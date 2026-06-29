import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import "multer";
import { TransactionRepository } from "../repositories/transaction.repository";
import { AssetRepository } from "../../asset/repositories/asset.repository";
import { CategoryRepository } from "../../category/repositories/category.repository";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { Transaction, TransactionType, Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { TransactionQueryDto } from "../dto/transaction-query.dto";

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly assetRepository: AssetRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly prisma: PrismaService,
  ) {}

  private readonly supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "",
  );

  async uploadFile(file: Express.Multer.File): Promise<string | null> {
    if (!file) return null;
    try {
      const bucketName = process.env.SUPABASE_BUCKET || "attachments";
      const fileExtension = file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return null;
      }
      return data.path; // ponytail: store path instead of public URL for private buckets
    } catch (e) {
      console.error("Upload exception:", e);
      return null;
    }
  }

  private async getAttachmentUrl(
    pathOrUrl: string | null,
    bucketName: string,
  ): Promise<string | null> {
    if (!pathOrUrl) return null;
    // If it's already a full URL (legacy), try to extract path or just return it
    let path = pathOrUrl;
    if (pathOrUrl.startsWith("http")) {
      const parts = pathOrUrl.split(`/${bucketName}/`);
      if (parts.length > 1) {
        path = parts[1];
      } else {
        return pathOrUrl; // Cannot extract, return as is
      }
    }

    const { data } = await this.supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 3600); // 1 hour expiration

    return data?.signedUrl || null;
  }

  private async removeAttachmentFromSupabase(
    attachmentUrl: string,
  ): Promise<void> {
    const bucketName = process.env.SUPABASE_BUCKET || "attachments";
    let path = attachmentUrl;
    if (path.startsWith("http")) {
      const parts = path.split(`/${bucketName}/`);
      if (parts.length > 1) {
        path = parts[1];
      }
    }
    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([path]);
    if (error) {
      console.error("Failed to delete attachment from Supabase:", error);
    }
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
    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.ADJUSTMENT,
        amount: dto.amount,
        note: dto.note,
        date: new Date(dto.date),
        userId,
        assetId: dto.assetId,
        attachmentUrl,
      },
    });
    await tx.asset.update({
      where: { id: dto.assetId },
      data: { balance: { increment: dto.amount } },
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
      const uploadedUrl = await this.uploadFile(file);
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
      const bucketName = process.env.SUPABASE_BUCKET || "attachments";
      resultTransaction.attachmentUrl = await this.getAttachmentUrl(
        resultTransaction.attachmentUrl,
        bucketName,
      );
    }
    return resultTransaction;
  }

  async findAll(
    userId: string,
    query: TransactionQueryDto,
  ): Promise<{ items: Transaction[]; total: number }> {
    const result = await this.transactionRepository.findAllByUserId(
      userId,
      query,
    );
    const bucketName = process.env.SUPABASE_BUCKET || "attachments";

    // Map paths to signed URLs
    for (const item of result.items) {
      if (item.attachmentUrl) {
        item.attachmentUrl = await this.getAttachmentUrl(
          item.attachmentUrl,
          bucketName,
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
    const tx = await this.transactionRepository.findById(id);
    if (!tx) throw new NotFoundException("Transaction not found");
    if (tx.userId !== userId)
      throw new ForbiddenException("You do not own this transaction");

    if (
      tx.attachmentUrl &&
      (dto.attachmentUrl === null || dto.attachmentUrl === "")
    ) {
      await this.removeAttachmentFromSupabase(tx.attachmentUrl);
    }

    let newAttachmentUrl =
      dto.attachmentUrl === null || dto.attachmentUrl === ""
        ? null
        : dto.attachmentUrl || tx.attachmentUrl;

    if (file) {
      const uploadedUrl = await this.uploadFile(file);
      if (uploadedUrl) {
        newAttachmentUrl = uploadedUrl;
        // Optionally delete the old file if we just uploaded a new one and didn't already delete it
        if (tx.attachmentUrl && tx.attachmentUrl !== newAttachmentUrl) {
          await this.removeAttachmentFromSupabase(tx.attachmentUrl);
        }
      }
    }

    const updatedTx = await this.transactionRepository.update(id, userId, {
      ...dto,
      attachmentUrl: newAttachmentUrl,
      date: dto.date ? new Date(dto.date) : undefined,
    });

    if (updatedTx.attachmentUrl) {
      const bucketName = process.env.SUPABASE_BUCKET || "attachments";
      updatedTx.attachmentUrl = await this.getAttachmentUrl(
        updatedTx.attachmentUrl,
        bucketName,
      );
    }
    return updatedTx;
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
