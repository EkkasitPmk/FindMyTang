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

// ponytail: expense-only DTO — no type field, no userId, no balance
export class CreateExpenseDto {
  @ApiProperty({ description: "Asset ID", example: "uuid-here" })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: "Category ID (must be EXPENSE type)" })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: "Expense amount (must be > 0)", example: 150.5 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive({ message: "Amount must be greater than 0" })
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
  transactionDate: string;
}
