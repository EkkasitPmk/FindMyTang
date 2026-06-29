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
    description: "Name of the asset",
    example: "Cash",
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: "Asset name is required" })
  @MaxLength(100, { message: "Asset name must not exceed 100 characters" })
  name!: string;

  @ApiProperty({
    description: "Type of the asset",
    enum: AssetType,
    example: AssetType.CASH,
  })
  @IsEnum(AssetType, { message: "Invalid asset type" })
  @IsNotEmpty({ message: "Asset type is required" })
  type!: AssetType;

  @ApiProperty({
    description: "Initial balance of the asset",
    example: 500,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiProperty({
    description: "Hex color code for the asset",
    example: "#3B82F6",
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;
}
