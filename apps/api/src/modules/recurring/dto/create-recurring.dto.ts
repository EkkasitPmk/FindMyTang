import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsISO8601,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RecurringCycle, RecurringStatus } from "@prisma/client";

export class CreateRecurringDto {
  @ApiProperty({ example: "Netflix Premium" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 419.0 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: "THB", default: "THB" })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ enum: RecurringCycle, default: RecurringCycle.MONTHLY })
  @IsEnum(RecurringCycle)
  billingCycle!: RecurringCycle;

  @ApiProperty({ example: "2026-10-22T00:00:00.000Z" })
  @IsISO8601()
  firstBillingDate!: string;

  @ApiProperty({ example: "2026-10-22T00:00:00.000Z" })
  @IsISO8601()
  nextBillingDate!: string;

  @ApiPropertyOptional({ example: "asset-uuid" })
  @IsString()
  @IsOptional()
  assetId?: string;

  @ApiPropertyOptional({ example: "category-cuid" })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: RecurringStatus,
    default: RecurringStatus.ACTIVE,
  })
  @IsEnum(RecurringStatus)
  @IsOptional()
  status?: RecurringStatus;

  @ApiPropertyOptional({ example: "Shared family plan" })
  @IsString()
  @IsOptional()
  note?: string;
}
