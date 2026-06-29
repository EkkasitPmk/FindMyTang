import { Injectable, BadRequestException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    return this.userRepository.update(userId, dto);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException("New passwords do not match");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    // ponytail: compare existing password if it is set. If not set (e.g. guest/oauth), skip check.
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException("Incorrect current password");
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
