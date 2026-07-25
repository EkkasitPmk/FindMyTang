import { ApiProperty } from "@nestjs/swagger";
import { AssetType, TransactionType } from "@prisma/client";

export class CategoryBreakdownSummaryDto {
  @ApiProperty({
    description: "Total income for specified month",
    example: 5000,
    type: Number,
  })
  income!: number;

  @ApiProperty({
    description: "Total expense for specified month",
    example: 1200.5,
    type: Number,
  })
  expense!: number;

  @ApiProperty({
    description: "Total transfer for specified month",
    example: 500,
    type: Number,
  })
  transfer!: number;

  @ApiProperty({
    description: "Total adjustment for specified month",
    example: 50,
    type: Number,
  })
  adjust!: number;

  @ApiProperty({
    description: "Net amount (income - expense)",
    example: 3799.5,
    type: Number,
  })
  net!: number;
}

export class CategoryBreakdownItemDto {
  @ApiProperty({
    description: "Category ID",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    type: String,
  })
  categoryId!: string;

  @ApiProperty({
    description: "Category name",
    example: "Food & Dining",
    type: String,
  })
  categoryName!: string;

  @ApiProperty({
    description: "Category hex color code",
    example: "#FF5733",
    nullable: true,
    type: String,
  })
  categoryColor!: string | null;

  @ApiProperty({
    description: "Category icon identifier",
    example: "utensils",
    nullable: true,
    type: String,
  })
  categoryIcon!: string | null;

  @ApiProperty({
    description: "Total transaction amount under this category",
    example: 450.0,
    type: Number,
  })
  totalAmount!: number;

  @ApiProperty({
    description: "Total number of transactions under this category",
    example: 12,
    type: Number,
  })
  transactionCount!: number;

  @ApiProperty({
    description: "Percentage of total amount for this category",
    example: 37.5,
    type: Number,
  })
  percentage!: number;
}

export class CategoryBreakdownResponseDto {
  @ApiProperty({
    description: "Monthly financial summary",
    type: CategoryBreakdownSummaryDto,
  })
  summary!: CategoryBreakdownSummaryDto;

  @ApiProperty({
    description: "List of breakdown items per category",
    type: [CategoryBreakdownItemDto],
  })
  breakdown!: CategoryBreakdownItemDto[];
}

export class MonthlyTrendMonthDto {
  @ApiProperty({ description: "Month number (1-12)", example: 6, type: Number })
  month!: number;

  @ApiProperty({ description: "Income amount", example: 5000, type: Number })
  income!: number;

  @ApiProperty({ description: "Expense amount", example: 1200.5, type: Number })
  expense!: number;

  @ApiProperty({ description: "Transfer amount", example: 500, type: Number })
  transfer!: number;

  @ApiProperty({ description: "Adjustment amount", example: 0, type: Number })
  adjust!: number;

  @ApiProperty({
    description: "Net amount for the month",
    example: 3799.5,
    type: Number,
  })
  net!: number;
}

export class MonthlyTrendsResponseDto {
  @ApiProperty({
    description: "Year of the trends report",
    example: 2026,
    type: Number,
  })
  year!: number;

  @ApiProperty({
    description: "List of 12 monthly trend data points",
    type: [MonthlyTrendMonthDto],
  })
  months!: MonthlyTrendMonthDto[];
}

export class AssetDistributionItemDto {
  @ApiProperty({
    description: "Asset ID",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Asset name",
    example: "Kasikorn Savings",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Current asset balance",
    example: 25000.0,
    type: Number,
  })
  balance!: number;
}

export class AssetDistributionGroupDto {
  @ApiProperty({
    description: "Asset type",
    enum: AssetType,
    example: AssetType.BANK,
  })
  assetType!: string;

  @ApiProperty({
    description: "Total balance for this asset type",
    example: 25000.0,
    type: Number,
  })
  totalBalance!: number;

  @ApiProperty({
    description: "Percentage of total net worth",
    example: 65.5,
    type: Number,
  })
  percentage!: number;

  @ApiProperty({
    description: "List of individual assets in this group",
    type: [AssetDistributionItemDto],
  })
  assets!: AssetDistributionItemDto[];
}

export class AssetDistributionResponseDto {
  @ApiProperty({
    description: "Total net worth across all positive assets",
    example: 38160.0,
    type: Number,
  })
  totalAssets!: number;

  @ApiProperty({
    description: "Distribution grouped by asset type",
    type: [AssetDistributionGroupDto],
  })
  distribution!: AssetDistributionGroupDto[];
}

export class CategoryInfoResponseDto {
  @ApiProperty({
    description: "Category ID",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Category name",
    example: "Food & Dining",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Category color",
    example: "#FF5733",
    nullable: true,
    type: String,
  })
  color!: string | null;

  @ApiProperty({
    description: "Category icon",
    example: "utensils",
    nullable: true,
    type: String,
  })
  icon!: string | null;
}

export class CategoryTransactionSummaryDto {
  @ApiProperty({
    description: "Total amount for current month",
    example: 450.0,
    type: Number,
  })
  currentMonth!: number;

  @ApiProperty({
    description: "Total amount for previous month",
    example: 400.0,
    type: Number,
  })
  previousMonth!: number;

  @ApiProperty({
    description: "Percentage change compared to previous month",
    example: 12.5,
    type: Number,
  })
  percentageChange!: number;

  @ApiProperty({
    description: "Percentage of total expenses in current month",
    example: 25.0,
    type: Number,
  })
  percentageOfTotal!: number;
}

export class CategoryTransactionItemDto {
  @ApiProperty({
    description: "Transaction ID",
    example: "t1u2v3w4-5678-90ab-cdef-1234567890ab",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Transaction type",
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  type!: TransactionType;

  @ApiProperty({ description: "Amount", example: 150.0, type: Number })
  amount!: number;

  @ApiProperty({
    description: "Note or memo",
    example: "Lunch",
    nullable: true,
    type: String,
  })
  note!: string | null;

  @ApiProperty({
    description: "Transaction date (ISO 8601 string)",
    example: "2026-06-17T12:00:00.000Z",
    type: String,
  })
  date!: string;

  @ApiProperty({ description: "Associated asset info", nullable: true })
  asset!: any;
}

export class CategoryTransactionsResponseDto {
  @ApiProperty({
    description: "Category information",
    type: CategoryInfoResponseDto,
  })
  category!: CategoryInfoResponseDto;

  @ApiProperty({
    description: "Category monthly comparison summary",
    type: CategoryTransactionSummaryDto,
  })
  summary!: CategoryTransactionSummaryDto;

  @ApiProperty({
    description:
      "List of transactions for this category in the specified month",
    type: [CategoryTransactionItemDto],
  })
  transactions!: CategoryTransactionItemDto[];
}
