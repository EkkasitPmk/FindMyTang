import {
  Body,
  Controller,
  Patch,
  Post,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Response,
} from "@nestjs/common";
import * as express from "express";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../services/user.service";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User } from "@prisma/client";

type CookieSameSite = "lax" | "strict" | "none";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Patch("profile")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ) {
    const updatedUser = await this.userService.updateProfile(user.id, dto);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      avatarUrl: updatedUser.avatarUrl,
      language: updatedUser.language,
    };
  }

  @Post("change-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.userService.changePassword(user.id, dto);
    return { success: true, message: "Password changed successfully" };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async deleteAccount(
    @CurrentUser() user: User,
    @Response({ passthrough: true }) res: express.Response,
  ) {
    await this.userService.deleteAccount(user.id);

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

    return { success: true, message: "Account deleted successfully" };
  }
}
