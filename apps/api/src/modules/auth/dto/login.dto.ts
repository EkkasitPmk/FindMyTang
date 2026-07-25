import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Email address of the user account",
    example: "user@example.com",
    required: true,
    type: String,
  })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @ApiProperty({
    description: "Account password (at least 8 characters)",
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
}
