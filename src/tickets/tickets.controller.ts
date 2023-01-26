import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AgentsService } from '../agents/agents.service';

@Controller()
export class TicketsController {
  constructor(
    private readonly ticketService: TicketsService,
    private readonly agentsService: AgentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('tickets/create')
  async create(
    @Body() createTicketDto: CreateTicketDto,
    @Request() req,
  ): Promise<Ticket> {
    return this.ticketService.create(req.user.userId, createTicketDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets/resolved')
  async resolve(@Body() body, @Request() req): Promise<boolean> {
    //ToDO: check if the ticket belongs to the user
    //TODO check if the ticket is in progress "Should Handle ticket workflow"
    const ticket = await this.ticketService.resolveTicket(body.id);

    await this.agentsService.markAgentAvailable(ticket.agent_id);
    return true;
  }
}
