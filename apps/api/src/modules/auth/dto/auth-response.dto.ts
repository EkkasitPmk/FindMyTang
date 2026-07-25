import { ApiProperty } from "@nestjs/swagger";

export class AuthUserObjectDto {
  @ApiProperty({
    description: "Unique user ID (UUID)",
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
    type: String,
  })
  displayName!: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: "Newly created user ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Registered email address",
    example: "user@example.com",
    nullable: true,
    type: String,
  })
  email!: string | null;

  @ApiProperty({
    description: "Display name of the registered user",
    example: "John Doe",
    type: String,
  })
  displayName!: string;

  @ApiProperty({
    description: "ISO timestamp when registered",
    example: "2026-06-17T12:00:00.000Z",
    type: String,
  })
  createdAt!: Date | string;
}

export class AuthUserResponseDto {
  @ApiProperty({
    description: "Authenticated user details",
    type: AuthUserObjectDto,
  })
  user!: AuthUserObjectDto;
}

export class SyncUserResponseDto {
  @ApiProperty({
    description: "Indicates whether the sync operation was successful",
    example: true,
    type: Boolean,
  })
  success!: boolean;

  @ApiProperty({
    description: "ISO timestamp of the sync execution",
    example: "2026-06-17T12:00:00.000Z",
    type: String,
  })
  lastSyncedAt!: Date | string;

  @ApiProperty({
    description: "Sync status message",
    example: "SUCCESS",
    type: String,
  })
  lastSyncStatus!: string;
}

export class MeResponseDto {
  @ApiProperty({
    description: "Current user ID (UUID)",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    type: String,
  })
  id!: string;

  @ApiProperty({
    description: "Email address of current user",
    example: "user@example.com",
    nullable: true,
    type: String,
  })
  email!: string | null;

  @ApiProperty({
    description: "Display name of current user",
    example: "John Doe",
    type: String,
  })
  displayName!: string;

  @ApiProperty({
    description: "Avatar URL of current user",
    example: "https://example.com/avatar.png",
    nullable: true,
    type: String,
  })
  avatarUrl!: string | null;

  @ApiProperty({
    description: "Language preference",
    example: "th",
    type: String,
  })
  language!: string;

  @ApiProperty({
    description: "Timestamp of last sync",
    example: "2026-06-17T12:00:00.000Z",
    nullable: true,
    type: String,
  })
  lastSyncedAt!: Date | string | null;

  @ApiProperty({
    description: "Status of last sync",
    example: "SUCCESS",
    nullable: true,
    type: String,
  })
  lastSyncStatus!: string | null;
}

export class AuthMessageResponseDto {
  @ApiProperty({
    description: "Response message",
    example: "Logged out successfully",
    type: String,
  })
  message!: string;
}

export class AuthActionResponseDto {
  @ApiProperty({
    description: "Indicates whether the action completed successfully",
    example: true,
    type: Boolean,
  })
  success!: boolean;
}
