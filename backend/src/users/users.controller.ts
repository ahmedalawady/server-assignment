import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';

// @UseFilters(new HttpExceptionFilter())
@Controller()
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('users/register')
  async register(@Request() req) {
    const { username, password, role } = req.body;
    return this.userService.create({ username, password, role });
  }

  @Post('users/login')
  async login(@Body() loginData: LoginUserDto) {
    const { username, password } = loginData;
    const res = await this.userService.validateUser(username, password);
    if (!res) throw new BadRequestException('Invalid credentials');
    return this.authService.login(res);
  }

  // @Post('users/logout')
  // async logout(@Request() req) {
  //   const { username } = req.body;
  //   return this.authService.logout(username);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('users/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
