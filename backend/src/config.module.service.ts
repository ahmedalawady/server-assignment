import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//TODO I have to use it in the future
@Injectable()
export class ConfigModuleService {
  constructor(private readonly configService: ConfigService) {}

  getTypeOrmConfig() {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<boolean>('TYPEORM_SYNC'),
    };
  }
}
