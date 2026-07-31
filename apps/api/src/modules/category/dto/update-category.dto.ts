import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";
import { IsOptional, IsString, MaxLength, IsEnum } from "class-validator";
import { CategoryType } from "@prisma/client";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: "Updated name of the category (maximum 25 characters)",
    example: "Dining Out",
    required: false,
    maxLength: 25,
    type: String,
  })
  @IsString()
  @IsOptional()
  @MaxLength(25, { message: "Category name must not exceed 25 characters" })
  name?: string;

  @ApiProperty({
    description: "Updated icon identifier for the category",
    example: "utensils",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: "Updated hex color code for the category",
    example: "#EF4444",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: "Updated category type (INCOME or EXPENSE)",
    enum: CategoryType,
    example: CategoryType.EXPENSE,
    required: false,
  })
  @IsEnum(CategoryType, { message: "Invalid category type" })
  @IsOptional()
  type?: CategoryType;
}
