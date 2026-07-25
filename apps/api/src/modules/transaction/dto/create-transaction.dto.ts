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
import { Transform } from "class-transformer";

export class CreateTransactionDto {
  @ApiProperty({
    description: "Transaction type (INCOME, EXPENSE, TRANSFER, ADJUSTMENT)",
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    required: true,
  })
  @IsEnum(TransactionType, { message: "Invalid transaction type" })
  @IsNotEmpty()
  type!: TransactionType;

  @ApiProperty({
    description:
      "Transaction amount (must be positive number, or non-zero for adjustment)",
    example: 150.5,
    required: true,
    type: Number,
  })
  @Transform(({ value }) =>
    typeof value === "string" ? Number.parseFloat(value) : Number(value),
  )
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    description:
      "Optional note or memo for the transaction (maximum 500 characters)",
    example: "Lunch with colleagues",
    required: false,
    maxLength: 500,
    type: String,
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: "Transaction date (ISO 8601 string)",
    example: "2026-06-17T12:00:00.000Z",
    required: true,
    type: String,
  })
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({
    description: "Source asset ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  assetId!: string;

  @ApiProperty({
    description: "Target asset ID (UUID) (required when type is TRANSFER)",
    required: false,
    example: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    type: String,
  })
  @IsString()
  @IsOptional()
  toAssetId?: string;

  @ApiProperty({
    description: "Category ID (UUID) (optional for TRANSFER and ADJUSTMENT)",
    required: false,
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    type: String,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: "URL or file path of attached receipt/image",
    required: false,
    example: "https://example.com/uploads/receipt.jpg",
    type: String,
  })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
