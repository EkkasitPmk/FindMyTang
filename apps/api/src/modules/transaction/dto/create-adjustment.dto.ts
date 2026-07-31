import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateAdjustmentDto {
  @ApiProperty({
    description: "Target asset ID (UUID) adjusting balance for",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  assetId!: string;

  @ApiProperty({
    description: "New balance amount or adjustment difference",
    example: 1250.5,
    required: true,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @ApiProperty({
    description: "Optional note or memo explaining adjustment",
    example: "Adjust balance to match wallet cash count",
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
