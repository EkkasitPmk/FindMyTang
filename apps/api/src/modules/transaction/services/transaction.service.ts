import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { TransactionRepository } from "../repositories/transaction.repository";
import { AssetRepository } from "../../asset/repositories/asset.repository";
import { CategoryRepository } from "../../category/repositories/category.repository";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { CreateExpenseDto } from "../dto/create-expense.dto";
import { CreateIncomeDto } from "../dto/create-income.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { Transaction, TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import { TransactionQueryDto } from "../dto/transaction-query.dto";

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly assetRepository: AssetRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createIncome(
    userId: string,
    dto: CreateIncomeDto,
  ): Promise<Transaction> {
    // 1. Validate asset exists and belongs to user
    const asset = await this.assetRepository.findById(dto.assetId);
    if (!asset) throw new NotFoundException("Asset not found");
    if (asset.userId !== userId)
      throw new ForbiddenException("You do not own this asset");

    // 2. Validate category exists, belongs to user, and is INCOME type
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) throw new NotFoundException("Category not found");
    if (category.userId !== userId)
      throw new ForbiddenException("You do not own this category");
    if (category.type !== "INCOME")
      throw new BadRequestException("Category must be of type INCOME");

    // 3. Prisma $transaction — create record + increment balance atomically
    const [tx] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: TransactionType.INCOME,
          amount: dto.amount,
          note: dto.note,
          date: new Date(dto.transactionDate),
          userId,
          assetId: dto.assetId,
          categoryId: dto.categoryId,
        },
      }),
      this.prisma.asset.update({
        where: { id: dto.assetId },
        data: { balance: { increment: dto.amount } },
      }),
    ]);

    return tx;
  }

  async createExpense(
    userId: string,
    dto: CreateExpenseDto,
  ): Promise<Transaction> {
    // 1. Validate asset exists and belongs to user
    const asset = await this.assetRepository.findById(dto.assetId);
    if (!asset) throw new NotFoundException("Asset not found");
    if (asset.userId !== userId)
      throw new ForbiddenException("You do not own this asset");

    // 2. Validate category exists, belongs to user, and is EXPENSE type
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) throw new NotFoundException("Category not found");
    if (category.userId !== userId)
      throw new ForbiddenException("You do not own this category");
    if (category.type !== "EXPENSE")
      throw new BadRequestException("Category must be of type EXPENSE");

    // 3. Check sufficient balance
    if (new Decimal(asset.balance).lessThan(dto.amount))
      throw new BadRequestException("Insufficient asset balance");

    // 4. Prisma $transaction — create record + decrement balance atomically
    // ponytail: both ops in one DB transaction; if either fails, both roll back
    const [tx] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: TransactionType.EXPENSE,
          amount: dto.amount,
          note: dto.note,
          date: new Date(dto.transactionDate),
          userId,
          assetId: dto.assetId,
          categoryId: dto.categoryId,
        },
      }),
      this.prisma.asset.update({
        where: { id: dto.assetId },
        data: { balance: { decrement: dto.amount } },
      }),
    ]);

    return tx;
  }

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionRepository.create(userId, {
      type: dto.type,
      amount: dto.amount,
      note: dto.note,
      date: new Date(dto.date),
      assetId: dto.assetId,
      categoryId: dto.categoryId,
    });
  }

  async findAll(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<{ items: Transaction[]; total: number }> {
    return this.transactionRepository.findAllByUserId(userId, query);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const tx = await this.transactionRepository.findById(id);
    if (!tx) throw new NotFoundException("Transaction not found");
    if (tx.userId !== userId)
      throw new ForbiddenException("You do not own this transaction");

    return this.transactionRepository.update(id, userId, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }

  async delete(id: string, userId: string): Promise<Transaction> {
    const tx = await this.transactionRepository.findById(id);
    if (!tx) throw new NotFoundException("Transaction not found");
    if (tx.userId !== userId)
      throw new ForbiddenException("You do not own this transaction");

    return this.transactionRepository.delete(id, userId);
  }

  // ponytail: skeletons — will wire into create/update/delete when POST /transactions is implemented.

  async applyIncome(
    userId: string,
    assetId: string,
    amount: number,
  ): Promise<void> {
    // TODO: asset.balance += amount
    await this.assetRepository.incrementBalance(assetId, userId, amount);
  }

  async applyExpense(
    userId: string,
    assetId: string,
    amount: number,
  ): Promise<void> {
    // TODO: asset.balance -= amount
    await this.assetRepository.decrementBalance(assetId, userId, amount);
  }
}
