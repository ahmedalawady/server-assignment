import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AgentDto } from './dto/agent.dto';

@Controller()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  //@UseGuards(JwtAuthGuard)
  @Post('agents/create')
  create(@Body() createAgentDto: CreateAgentDto): Promise<AgentDto> {
    return this.agentsService.create(createAgentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('agents')
  findAll() {
    return this.agentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('agents/:id')
  findOne(@Request() req) {
    return this.agentsService.findOne(req.params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('agents/update/:id')
  update(@Request() req) {
    return this.agentsService.update(req.params.id, req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('agents/delete/:id')
  delete(@Request() req) {
    return this.agentsService.delete(req.params.id);
  }
}
