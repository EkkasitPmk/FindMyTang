import { ApiProperty } from "@nestjs/swagger";
import { AssetType } from "@prisma/client";

export class AssetResponseDto {
  @ApiProperty({
    description: "Unique asset ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Name of the asset",
    example: "Cash Wallet",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Type of the asset",
    enum: AssetType,
    example: AssetType.CASH,
  })
  type!: AssetType;

  @ApiProperty({
    description: "Current balance of the asset",
    example: 1250.75,
    type: Number,
  })
  balance!: number;

  @ApiProperty({
    description: "Hex color code for the asset icon/card styling",
    example: "#3B82F6",
    nullable: true,
    type: String,
  })
  color!: string | null;

  @ApiProperty({
    description: "Archived status of the asset",
    example: false,
    type: Boolean,
  })
  isArchived!: boolean;

  @ApiProperty({
    description: "ISO timestamp when soft-deleted, or null if active",
    example: null,
    nullable: true,
    type: String,
  })
  deletedAt!: string | null;

  @ApiProperty({
    description: "ISO timestamp when created",
    example: "2026-01-01T00:00:00.000Z",
    type: String,
  })
  createdAt!: string;

  @ApiProperty({
    description: "ISO timestamp when last updated",
    example: "2026-01-01T00:00:00.000Z",
    type: String,
  })
  updatedAt!: string;
}

export class AssetActionResponseDto {
  @ApiProperty({
    description: "Indicates whether the action completed successfully",
    example: true,
    type: Boolean,
  })
  success!: boolean;
}
