import { Injectable } from '@nestjs/common';
import { Ticket } from '../ticket.entity';
import { TicketDto } from './ticket.dto';

@Injectable()
export class TicketMapperService {
  toDto(ticket: Ticket): TicketDto {
    const ticketDto: TicketDto = {
      id: ticket.id,
      return_reason: ticket.return_reason,
      note: ticket.note || null,
      customer_id: ticket.customer_id,
      order_number: ticket.order_number,
      status: ticket.status,
    };

    if (ticket.Agent) {
      ticketDto.agent = {
        id: ticket.Agent.id,
        name: ticket.Agent.name,
      };
    }
    return ticketDto;
  }

  // toEntity(dto: CreateAgentDto): Agent {
  //   const agent = new Agent();
  //   agent.name = dto.name;
  //   agent.title = dto.title;
  //   return agent;
  // }
}
