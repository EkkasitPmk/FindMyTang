import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UseGuards,
} from "@nestjs/common";
import * as express from "express";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";
import { User, Profile } from "@prisma/client";

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
      displayName: user.profile?.firstName ?? registerDto.displayName,
      createdAt: user.createdAt,
    };
  }

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, user } = await this.authService.login(loginDto);

    const domain =
      this.configService.get<string>("cookie.domain") || "localhost";
    const secure = this.configService.get<boolean>("cookie.secure") ?? false;
    const sameSite =
      this.configService.get<"lax" | "strict" | "none">("cookie.sameSite") ||
      "lax";

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      maxAge: 15 * 60 * 1000, // 15 minutes to match access token expiration
    });

    return { user };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User & { profile: Profile | null }) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.profile?.firstName ?? "User",
    };
  }

  @Post("logout")
  async logout(@Response({ passthrough: true }) res: express.Response) {
    const domain =
      this.configService.get<string>("cookie.domain") || "localhost";
    const secure = this.configService.get<boolean>("cookie.secure") ?? false;
    const sameSite =
      this.configService.get<"lax" | "strict" | "none">("cookie.sameSite") ||
      "lax";

    res.clearCookie("access_token", {
      httpOnly: true,
      secure,
      sameSite,
      domain,
    });

    return { success: true };
  }
}
