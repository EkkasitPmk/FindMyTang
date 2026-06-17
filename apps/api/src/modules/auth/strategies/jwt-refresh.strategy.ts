import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { UserRepository } from "../../user/repositories/user.repository";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request?.cookies as
            | Record<string, unknown>
            | undefined;
          return (cookies?.refresh_token as string | undefined) || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>("jwt.refreshSecret") || "your-refresh-secret",
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const cookies = request?.cookies as Record<string, unknown> | undefined;
    const refreshToken = cookies?.refresh_token;
    if (typeof refreshToken !== "string") {
      throw new UnauthorizedException("Refresh token not found");
    }
    return {
      user,
      refreshToken,
    };
  }
}
