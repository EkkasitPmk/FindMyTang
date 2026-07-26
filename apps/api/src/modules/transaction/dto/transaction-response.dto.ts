import { ApiProperty } from "@nestjs/swagger";
import { TransactionType, AssetType, CategoryType } from "@prisma/client";

export class TransactionAssetRelationDto {
  @ApiProperty({
    description: "Asset ID",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Asset name",
    example: "Cash Wallet",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Asset type",
    enum: AssetType,
    example: AssetType.CASH,
  })
  type!: AssetType;

  @ApiProperty({
    description: "Current asset balance",
    example: 1000,
    type: Number,
  })
  balance!: number;
}

export class TransactionCategoryRelationDto {
  @ApiProperty({
    description: "Category ID",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Category name",
    example: "Food & Dining",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Category type",
    enum: CategoryType,
    example: CategoryType.EXPENSE,
  })
  type!: CategoryType;

  @ApiProperty({
    description: "Hex color code",
    example: "#FF5733",
    nullable: true,
    type: String,
  })
  color!: string | null;

  @ApiProperty({
    description: "Icon name/identifier",
    example: "utensils",
    nullable: true,
    type: String,
  })
  icon!: string | null;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: "Unique transaction ID (UUID)",
    example: "t1u2v3w4-5678-90ab-cdef-1234567890ab",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Transaction type",
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  type!: TransactionType;

  @ApiProperty({
    description: "Transaction amount",
    example: 150.5,
    type: Number,
  })
  amount!: number;

  @ApiProperty({
    description: "Transaction note or memo",
    example: "Lunch with colleagues",
    nullable: true,
    type: String,
  })
  note!: string | null;

  @ApiProperty({
    description: "Transaction date",
    example: "2026-06-17T12:00:00.000Z",
    type: String,
  })
  transactionDate!: Date | string;

  @ApiProperty({
    description: "Source asset ID",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type: String,
  })
  assetId!: string;

  @ApiProperty({
    description: "Target asset ID (for TRANSFER type)",
    example: null,
    nullable: true,
    type: String,
  })
  toAssetId!: string | null;

  @ApiProperty({
    description: "Category ID",
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    nullable: true,
    type: String,
  })
  categoryId!: string | null;

  @ApiProperty({
    description: "URL of attached receipt/image",
    example: "https://example.com/uploads/receipt.jpg",
    nullable: true,
    type: String,
  })
  attachmentUrl!: string | null;

  @ApiProperty({
    description: "Associated source asset details",
    type: TransactionAssetRelationDto,
    required: false,
  })
  asset?: TransactionAssetRelationDto;

  @ApiProperty({
    description: "Associated target asset details",
    type: TransactionAssetRelationDto,
    required: false,
  })
  toAsset?: TransactionAssetRelationDto;

  @ApiProperty({
    description: "Associated category details",
    type: TransactionCategoryRelationDto,
    required: false,
  })
  category?: TransactionCategoryRelationDto;

  @ApiProperty({
    description: "ISO timestamp when created",
    example: "2026-06-17T12:00:00.000Z",
    type: String,
  })
  createdAt!: Date | string;

  @ApiProperty({
    description: "ISO timestamp when updated",
    example: "2026-06-17T12:00:00.000Z",
    type: String,
  })
  updatedAt!: Date | string;

  @ApiProperty({
    description: "ISO timestamp when soft-deleted, or null if active",
    example: null,
    nullable: true,
    type: String,
  })
  deletedAt!: Date | string | null;
}

export class TransactionPaginationMetaDto {
  @ApiProperty({
    description: "Current page number",
    example: 1,
    type: Number,
  })
  page!: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 20,
    type: Number,
  })
  limit!: number;

  @ApiProperty({
    description: "Total number of matching transactions",
    example: 45,
    type: Number,
  })
  total!: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 3,
    type: Number,
  })
  totalPages!: number;
}

export class PaginatedTransactionResponseDto {
  @ApiProperty({
    description: "List of transactions on current page",
    type: [TransactionResponseDto],
  })
  items!: TransactionResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: TransactionPaginationMetaDto,
  })
  meta!: TransactionPaginationMetaDto;
}
