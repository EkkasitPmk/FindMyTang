import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AssetService } from "../services/asset.service";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { UpdateAssetDto } from "../dto/update-asset.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import type { User } from "@prisma/client";

@Controller("assets")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createAssetDto: CreateAssetDto,
  ) {
    // ponytail: Create asset endpoint, mapping Prisma Decimal to number in the response.
    const asset = await this.assetService.create(user.id, createAssetDto);
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      balance: Number(asset.balance),
      color: asset.color,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    // ponytail: Get assets endpoint, mapping Prisma Decimal balance to number.
    const assets = await this.assetService.findAll(user.id);
    return assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      balance: Number(asset.balance),
      color: asset.color,
    }));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id") id: string,
    @CurrentUser() user: User,
    @Body() updateAssetDto: UpdateAssetDto,
  ) {
    // ponytail: Update asset endpoint, mapping Prisma Decimal to number in response.
    const asset = await this.assetService.update(id, user.id, updateAssetDto);
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      balance: Number(asset.balance),
      color: asset.color,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string, @CurrentUser() user: User) {
    // ponytail: Delete asset endpoint, mapping Prisma Decimal to number in response.
    const asset = await this.assetService.delete(id, user.id);
    return {
      id: asset.id,
      name: asset.name,
      type: asset.type,
      balance: Number(asset.balance),
      color: asset.color,
    };
  }
}
