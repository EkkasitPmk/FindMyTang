import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Current account password (minimum 8 characters)",
    example: "oldpassword123",
    minLength: 8,
    required: true,
    type: String,
    format: "password",
  })
  @IsString()
  @IsNotEmpty({ message: "Current password is required" })
  @MinLength(8, {
    message: "Current password must be at least 8 characters long",
  })
  currentPassword!: string;

  @ApiProperty({
    description: "New password to set (minimum 8 characters)",
    example: "newpassword123",
    minLength: 8,
    required: true,
    type: String,
    format: "password",
  })
  @IsString()
  @IsNotEmpty({ message: "New password is required" })
  @MinLength(8, { message: "New password must be at least 8 characters long" })
  newPassword!: string;

  @ApiProperty({
    description: "Confirmation of the new password (must match newPassword)",
    example: "newpassword123",
    minLength: 8,
    required: true,
    type: String,
    format: "password",
  })
  @IsString()
  @IsNotEmpty({ message: "Confirm new password is required" })
  @MinLength(8, {
    message: "Confirm new password must be at least 8 characters long",
  })
  confirmNewPassword!: string;
}
