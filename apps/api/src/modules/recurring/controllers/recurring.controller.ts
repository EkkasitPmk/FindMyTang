import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { RecurringService } from "../services/recurring.service";
import { CreateRecurringDto } from "../dto/create-recurring.dto";
import { UpdateRecurringDto } from "../dto/update-recurring.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { RecurringStatus, type User } from "@prisma/client";

@ApiTags("Recurring")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("recurring")
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post()
  @ApiOperation({ summary: "Create a new recurring expense" })
  @ApiBody({ type: CreateRecurringDto })
  @ApiResponse({
    status: 201,
    description: "Recurring expense created successfully",
  })
  async create(@CurrentUser() user: User, @Body() dto: CreateRecurringDto) {
    return this.recurringService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all recurring expenses for current user" })
  @ApiQuery({ name: "status", enum: RecurringStatus, required: false })
  @ApiQuery({ name: "includeDeleted", type: Boolean, required: false })
  async findAll(
    @CurrentUser() user: User,
    @Query("status") status?: RecurringStatus,
    @Query("includeDeleted") includeDeleted?: string,
  ) {
    const shouldIncludeDeleted = includeDeleted === "true";
    return this.recurringService.findAll(user.id, status, shouldIncludeDeleted);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a recurring expense by ID" })
  @ApiParam({ name: "id", type: String })
  async findById(@CurrentUser() user: User, @Param("id") id: string) {
    return this.recurringService.findById(id, user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a recurring expense by ID" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateRecurringDto })
  async update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(id, user.id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a recurring expense by ID (soft delete)" })
  @ApiParam({ name: "id", type: String })
  async delete(@CurrentUser() user: User, @Param("id") id: string) {
    return this.recurringService.delete(id, user.id);
  }
}
