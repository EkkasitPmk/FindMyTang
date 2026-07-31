import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { CategoryType } from "@prisma/client";

export class CreateCategoryDto {
  @ApiProperty({
    description: "Name of the category (maximum 25 characters)",
    example: "Food & Dining",
    maxLength: 25,
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: "Category name is required" })
  @MaxLength(25, { message: "Category name must not exceed 25 characters" })
  name!: string;

  @ApiProperty({
    description: "Type of the category (INCOME or EXPENSE)",
    enum: CategoryType,
    example: CategoryType.EXPENSE,
    required: true,
  })
  @IsEnum(CategoryType, { message: "Invalid category type" })
  @IsNotEmpty({ message: "Category type is required" })
  type!: CategoryType;

  @ApiProperty({
    description: "Hex color code associated with the category",
    example: "#FF5733",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: "Icon name/identifier associated with the category",
    example: "utensils",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: "Display sort order of the category",
    example: 1,
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  displayOrder?: number;
}
