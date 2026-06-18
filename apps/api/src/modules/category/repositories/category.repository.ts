import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Category, CategoryType } from "@prisma/client";

export interface CreateCategoryData {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  isSystem?: boolean;
}

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateCategoryData): Promise<Category> {
    // ponytail: Creates a category for a user.
    return this.prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
        isSystem: data.isSystem ?? false,
        userId,
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    // ponytail: Finds a category by its ID, ensuring it's not soft-deleted.
    return this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findAll(userId: string): Promise<Category[]> {
    // ponytail: Fetches all categories belonging to the user that are not soft-deleted, sorted by createdAt ASC.
    return this.prisma.category.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateCategoryData>,
  ): Promise<Category> {
    // ponytail: Updates a category matching id and userId to prevent cross-user updates.
    const category = await this.prisma.category.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!category) {
      throw new Error("Category not found or access denied");
    }
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Category> {
    // ponytail: Soft deletes a category matching id and userId.
    const category = await this.prisma.category.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!category) {
      throw new Error("Category not found or access denied");
    }
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
