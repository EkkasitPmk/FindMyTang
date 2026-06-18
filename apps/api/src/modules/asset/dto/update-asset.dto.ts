import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateAssetDto } from "./create-asset.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateAssetDto extends PartialType(CreateAssetDto) {
  @ApiProperty({
    description: "Whether the asset is archived",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}
