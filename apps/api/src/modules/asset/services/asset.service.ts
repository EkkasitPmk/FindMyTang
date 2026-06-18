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

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

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
      currency: dto.currency,
      color: dto.color,
      icon: dto.icon,
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
      currency: dto.currency,
      color: dto.color,
      icon: dto.icon,
      isArchived: dto.isArchived,
    });
  }

  async delete(id: string, userId: string): Promise<Asset> {
    // ponytail: Deletes an asset by checking existence and ownership first.
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    if (asset.userId !== userId) {
      throw new ForbiddenException("You do not own this asset");
    }

    return this.assetRepository.delete(id, userId);
  }
}
