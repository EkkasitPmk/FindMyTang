import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { AssetType } from "@prisma/client";

export class CreateAssetDto {
  @ApiProperty({
    description: "Name of the asset (maximum 100 characters)",
    example: "Cash Wallet",
    maxLength: 100,
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: "Asset name is required" })
  @MaxLength(100, { message: "Asset name must not exceed 100 characters" })
  name!: string;

  @ApiProperty({
    description: "Type of the asset (CASH, BANK, CREDIT, INVESTMENT, OTHER)",
    enum: AssetType,
    example: AssetType.CASH,
    required: true,
  })
  @IsEnum(AssetType, { message: "Invalid asset type" })
  @IsNotEmpty({ message: "Asset type is required" })
  type!: AssetType;

  @ApiProperty({
    description: "Initial balance of the asset",
    example: 500,
    required: false,
    default: 0,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiProperty({
    description: "Hex color code for asset icon/card styling",
    example: "#3B82F6",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  color?: string;
}
