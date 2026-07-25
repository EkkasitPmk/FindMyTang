import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, ArrayNotEmpty } from "class-validator";

export class BulkAssetIdsDto {
  @ApiProperty({
    description: "Array of asset IDs (UUIDs)",
    example: [
      "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: "Asset IDs list must not be empty" })
  ids!: string[];
}
