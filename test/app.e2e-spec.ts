import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    await getConnection().query('call set_known_good_state()');
  });

  it('should successfully login', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;
    token = access_token;
    console.log(access_token);
    expect(typeof access_token).toBe('string');
    expect(access_token.split('.').length).toBe(3);
  });

  it('should successfully register', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        firstName: 'testina',
        lastName: 'testerella',
        email: 'test3@test.com',
        password: 'password',
        roleId: 5,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    const { access_token } = res.body;
    expect(typeof access_token).toBe('string');
    expect(access_token.split('.').length).toBe(3);
  });

  it('should not register if not logged in', async () => {
    await request(app.getHttpServer())
      .post('/api/register')
      .send({
        firstName: 'testina',
        lastName: 'testerella',
        email: 'test3@test.com',
        password: 'password',
        roleId: 5,
      })
      .expect(401);
  });

  it('should not register if not an admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'planner@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    await request(app.getHttpServer())
      .post('/api/register')
      .send({
        firstName: 'testina',
        lastName: 'testerella',
        email: 'test3@test.com',
        password: 'password',
        roleId: 5,
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);
  });

  it('should not register with invalid data', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        firstName: 'testina',
        lastName: 'testerella',
        email: 'bogusemail',
        password: 'password',
        roleId: 'hahaha',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    const { message } = res.body;
    expect(message.length).toBe(3);
    expect(message).toContain('email must be an email');
    expect(message).toContain('roleId must be an integer number');
    expect(message).toContain('roleId must not be less than 0');
  });

  it('should not register with missing data', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/register')
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    const { message } = res.body;
    expect(message.length).toBe(6);
    expect(message).toContain('firstName must be a string');
    expect(message).toContain('lastName must be a string');
    expect(message).toContain('email must be an email');
    expect(message).toContain('password must be a string');
    expect(message).toContain('roleId must be an integer number');
    expect(message).toContain('roleId must not be less than 0');
  });

  it('should return roles when logged in', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const { body } = res;
    expect(body.length).toBe(5);
    expect(body[0].id).toBe(1);
    expect(body[0].roleName).toBe('admin');
  });

  it('should not return roles when not logged in', async () => {
    await request(app.getHttpServer()).get('/api/roles').expect(401);
  });
});
