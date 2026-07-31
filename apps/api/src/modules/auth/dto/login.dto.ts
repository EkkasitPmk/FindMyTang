import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class LoginDto {
  @ApiProperty({
    description: "Email address of the user account",
    example: "user@example.com",
    required: true,
    maxLength: 254,
    type: String,
  })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim() : (value as unknown),
  )
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  @MaxLength(254, { message: "Email must not exceed 254 characters" })
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
