import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      id: user.id,
      email: user.email,
      displayName: user.profile?.firstName ?? registerDto.displayName,
      createdAt: user.createdAt,
    };
  }
}
