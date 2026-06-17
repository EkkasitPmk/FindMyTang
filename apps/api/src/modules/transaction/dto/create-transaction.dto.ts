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

export class CreateTransactionDto {
  @ApiProperty({
    description: "Transaction type",
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType, { message: "Invalid transaction type" })
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({ description: "Transaction amount", example: 150.5 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

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
  date: string;

  @ApiProperty({ description: "Asset ID", example: "uuid-here" })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({
    description: "Category ID (optional for TRANSFER)",
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
