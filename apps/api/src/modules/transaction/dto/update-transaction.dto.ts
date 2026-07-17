import { PartialType } from "@nestjs/swagger";
import { CreateTransactionDto } from "./create-transaction.dto";
import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { TransactionType } from "@prisma/client";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  type?: TransactionType;
  @IsOptional()
  amount?: number;
  @IsOptional()
  date?: string;
  @IsOptional()
  categoryId?: string;
  @IsOptional()
  assetId?: string;
  @IsOptional()
  toAssetId?: string;
  @IsOptional()
  note?: string;
  @IsOptional()
  attachmentUrl?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === "null" || value === ""
      ? null
      : new Date(value as string),
  )
  deletedAt?: Date | null;
}
