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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { ReorderCategoriesDto } from "../dto/reorder-categories.dto";
import {
  CategoryResponseDto,
  CategoryActionResponseDto,
} from "../dto/category-response.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User } from "@prisma/client";

@ApiTags("Category")
@ApiBearerAuth()
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Create a new category",
    description:
      "Creates a new transaction category (INCOME or EXPENSE) for the authenticated user.",
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: "Category created successfully.",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request (validation error or empty category name).",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async create(
    @CurrentUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
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
  @ApiOperation({
    summary: "Get all categories",
    description:
      "Fetches all active categories for the authenticated user. Pass query param includeDeleted=true to include soft-deleted categories.",
  })
  @ApiQuery({
    name: "includeDeleted",
    required: false,
    type: String,
    description: "Set to 'true' to include soft-deleted categories",
    example: "true",
  })
  @ApiResponse({
    status: 200,
    description: "List of categories retrieved successfully.",
    type: [CategoryResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async findAll(
    @CurrentUser() user: User,
    @Query("includeDeleted") includeDeleted?: string,
  ): Promise<CategoryResponseDto[]> {
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
  @ApiOperation({
    summary: "Reorder categories",
    description:
      "Updates the display order sequence of categories according to the provided array of category IDs.",
  })
  @ApiBody({ type: ReorderCategoriesDto })
  @ApiResponse({
    status: 200,
    description: "Categories reordered successfully.",
    type: CategoryActionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async reorder(
    @CurrentUser() user: User,
    @Body() body: ReorderCategoriesDto,
  ): Promise<CategoryActionResponseDto> {
    await this.categoryService.reorder(user.id, body.ids);
    return { success: true };
  }

  @Patch(":id/restore")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Restore a soft-deleted category",
    description: "Restores a soft-deleted category back to active status.",
  })
  @ApiParam({
    name: "id",
    description: "Unique category ID (UUID)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
  })
  @ApiResponse({
    status: 200,
    description: "Category restored successfully.",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden (category belongs to another user).",
  })
  @ApiResponse({
    status: 404,
    description: "Category not found.",
  })
  async restore(
    @Param("id") id: string,
    @CurrentUser() user: User,
  ): Promise<CategoryResponseDto> {
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
  @ApiOperation({
    summary: "Update a category",
    description:
      "Updates details of a specific category (e.g. name, type, color, icon).",
  })
  @ApiParam({
    name: "id",
    description: "Unique category ID (UUID)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: "Category updated successfully.",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request (validation error or invalid data).",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden (category belongs to another user).",
  })
  @ApiResponse({
    status: 404,
    description: "Category not found.",
  })
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
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
  @ApiOperation({
    summary: "Delete a category",
    description:
      "Deletes a category. Performs a soft delete by default, or hard delete if isHardDelete=true query param is set.",
  })
  @ApiParam({
    name: "id",
    description: "Unique category ID (UUID)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
  })
  @ApiQuery({
    name: "isHardDelete",
    required: false,
    type: String,
    description: "Set to 'true' for permanent hard deletion",
    example: "true",
  })
  @ApiResponse({
    status: 200,
    description: "Category deleted successfully.",
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden.",
  })
  @ApiResponse({
    status: 404,
    description: "Category not found.",
  })
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Query("isHardDelete") isHardDelete?: string,
  ): Promise<CategoryResponseDto> {
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
