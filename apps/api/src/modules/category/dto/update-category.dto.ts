import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";
import { IsOptional } from "class-validator";
import { CategoryType } from "@prisma/client";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  name?: string;
  @IsOptional()
  icon?: string;
  @IsOptional()
  color?: string;
  @IsOptional()
  type?: CategoryType;
}
