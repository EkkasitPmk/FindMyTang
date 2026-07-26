import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { AssetService } from "../services/asset.service";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { UpdateAssetDto } from "../dto/update-asset.dto";
import { BulkAssetIdsDto } from "../dto/bulk-asset-ids.dto";
import {
  AssetResponseDto,
  AssetActionResponseDto,
} from "../dto/asset-response.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { Asset, User } from "@prisma/client";

// ponytail: DRY response mapper. Converts Prisma Decimal to number and includes all fields the frontend needs.
function toResponse(asset: Asset): AssetResponseDto {
  return {
    id: asset.id,
    name: asset.name,
    type: asset.type,
    balance: Number(asset.balance),
    color: asset.color,
    isArchived: asset.isArchived,
    deletedAt: asset.deletedAt?.toISOString() ?? null,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}

@ApiTags("Asset")
@ApiBearerAuth()
@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Create a new asset",
    description:
      "Creates a new asset account (e.g. Cash, Bank Account, Credit Card, Investment) for the authenticated user.",
  })
  @ApiBody({ type: CreateAssetDto })
  @ApiResponse({
    status: 201,
    description: "Asset created successfully.",
    type: AssetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request (validation error or empty asset name).",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async create(
    @CurrentUser() user: User,
    @Body() createAssetDto: CreateAssetDto,
  ): Promise<AssetResponseDto> {
    return toResponse(await this.assetService.create(user.id, createAssetDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get all user assets",
    description:
      "Fetches all active assets for the authenticated user. Pass query param includeDeleted=true to include soft-deleted assets.",
  })
  @ApiQuery({
    name: "includeDeleted",
    required: false,
    type: String,
    description: "Set to 'true' to include soft-deleted assets",
    example: "true",
  })
  @ApiResponse({
    status: 200,
    description: "List of assets retrieved successfully.",
    type: [AssetResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async findAll(
    @CurrentUser() user: User,
    @Query("includeDeleted") includeDeleted?: string,
  ): Promise<AssetResponseDto[]> {
    const assets =
      includeDeleted === "true"
        ? await this.assetService.findAllIncludingDeleted(user.id)
        : await this.assetService.findAllActive(user.id);
    return assets.map(toResponse);
  }

  @Patch("reorder")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Reorder assets",
    description:
      "Updates the display order sequence of assets according to the provided array of asset IDs.",
  })
  @ApiBody({ type: BulkAssetIdsDto })
  @ApiResponse({
    status: 200,
    description: "Assets reordered successfully.",
    type: AssetActionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async reorder(
    @CurrentUser() user: User,
    @Body() body: BulkAssetIdsDto,
  ): Promise<AssetActionResponseDto> {
    await this.assetService.reorder(user.id, body.ids);
    return { success: true };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Update an asset",
    description:
      "Updates details of a specific asset account (e.g. name, type, balance, color, or archived status).",
  })
  @ApiParam({
    name: "id",
    description: "Unique asset ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @ApiBody({ type: UpdateAssetDto })
  @ApiResponse({
    status: 200,
    description: "Asset updated successfully.",
    type: AssetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request (validation error or invalid data).",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden (asset belongs to another user).",
  })
  @ApiResponse({
    status: 404,
    description: "Asset not found.",
  })
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() updateAssetDto: UpdateAssetDto,
  ): Promise<AssetResponseDto> {
    return toResponse(
      await this.assetService.update(id, user.id, updateAssetDto),
    );
  }

  @Patch(":id/restore")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Restore a soft-deleted asset",
    description: "Restores a soft-deleted asset back to active status.",
  })
  @ApiParam({
    name: "id",
    description: "Unique asset ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @ApiResponse({
    status: 200,
    description: "Asset restored successfully.",
    type: AssetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request (asset is not soft-deleted).",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden.",
  })
  @ApiResponse({
    status: 404,
    description: "Asset not found.",
  })
  async restore(
    @Param("id") id: string,
    @CurrentUser() user: User,
  ): Promise<AssetResponseDto> {
    return toResponse(await this.assetService.restore(id, user.id));
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Delete an asset",
    description:
      "Deletes an asset. By default performs a soft delete. Pass query param hard=true for permanent hard deletion.",
  })
  @ApiParam({
    name: "id",
    description: "Unique asset ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @ApiQuery({
    name: "hard",
    required: false,
    type: String,
    description: "Set to 'true' for permanent hard deletion",
    example: "true",
  })
  @ApiResponse({
    status: 200,
    description: "Asset deleted successfully.",
    type: AssetResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden.",
  })
  @ApiResponse({
    status: 404,
    description: "Asset not found.",
  })
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Query("hard") hard?: string,
  ): Promise<AssetResponseDto> {
    if (hard === "true") {
      return toResponse(await this.assetService.hardDelete(id, user.id));
    }
    return toResponse(await this.assetService.softDelete(id, user.id));
  }

  @Post("bulk-delete")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Bulk delete assets",
    description:
      "Deletes multiple assets by ID list (soft delete by default, hard delete if hard=true query param is set).",
  })
  @ApiQuery({
    name: "hard",
    required: false,
    type: String,
    description: "Set to 'true' for permanent hard deletion",
    example: "true",
  })
  @ApiBody({ type: BulkAssetIdsDto })
  @ApiResponse({
    status: 200,
    description: "Bulk deletion completed successfully.",
    type: AssetActionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async bulkDelete(
    @CurrentUser() user: User,
    @Body() body: BulkAssetIdsDto,
    @Query("hard") hard?: string,
  ): Promise<AssetActionResponseDto> {
    if (hard === "true") {
      await this.assetService.bulkHardDelete(user.id, body.ids);
    } else {
      await this.assetService.bulkSoftDelete(user.id, body.ids);
    }
    return { success: true };
  }

  @Post("bulk-archive")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Bulk archive assets",
    description: "Archives multiple assets at once using a list of asset IDs.",
  })
  @ApiBody({ type: BulkAssetIdsDto })
  @ApiResponse({
    status: 200,
    description: "Bulk archiving completed successfully.",
    type: AssetActionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async bulkArchive(
    @CurrentUser() user: User,
    @Body() body: BulkAssetIdsDto,
  ): Promise<AssetActionResponseDto> {
    await this.assetService.bulkArchive(user.id, body.ids);
    return { success: true };
  }

  @Post("bulk-restore")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Bulk restore assets",
    description:
      "Restores multiple soft-deleted assets at once using a list of asset IDs.",
  })
  @ApiBody({ type: BulkAssetIdsDto })
  @ApiResponse({
    status: 200,
    description: "Bulk restoration completed successfully.",
    type: AssetActionResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized access.",
  })
  async bulkRestore(
    @CurrentUser() user: User,
    @Body() body: BulkAssetIdsDto,
  ): Promise<AssetActionResponseDto> {
    await this.assetService.bulkRestore(user.id, body.ids);
    return { success: true };
  }
}
