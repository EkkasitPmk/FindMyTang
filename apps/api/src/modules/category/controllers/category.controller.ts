import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User } from "@prisma/client";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    // ponytail: Create category endpoint.
    const category = await this.categoryService.create(
      user.id,
      createCategoryDto,
    );
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isSystem: category.isSystem,
      displayOrder: category.displayOrder,
      deletedAt: category.deletedAt ? category.deletedAt.toISOString() : null,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Query("includeDeleted") includeDeleted?: string,
  ) {
    // ponytail: Get categories endpoint.
    const categories = await this.categoryService.findAll(
      user.id,
      includeDeleted === "true",
    );
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isSystem: category.isSystem,
      displayOrder: category.displayOrder,
      deletedAt: category.deletedAt ? category.deletedAt.toISOString() : null,
    }));
  }

  @Patch("reorder")
  @UseGuards(JwtAuthGuard)
  async reorder(@CurrentUser() user: User, @Body("ids") ids: string[]) {
    // ponytail: Reorder categories endpoint.
    await this.categoryService.reorder(user.id, ids);
    return { success: true };
  }

  @Patch(":id/restore")
  @UseGuards(JwtAuthGuard)
  async restore(@Param("id") id: string, @CurrentUser() user: User) {
    // ponytail: Restore soft-deleted category endpoint.
    const category = await this.categoryService.restore(id, user.id);
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isSystem: category.isSystem,
      displayOrder: category.displayOrder,
      deletedAt: null,
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    // ponytail: Update category endpoint.
    const category = await this.categoryService.update(
      id,
      user.id,
      updateCategoryDto,
    );
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isSystem: category.isSystem,
      displayOrder: category.displayOrder,
      deletedAt: category.deletedAt ? category.deletedAt.toISOString() : null,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Query("isHardDelete") isHardDelete?: string,
  ) {
    // ponytail: Delete category endpoint (soft or hard).
    const category = await this.categoryService.delete(
      id,
      user.id,
      isHardDelete === "true",
    );
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isSystem: category.isSystem,
      displayOrder: category.displayOrder,
      deletedAt: category.deletedAt ? category.deletedAt.toISOString() : null,
    };
  }
}
