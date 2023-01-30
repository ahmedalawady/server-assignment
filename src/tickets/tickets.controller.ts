//TODO AUTHORRIZATION LOGIC
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AgentsService } from '../agents/agents.service';
import { UserRole } from '../common/types';
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
    @Res() res: Response,
  ) {
    const ticket = await this.ticketService.create(
      req.user.userId,
      createTicketDto,
    );
    res.status(HttpStatus.CREATED).json(ticket);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  async getTickets(@Res() res: Response, @Request() req) {
    let filter;
    if (req.user.role === UserRole.CUSTOMER) {
      filter = {
        customer_id: req.user.userId,
      };
    }
    const tickets = await this.ticketService.findAll(filter);
    res.status(HttpStatus.OK).json(tickets);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets/resolved')
  async resolve(@Body() body, @Res() res: Response) {
    //ToDO: check if the ticket belongs to the user
    //TODO check if the ticket is in progress "Should Handle ticket workflow"
    //TODO: Validate Input
    const { id, note } = body;
    const ticket = await this.ticketService.resolveTicket(id, note);
    await this.agentsService.markAgentAvailable(ticket.agent?.id);
    res.status(HttpStatus.OK).json({ message: 'Ticket Resolved' });
  }
}
