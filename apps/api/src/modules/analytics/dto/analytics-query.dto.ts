import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CategoryBreakdownQueryDto {
  @ApiProperty({
    description: "Month number (1-12). Defaults to current month if omitted.",
    example: "6",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiProperty({
    description:
      "Year number (e.g. 2026). Defaults to current year if omitted.",
    example: "2026",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({
    description:
      "Transaction type filter (EXPENSE, INCOME, TRANSFER, ADJUSTMENT). Defaults to EXPENSE.",
    example: "EXPENSE",
    required: false,
    enum: ["EXPENSE", "INCOME", "TRANSFER", "ADJUSTMENT"],
  })
  @IsOptional()
  @IsString()
  type?: string;
}

export class MonthlyTrendsQueryDto {
  @ApiProperty({
    description:
      "Year number for monthly trends report. Defaults to current year.",
    example: "2026",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  year?: string;
}

export class CategoryTransactionsQueryDto {
  @ApiProperty({
    description: "Month number (1-12). Defaults to current month if omitted.",
    example: "6",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiProperty({
    description:
      "Year number (e.g. 2026). Defaults to current year if omitted.",
    example: "2026",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  year?: string;
}
