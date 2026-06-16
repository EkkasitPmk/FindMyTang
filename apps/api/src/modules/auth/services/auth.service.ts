import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { UserRepository } from "../../user/repositories/user.repository";
import { RegisterDto } from "../dto/register.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, displayName } = registerDto;

    // 1. Validate password === confirmPassword
    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    // 2. UserRepository.findByEmail()
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    // 3. bcrypt.hash(password)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. UserRepository.create()
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      profile: {
        create: {
          firstName: displayName,
        },
      },
    });

    return user;
  }
}
