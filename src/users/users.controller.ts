import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('users/register')
  async register(@Request() req) {
    console.log('BODY', req.body);
    const { username, password, user_type } = req.body;
    return this.userService.create({ username, password, user_type });
  }

  @Post('users/login')
  async login(@Request() req) {
    const { username, password } = req.body;
    const res = await this.userService.validateUser(username, password);
    return this.authService.login(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
