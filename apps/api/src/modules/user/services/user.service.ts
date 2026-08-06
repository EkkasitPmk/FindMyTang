import { Injectable, BadRequestException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

export const USER_ERROR_CODES = {
  PASSWORD_MISMATCH: "PASSWORD_MISMATCH",
  PASSWORD_SAME_AS_CURRENT: "PASSWORD_SAME_AS_CURRENT",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INCORRECT_CURRENT_PASSWORD: "INCORRECT_CURRENT_PASSWORD",
} as const;

const userError = (code: string, field: string, message: string) =>
  new BadRequestException({ code, field, message });

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    return this.userRepository.update(userId, dto);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw userError(
        USER_ERROR_CODES.PASSWORD_MISMATCH,
        "confirmNewPassword",
        "New passwords do not match",
      );
    }
    if (currentPassword === newPassword) {
      throw userError(
        USER_ERROR_CODES.PASSWORD_SAME_AS_CURRENT,
        "newPassword",
        "New password must be different from current password",
      );
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw userError(
        USER_ERROR_CODES.USER_NOT_FOUND,
        "account",
        "User not found",
      );
    }

    // ponytail: compare existing password if it is set. If not set (e.g. guest/oauth), skip check.
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw userError(
          USER_ERROR_CODES.INCORRECT_CURRENT_PASSWORD,
          "currentPassword",
          "Incorrect current password",
        );
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
