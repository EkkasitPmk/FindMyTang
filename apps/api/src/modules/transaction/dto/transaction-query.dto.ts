import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsString,
  IsDateString,
  IsBoolean,
  IsIn,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { TransactionType } from "@prisma/client";

export class TransactionQueryDto {
  @ApiProperty({
    description: "Page number for pagination",
    example: 1,
    default: 1,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Number of items per page",
    example: 20,
    default: 20,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({
    description: "Pagination strategy",
    enum: ["page", "cursor"],
    required: false,
    default: "page",
  })
  @IsOptional()
  @IsIn(["page", "cursor"])
  pagination?: "page" | "cursor" = "page";

  @ApiProperty({
    description: "Opaque cursor returned by the previous request",
    required: false,
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({
    description: "Direction to read from the cursor",
    enum: ["next", "previous"],
    required: false,
    default: "next",
  })
  @IsOptional()
  @IsIn(["next", "previous"])
  cursorDirection?: "next" | "previous" = "next";

  @ApiProperty({
    description:
      "Filter by transaction type (INCOME, EXPENSE, TRANSFER, ADJUSTMENT)",
    enum: TransactionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({
    description: "Filter by source asset ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiProperty({
    description: "Filter by category ID (UUID)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: "Search keyword for note or category name",
    example: "Lunch",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @ApiProperty({
    description: "Filter transactions from start date (ISO 8601 string)",
    example: "2026-06-01T00:00:00.000Z",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({
    description: "Filter transactions to end date (ISO 8601 string)",
    example: "2026-06-30T23:59:59.999Z",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiProperty({
    description: "Set to true to retrieve soft-deleted transactions",
    example: false,
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({
    description:
      "Sort order type (e.g., 'date_desc', 'date_asc', 'amount_desc', 'amount_asc')",
    example: "date_desc",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  sortType?: string;
}
