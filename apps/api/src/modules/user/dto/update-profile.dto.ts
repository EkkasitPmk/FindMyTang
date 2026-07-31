import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, IsIn } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty({
    description: "Display name of the user (maximum 25 characters)",
    example: "John Doe",
    required: false,
    maxLength: 25,
    type: String,
  })
  @IsString()
  @IsOptional()
  @MaxLength(25, { message: "Display name must not exceed 25 characters" })
  displayName?: string;

  @ApiProperty({
    description: "Avatar image URL or path",
    example: "https://example.com/avatar.png",
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: "Language preference for application interface ('th' or 'en')",
    example: "th",
    required: false,
    enum: ["th", "en"],
    type: String,
  })
  @IsString()
  @IsOptional()
  @IsIn(["th", "en"], { message: "Language must be either 'th' or 'en'" })
  language?: string;
}
