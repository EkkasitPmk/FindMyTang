import { Controller, Get, Query, Req, UseGuards, Param } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { AnalyticsService } from "../services/analytics.service";
import {
  CategoryBreakdownQueryDto,
  MonthlyTrendsQueryDto,
  CategoryTransactionsQueryDto,
} from "../dto/analytics-query.dto";
import {
  CategoryBreakdownResponseDto,
  MonthlyTrendsResponseDto,
  AssetDistributionResponseDto,
  CategoryTransactionsResponseDto,
} from "../dto/analytics-response.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import type { Request } from "express";

@ApiTags("Analytics")
@ApiBearerAuth()
@Controller("analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("categories")
  @ApiOperation({
    summary: "Get category breakdown report",
    description:
      "Calculates financial breakdown by category for a given month and year (defaults to current month and year).",
  })
  @ApiResponse({
    status: 200,
    description: "Category breakdown retrieved successfully.",
    type: CategoryBreakdownResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async getCategoryBreakdown(
    @Req() req: Request,
    @Query() query: CategoryBreakdownQueryDto,
  ): Promise<CategoryBreakdownResponseDto> {
    const userId = (req.user as { id: string }).id;
    const m = query.month
      ? Number.parseInt(query.month, 10)
      : new Date().getMonth() + 1;
    const y = query.year
      ? Number.parseInt(query.year, 10)
      : new Date().getFullYear();
    const t = ["INCOME", "TRANSFER", "ADJUSTMENT"].includes(
      query.type as string,
    )
      ? (query.type as "INCOME" | "TRANSFER" | "ADJUSTMENT")
      : "EXPENSE";
    return this.analyticsService.getCategoryBreakdown(userId, m, y, t);
  }

  @Get("trends")
  @ApiOperation({
    summary: "Get 12-month financial trends",
    description:
      "Retrieves 12-month income, expense, transfer, adjustment, and net cash flow trends for a specific year.",
  })
  @ApiResponse({
    status: 200,
    description: "Monthly trends retrieved successfully.",
    type: MonthlyTrendsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async getMonthlyTrends(
    @Req() req: Request,
    @Query() query: MonthlyTrendsQueryDto,
  ): Promise<MonthlyTrendsResponseDto> {
    const userId = (req.user as { id: string }).id;
    const y = query.year
      ? Number.parseInt(query.year, 10)
      : new Date().getFullYear();
    return this.analyticsService.getMonthlyTrends(userId, y);
  }

  @Get("assets")
  @ApiOperation({
    summary: "Get asset distribution report",
    description:
      "Calculates asset distribution percentage grouped by asset type (e.g. Bank, Cash, Investment).",
  })
  @ApiResponse({
    status: 200,
    description: "Asset distribution report retrieved successfully.",
    type: AssetDistributionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async getAssetDistribution(
    @Req() req: Request,
  ): Promise<AssetDistributionResponseDto> {
    const userId = (req.user as { id: string }).id;
    return this.analyticsService.getAssetDistribution(userId);
  }

  @Get("categories/:id/transactions")
  @ApiOperation({
    summary: "Get category drill-down transactions",
    description:
      "Fetches detailed transactions under a specific category for a given month with month-over-month comparison.",
  })
  @ApiParam({
    name: "id",
    description: "Unique category ID (UUID)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
  })
  @ApiResponse({
    status: 200,
    description: "Category drill-down details retrieved successfully.",
    type: CategoryTransactionsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  @ApiResponse({
    status: 404,
    description: "Category not found.",
  })
  async getCategoryTransactions(
    @Req() req: Request,
    @Param("id") categoryId: string,
    @Query() query: CategoryTransactionsQueryDto,
  ): Promise<CategoryTransactionsResponseDto> {
    const userId = (req.user as { id: string }).id;
    const m = query.month
      ? Number.parseInt(query.month, 10)
      : new Date().getMonth() + 1;
    const y = query.year
      ? Number.parseInt(query.year, 10)
      : new Date().getFullYear();
    return this.analyticsService.getCategoryTransactions(
      userId,
      categoryId,
      m,
      y,
    );
  }
}
