import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, ArrayNotEmpty } from "class-validator";

export class ReorderCategoriesDto {
  @ApiProperty({
    description: "Array of category IDs (UUIDs) in the desired display order",
    example: [
      "c1d2e3f4-5678-90ab-cdef-1234567890ab",
      "d2e3f4a5-6789-01bc-def1-234567890abc",
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: "Category IDs list must not be empty" })
  ids!: string[];
}
