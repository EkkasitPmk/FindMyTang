import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { AssetRepository } from "../repositories/asset.repository";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { UpdateAssetDto } from "../dto/update-asset.dto";
import { Asset } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class AssetService {
  private readonly supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "",
  );

  constructor(private readonly assetRepository: AssetRepository) {}

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

  async create(userId: string, dto: CreateAssetDto): Promise<Asset> {
    // ponytail: Trims asset name and validates it is not empty, then creates the asset.
    const trimmedName = dto.name ? dto.name.trim() : "";
    if (!trimmedName) {
      throw new BadRequestException(
        "Asset name must not be empty or whitespace only",
      );
    }

    return this.assetRepository.create(userId, {
      name: trimmedName,
      type: dto.type,
      balance: dto.balance,
      color: dto.color,
    });
  }

  async findAllActive(userId: string): Promise<Asset[]> {
    return this.assetRepository.findAllActiveByUserId(userId);
  }

  async findAllIncludingDeleted(userId: string): Promise<Asset[]> {
    return this.assetRepository.findAllIncludingDeletedByUserId(userId);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateAssetDto,
  ): Promise<Asset> {
    // ponytail: Business logic to find, check ownership, validate, and update the asset.
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not own this asset");
    }

    if (dto.name !== undefined) {
      const trimmedName = dto.name.trim();
      if (!trimmedName) {
        throw new BadRequestException(
          "Asset name must not be empty or whitespace only",
        );
      }
      dto.name = trimmedName;
    }

    const updateData = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.balance !== undefined && { balance: dto.balance }),
      ...(dto.color !== undefined && { color: dto.color }),
      ...(dto.isArchived !== undefined && { isArchived: dto.isArchived }),
    };

    return this.assetRepository.update(id, userId, updateData);
  }

  async softDelete(id: string, userId: string): Promise<Asset> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new NotFoundException("Asset not found");
    }
    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not own this asset");
    }
    return this.assetRepository.softDelete(id, userId);
  }

  async hardDelete(id: string, userId: string): Promise<Asset> {
    const asset = await this.assetRepository.findByIdAny(id);
    if (!asset) {
      throw new NotFoundException("Asset not found");
    }
    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not own this asset");
    }

    const attachments = await this.assetRepository.findAttachmentsByAssetId(
      id,
      userId,
    );
    await Promise.all(
      attachments.map((url) => this.removeAttachmentFromSupabase(url)),
    );

    return this.assetRepository.hardDelete(id, userId);
  }

  async restore(id: string, userId: string): Promise<Asset> {
    // ponytail: Restores a soft-deleted asset. Validates ownership.
    const asset = await this.assetRepository.findByIdAny(id);
    if (!asset) {
      throw new NotFoundException("Asset not found");
    }
    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not own this asset");
    }
    if (!asset.deletedAt) {
      throw new BadRequestException("Asset is not deleted");
    }
    return this.assetRepository.restore(id, userId);
  }

  async reorder(userId: string, ids: string[]): Promise<void> {
    // ponytail: Triggers bulk update for asset ordering.
    await this.assetRepository.reorder(userId, ids);
  }

  async bulkSoftDelete(userId: string, ids: string[]): Promise<void> {
    return this.assetRepository.bulkSoftDelete(userId, ids);
  }

  async bulkHardDelete(userId: string, ids: string[]): Promise<void> {
    const attachments = await Promise.all(
      ids.map((id) =>
        this.assetRepository.findAttachmentsByAssetId(id, userId),
      ),
    );
    const allAttachments = attachments.flat();
    await Promise.all(
      allAttachments.map((url) => this.removeAttachmentFromSupabase(url)),
    );
    return this.assetRepository.bulkHardDelete(userId, ids);
  }

  async bulkArchive(userId: string, ids: string[]): Promise<void> {
    return this.assetRepository.bulkArchive(userId, ids);
  }

  async bulkRestore(userId: string, ids: string[]): Promise<void> {
    return this.assetRepository.bulkRestore(userId, ids);
  }
}
