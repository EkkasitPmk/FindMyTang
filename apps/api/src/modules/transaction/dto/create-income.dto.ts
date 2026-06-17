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

// ponytail: income-only DTO — no type field, no userId, no balance
export class CreateIncomeDto {
  @ApiProperty({ description: "Asset ID", example: "uuid-here" })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: "Category ID (must be INCOME type)" })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: "Income amount (must be > 0)", example: 1000.0 })
  @IsNumber()
  @IsPositive({ message: "Amount must be greater than 0" })
  amount: number;

  @ApiProperty({
    description: "Optional note",
    example: "Salary",
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
  transactionDate: string;
}
