import { Injectable } from '@nestjs/common';
import { AgentDto } from './agent.dto';
import { CreateAgentDto } from './create-agent.dto';
import { Agent } from '../agent.entity';

@Injectable()
export class AgentMapperService {
  toDto(agent: Agent): AgentDto {
    return {
      id: agent.id,
      name: agent.name,
      title: agent.title,
      is_available: agent.is_available,
    };
  }

  toEntity(dto: CreateAgentDto): Agent {
    const agent = new Agent();
    agent.name = dto.name;
    agent.title = dto.title;
    return agent;
  }
}
