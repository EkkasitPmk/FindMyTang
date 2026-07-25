import { ApiProperty } from "@nestjs/swagger";

export class UserProfileResponseDto {
  @ApiProperty({
    description: "Unique identifier for the user (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "user@example.com",
    nullable: true,
    type: String,
  })
  email!: string | null;

  @ApiProperty({
    description: "Display name of the user",
    example: "John Doe",
    nullable: true,
    type: String,
  })
  displayName!: string | null;

  @ApiProperty({
    description: "Avatar URL of the user",
    example: "https://example.com/avatar.png",
    nullable: true,
    type: String,
  })
  avatarUrl!: string | null;

  @ApiProperty({
    description: "Language preference (e.g., 'th' or 'en')",
    example: "th",
    enum: ["th", "en"],
    type: String,
  })
  language!: string;
}

export class UserActionResponseDto {
  @ApiProperty({
    description: "Indicates whether the action completed successfully",
    example: true,
    type: Boolean,
  })
  success!: boolean;

  @ApiProperty({
    description: "Response message describing the outcome",
    example: "Password changed successfully",
    type: String,
  })
  message!: string;
}
