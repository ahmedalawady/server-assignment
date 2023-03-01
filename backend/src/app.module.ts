import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { Ticket } from './tickets/ticket.entity';
import { User } from './users/user.entity';
import { Agent } from './agents/agent.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';

@Module({
  //TODO Should be configured in a config file
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'mysql',
      port: process.env.DATABASE_PORT
        ? Number(process.env.DATABASE_PORT)
        : 3306,
      username: process.env.DATABASE_USERNAME || 'user',
      password: process.env.DATABASE_PASSWORD || '123456789',
      database: process.env.DATABASE_NAME || 'support',
      entities: [Ticket, User, Agent],
      synchronize: process.env.TYPEORM_SYNCHRONIZE == 'true' ? true : false,
      migrations: ['dist/src/db/seeds/*.js'],
      migrationsTableName: 'migrations', // I will use migrations as Seed scripts for my database tables
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      },
    }),
    TicketsModule,
    AuthModule,
    UsersModule,
    AgentsModule,
  ],
})
export class AppModule {}
