import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "Email address for the new account",
    example: "user@example.com",
    required: true,
    type: String,
  })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @ApiProperty({
    description: "Password for the new account (at least 8 characters)",
    example: "password123",
    minLength: 8,
    required: true,
    type: String,
    format: "password",
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  password!: string;

  @ApiProperty({
    description: "Confirmation of the password (must match password)",
    example: "password123",
    minLength: 8,
    required: true,
    type: String,
    format: "password",
  })
  @IsString()
  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;

  @ApiProperty({
    description: "Display name of the user",
    example: "John Doe",
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: "Display name is required" })
  @MaxLength(25, { message: "Display name must not exceed 25 characters" })
  displayName!: string;
}
