import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { TransactionType } from "@prisma/client";
import { Type } from "class-transformer";

export class CreateTransactionDto {
  @ApiProperty({
    description: "Transaction type",
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType, { message: "Invalid transaction type" })
  @IsNotEmpty()
  type!: TransactionType;

  @ApiProperty({ description: "Transaction amount", example: 150.5 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    description: "Optional note",
    example: "Lunch",
    required: false,
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: "Transaction date (ISO 8601)",
    example: "2026-06-17T12:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ description: "Asset ID", example: "uuid-here" })
  @IsString()
  @IsNotEmpty()
  assetId!: string;

  @ApiProperty({
    description: "Target Asset ID (required for TRANSFER)",
    required: false,
    example: "uuid-here",
  })
  @IsString()
  @IsOptional()
  toAssetId?: string;

  @ApiProperty({
    description: "Category ID (optional for TRANSFER and ADJUSTMENT)",
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: "URL of the attached file",
    required: false,
    example: "https://example.com/uploads/receipt.jpg",
  })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
