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

@Module({
  //TODO Should be configured in a config file
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'pass',
      database: 'db',
      entities: [Ticket, User, Agent],
      synchronize: true,
      migrations: ['dist/src/db/seeds/*.js'],
      migrationsTableName: 'migrations', // I will use migrations as Seed scripts for my database tables
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TicketsModule,
    AuthModule,
    UsersModule,
    AgentsModule,
  ],
})
export class AppModule {}
