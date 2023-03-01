import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAgentDto } from './dto/create-agent.dto';

@Controller()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  //@UseGuards(JwtAuthGuard)
  @Post('agents/create')
  async create(@Body() createAgentDto: CreateAgentDto, @Res() res: Response) {
    const agent = await this.agentsService.create(createAgentDto);
    res.status(HttpStatus.CREATED).json(agent);
  }

  @UseGuards(JwtAuthGuard)
  @Get('agents')
  async findAll(@Res() res: Response) {
    const agents = await this.agentsService.findAll();
    res.status(HttpStatus.OK).json(agents);
  }

  @UseGuards(JwtAuthGuard)
  @Get('agents/:id')
  async findOne(@Request() req, @Res() res: Response) {
    const agent = await this.agentsService.findOne(req.params.id);
    res.status(HttpStatus.OK).json(agent);
  }

  @UseGuards(JwtAuthGuard)
  @Post('agents/update/:id')
  async update(@Request() req, @Res() res: Response) {
    await this.agentsService.update(req.params.id, req.body);
    //TODO: Return updated agent
    res.status(HttpStatus.OK).json({ message: 'Agent Updated' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('agents/delete/:id')
  async delete(@Request() req, @Res() res: Response) {
    await this.agentsService.delete(req.params.id);
    res.status(HttpStatus.OK).json({ message: 'Agent Deleted' });
  }
}
