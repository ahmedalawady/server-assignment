import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketDto } from './dto/ticket.dto';
import { Ticket } from './ticket.entity';
import { Queue } from 'bull';
import { TicketStatus } from '../common/types';
import { Agent } from '../agents/agent.entity';
import { TicketMapperService } from './dto/ticket.mapper.service';
import { FilterTicketDto } from './dto/filter-ticket.dto';
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentsRepository: Repository<Agent>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectQueue('tickets')
    private readonly ticketsQueue: Queue,
    private readonly mapper: TicketMapperService,
  ) {}

  async create(customer_id: number, ticket: CreateTicketDto) {
    //TODO I HAVE TO VALIDATE IF THIS ORDER IS EXIST AND BELONGS TO THIS CUSTOMER
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

    return this.mapper.toDto(ticketObj);
  }

  async assignTicket(ticket_id: number, agent: Agent) {
    const updated = await this.ticketRepository.update(ticket_id, {
      Agent: agent,
      status: TicketStatus.INPROGRESS,
    });

    if (updated.affected === 0) {
      //TODO throw custom exception
      throw new Error('Ticket not found');
    }
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticket_id },
      relations: {
        Agent: true,
      },
    });
    console.log(
      '🚀 ~ file: tickets.service.ts:64 ~ TicketsService ~ assignTicket ~ ticket',
      ticket,
    );
    return this.mapper.toDto(ticket);
  }

  async resolveTicket(ticket_id: number, note: string) {
    const updated = await this.ticketRepository.update(ticket_id, {
      status: TicketStatus.RESOLVED,
      note,
    });
    if (updated.affected === 0) {
      //TODO throw custom exception
      throw new Error('Ticket not found');
    }
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticket_id },
      relations: {
        Agent: true,
      },
    });

    return this.mapper.toDto(ticket);
  }
  //TODO: Add pagination - Filters - Sorting
  async findAll(filter?: FilterTicketDto): Promise<TicketDto[]> {
    // Write joining query between Ticket and Agent
    const options: any = {
      relations: {
        Agent: true,
      },
      order: {
        id: 'DESC',
      },
    };
    if (filter) {
      if (filter.customer_id) {
        options['where'] = {
          customer_id: filter.customer_id,
        };
      }
    }
    return (await this.ticketRepository.find(options)).map((ticket) =>
      this.mapper.toDto(ticket),
    );
  }
}
