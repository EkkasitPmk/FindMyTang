import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Category, CategoryType } from "@prisma/client";

export interface CreateCategoryData {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
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
        userId,
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    // ponytail: Finds a category by its ID.
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findAll(userId: string): Promise<Category[]> {
    // ponytail: Fetches all categories belonging to the user sorted by createdAt ASC.
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateCategoryData>,
  ): Promise<Category> {
    // ponytail: Updates a category using updateMany for a strict owner check, then returns the updated category.
    const result = await this.prisma.category.updateMany({
      where: { id, userId },
      data,
    });
    if (result.count === 0) {
      throw new Error("Category not found or access denied");
    }
    const updated = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!updated) {
      throw new Error("Category not found after update");
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<Category> {
    // ponytail: Deletes a category after checking ownership.
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });
    if (!category) {
      throw new Error("Category not found or access denied");
    }
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
