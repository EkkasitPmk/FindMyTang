import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Category, CategoryType } from "@prisma/client";

export interface CreateCategoryData {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  isSystem?: boolean;
  displayOrder?: number;
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
        displayOrder: data.displayOrder ?? 0,
        userId,
      },
    });
  }

  async findById(id: string, includeDeleted = false): Promise<Category | null> {
    // ponytail: Finds a category by ID. If includeDeleted is false, filters out soft-deleted items.
    return this.prisma.category.findFirst({
      where: { id, ...(includeDeleted ? {} : { deletedAt: null }) },
    });
  }

  async findAll(userId: string, includeDeleted = false): Promise<Category[]> {
    // ponytail: Fetches all categories belonging to the user. Filters out soft-deleted if includeDeleted is false.
    return this.prisma.category.findMany({
      where: { userId, ...(includeDeleted ? {} : { deletedAt: null }) },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
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

  async restore(id: string, userId: string): Promise<Category> {
    // ponytail: Restores a soft-deleted category by setting deletedAt to null.
    const category = await this.prisma.category.findFirst({
      where: { id, userId, deletedAt: { not: null } },
    });
    if (!category) {
      throw new Error("Category not found or not deleted");
    }
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async hardDelete(id: string, userId: string): Promise<Category> {
    // ponytail: Permanently deletes a category after setting referencing transactions' categoryId to null.
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });
    if (!category) {
      throw new Error("Category not found or access denied");
    }
    await this.prisma.transaction.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async reorder(userId: string, ids: string[]): Promise<void> {
    // ponytail: Bulk update displayOrder for categories in a transaction.
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.category.updateMany({
          where: { id, userId },
          data: { displayOrder: index + 1 },
        }),
      ),
    );
  }
}
