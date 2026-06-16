import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "Email address of the user",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    description: "Password of the user (at least 8 characters)",
    example: "password123",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @ApiProperty({
    description: "Confirmation of the password",
    example: "password123",
  })
  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword: string;

  @ApiProperty({
    description: "Display name of the user",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty({ message: "Display name is required" })
  displayName: string;
}
