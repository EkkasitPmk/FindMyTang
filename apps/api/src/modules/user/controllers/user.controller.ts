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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { UserService } from "../services/user.service";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import {
  UserProfileResponseDto,
  UserActionResponseDto,
} from "../dto/user-response.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User } from "@prisma/client";

import { Throttle } from "@nestjs/throttler";

type CookieSameSite = "lax" | "strict" | "none";

@ApiTags("User")
@ApiBearerAuth()
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Patch("profile")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Update user profile",
    description:
      "Updates profile details of the authenticated user including display name, avatar URL, and language preference.",
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully.",
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error or invalid input data provided.",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access (missing or invalid JWT token).",
  })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfileResponseDto> {
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
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Change account password",
    description:
      "Changes the password of the authenticated user after verifying their current password.",
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: "Password changed successfully.",
    type: UserActionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "Bad request (e.g. passwords do not match or incorrect current password).",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access (missing or invalid JWT token).",
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDto,
  ): Promise<UserActionResponseDto> {
    await this.userService.changePassword(user.id, dto);
    return { success: true, message: "Password changed successfully" };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Delete user account",
    description:
      "Permanently deletes the authenticated user's account and clears authentication cookies.",
  })
  @ApiResponse({
    status: 200,
    description: "Account deleted successfully.",
    type: UserActionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access (missing or invalid JWT token).",
  })
  async deleteAccount(
    @CurrentUser() user: User,
    @Response({ passthrough: true }) res: express.Response,
  ): Promise<UserActionResponseDto> {
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
