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
import { AssetService } from "../services/asset.service";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { UpdateAssetDto } from "../dto/update-asset.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { Asset, User } from "@prisma/client";

// ponytail: DRY response mapper. Converts Prisma Decimal to number and includes all fields the frontend needs.
function toResponse(asset: Asset) {
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

@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createAssetDto: CreateAssetDto,
  ) {
    return toResponse(await this.assetService.create(user.id, createAssetDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Query("includeDeleted") includeDeleted?: string,
  ) {
    const assets =
      includeDeleted === "true"
        ? await this.assetService.findAllIncludingDeleted(user.id)
        : await this.assetService.findAllActive(user.id);
    return assets.map(toResponse);
  }

  @Patch("reorder")
  @UseGuards(JwtAuthGuard)
  async reorder(@CurrentUser() user: User, @Body() body: { ids: string[] }) {
    await this.assetService.reorder(user.id, body.ids);
    return { success: true };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    return toResponse(
      await this.assetService.update(id, user.id, updateAssetDto),
    );
  }

  @Patch(":id/restore")
  @UseGuards(JwtAuthGuard)
  async restore(@Param("id") id: string, @CurrentUser() user: User) {
    return toResponse(await this.assetService.restore(id, user.id));
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Query("hard") hard?: string,
  ) {
    if (hard === "true") {
      return toResponse(await this.assetService.hardDelete(id, user.id));
    }
    return toResponse(await this.assetService.softDelete(id, user.id));
  }

  @Post("bulk-delete")
  @UseGuards(JwtAuthGuard)
  async bulkDelete(
    @CurrentUser() user: User,
    @Body() body: { ids: string[] },
    @Query("hard") hard?: string,
  ) {
    if (hard === "true") {
      await this.assetService.bulkHardDelete(user.id, body.ids);
    } else {
      await this.assetService.bulkSoftDelete(user.id, body.ids);
    }
    return { success: true };
  }

  @Post("bulk-archive")
  @UseGuards(JwtAuthGuard)
  async bulkArchive(
    @CurrentUser() user: User,
    @Body() body: { ids: string[] },
  ) {
    await this.assetService.bulkArchive(user.id, body.ids);
    return { success: true };
  }

  @Post("bulk-restore")
  @UseGuards(JwtAuthGuard)
  async bulkRestore(
    @CurrentUser() user: User,
    @Body() body: { ids: string[] },
  ) {
    await this.assetService.bulkRestore(user.id, body.ids);
    return { success: true };
  }
}
