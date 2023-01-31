import { Module } from '@nestjs/common';
import { UsersModule } from '../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../src/tickets/ticket.entity';
import { Agent } from '../src/agents/agent.entity';
import { User } from '../src/users/user.entity';
import { AgentsModule } from '../src/agents/agents.module';
import { TicketsAssignProcessor } from '../src/tickets/tickets-assign.processor';
import { TicketsService } from '../src/tickets/tickets.service';
import { TicketsController } from '../src/tickets/tickets.controller';
import { BullModule } from '@nestjs/bull';
import { TicketMapperService } from '../src/tickets/dto/ticket.mapper.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'mysql',
      port: process.env.DATABASE_PORT
        ? Number(process.env.DATABASE_PORT)
        : 3306,
      username: process.env.DATABASE_USERNAME || 'user',
      password: process.env.DATABASE_PASSWORD || 'pass',
      database: process.env.DATABASE_NAME || 'db',
      entities: [Ticket, Agent, User],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      },
    }),
    BullModule.registerQueue({
      // Should be configured in a config file
      name: 'tickets',
    }),
    TypeOrmModule.forFeature([Ticket, Agent, User]),
    AgentsModule,
    UsersModule,
  ],
  providers: [TicketsService, TicketsAssignProcessor, TicketMapperService],
  controllers: [TicketsController],
})
export class TestingModule {}
