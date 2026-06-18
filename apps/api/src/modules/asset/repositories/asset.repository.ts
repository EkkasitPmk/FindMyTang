import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Asset, AssetType } from "@prisma/client";

export interface CreateAssetData {
  name: string;
  type: AssetType;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
}

@Injectable()
export class AssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateAssetData): Promise<Asset> {
    // ponytail: Creates a new asset associated with the authenticated user.
    return this.prisma.asset.create({
      data: {
        name: data.name,
        type: data.type,
        balance: data.balance,
        currency: data.currency,
        color: data.color,
        icon: data.icon,
        userId,
      },
    });
  }

  async findById(id: string): Promise<Asset | null> {
    // ponytail: Finds an asset by its unique database ID, ensuring it's not soft-deleted.
    return this.prisma.asset.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findAllByUserId(userId: string): Promise<Asset[]> {
    // ponytail: Fetches all assets associated with the authenticated user that are not soft-deleted.
    return this.prisma.asset.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateAssetData & { isArchived: boolean }>,
  ): Promise<Asset> {
    // ponytail: Updates an asset matching id and userId to prevent cross-user updates.
    const asset = await this.prisma.asset.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!asset) {
      throw new Error("Asset not found or access denied");
    }
    return this.prisma.asset.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Asset> {
    // ponytail: Soft deletes an asset matching id and userId.
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

  async incrementBalance(
    id: string,
    userId: string,
    amount: number,
  ): Promise<Asset> {
    // ponytail: atomic increment — Prisma handles it in a single UPDATE, no read-then-write race.
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
    // ponytail: atomic decrement — same as above. Negative-balance guard is a service concern, not repo.
    return this.prisma.asset.update({
      where: { id, userId },
      data: { balance: { decrement: amount } },
    });
  }
}
