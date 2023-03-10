import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { CreateUserDto } from './create-user.dto';
import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';

const SALT = 10;

@Injectable()
export class UserMapperService {
  toDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      created_at: user.created_at,
    };
  }

  async toEntity(dto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = dto.username;
    user.password = await bcrypt.hash(dto.password, SALT);
    user.role = dto.role;
    return user;
  }
}
