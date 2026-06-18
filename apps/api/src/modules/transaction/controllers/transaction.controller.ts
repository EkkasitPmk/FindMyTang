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
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { CreateExpenseDto } from "../dto/create-expense.dto";
import { CreateIncomeDto } from "../dto/create-income.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { TransactionType } from "@prisma/client";
import type { User, Transaction } from "@prisma/client";
import { TransactionQueryDto } from "../dto/transaction-query.dto";

// ponytail: maps Prisma Transaction to a plain JSON-safe object (Decimal → number)
// and handles included relations if present
function toResponse(tx: any) {
  return {
    id: tx.id,
    type: tx.type,
    amount: Number(tx.amount),
    note: tx.note,
    transactionDate: tx.date,
    assetId: tx.assetId,
    categoryId: tx.categoryId,
    asset: tx.asset
      ? {
          id: tx.asset.id,
          name: tx.asset.name,
          type: tx.asset.type,
          balance: Number(tx.asset.balance),
          currency: tx.asset.currency,
        }
      : undefined,
    category: tx.category
      ? {
          id: tx.category.id,
          name: tx.category.name,
          type: tx.category.type,
          color: tx.category.color,
          icon: tx.category.icon,
        }
      : undefined,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
  };
}

@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post("income")
  @UseGuards(JwtAuthGuard)
  async createIncome(
    @CurrentUser() user: User,
    @Body() dto: CreateIncomeDto,
  ) {
    return toResponse(
      await this.transactionService.create(user.id, {
        ...dto,
        type: TransactionType.INCOME,
        date: dto.transactionDate,
      }),
    );
  }

  @Post("expense")
  @UseGuards(JwtAuthGuard)
  async createExpense(
    @CurrentUser() user: User,
    @Body() dto: CreateExpenseDto,
  ) {
    return toResponse(
      await this.transactionService.create(user.id, {
        ...dto,
        type: TransactionType.EXPENSE,
        date: dto.transactionDate,
      }),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: User, @Body() dto: CreateTransactionDto) {
    return toResponse(await this.transactionService.create(user.id, dto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Query() query: TransactionQueryDto,
  ) {
    const { items, total } = await this.transactionService.findAll(
      user.id,
      query,
    );
    const limit = query.limit || 20;
    const page = query.page || 1;

    return {
      items: items.map(toResponse),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateTransactionDto,
  ) {
    return toResponse(await this.transactionService.update(id, user.id, dto));
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string, @CurrentUser() user: User) {
    return toResponse(await this.transactionService.delete(id, user.id));
  }
}
