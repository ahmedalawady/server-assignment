import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    console.log('USER', user);
    const payload = { username: user.username, sub: user.id };
    console.log('PAYLOAD', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
