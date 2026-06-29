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

  async findAll(userId: string): Promise<Asset[]> {
    // ponytail: Retrieves all assets belonging to the specified user.
    return this.assetRepository.findAllByUserId(userId);
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

    return this.assetRepository.update(id, userId, {
      name: dto.name,
      type: dto.type,
      balance: dto.balance,
      color: dto.color,
      isArchived: dto.isArchived,
    });
  }

  async delete(
    id: string,
    userId: string,
    hard: boolean = false,
  ): Promise<Asset> {
    // ponytail: Deletes an asset by checking existence and ownership first. Also cleans up attachments if hard delete.
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not own this asset");
    }

    if (hard) {
      const attachments = await this.assetRepository.findAttachmentsByAssetId(
        id,
        userId,
      );
      await Promise.all(
        attachments.map((url) => this.removeAttachmentFromSupabase(url)),
      );
    }

    return this.assetRepository.delete(id, userId, hard);
  }
}
