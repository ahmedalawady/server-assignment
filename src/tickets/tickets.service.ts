import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './ticket.entity';
import { Queue } from 'bull';
import { TicketStatus } from '../types';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectQueue('tickets')
    private readonly ticketsQueue: Queue,
  ) {}

  async create(customer_id: number, ticket: CreateTicketDto): Promise<Ticket> {
    const ticketObj = await this.ticketRepository.save({
      ...ticket,
      customer_id,
    });

    await this.ticketsQueue.add(
      'ticket',
      {
        ...ticketObj,
      },
      {
        attempts: 3,
        removeOnComplete: true,
      },
    );

    return ticketObj;
  }

  async assignTicket(ticket_id: number, agent_id: number) {
    await this.ticketRepository.update(ticket_id, {
      agent_id,
      status: TicketStatus.INPROGRESS,
    });
    return this.ticketRepository.findOne({ where: { id: ticket_id } });
  }

  async resolveTicket(ticket_id: number) {
    console.log('ticket_id', ticket_id);
    await this.ticketRepository.update(ticket_id, {
      status: TicketStatus.RESOLVED,
    });
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticket_id },
    });
    console.log(ticket);
    return ticket;
  }
}
