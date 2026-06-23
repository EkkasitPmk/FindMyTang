import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Current password of the user",
    example: "oldpassword123",
  })
  @IsString()
  @IsNotEmpty({ message: "Current password is required" })
  @MinLength(8, { message: "Current password must be at least 8 characters long" })
  currentPassword: string;

  @ApiProperty({
    description: "New password of the user",
    example: "newpassword123",
  })
  @IsString()
  @IsNotEmpty({ message: "New password is required" })
  @MinLength(8, { message: "New password must be at least 8 characters long" })
  newPassword: string;

  @ApiProperty({
    description: "Confirmation of the new password",
    example: "newpassword123",
  })
  @IsString()
  @IsNotEmpty({ message: "Confirm new password is required" })
  @MinLength(8, { message: "Confirm new password must be at least 8 characters long" })
  confirmNewPassword: string;
}
