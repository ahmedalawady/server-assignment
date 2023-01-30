import { CreateAgentDto } from '../src/agents/dto/create-agent.dto';
import * as request from 'supertest';

const agentExample: CreateAgentDto = {
  name: 'agentName',
  username: 'agentUsername-2',
  title: 'agentTitle',
  password: '123456',
};

export const createUserReturnToken = async (app, data) => {
  await request(app.getHttpServer()).post('/users/register').send(data);

  const login = await request(app.getHttpServer()).post('/users/login').send({
    username: data.username,
    password: data.password,
  });

  return login.body.access_token;
};

export const createAgent = async (app, token) => {
  const agent = await request(app.getHttpServer())
    .post('/agents/create')
    .set('Authorization', `Bearer ${token}`)
    .send(agentExample)
    .then((res) => res.body);

  return agent.id;
};
