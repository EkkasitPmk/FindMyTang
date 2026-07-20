import { Controller, Get, Query, Req, UseGuards, Param } from "@nestjs/common";
import { AnalyticsService } from "../services/analytics.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import type { Request } from "express";

// ponytail: minimal robust controller mapping req/query to service
@Controller("analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("categories")
  async getCategoryBreakdown(
    @Req() req: Request,
    @Query("month") month?: string,
    @Query("year") year?: string,
    @Query("type") type?: string,
  ) {
    const userId = (req.user as { id: string }).id;
    const m = month ? Number.parseInt(month, 10) : new Date().getMonth() + 1;
    const y = year ? Number.parseInt(year, 10) : new Date().getFullYear();
    const t = ["INCOME", "TRANSFER", "ADJUSTMENT"].includes(type as string)
      ? (type as "INCOME" | "TRANSFER" | "ADJUSTMENT")
      : "EXPENSE";
    return this.analyticsService.getCategoryBreakdown(userId, m, y, t);
  }

  @Get("trends")
  async getMonthlyTrends(@Req() req: Request, @Query("year") year?: string) {
    const userId = (req.user as { id: string }).id;
    const y = year ? Number.parseInt(year, 10) : new Date().getFullYear();
    return this.analyticsService.getMonthlyTrends(userId, y);
  }

  @Get("assets")
  async getAssetDistribution(@Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    return this.analyticsService.getAssetDistribution(userId);
  }

  @Get("categories/:id/transactions")
  async getCategoryTransactions(
    @Req() req: Request,
    @Param("id") categoryId: string,
    @Query("month") month?: string,
    @Query("year") year?: string,
  ) {
    const userId = (req.user as { id: string }).id;
    const m = month ? Number.parseInt(month, 10) : new Date().getMonth() + 1;
    const y = year ? Number.parseInt(year, 10) : new Date().getFullYear();
    return this.analyticsService.getCategoryTransactions(
      userId,
      categoryId,
      m,
      y,
    );
  }
}
