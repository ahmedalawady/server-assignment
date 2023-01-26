import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsController } from './agents.controller';
import { UsersModule } from '../users/users.module';
import { Agent } from './agent.entity';
import { AgentMapperService } from './dto/agent.mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent]), UsersModule],
  controllers: [AgentsController],
  providers: [AgentMapperService, AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
