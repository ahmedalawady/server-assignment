import { Test } from '@nestjs/testing';
import { TestingModule } from './testing.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Agent } from '../src/agents/agent.entity';
import { User } from '../src/users/user.entity';
import { CreateAgentDto } from '../src/agents/dto/create-agent.dto';
import { UserRole } from '../src/common/types';
import { Ticket } from '../src/tickets/ticket.entity';
import { createUserReturnToken } from './helper';

//TODO THE GOOD PRACTICE THAT MAKE EVERY TEST RUN INDEPENDENTLY
describe('AgentsController (e2e)', () => {
  let app: INestApplication;
  let agentRepository: Repository<Agent>;
  let userRepository: Repository<User>;
  let createdAgentID: number;
  let token: string;
  let moduleFixture;
  let UserId: number;

  const agentExample: CreateAgentDto = {
    name: 'agentName',
    username: 'agentUsername',
    title: 'agentTitle',
    password: '123456',
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [TestingModule],
    }).compile();
    agentRepository = moduleFixture.get('AgentRepository');
    userRepository = moduleFixture.get('UserRepository');
    app = moduleFixture.createNestApplication();
    await app.init();

    const userExample = {
      username: 'admin',
      password: '123456',
      //TODO add role to admin
      role: UserRole.ADMIN,
    };

    token = await createUserReturnToken(app, userExample);
  });

  it('Create new agent', () => {
    return request(app.getHttpServer())
      .post('/agents/create')
      .set('Authorization', `Bearer ${token}`)
      .send(agentExample)
      .expect(201)
      .then(async () => {
        const optionsAgent: any = {
          where: { name: agentExample.name },
        };

        const agent = await agentRepository.find(optionsAgent);
        createdAgentID = agent[0].id;
        expect(agent).toBeDefined();
        const optionsUser: any = {
          where: { username: agentExample.username },
        };

        const user = await userRepository.find(optionsUser);
        UserId = user[0].id;
        expect(user).toBeDefined();
        expect(user[0].role).toBe(UserRole.AGENT);
      });
  });

  it('GET /agents', async () => {
    const response = await request(app.getHttpServer())
      .get('/agents')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const agentRes = response.body[0];
    expect(agentRes).toBeDefined();
    expect(agentRes).toHaveProperty('id');
    expect(agentRes).toHaveProperty('name');
    expect(agentRes.name).toBe(agentExample.name);
    expect(agentRes).toHaveProperty('title');
    expect(agentRes.title).toBe(agentExample.title);
  });

  afterAll(async () => {
    await userRepository.delete({ id: UserId });
    await agentRepository.delete({ id: createdAgentID });
    await app.close();
  });
});
