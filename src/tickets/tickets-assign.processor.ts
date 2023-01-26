import { OnQueueActive, Processor, Process } from '@nestjs/bull';
import { Logger, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { AgentsService } from '../agents/agents.service';
import { TicketsService } from './tickets.service';

@Injectable()
@Processor('tickets')
export class TicketsAssignProcessor {
  private readonly logger = new Logger(TicketsAssignProcessor.name);
  constructor(
    private agentService: AgentsService,
    private ticketService: TicketsService,
  ) {}

  @Process('ticket')
  async transcode(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    const { id } = job.data;
    const agent = await this.agentService.findAvailableAgentMarkUnavailable();
    if (!agent) {
      this.logger.warn(`No agent available for ticket ${id}`);
      //TODO handle no agent available
      return;
    }

    try {
      this.logger.debug(`Assigning ticket ${job.data.id} to agent ${agent.id}`);
      await this.ticketService.assignTicket(id, agent.id);
    } catch (e) {
      this.logger.error(e);
      this.logger.debug(job.data);
      await this.agentService.markAgentAvailable(agent.id);
    }
  }
}
