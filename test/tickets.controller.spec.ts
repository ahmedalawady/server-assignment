import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../src/tickets/ticket.entity';
import { Agent } from '../src/agents/agent.entity';
import { User } from '../src/users/user.entity';
import { AgentsController } from '../src/agents/agents.controller';
import { AgentMapperService } from '../src/agents/dto/agent.mapper.service';
import { AgentsService } from '../src/agents/agents.service';
import { CreateAgentDto } from '../src/agents/dto/create-agent.dto';
import { TicketStatus, UserType } from '../src/types';
import { AgentsModule } from '../src/agents/agents.module';
import { TicketsAssignProcessor } from '../src/tickets/tickets-assign.processor';
import { TicketsService } from '../src/tickets/tickets.service';
import { TicketsController } from '../src/tickets/tickets.controller';
import { BullModule } from '@nestjs/bull';

describe.only('TicketsController (e2e)', () => {
  let app: INestApplication;
  let agentRepository: Repository<Agent>;
  let ticketRepository: Repository<Ticket>;
  let userRepository: Repository<User>;
  let createdAgentID: number;
  let createdTicketID: number;
  let token: string;

  //TODO I have to move these function in helper file
  const agentExample: CreateAgentDto = {
    name: 'agentName',
    username: 'agentUsername',
    title: 'agentTitle',
    password: '123456',
  };

  const createUserReturnToken = async () => {
    await request(app.getHttpServer()).post('/users/register').send({
      username: 'customer',
      password: '123456',
      user_type: UserType.CUSTOMER,
    });

    const login = await request(app.getHttpServer()).post('/users/login').send({
      username: 'customer',
      password: '123456',
    });

    return login.body.access_token;
  };

  const createAgent = async (token) => {
    const agent = await request(app.getHttpServer())
      .post('/agents/create')
      .set('Authorization', `Bearer ${token}`)
      .send(agentExample)
      .then((res) => res.body);

    createdAgentID = agent.id;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'user',
          password: 'pass',
          database: 'db',
          entities: [Ticket, Agent, User],
          synchronize: true,
        }),
        BullModule.registerQueue({
          // Should be configured in a config file
          name: 'tickets',
        }),
        TypeOrmModule.forFeature([Ticket]),
        AgentsModule,
        UsersModule,
      ],
      providers: [TicketsService, TicketsAssignProcessor],
      controllers: [TicketsController],
    }).compile();
    agentRepository = moduleFixture.get('AgentRepository');
    ticketRepository = moduleFixture.get('TicketRepository');
    userRepository = moduleFixture.get('UserRepository');
    await userRepository.clear();
    await agentRepository.clear();
    await ticketRepository.clear();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    token = await createUserReturnToken();
    await createAgent(token);
  });

  it('should create ticket and make sure it is assigned automatically to available agent', async () => {
    await request(app.getHttpServer())
      .post('/tickets/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        subject: 'subject',
        description: 'description',
        product_id: 'sl-1',
      })
      .expect(201)
      .then(async (res) => {
        createdTicketID = res.body.id;
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const ticket = await ticketRepository.findOne({
          where: { id: createdTicketID },
        });

        expect(ticket.agent_id).toBe(createdAgentID);
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
        subject: 'subject',
        description: 'description',
        product_id: 'sl-1',
      })
      .expect(201)
      .then(async (res) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const ticket = await ticketRepository.findOne({
          where: { id: res.body.id },
        });

        expect(ticket.agent_id).toBe(null);
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
      .expect(201)
      .then(async (res) => {
        const ticket = await ticketRepository.findOne({
          where: { id: createdTicketID },
        });

        expect(ticket.status).toBe(TicketStatus.RESOLVED);
      });
  });

  afterAll(async () => {
    await userRepository.clear();
    await agentRepository.clear();
    await ticketRepository.clear();
    await app.close();
  });
});
