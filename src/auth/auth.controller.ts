import {
  Controller,
  Request,
  Body,
  Post,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { firstName, lastName, email, password, roleId } = body;
    const user = await this.authService.register(
      firstName,
      lastName,
      email,
      password,
      roleId,
    );
    return this.authService.login(user);
  }
}
