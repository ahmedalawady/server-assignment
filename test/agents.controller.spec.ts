import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../src/agents/agent.entity';
import { User } from '../src/users/user.entity';
import { AgentsController } from '../src/agents/agents.controller';
import { AgentMapperService } from '../src/agents/dto/agent.mapper.service';
import { AgentsService } from '../src/agents/agents.service';
import { CreateAgentDto } from '../src/agents/dto/create-agent.dto';
import { UserType } from '../src/types';

describe('AgentsController (e2e)', () => {
  let app: INestApplication;
  let agentRepository: Repository<Agent>;
  let userRepository: Repository<User>;
  let createdAgentID: number;
  let token: string;

  const agentExample: CreateAgentDto = {
    name: 'agentName',
    username: 'agentUsername',
    title: 'agentTitle',
    password: '123456',
  };

  beforeAll(async () => {
    // authenticate user and get token for further requests to protected routes
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'user',
          password: 'pass',
          database: 'db',
          entities: [User, Agent],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Agent]),
        UsersModule,
      ],
      controllers: [AgentsController],
      providers: [AgentMapperService, AgentsService],
    }).compile();
    agentRepository = moduleFixture.get('AgentRepository');
    userRepository = moduleFixture.get('UserRepository');
    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).post('/users/register').send({
      username: 'admin',
      password: '123456',
      //TODO add user_type to admin
      user_type: UserType.CUSTOMER,
    });

    const login = await request(app.getHttpServer()).post('/users/login').send({
      username: 'admin',
      password: '123456',
    });

    token = login.body.access_token;
  });

  it('Create new agent', () => {
    return request(app.getHttpServer())
      .post('/agents/create')
      .send(agentExample)
      .expect(201)
      .then(async () => {
        const agent = await agentRepository.find({
          where: { name: agentExample.name },
        });
        createdAgentID = agent[0].id;
        expect(agent).toBeDefined();
        const user = await userRepository.find({
          where: { username: agentExample.username },
        });
        console.log(user);
        expect(user).toBeDefined();
        expect(user[0].user_type).toBe(UserType.AGENT);
        console.log(user);
      });
  });

  it('GET /agents', () => {
    return request(app.getHttpServer())
      .get('/agents')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async () => {
        const agents = await agentRepository.find();
        expect(agents).toBeDefined();
      });
  });

  it('GET /agents/:id', () => {
    return request(app.getHttpServer())
      .get(`/agents/${createdAgentID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async () => {
        const agent = await agentRepository.findOne({
          where: { id: createdAgentID },
        });
        expect(agent).toBeDefined();
      });
  });

  afterAll(async () => {
    await agentRepository.clear();
    await userRepository.clear();
    await app.close();
  });
});
