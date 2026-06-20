import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { User, CategoryType } from "@prisma/client";

export interface CreateUserData {
  email?: string;
  password?: string;
  isGuest?: boolean;
  displayName?: string;
  avatarUrl?: string;
  language?: string;
  timezone?: string;
  categories?: {
    create: Array<{
      name: string;
      type: CategoryType;
      color?: string;
      icon?: string;
    }>;
  };
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  isGuest?: boolean;
  displayName?: string;
  avatarUrl?: string;
  language?: string;
  timezone?: string;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
