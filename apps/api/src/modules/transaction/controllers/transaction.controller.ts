import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TransactionService } from "../services/transaction.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { CreateExpenseDto } from "../dto/create-expense.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User, Transaction } from "@prisma/client";

// ponytail: maps Prisma Transaction to a plain JSON-safe object (Decimal → number)
function toResponse(tx: Transaction) {
  return {
    id: tx.id,
    type: tx.type,
    amount: Number(tx.amount),
    note: tx.note,
    date: tx.date,
    assetId: tx.assetId,
    categoryId: tx.categoryId,
    createdAt: tx.createdAt,
    updatedAt: tx.updatedAt,
  };
}

@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post("expense")
  @UseGuards(JwtAuthGuard)
  async createExpense(
    @CurrentUser() user: User,
    @Body() dto: CreateExpenseDto,
  ) {
    return toResponse(
      await this.transactionService.createExpense(user.id, dto),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: User, @Body() dto: CreateTransactionDto) {
    return toResponse(await this.transactionService.create(user.id, dto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    const txs = await this.transactionService.findAll(user.id);
    return txs.map(toResponse);
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
