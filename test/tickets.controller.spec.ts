import { Test } from '@nestjs/testing';
import { TestingModule } from './testing.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Ticket } from '../src/tickets/ticket.entity';
import { Agent } from '../src/agents/agent.entity';
import { User } from '../src/users/user.entity';
import { TicketStatus, UserRole } from '../src/common/types';
import { createUserReturnToken, createAgent } from './helper';

describe('TicketsController (e2e)', () => {
  let app: INestApplication;
  let agentRepository: Repository<Agent>;
  let ticketRepository: Repository<Ticket>;
  let userRepository: Repository<User>;
  let createdAgentID: number;
  let createdTicketID: number;
  let token: string;

  //TODO I have to move these function in helper file

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TestingModule],
    }).compile();
    agentRepository = moduleFixture.get('AgentRepository');
    ticketRepository = moduleFixture.get('TicketRepository');
    userRepository = moduleFixture.get('UserRepository');
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const userExample = {
      username: 'customer-1',
      password: '123456',
      role: UserRole.CUSTOMER,
    };

    token = await createUserReturnToken(app, userExample);
    createdAgentID = await createAgent(app, token);
  });

  it('should create ticket and make sure it is assigned automatically to available agent', async () => {
    await request(app.getHttpServer())
      .post('/tickets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_number: 'order-1',
        return_reason: 'reason-1',
      })
      .expect(201)
      .then(async (res) => {
        createdTicketID = res.body.id;
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const ticket = await ticketRepository.findOne({
          where: { id: createdTicketID },
          relations: {
            Agent: true,
          },
        });

        expect(ticket.Agent.id).toBe(createdAgentID);
        expect(ticket.status).toBe(TicketStatus.INPROGRESS);

        const agent = await agentRepository.findOne({
          where: { id: createdAgentID },
        });
        expect(agent.is_available).toBe(false);
      });
  });

  it('should create an unassigned ticket when no availability is found', async () => {
    await request(app.getHttpServer())
      .post('/tickets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        order_number: 'order-1',
        return_reason: 'reason-1',
      })
      .expect(201)
      .then(async (res) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const ticket = await ticketRepository.findOne({
          where: { id: res.body.id },
          relations: {
            Agent: true,
          },
        });

        expect(ticket.Agent).toBe(null);
        expect(ticket.status).toBe(TicketStatus.OPEN);
      });
  });

  it('Resolve ticket', async () => {
    await request(app.getHttpServer())
      .post('/tickets/resolved')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: createdTicketID,
      })
      .expect(200)
      .then(async (res) => {
        const ticket = await ticketRepository.findOne({
          where: { id: createdTicketID },
          relations: {
            Agent: true,
          },
        });

        expect(ticket.status).toBe(TicketStatus.RESOLVED);
      });
  });

  afterAll(async () => {
    await userRepository.delete({});
    await ticketRepository.delete({});
    await agentRepository.delete({});
    await app.close();
  });
});
