// import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
// import { AuthService } from './auth/auth.service';
// import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
// import { LocalAuthGuard } from './auth/guards/local-auth.guard';

// @Controller()
// export class AppController {
//   constructor(private readonly authService: AuthService) {}

//   @UseGuards(LocalAuthGuard)
//   @Post('auth/login')
//   async login(@Request() req) {
//     console.log(req.body);
//     return this.authService.login(req.body);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile(@Request() req) {
//     return req.user;
//   }
// }
