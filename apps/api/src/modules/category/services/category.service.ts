import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { Category } from "@prisma/client";

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async invalidateCache(userId: string): Promise<void> {
    await Promise.all([
      this.cacheManager.del(`cat_${userId}_true`),
      this.cacheManager.del(`cat_${userId}_false`),
    ]);
  }

  async create(userId: string, dto: CreateCategoryDto): Promise<Category> {
    // ponytail: Trims category name and validates it is not empty, then creates the category.
    const trimmedName = dto.name ? dto.name.trim() : "";
    if (!trimmedName) {
      throw new BadRequestException(
        "Category name must not be empty or whitespace only",
      );
    }

    const category = await this.categoryRepository.create(userId, {
      name: trimmedName,
      type: dto.type,
      color: dto.color,
      icon: dto.icon,
    });

    await this.invalidateCache(userId);
    return category;
  }

  async findAll(userId: string, includeDeleted = false): Promise<Category[]> {
    // ponytail: Retrieves categories belonging to user with 5-min in-memory cache.
    const cacheKey = `cat_${userId}_${includeDeleted}`;
    const cached = await this.cacheManager.get<Category[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.categoryRepository.findAll(
      userId,
      includeDeleted,
    );
    await this.cacheManager.set(cacheKey, categories, 300000);
    return categories;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    // ponytail: Business logic to find, check ownership, validate, and update the category.
    const category = await this.categoryRepository.findById(id, true);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category.userId !== userId) {
      throw new ForbiddenException("You do not own this category");
    }

    if (dto.name !== undefined) {
      const trimmedName = dto.name.trim();
      if (!trimmedName) {
        throw new BadRequestException(
          "Category name must not be empty or whitespace only",
        );
      }
      dto.name = trimmedName;
    }

    const updatedCategory = await this.categoryRepository.update(id, userId, {
      ...dto,
      deletedAt: null,
    });
    await this.invalidateCache(userId);
    return updatedCategory;
  }

  async delete(
    id: string,
    userId: string,
    isHardDelete = false,
  ): Promise<Category> {
    // ponytail: Soft or hard deletes a category by checking existence and ownership first.
    const category = await this.categoryRepository.findById(id, true);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category.userId !== userId) {
      throw new ForbiddenException("You do not own this category");
    }

    let deletedCategory: Category;
    if (isHardDelete) {
      deletedCategory = await this.categoryRepository.hardDelete(id, userId);
    } else {
      deletedCategory = await this.categoryRepository.delete(id, userId);
    }

    await this.invalidateCache(userId);
    return deletedCategory;
  }

  async restore(id: string, userId: string): Promise<Category> {
    // ponytail: Restores a soft-deleted category after checking ownership.
    const category = await this.categoryRepository.findById(id, true);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category.userId !== userId) {
      throw new ForbiddenException("You do not own this category");
    }

    const restoredCategory = await this.categoryRepository.restore(id, userId);
    await this.invalidateCache(userId);
    return restoredCategory;
  }

  async reorder(userId: string, ids: string[]): Promise<void> {
    // ponytail: Triggers bulk update for category ordering in the repository.
    await this.categoryRepository.reorder(userId, ids);
    await this.invalidateCache(userId);
  }
}
