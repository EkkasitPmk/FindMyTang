import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Asset, AssetType } from "@prisma/client";

export interface CreateAssetData {
  name: string;
  type: AssetType;
  balance?: number;
  color?: string;
  includeInSnapshot?: boolean;
  savingsAmount?: number;
}

@Injectable()
export class AssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateAssetData): Promise<Asset> {
    return this.prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: {
          name: data.name,
          type: data.type,
          balance: data.balance ?? 0,
          color: data.color,
          includeInSnapshot: data.includeInSnapshot ?? true,
          savingsAmount: data.savingsAmount ?? 0,
          userId,
        },
      });

      if (data.balance && data.balance > 0) {
        await tx.transaction.create({
          data: {
            amount: data.balance,
            date: new Date(),
            userId,
            assetId: asset.id,
            type: "ADJUSTMENT",
            note: "Initial Balance",
          },
        });
      }

      return asset;
    });
  }

  async findById(id: string): Promise<Asset | null> {
    return this.prisma.asset.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByIdAny(id: string): Promise<Asset | null> {
    return this.prisma.asset.findFirst({
      where: { id },
    });
  }

  async findAllActiveByUserId(userId: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { userId, deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
  }

  async findAllIncludingDeletedByUserId(userId: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { userId },
      orderBy: { displayOrder: "asc" },
    });
  }

  async findAttachmentsByAssetId(
    id: string,
    userId: string,
  ): Promise<string[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        OR: [{ assetId: id }, { toAssetId: id }],
        attachmentUrl: { not: null },
      },
      select: { attachmentUrl: true },
    });
    return transactions
      .map((t) => t.attachmentUrl)
      .filter((url): url is string => Boolean(url));
  }

  async update(
    id: string,
    userId: string,
    data: Partial<
      CreateAssetData & { isArchived: boolean; deletedAt: Date | null }
    >,
  ): Promise<Asset> {
    const asset = await this.prisma.asset.findFirst({
      where: { id, userId },
    });
    if (!asset) {
      throw new Error("Asset not found or access denied");
    }
    return this.prisma.asset.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, userId: string): Promise<Asset> {
    const asset = await this.prisma.asset.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!asset) {
      throw new Error("Asset not found or access denied");
    }
    return this.prisma.asset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardDelete(id: string, userId: string): Promise<Asset> {
    const asset = await this.prisma.asset.findFirst({ where: { id, userId } });
    if (!asset) {
      throw new Error("Asset not found or access denied");
    }
    await this.prisma.transaction.deleteMany({
      where: { toAssetId: id },
    });
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async restore(id: string, userId: string): Promise<Asset> {
    const asset = await this.prisma.asset.findFirst({
      where: { id, userId, deletedAt: { not: null } },
    });
    if (!asset) {
      throw new Error("Asset not found or not deleted");
    }
    return this.prisma.asset.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async incrementBalance(
    id: string,
    userId: string,
    amount: number,
  ): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id, userId },
      data: { balance: { increment: amount } },
    });
  }

  async decrementBalance(
    id: string,
    userId: string,
    amount: number,
  ): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id, userId },
      data: { balance: { decrement: amount } },
    });
  }

  async reorder(userId: string, ids: string[]): Promise<void> {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.asset.updateMany({
          where: { id, userId },
          data: { displayOrder: index + 1 },
        }),
      ),
    );
  }

  async bulkSoftDelete(userId: string, ids: string[]): Promise<void> {
    await this.prisma.asset.updateMany({
      where: { userId, id: { in: ids } },
      data: { deletedAt: new Date() },
    });
  }

  async bulkHardDelete(userId: string, ids: string[]): Promise<void> {
    await this.prisma.transaction.deleteMany({
      where: {
        OR: [{ assetId: { in: ids } }, { toAssetId: { in: ids } }],
      },
    });
    await this.prisma.asset.deleteMany({
      where: { userId, id: { in: ids } },
    });
  }

  async bulkArchive(userId: string, ids: string[]): Promise<void> {
    await this.prisma.asset.updateMany({
      where: { userId, id: { in: ids } },
      data: { isArchived: true },
    });
  }

  async bulkRestore(userId: string, ids: string[]): Promise<void> {
    await this.prisma.asset.updateMany({
      where: { userId, id: { in: ids } },
      data: { deletedAt: null, isArchived: false },
    });
  }
}
