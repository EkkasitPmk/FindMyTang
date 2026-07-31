import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateIncomeDto {
  @ApiProperty({
    description: "Target asset ID (UUID) receiving income",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  assetId!: string;

  @ApiProperty({
    description: "Category ID (must be INCOME type)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({
    description: "Income amount (must be > 0)",
    example: 3500.0,
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: "Amount must be greater than 0" })
  amount!: number;

  @ApiProperty({
    description: "Optional note or memo for the income",
    example: "Monthly Salary",
    required: false,
    maxLength: 255,
    type: String,
  })
  @IsString()
  @MaxLength(255)
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
  transactionDate!: string;
}
