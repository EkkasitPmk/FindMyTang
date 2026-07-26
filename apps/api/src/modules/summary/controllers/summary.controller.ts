import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { SummaryService } from "../services/summary.service";
import { SummaryResponseDto } from "../dto/summary-response.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User } from "@prisma/client";

@ApiTags("Summary")
@ApiBearerAuth()
@Controller("summary")
@UseGuards(JwtAuthGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get("today")
  @ApiOperation({
    summary: "Get today's financial summary",
    description:
      "Calculates total income, total expense, and net cash flow for today.",
  })
  @ApiResponse({
    status: 200,
    description: "Today's summary retrieved successfully.",
    type: SummaryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async getTodaySummary(
    @CurrentUser() user: User,
  ): Promise<SummaryResponseDto> {
    return this.summaryService.getTodaySummary(user.id);
  }

  @Get("monthly")
  @ApiOperation({
    summary: "Get this month's financial summary",
    description:
      "Calculates total income, total expense, net cash flow, and total net worth for the current month.",
  })
  @ApiResponse({
    status: 200,
    description: "This month's summary retrieved successfully.",
    type: SummaryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async getThisMonthSummary(
    @CurrentUser() user: User,
  ): Promise<SummaryResponseDto> {
    return this.summaryService.getThisMonthSummary(user.id);
  }
}
