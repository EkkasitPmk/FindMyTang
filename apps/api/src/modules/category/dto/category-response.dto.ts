import { ApiProperty } from "@nestjs/swagger";
import { CategoryType } from "@prisma/client";

export class CategoryResponseDto {
  @ApiProperty({
    description: "Unique category ID (UUID)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Name of the category",
    example: "Food & Dining",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Type of the category (INCOME or EXPENSE)",
    enum: CategoryType,
    example: CategoryType.EXPENSE,
  })
  type!: CategoryType;

  @ApiProperty({
    description: "Hex color code associated with the category",
    example: "#FF5733",
    nullable: true,
    type: String,
  })
  color!: string | null;

  @ApiProperty({
    description: "Icon name/identifier associated with the category",
    example: "utensils",
    nullable: true,
    type: String,
  })
  icon!: string | null;

  @ApiProperty({
    description: "Indicates whether this is a default system-provided category",
    example: false,
    type: Boolean,
  })
  isSystem!: boolean;

  @ApiProperty({
    description: "Sort display order of the category",
    example: 1,
    type: Number,
  })
  displayOrder!: number;

  @ApiProperty({
    description: "ISO timestamp when soft-deleted, or null if active",
    example: null,
    nullable: true,
    type: String,
  })
  deletedAt!: string | null;
}

export class CategoryActionResponseDto {
  @ApiProperty({
    description: "Indicates whether the action completed successfully",
    example: true,
    type: Boolean,
  })
  success!: boolean;
}
