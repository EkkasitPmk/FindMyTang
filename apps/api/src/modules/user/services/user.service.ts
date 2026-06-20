import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    return this.userRepository.update(userId, dto);
  }
}
