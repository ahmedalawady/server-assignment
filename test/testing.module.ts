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
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'pass',
      database: 'testing',
      entities: [Ticket, Agent, User],
      synchronize: true,
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
