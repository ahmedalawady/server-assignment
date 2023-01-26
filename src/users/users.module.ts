import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { User } from './user.entity';
import { UserMapperService } from './dto/UserMapperService';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UserMapperService],
  exports: [UsersService],
})
export class UsersModule {}
