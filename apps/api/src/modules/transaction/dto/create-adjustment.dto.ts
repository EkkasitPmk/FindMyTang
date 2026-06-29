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
  @ApiProperty({ description: "Asset ID", example: "uuid-here" })
  @IsString()
  @IsNotEmpty()
  assetId!: string;

  @ApiProperty({ description: "Adjustment amount", example: 150.5 })
  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @ApiProperty({
    description: "Optional note",
    example: "Adjust balance",
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
  transactionDate!: string;
}
