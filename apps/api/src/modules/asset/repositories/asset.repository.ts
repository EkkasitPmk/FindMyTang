import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { Asset, AssetType } from "@prisma/client";

export interface CreateAssetData {
  name: string;
  type: AssetType;
  balance?: number;
  currency?: string;
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
        userId,
      },
    });
  }

  async findById(id: string): Promise<Asset | null> {
    // ponytail: Finds an asset by its unique database ID.
    return this.prisma.asset.findUnique({
      where: { id },
    });
  }

  async findAllByUserId(userId: string): Promise<Asset[]> {
    // ponytail: Fetches all assets associated with the authenticated user.
    return this.prisma.asset.findMany({
      where: {
        userId,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<CreateAssetData>,
  ): Promise<Asset> {
    // ponytail: Updates an asset matching id and userId to prevent cross-user updates.
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

  async delete(id: string, userId: string): Promise<Asset> {
    // ponytail: Deletes an asset matching id and userId to prevent cross-user deletion.
    const asset = await this.prisma.asset.findFirst({
      where: { id, userId },
    });
    if (!asset) {
      throw new Error("Asset not found or access denied");
    }
    return this.prisma.asset.delete({
      where: { id },
    });
  }
}
