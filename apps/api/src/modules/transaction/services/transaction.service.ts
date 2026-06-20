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

import { TransactionQueryDto } from "../dto/transaction-query.dto";

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly assetRepository: AssetRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    // 1. Validate main asset
    const asset = await this.assetRepository.findById(dto.assetId);
    if (!asset) throw new NotFoundException("Asset not found");
    if (asset.userId !== userId)
      throw new ForbiddenException("You do not own this asset");

    // 2. Handle based on type
    return this.prisma.$transaction(async (tx) => {
      let transaction: Transaction;

      if (dto.type === TransactionType.TRANSFER) {
        if (!dto.toAssetId) {
          throw new BadRequestException(
            "Target asset is required for transfer",
          );
        }
        const toAsset = await this.assetRepository.findById(dto.toAssetId);
        if (!toAsset) throw new NotFoundException("Target asset not found");
        if (toAsset.userId !== userId)
          throw new ForbiddenException("You do not own the target asset");

        transaction = await tx.transaction.create({
          data: {
            type: TransactionType.TRANSFER,
            amount: dto.amount,
            note: dto.note,
            date: new Date(dto.date),
            userId,
            assetId: dto.assetId,
            toAssetId: dto.toAssetId,
            attachmentUrl: dto.attachmentUrl,
          },
        });

        // Decrement From, Increment To
        await tx.asset.update({
          where: { id: dto.assetId },
          data: { balance: { decrement: dto.amount } },
        });
        await tx.asset.update({
          where: { id: dto.toAssetId },
          data: { balance: { increment: dto.amount } },
        });
      } else if (dto.type === TransactionType.ADJUSTMENT) {
        transaction = await tx.transaction.create({
          data: {
            type: TransactionType.ADJUSTMENT,
            amount: dto.amount,
            note: dto.note,
            date: new Date(dto.date),
            userId,
            assetId: dto.assetId,
            attachmentUrl: dto.attachmentUrl,
          },
        });

        // Update balance by delta (amount can be positive or negative)
        await tx.asset.update({
          where: { id: dto.assetId },
          data: { balance: { increment: dto.amount } },
        });
      } else {
        // INCOME or EXPENSE
        if (!dto.categoryId) {
          throw new BadRequestException(
            "Category is required for income/expense",
          );
        }
        const category = await this.categoryRepository.findById(dto.categoryId);
        if (!category) throw new NotFoundException("Category not found");
        if (category.userId !== userId)
          throw new ForbiddenException("You do not own this category");

        if (dto.type === TransactionType.INCOME && category.type !== "INCOME") {
          throw new BadRequestException("Category must be of type INCOME");
        }
        if (
          dto.type === TransactionType.EXPENSE &&
          category.type !== "EXPENSE"
        ) {
          throw new BadRequestException("Category must be of type EXPENSE");
        }

        transaction = await tx.transaction.create({
          data: {
            type: dto.type,
            amount: dto.amount,
            note: dto.note,
            date: new Date(dto.date),
            userId,
            assetId: dto.assetId,
            categoryId: dto.categoryId,
            attachmentUrl: dto.attachmentUrl,
          },
        });

        const increment =
          dto.type === TransactionType.INCOME ? dto.amount : -dto.amount;
        await tx.asset.update({
          where: { id: dto.assetId },
          data: { balance: { increment } },
        });
      }

      return transaction;
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
