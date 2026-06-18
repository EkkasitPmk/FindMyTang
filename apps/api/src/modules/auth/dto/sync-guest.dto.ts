import { ApiProperty, OmitType } from "@nestjs/swagger";
import {
  IsArray,
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
  @ApiProperty({ description: "Client-side temporary ID" })
  @IsString()
  @IsNotEmpty()
  localId: string;
}

export class SyncCategoryItemDto extends CreateCategoryDto {
  @ApiProperty({ description: "Client-side temporary ID" })
  @IsString()
  @IsNotEmpty()
  localId: string;
}

export class SyncTransactionItemDto extends OmitType(CreateTransactionDto, [
  "assetId",
  "toAssetId",
  "categoryId",
] as const) {
  @ApiProperty({ description: "Client-side temporary ID" })
  @IsString()
  @IsNotEmpty()
  localId: string;

  @ApiProperty({ description: "Client-side temporary Asset ID" })
  @IsString()
  @IsNotEmpty()
  localAssetId: string;

  @ApiProperty({
    description: "Client-side temporary Target Asset ID (for TRANSFER)",
  })
  @IsString()
  @IsOptional()
  localToAssetId?: string;

  @ApiProperty({
    description: "Client-side temporary Category ID (for INCOME/EXPENSE)",
  })
  @IsString()
  @IsOptional()
  localCategoryId?: string;
}

export class SyncGuestDto {
  @ApiProperty({ type: [SyncAssetItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncAssetItemDto)
  assets: SyncAssetItemDto[];

  @ApiProperty({ type: [SyncCategoryItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncCategoryItemDto)
  categories: SyncCategoryItemDto[];

  @ApiProperty({ type: [SyncTransactionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncTransactionItemDto)
  transactions: SyncTransactionItemDto[];
}
