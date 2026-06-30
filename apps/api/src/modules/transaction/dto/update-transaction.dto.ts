import { PartialType } from "@nestjs/swagger";
import { CreateTransactionDto } from "./create-transaction.dto";
import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === "null" || value === ""
      ? null
      : new Date(value as string),
  )
  deletedAt?: Date | null;
}
