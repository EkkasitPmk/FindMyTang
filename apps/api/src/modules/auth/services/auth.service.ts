import { Prisma } from "@prisma/client";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "../../user/repositories/user.repository";
import { SessionRepository } from "../../session/repositories/session.repository";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import * as bcrypt from "bcrypt";
import * as crypto from "node:crypto";
import { DEFAULT_CATEGORIES } from "../../../common/constants/default-categories";
import { PrismaService } from "../../../prisma/prisma.service";
import { SyncGuestDto } from "../dto/sync-guest.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly sessionRepository: SessionRepository,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user?.password) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // 2. Compare password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // 3. Generate JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email || "",
    };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshSecret = this.configService.get<string>("jwt.refreshSecret");
    const refreshExpiresIn =
      this.configService.get<string>("jwt.refreshExpiresIn") || "7d";

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, jti: crypto.randomUUID() },
      {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as unknown as number,
      },
    );

    // Hash refresh token for DB session using SHA-256 to avoid bcrypt's 72-character limit
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Create session in DB
    const expiresAt = new Date();
    // ponytail: hardcoded 7 days offset matching '7d' expiration limit.
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName ?? "User",
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, displayName } = registerDto;

    // 1. Validate password === confirmPassword
    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    // 2. UserRepository.findByEmail()
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // 3. bcrypt.hash(password)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. UserRepository.create()
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      profile: {
        create: {
          displayName,
        },
      },
      categories: {
        create: DEFAULT_CATEGORIES.map((cat) => ({
          name: cat.name,
          type: cat.type,
          color: cat.color,
          icon: cat.icon,
          isSystem: false,
        })),
      },
    });

    return user;
  }

  async syncGuest(
    userId: string,
    syncDto: SyncGuestDto,
  ): Promise<{ success: boolean }> {
    const { assets, categories, transactions } = syncDto;

    return await this.prisma.$transaction(async (tx) => {
      const categoryMap = new Map<string, string>();
      const assetMap = new Map<string, string>();

      // 1. Sync Categories
      for (const cat of categories) {
        const createdCat = await tx.category.create({
          data: {
            name: cat.name,
            type: cat.type,
            color: cat.color,
            icon: cat.icon,
            userId,
          },
        });
        categoryMap.set(cat.localId, createdCat.id);
      }

      // 2. Sync Assets
      for (const asset of assets) {
        const createdAsset = await tx.asset.create({
          data: {
            name: asset.name,
            type: asset.type,
            balance: new Prisma.Decimal(asset.balance || 0),
            currency: asset.currency || "THB",
            color: asset.color,
            icon: asset.icon,
            userId,
          },
        });
        assetMap.set(asset.localId, createdAsset.id);
      }

      // 3. Sync Transactions
      for (const txData of transactions) {
        const assetId = assetMap.get(txData.localAssetId);
        if (!assetId) continue;

        const toAssetId = txData.localToAssetId
          ? assetMap.get(txData.localToAssetId)
          : undefined;
        const categoryId = txData.localCategoryId
          ? categoryMap.get(txData.localCategoryId)
          : undefined;

        await tx.transaction.create({
          data: {
            type: txData.type,
            amount: new Prisma.Decimal(txData.amount),
            note: txData.note,
            date: new Date(txData.date),
            userId,
            assetId,
            toAssetId,
            categoryId,
          },
        });
      }

      // 4. Create Sync Log
      await tx.syncLog.create({
        data: {
          userId,
          guestId: "GUEST_SYNC", // Placeholder or from client
          status: "SUCCESS",
        },
      });

      return { success: true };
    });
  }

  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string | null;
      displayName: string;
    };
  }> {
    // 1. Verify token signature
    const refreshSecret = this.configService.get<string>("jwt.refreshSecret");
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const userId = payload.sub;

    // 2. Find session by hashed token
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session =
      await this.sessionRepository.findByToken(hashedRefreshToken);
    if (session?.userId !== userId) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    // Check expiry
    if (session.expiresAt < new Date()) {
      await this.sessionRepository.delete(session.id).catch(() => {});
      throw new UnauthorizedException("Invalid or expired session");
    }

    // 3. Generate new Access Token and Refresh Token (rotation)
    const newPayload: JwtPayload = {
      sub: userId,
      email: payload.email,
    };

    const newAccessToken = await this.jwtService.signAsync(newPayload);
    const refreshExpiresIn =
      this.configService.get<string>("jwt.refreshExpiresIn") || "7d";
    const newRefreshToken = await this.jwtService.signAsync(
      { ...newPayload, jti: crypto.randomUUID() },
      {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as unknown as number,
      },
    );

    // Hash the new refresh token using SHA-256 to avoid bcrypt's 72-character limit
    const newHashedRefreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    // Update session in DB
    const expiresAt = new Date();
    // ponytail: hardcoded 7 days offset matching '7d' expiration limit.
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.update(session.id, {
      token: newHashedRefreshToken,
      expiresAt,
    });

    // Also get user object
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName ?? "User",
      },
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session =
      await this.sessionRepository.findByToken(hashedRefreshToken);
    if (session) {
      await this.sessionRepository.delete(session.id);
    }
  }
}
