import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateTransactionDto } from "./create-transaction.dto";
import { IsOptional, IsString, IsDateString } from "class-validator";
import { Transform } from "class-transformer";
import { TransactionType } from "@prisma/client";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({
    description: "Transaction type",
    enum: TransactionType,
    example: TransactionType.EXPENSE,
    required: false,
  })
  @IsOptional()
  type?: TransactionType;

  @ApiProperty({
    description: "Transaction amount",
    example: 180.0,
    required: false,
    type: Number,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: "Transaction date (ISO 8601 string)",
    example: "2026-06-17T12:00:00.000Z",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: "Category ID (UUID)",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({
    description: "Source asset ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiProperty({
    description: "Target asset ID (UUID)",
    example: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  toAssetId?: string;

  @ApiProperty({
    description: "Optional note or memo",
    example: "Updated dinner note",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: "URL or file path of attached receipt/image",
    example: "https://example.com/uploads/receipt2.jpg",
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiProperty({
    description: "Soft deletion timestamp, or null to restore",
    example: null,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === "null" || value === ""
      ? null
      : new Date(value as string),
  )
  deletedAt?: Date | null;
}
