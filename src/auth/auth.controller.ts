import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthDto) {
    try {
      return await this.authService.register(body.username, body.password);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() body: AuthDto) {
    try {
      return await this.authService.login(body.username, body.password);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
