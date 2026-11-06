import {
  BadRequestException,
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { AssetRepository } from "../repositories/asset.repository";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { UpdateAssetDto } from "../dto/update-asset.dto";
import { Asset } from "@prisma/client";
import { StorageService } from "../../../common/storage/storage.service";

@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly storageService: StorageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private async invalidateSummaryCache(userId: string): Promise<void> {
    await Promise.all([
      this.cacheManager.del(`summary_today_${userId}`),
      this.cacheManager.del(`summary_month_${userId}`),
    ]);
  }

  async create(userId: string, dto: CreateAssetDto): Promise<Asset> {
    const trimmedName = dto.name ? dto.name.trim() : "";
    if (!trimmedName) {
      throw new BadRequestException(
        "Asset name must not be empty or whitespace only",
      );
    }

    const created = await this.assetRepository.create(userId, {
      name: trimmedName,
      type: dto.type,
      balance: dto.balance,
      color: dto.color,
      includeInSnapshot: dto.includeInSnapshot,
      savingsAmount: dto.savingsAmount,
    });
    await this.invalidateSummaryCache(userId);
    return created;
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
    const asset = await this.assetRepository.findByIdAny(id);
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
      ...(dto.includeInSnapshot !== undefined && {
        includeInSnapshot: dto.includeInSnapshot,
      }),
      ...(dto.savingsAmount !== undefined && {
        savingsAmount: dto.savingsAmount,
      }),
      deletedAt: null,
    };

    const updated = await this.assetRepository.update(id, userId, updateData);
    await this.invalidateSummaryCache(userId);
    return updated;
  }

  async softDelete(id: string, userId: string): Promise<Asset> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new NotFoundException("Asset not found");
    }
    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not own this asset");
    }
    const deleted = await this.assetRepository.softDelete(id, userId);
    await this.invalidateSummaryCache(userId);
    return deleted;
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
      attachments.map((url) => this.storageService.removeFile(url)),
    );

    const deleted = await this.assetRepository.hardDelete(id, userId);
    await this.invalidateSummaryCache(userId);
    return deleted;
  }

  async restore(id: string, userId: string): Promise<Asset> {
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
    const restored = await this.assetRepository.restore(id, userId);
    await this.invalidateSummaryCache(userId);
    return restored;
  }

  async reorder(userId: string, ids: string[]): Promise<void> {
    await this.assetRepository.reorder(userId, ids);
  }

  async bulkSoftDelete(userId: string, ids: string[]): Promise<void> {
    const result = await this.assetRepository.bulkSoftDelete(userId, ids);
    await this.invalidateSummaryCache(userId);
    return result;
  }

  async bulkHardDelete(userId: string, ids: string[]): Promise<void> {
    const attachments = await Promise.all(
      ids.map((id) =>
        this.assetRepository.findAttachmentsByAssetId(id, userId),
      ),
    );
    const allAttachments = attachments.flat();
    await Promise.all(
      allAttachments.map((url) => this.storageService.removeFile(url)),
    );
    const result = await this.assetRepository.bulkHardDelete(userId, ids);
    await this.invalidateSummaryCache(userId);
    return result;
  }

  async bulkArchive(userId: string, ids: string[]): Promise<void> {
    const result = await this.assetRepository.bulkArchive(userId, ids);
    await this.invalidateSummaryCache(userId);
    return result;
  }

  async bulkRestore(userId: string, ids: string[]): Promise<void> {
    const result = await this.assetRepository.bulkRestore(userId, ids);
    await this.invalidateSummaryCache(userId);
    return result;
  }
}
