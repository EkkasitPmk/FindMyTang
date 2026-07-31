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

export class CreateTransferDto {
  @ApiProperty({
    description: "Source asset ID (UUID) transferring from",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  assetId!: string;

  @ApiProperty({
    description: "Target asset ID (UUID) transferring to",
    example: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  toAssetId!: string;

  @ApiProperty({
    description: "Transfer amount (must be > 0)",
    example: 500.0,
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: "Amount must be greater than 0" })
  amount!: number;

  @ApiProperty({
    description: "Optional note or memo for the transfer",
    example: "Transfer to Savings account",
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
