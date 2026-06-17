import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { CategoryType } from "@prisma/client";

export class CreateCategoryDto {
  @ApiProperty({
    description: "Name of the category",
    example: "Food",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: "Category name is required" })
  @MaxLength(100, { message: "Category name must not exceed 100 characters" })
  name: string;

  @ApiProperty({
    description: "Type of the category",
    enum: CategoryType,
    example: CategoryType.EXPENSE,
  })
  @IsEnum(CategoryType, { message: "Invalid category type" })
  @IsNotEmpty({ message: "Category type is required" })
  type: CategoryType;

  @ApiProperty({
    description: "Color associated with the category",
    example: "#FF5733",
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: "Icon associated with the category",
    example: "food-icon",
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;
}
