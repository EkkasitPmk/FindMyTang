import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { Category } from "@prisma/client";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(userId: string, dto: CreateCategoryDto): Promise<Category> {
    // ponytail: Trims category name and validates it is not empty, then creates the category.
    const trimmedName = dto.name ? dto.name.trim() : "";
    if (!trimmedName) {
      throw new BadRequestException(
        "Category name must not be empty or whitespace only",
      );
    }

    return this.categoryRepository.create(userId, {
      name: trimmedName,
      type: dto.type,
      color: dto.color,
      icon: dto.icon,
    });
  }

  async findAll(userId: string, includeDeleted = false): Promise<Category[]> {
    // ponytail: Retrieves categories belonging to user. Optional includeDeleted flag.
    return this.categoryRepository.findAll(userId, includeDeleted);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    // ponytail: Business logic to find, check ownership, validate, and update the category.
    const category = await this.categoryRepository.findById(id);
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

    return this.categoryRepository.update(id, userId, dto);
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

    if (isHardDelete) {
      return this.categoryRepository.hardDelete(id, userId);
    }

    return this.categoryRepository.delete(id, userId);
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

    return this.categoryRepository.restore(id, userId);
  }

  async reorder(userId: string, ids: string[]): Promise<void> {
    // ponytail: Triggers bulk update for category ordering in the repository.
    await this.categoryRepository.reorder(userId, ids);
  }
}
