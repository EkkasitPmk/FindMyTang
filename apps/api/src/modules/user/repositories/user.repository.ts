import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { User, Profile, CategoryType } from "@prisma/client";

export interface CreateUserData {
  email?: string;
  password?: string;
  isGuest?: boolean;
  profile?: {
    create: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
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
  profile?: {
    update: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
  ): Promise<(User & { profile: Profile | null }) | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async findByEmail(
    email: string,
  ): Promise<(User & { profile: Profile | null }) | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async create(
    data: CreateUserData,
  ): Promise<User & { profile: Profile | null }> {
    return this.prisma.user.create({
      data,
      include: {
        profile: true,
      },
    });
  }

  async update(
    id: string,
    data: UpdateUserData,
  ): Promise<User & { profile: Profile | null }> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        profile: true,
      },
    });
  }

  async delete(id: string): Promise<User & { profile: Profile | null }> {
    return this.prisma.user.delete({
      where: { id },
      include: {
        profile: true,
      },
    });
  }
}
