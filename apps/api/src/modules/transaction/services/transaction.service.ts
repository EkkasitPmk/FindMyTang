import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import "multer";
import { TransactionRepository } from "../repositories/transaction.repository";
import { AssetRepository } from "../../asset/repositories/asset.repository";
import { CategoryRepository } from "../../category/repositories/category.repository";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { Transaction, TransactionType, Prisma } from "@prisma/client";
import { TransactionQueryDto } from "../dto/transaction-query.dto";
import { StorageService } from "../../../common/storage/storage.service";

@Injectable()
export class TransactionService implements OnModuleInit, OnModuleDestroy {
  private cleanupTimer?: NodeJS.Timeout;

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly assetRepository: AssetRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async invalidateSummaryCache(userId: string): Promise<void> {
    await Promise.all([
      this.cacheManager.del(`summary_today_${userId}`),
      this.cacheManager.del(`summary_month_${userId}`),
    ]);
  }

  onModuleInit() {
    // ponytail: using native setInterval instead of @nestjs/schedule to avoid unnecessary dependency.
    // Run every hour to check for 30-day old soft-deleted transactions and hard delete them.
    this.cleanupTimer = setInterval(
      () => {
        void (async () => {
          try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const expiredTransactions = await this.prisma.transaction.findMany({
              where: {
                deletedAt: {
                  lte: thirtyDaysAgo,
                },
              },
            });

            if (expiredTransactions.length > 0) {
              console.log(
                `Auto-deleting ${expiredTransactions.length} expired transactions`,
              );

              for (const tx of expiredTransactions) {
                if (tx.attachmentUrl) {
                  await this.storageService.removeFile(tx.attachmentUrl);
                }
              }

              await this.prisma.transaction.deleteMany({
                where: {
                  id: { in: expiredTransactions.map((t) => t.id) },
                },
              });
            }

            const expiredCategories = await this.prisma.category.findMany({
              where: { deletedAt: { lte: thirtyDaysAgo } },
              select: { id: true },
            });
            if (expiredCategories.length > 0) {
              const categoryIds = expiredCategories.map(
                (category) => category.id,
              );
              await this.prisma.transaction.updateMany({
                where: { categoryId: { in: categoryIds } },
                data: { categoryId: null },
              });
              await this.prisma.category.deleteMany({
                where: { id: { in: categoryIds } },
              });
            }

            const expiredAssets = await this.prisma.asset.findMany({
              where: { deletedAt: { lte: thirtyDaysAgo } },
              select: { id: true },
            });
            if (expiredAssets.length > 0) {
              const assetIds = expiredAssets.map((asset) => asset.id);
              const assetTransactions = await this.prisma.transaction.findMany({
                where: {
                  OR: [
                    { assetId: { in: assetIds } },
                    { toAssetId: { in: assetIds } },
                  ],
                  attachmentUrl: { not: null },
                },
                select: { attachmentUrl: true },
              });
              await Promise.all(
                assetTransactions
                  .map((transaction) => transaction.attachmentUrl)
                  .filter((url): url is string => Boolean(url))
                  .map((url) => this.storageService.removeFile(url)),
              );
              await this.prisma.transaction.deleteMany({
                where: { toAssetId: { in: assetIds } },
              });
              await this.prisma.asset.deleteMany({
                where: { id: { in: assetIds } },
              });
            }
          } catch (e) {
            console.error("Error running auto-delete cron:", e);
          }
        })();
      },
      60 * 60 * 1000,
    ); // Check every hour
  }

  onModuleDestroy() {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
  }

  private async handleTransfer(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CreateTransactionDto,
    attachmentUrl?: string | null,
  ): Promise<Transaction> {
    if (!dto.toAssetId)
      throw new BadRequestException("Target asset is required for transfer");
    const toAsset = await this.assetRepository.findById(dto.toAssetId);
    if (!toAsset) throw new NotFoundException("Target asset not found");
    if (toAsset.userId !== userId)
      throw new ForbiddenException("You do not own the target asset");

    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.TRANSFER,
        amount: dto.amount,
        note: dto.note,
        date: new Date(dto.date),
        userId,
        assetId: dto.assetId,
        toAssetId: dto.toAssetId,
        attachmentUrl,
      },
    });
    await tx.asset.update({
      where: { id: dto.assetId },
      data: { balance: { decrement: dto.amount } },
    });
    await tx.asset.update({
      where: { id: dto.toAssetId },
      data: { balance: { increment: dto.amount } },
    });
    return transaction;
  }

  private async handleAdjustment(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CreateTransactionDto,
    attachmentUrl?: string | null,
  ): Promise<Transaction> {
    const asset = await tx.asset.findUnique({ where: { id: dto.assetId } });
    if (!asset) throw new NotFoundException("Asset not found");

    // dto.amount is the target balance sent by frontend
    const difference = dto.amount - Number(asset.balance);

    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.ADJUSTMENT,
        amount: difference,
        note: dto.note,
        date: new Date(dto.date),
        userId,
        assetId: dto.assetId,
        attachmentUrl,
      },
    });
    await tx.asset.update({
      where: { id: dto.assetId },
      data: { balance: dto.amount },
    });
    return transaction;
  }

  private async handleIncomeExpense(
    tx: Prisma.TransactionClient,
    userId: string,
    dto: CreateTransactionDto,
    attachmentUrl?: string | null,
  ): Promise<Transaction> {
    if (!dto.categoryId)
      throw new BadRequestException("Category is required for income/expense");
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) throw new NotFoundException("Category not found");
    if (category.userId !== userId)
      throw new ForbiddenException("You do not own this category");

    if (dto.type === TransactionType.INCOME && category.type !== "INCOME")
      throw new BadRequestException("Category must be of type INCOME");
    if (dto.type === TransactionType.EXPENSE && category.type !== "EXPENSE")
      throw new BadRequestException("Category must be of type EXPENSE");

    const transaction = await tx.transaction.create({
      data: {
        type: dto.type,
        amount: dto.amount,
        note: dto.note,
        date: new Date(dto.date),
        userId,
        assetId: dto.assetId,
        categoryId: dto.categoryId,
        attachmentUrl,
      },
    });

    const increment =
      dto.type === TransactionType.INCOME ? dto.amount : -dto.amount;
    await tx.asset.update({
      where: { id: dto.assetId },
      data: { balance: { increment } },
    });
    return transaction;
  }

  private async updateBalances(
    tx: Prisma.TransactionClient,
    type: TransactionType,
    amount: number | Prisma.Decimal,
    assetId: string,
    toAssetId?: string | null,
    isRevert: boolean = false,
  ) {
    const numericAmount = typeof amount === "number" ? amount : Number(amount);
    const multiplier = isRevert ? -1 : 1;
    if (
      type === TransactionType.INCOME ||
      type === TransactionType.ADJUSTMENT
    ) {
      await tx.asset.update({
        where: { id: assetId },
        data: { balance: { increment: numericAmount * multiplier } },
      });
    } else if (type === TransactionType.EXPENSE) {
      await tx.asset.update({
        where: { id: assetId },
        data: { balance: { decrement: numericAmount * multiplier } },
      });
    } else if (type === TransactionType.TRANSFER) {
      await tx.asset.update({
        where: { id: assetId },
        data: { balance: { decrement: numericAmount * multiplier } },
      });
      if (toAssetId) {
        await tx.asset.update({
          where: { id: toAssetId },
          data: { balance: { increment: numericAmount * multiplier } },
        });
      }
    }
  }

  async create(
    userId: string,
    dto: CreateTransactionDto,
    file?: Express.Multer.File,
  ): Promise<Transaction> {
    // 1. Validate main asset
    const asset = await this.assetRepository.findById(dto.assetId);
    if (!asset) throw new NotFoundException("Asset not found");
    if (asset.userId !== userId)
      throw new ForbiddenException("You do not own this asset");

    let attachmentUrl = dto.attachmentUrl;
    if (file) {
      const uploadedUrl = await this.storageService.uploadFile(file);
      if (uploadedUrl) {
        attachmentUrl = uploadedUrl;
      }
    }

    // 2. Handle based on type
    const resultTransaction = await this.prisma.$transaction(async (tx) => {
      if (dto.type === TransactionType.TRANSFER) {
        return this.handleTransfer(tx, userId, dto, attachmentUrl);
      } else if (dto.type === TransactionType.ADJUSTMENT) {
        return this.handleAdjustment(tx, userId, dto, attachmentUrl);
      } else {
        return this.handleIncomeExpense(tx, userId, dto, attachmentUrl);
      }
    });

    if (resultTransaction.attachmentUrl) {
      resultTransaction.attachmentUrl = await this.storageService.getSignedUrl(
        resultTransaction.attachmentUrl,
      );
    }
    await this.invalidateSummaryCache(userId);
    return resultTransaction;
  }

  async findAll(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<{
    items: Transaction[];
    total: number;
    nextCursor?: string | null;
  }> {
    const result = await this.transactionRepository.findAllByUserId(
      userId,
      query,
    );

    // Map paths to signed URLs
    for (const item of result.items) {
      if (item.attachmentUrl) {
        item.attachmentUrl = await this.storageService.getSignedUrl(
          item.attachmentUrl,
        );
      }
    }

    return result;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateTransactionDto,
    file?: Express.Multer.File,
  ): Promise<Transaction> {
    const tx = await this.transactionRepository.findById(id, true);
    if (!tx) throw new NotFoundException("Transaction not found");
    if (tx.userId !== userId)
      throw new ForbiddenException("You do not own this transaction");

    if (
      tx.attachmentUrl &&
      (dto.attachmentUrl === null || dto.attachmentUrl === "")
    ) {
      await this.storageService.removeFile(tx.attachmentUrl);
    }

    let newAttachmentUrl =
      dto.attachmentUrl === null || dto.attachmentUrl === ""
        ? null
        : dto.attachmentUrl || tx.attachmentUrl;

    if (file) {
      const uploadedUrl = await this.storageService.uploadFile(file);
      if (uploadedUrl) {
        newAttachmentUrl = uploadedUrl;
        // Optionally delete the old file if we just uploaded a new one and didn't already delete it
        if (tx.attachmentUrl && tx.attachmentUrl !== newAttachmentUrl) {
          await this.storageService.removeFile(tx.attachmentUrl);
        }
      }
    }

    const updatedTx = await this.prisma.$transaction(async (prismaTx) => {
      // Revert old transaction balances
      if (!tx.deletedAt) {
        await this.updateBalances(
          prismaTx,
          tx.type,
          tx.amount,
          tx.assetId,
          tx.toAssetId,
          true,
        );
      }

      const newType = dto.type ?? tx.type;
      const newAmount = dto.amount ?? tx.amount;
      const newAssetId = dto.assetId ?? tx.assetId;

      let newToAssetId = dto.toAssetId ?? tx.toAssetId;
      if (newType !== "TRANSFER" || newToAssetId === "") {
        newToAssetId = null;
      }

      let newCategoryId = dto.categoryId ?? tx.categoryId;
      if (
        newType === "TRANSFER" ||
        newType === "ADJUSTMENT" ||
        newCategoryId === ""
      ) {
        newCategoryId = null;
      }

      // Apply new transaction balances
      await this.updateBalances(
        prismaTx,
        newType,
        newAmount,
        newAssetId,
        newToAssetId,
        false,
      );

      return prismaTx.transaction.update({
        where: { id },
        data: {
          ...dto,
          toAssetId: newToAssetId,
          categoryId: newCategoryId,
          attachmentUrl: newAttachmentUrl,
          date: dto.date ? new Date(dto.date) : undefined,
          deletedAt: null,
        },
      });
    });

    if (updatedTx.attachmentUrl) {
      updatedTx.attachmentUrl = await this.storageService.getSignedUrl(
        updatedTx.attachmentUrl,
      );
    }
    await this.invalidateSummaryCache(userId);
    return updatedTx;
  }

  async delete(
    id: string,
    userId: string,
    isHardDelete?: boolean,
  ): Promise<Transaction> {
    const tx = await this.transactionRepository.findById(id, true); // Include soft-deleted if we are hard deleting
    if (!tx) throw new NotFoundException("Transaction not found");
    if (tx.userId !== userId)
      throw new ForbiddenException("You do not own this transaction");

    // ponytail: if hard deleting, clean up the storage file too so we don't leak space
    if (isHardDelete && tx.attachmentUrl) {
      await this.storageService.removeFile(tx.attachmentUrl);
    }

    const deletedTx = await this.prisma.$transaction(async (prismaTx) => {
      // If it's not already soft deleted, revert its balances
      if (!tx.deletedAt) {
        await this.updateBalances(
          prismaTx,
          tx.type,
          tx.amount,
          tx.assetId,
          tx.toAssetId,
          true,
        );
      }

      if (isHardDelete) {
        return prismaTx.transaction.delete({ where: { id } });
      }

      return prismaTx.transaction.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });

    await this.invalidateSummaryCache(userId);
    return deletedTx;
  }

  async getAvailableDates(
    userId: string,
    assetId?: string,
    isDeleted?: boolean,
  ) {
    return this.transactionRepository.getAvailableDates(
      userId,
      assetId,
      isDeleted,
    );
  }

  async findOne(userId: string, id: string) {
    // ponytail: Repository.findAll doesn't accept an ID directly, so we just use Prisma here for the single fetch.
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { asset: true, toAsset: true, category: true },
    });
    if (!transaction) throw new NotFoundException("Transaction not found");

    if (transaction.attachmentUrl) {
      transaction.attachmentUrl = await this.storageService.getSignedUrl(
        transaction.attachmentUrl,
      );
    }

    return transaction;
  }

  // ponytail: skeletons — will wire into create/update/delete when POST /transactions is implemented.

  async applyIncome(
    userId: string,
    assetId: string,
    amount: number,
  ): Promise<void> {
    //  asset.balance += amount
    await this.assetRepository.incrementBalance(assetId, userId, amount);
  }

  async applyExpense(
    userId: string,
    assetId: string,
    amount: number,
  ): Promise<void> {
    await this.assetRepository.decrementBalance(assetId, userId, amount);
  }

  async getAvailableYears(userId: string): Promise<number[]> {
    return this.transactionRepository.getAvailableYears(userId);
  }
}
