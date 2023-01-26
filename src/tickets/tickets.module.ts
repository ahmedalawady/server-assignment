import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './ticket.entity';
import { BullModule } from '@nestjs/bull';
import { TicketsAssignProcessor } from './tickets-assign.processor';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [
    //TODO: I should improve this to help me in the future if I want to change Redis to another provider
    BullModule.registerQueue({
      // Should be configured in a config file
      name: 'tickets',
    }),
    TypeOrmModule.forFeature([Ticket]),
    AgentsModule,
  ],
  providers: [TicketsService, TicketsAssignProcessor],
  controllers: [TicketsController],
})
export class TicketsModule {}
