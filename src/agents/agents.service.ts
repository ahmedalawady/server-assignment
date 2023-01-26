import { Injectable } from '@nestjs/common';
import { Agent } from './agent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgentDto } from './dto/create-agent.dto';
import { AgentDto } from './dto/agent.dto';
import { UsersService } from '../users/users.service';
import { AgentMapperService } from './dto/agent.mapper.service';
import { UserType } from '../types';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly userService: UsersService,
    private readonly mapperService: AgentMapperService,
  ) {}

  async create(agent: CreateAgentDto): Promise<AgentDto> {
    const user = await this.userService.create({
      username: agent.username,
      password: agent.password,
      user_type: UserType.AGENT,
    });

    const agentData = await this.agentRepository.save({
      name: agent.name,
      title: agent.title,
      user_id: user.id,
    });
    console.log('agentData', agentData);
    return this.mapperService.toDto(agentData);
  }

  //TODO handle pagination and filtering
  async findAll() {
    const agents = await this.agentRepository.find();
    return agents.map(async (agent) => {
      return await this.mapperService.toDto(agent);
    });
  }

  async findOne(id: number) {
    const agent = await this.agentRepository.findOne({ where: { id } });
    return this.mapperService.toDto(agent);
  }

  async findAvailableAgentMarkUnavailable() {
    //TODO handle race condition
    //Follow tell don't ask principle
    const agent = await this.agentRepository.findOne({
      where: { is_available: true },
      order: { available_at: 'ASC' },
    });
    if (!agent) {
      return null;
    }
    agent.is_available = false;
    await this.agentRepository.save(agent);
    return this.mapperService.toDto(agent);
  }

  async markAgentAvailable(id: number) {
    return await this.agentRepository.update(id, {
      is_available: true,
      available_at: new Date(),
    });
  }

  async update(id: number, agent: Agent): Promise<any> {
    return this.agentRepository.update(id, agent);
  }

  async delete(id: number): Promise<void> {
    await this.agentRepository.delete(id);
  }
}
