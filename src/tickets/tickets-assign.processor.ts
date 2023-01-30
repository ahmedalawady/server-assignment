import { OnQueueActive, Processor, Process } from '@nestjs/bull';
import { Logger, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { AgentsService } from '../agents/agents.service';
import { TicketsService } from './tickets.service';

//TODO I have to create cron job to check if there is any ticket that is in progress and not assigned to available agent based on availability time
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
    console.log(
      '🚀 ~ file: tickets-assign.processor.ts:21 ~ TicketsAssignProcessor ~ transcode ~ job.data',
      job.data,
    );
    const agent = await this.agentService.findAvailableAgentMarkUnavailable();
    console.log(
      '🚀 ~ file: tickets-assign.processor.ts:23 ~ TicketsAssignProcessor ~ transcode ~ agent',
      agent,
    );
    const dubugging = await this.agentService.findAll();
    console.log(
      '🚀 ~ file: tickets-assign.processor.ts:25 ~ TicketsAssignProcessor ~ transcode ~ dubugging',
      dubugging,
    );
    if (!agent) {
      this.logger.warn(`No agent available for ticket ${id}`);
      //TODO handle no agent available
      return;
    }

    try {
      this.logger.debug(`Assigning ticket ${job.data.id} to agent ${agent.id}`);
      await this.ticketService.assignTicket(id, agent);
      console.log(
        '🚀 ~ file: tickets-assign.processor.ts:34 ~ TicketsAssignProcessor ~ transcode ~ `Assigning ticket ${job.data.id} to agent ${agent.id}`',
        `Assigning ticket ${job.data.id} to agent ${agent.id}`,
      );
      this.logger.debug(`Assigned ticket ${job.data.id} to agent ${agent.id}`);
    } catch (e) {
      this.logger.error(e);
      this.logger.debug(job.data);
      await this.agentService.markAgentAvailable(agent.id);
    }
  }
}
