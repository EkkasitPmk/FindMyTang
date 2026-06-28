import { Controller, Get, UseGuards } from "@nestjs/common";
import { SummaryService, TodaySummary } from "../services/summary.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User } from "@prisma/client";

@Controller("summary")
@UseGuards(JwtAuthGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get("today")
  async getTodaySummary(@CurrentUser() user: User): Promise<TodaySummary> {
    return this.summaryService.getTodaySummary(user.id);
  }

  @Get("monthly")
  async getThisMonthSummary(@CurrentUser() user: User): Promise<TodaySummary> {
    return this.summaryService.getThisMonthSummary(user.id);
  }
}
