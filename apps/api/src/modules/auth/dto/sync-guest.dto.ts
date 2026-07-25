import { ApiProperty, OmitType } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateAssetDto } from "../../asset/dto/create-asset.dto";
import { CreateCategoryDto } from "../../category/dto/create-category.dto";
import { CreateTransactionDto } from "../../transaction/dto/create-transaction.dto";

export class SyncAssetItemDto extends CreateAssetDto {
  @ApiProperty({
    description: "Client-side temporary ID for guest asset",
    example: "temp-asset-1",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  localId!: string;

  @ApiProperty({
    description: "Display sort order",
    example: 1,
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({
    description: "Whether the asset is archived",
    example: false,
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiProperty({
    description: "ISO timestamp when soft-deleted",
    example: null,
    required: false,
    nullable: true,
    type: String,
  })
  @IsDateString()
  @IsOptional()
  deletedAt?: string | null;
}

export class SyncCategoryItemDto extends CreateCategoryDto {
  @ApiProperty({
    description: "Client-side temporary ID for guest category",
    example: "temp-cat-1",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  localId!: string;

  @ApiProperty({
    description: "Indicates if category is a default system category",
    example: false,
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @ApiProperty({
    description: "ISO timestamp when soft-deleted",
    example: null,
    required: false,
    nullable: true,
    type: String,
  })
  @IsDateString()
  @IsOptional()
  deletedAt?: string | null;
}

export class SyncTransactionItemDto extends OmitType(CreateTransactionDto, [
  "assetId",
  "toAssetId",
  "categoryId",
] as const) {
  @ApiProperty({
    description: "Client-side temporary ID for guest transaction",
    example: "temp-tx-1",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  localId!: string;

  @ApiProperty({
    description: "Client-side temporary source Asset ID",
    example: "temp-asset-1",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  localAssetId!: string;

  @ApiProperty({
    description:
      "Client-side temporary Target Asset ID (required for TRANSFER)",
    example: "temp-asset-2",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  localToAssetId?: string;

  @ApiProperty({
    description: "Client-side temporary Category ID (for INCOME/EXPENSE)",
    example: "temp-cat-1",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  localCategoryId?: string;

  @ApiProperty({
    description: "ISO timestamp when soft-deleted",
    example: null,
    required: false,
    nullable: true,
    type: String,
  })
  @IsDateString()
  @IsOptional()
  deletedAt?: string | null;
}

export class SyncGuestDto {
  @ApiProperty({
    description: "List of offline guest assets to synchronize",
    type: [SyncAssetItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncAssetItemDto)
  assets!: SyncAssetItemDto[];

  @ApiProperty({
    description: "List of offline guest categories to synchronize",
    type: [SyncCategoryItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCategoryItemDto)
  categories!: SyncCategoryItemDto[];

  @ApiProperty({
    description: "List of offline guest transactions to synchronize",
    type: [SyncTransactionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncTransactionItemDto)
  transactions!: SyncTransactionItemDto[];
}
