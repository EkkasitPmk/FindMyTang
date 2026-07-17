import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Response,
  UseGuards,
} from "@nestjs/common";
import * as express from "express";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { SyncGuestDto } from "../dto/sync-guest.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { JwtRefreshGuard } from "../guards/jwt-refresh.guard";
import { CurrentUser } from "../decorators/current-user.decorator";
import type { User } from "@prisma/client";

type CookieSameSite = "lax" | "strict" | "none";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName ?? registerDto.displayName,
      createdAt: user.createdAt,
    };
  }

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(loginDto);

    const domain =
      this.configService.get<string>("cookie.domain") || "localhost";
    const secure = this.configService.get<boolean>("cookie.secure") ?? false;
    const sameSite =
      this.configService.get<CookieSameSite>("cookie.sameSite") || "lax";

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      maxAge: 15 * 60 * 1000, // 15 minutes to match access token expiration
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days to match refresh token expiration
    });

    return { user };
  }

  @Post("sync-guest")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async syncGuest(
    @CurrentUser() user: User,
    @Body() syncDto: SyncGuestDto,
  ): Promise<{ success: boolean }> {
    return this.authService.syncGuest(user.id, syncDto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    const userPayload = req.user as {
      user: User;
      refreshToken: string;
    };
    const { refreshToken } = userPayload;

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await this.authService.refresh(refreshToken);

    const domain =
      this.configService.get<string>("cookie.domain") || "localhost";
    const secure = this.configService.get<boolean>("cookie.secure") ?? false;
    const sameSite =
      this.configService.get<CookieSameSite>("cookie.sameSite") || "lax";

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      maxAge: 15 * 60 * 1000, // 15 minutes to match access token expiration
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days to match refresh token expiration
    });

    return { user };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName ?? "User",
      avatarUrl: user.avatarUrl,
      language: user.language,
      lastSyncedAt: user.lastSyncedAt,
      lastSyncStatus: user.lastSyncStatus,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: express.Request,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    await this.authService.logout();

    const domain =
      this.configService.get<string>("cookie.domain") || "localhost";
    const secure = this.configService.get<boolean>("cookie.secure") ?? false;
    const sameSite =
      this.configService.get<CookieSameSite>("cookie.sameSite") || "lax";

    res.clearCookie("access_token", {
      httpOnly: true,
      secure,
      sameSite,
      domain,
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure,
      sameSite,
      domain,
    });

    return { message: "Logged out successfully" };
  }
}
