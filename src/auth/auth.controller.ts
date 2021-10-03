import {
  Controller,
  Request,
  Body,
  Post,
  UseGuards,
  HttpCode,
  Patch,
  ForbiddenException,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { UpdateDto } from './dtos/update.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { firstName, lastName, email, password, roleId } = body;
    await this.authService.register(
      firstName,
      lastName,
      email,
      password,
      roleId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(1)
  @Get('users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Patch('users/update')
  async update(@Body() body: UpdateDto) {
    const { userId, firstName, lastName, email, roleId } = body;
    await this.authService.update(userId, firstName, lastName, email, roleId);
  }
}
