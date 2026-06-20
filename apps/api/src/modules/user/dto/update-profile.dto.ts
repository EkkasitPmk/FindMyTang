import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, IsIn } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty({
    description: "Display name of the user",
    example: "John Doe",
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: "Display name must not exceed 100 characters" })
  displayName?: string;

  @ApiProperty({
    description: "Avatar image URL",
    example: "https://example.com/avatar.png",
    required: false,
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: "Language preference",
    example: "th",
    required: false,
    enum: ["th", "en"],
  })
  @IsString()
  @IsOptional()
  @IsIn(["th", "en"], { message: "Language must be either 'th' or 'en'" })
  language?: string;

  @ApiProperty({
    description: "Timezone preference",
    example: "Asia/Bangkok",
    required: false,
  })
  @IsString()
  @IsOptional()
  timezone?: string;
}
