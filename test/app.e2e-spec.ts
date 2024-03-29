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

  it('should not register if password needs to be changed', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    const res2 = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        firstName: 'testina',
        lastName: 'testerella',
        email: 'test3@test.com',
        password: 'password',
        roleId: 5,
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(res2.body.message).toBe('Please change your password');
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
    expect(message).toContain('roleId must not be less than 1');
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
    expect(message).toContain('roleId must not be less than 1');
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

  it('should not return roles if not an admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'planner@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    await request(app.getHttpServer())
      .get('/api/roles')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);
  });

  it('should not return roles if password needs to be changed', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    const res2 = await request(app.getHttpServer())
      .get('/api/roles')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(res2.body.message).toBe('Please change your password');
  });

  it('should get all users', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const { body } = res;
    expect(body.length).toBe(6);
    expect(body[0].id).toBe(1);
    expect(body[0].firstName).toBe('testy');
    expect(body[0].lastName).toBe('testerson');
    expect(body[0].email).toBe('test1@test.com');
    expect(body[0].passwordNeedsReset).toBe(true);
    expect(body[0].role.id).toBe(1);
    expect(body[0].role.roleName).toBe('admin');
    expect(body[0].password).toBeUndefined();
  });

  it('should not get all users when not logged in', async () => {
    await request(app.getHttpServer()).get('/api/users').expect(401);
  });

  it('should not get all users if not an admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'planner@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);
  });

  it('should not get all users if password needs to be changed', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    const res2 = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(res2.body.message).toBe('Please change your password');
  });

  it('should successfully update user', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/users/update')
      .send({
        userId: 1,
        firstName: 'testus',
        lastName: 'testerino',
        email: 'test1@test.com',
        roleId: 4,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should not update user when not logged in', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/update')
      .send({
        userId: 1,
        firstName: 'testus',
        lastName: 'testerino',
        email: 'test1@test.com',
        roleId: 4,
      })
      .expect(401);
  });

  it('should not update user if not an admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'planner@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    await request(app.getHttpServer())
      .patch('/api/users/update')
      .send({
        userId: 1,
        firstName: 'testus',
        lastName: 'testerino',
        email: 'test1@test.com',
        roleId: 4,
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);
  });

  it('should not update user if password needs to be changed', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    const res2 = await request(app.getHttpServer())
      .patch('/api/users/update')
      .send({
        userId: 1,
        firstName: 'testus',
        lastName: 'testerino',
        email: 'test1@test.com',
        roleId: 4,
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(res2.body.message).toBe('Please change your password');
  });

  it('should not update user with invalid data', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/users/update')
      .send({
        userId: 'hello',
        firstName: 'testus',
        lastName: 'testerino',
        email: 'blabla',
        roleId: 'top secret',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    const { message } = res.body;
    expect(message.length).toBe(5);
    expect(message).toContain('userId must be an integer number');
    expect(message).toContain('userId must not be less than 1');
    expect(message).toContain('email must be an email');
    expect(message).toContain('roleId must be an integer number');
    expect(message).toContain('roleId must not be less than 1');
  });

  it('should not update user with missing data', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/users/update')
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    const { message } = res.body;
    expect(message.length).toBe(7);
    expect(message).toContain('userId must be an integer number');
    expect(message).toContain('userId must not be less than 1');
    expect(message).toContain('firstName must be a string');
    expect(message).toContain('lastName must be a string');
    expect(message).toContain('email must be an email');
    expect(message).toContain('roleId must be an integer number');
    expect(message).toContain('roleId must not be less than 1');
  });

  it("should successfully change other user's password", async () => {
    await request(app.getHttpServer())
      .patch('/api/users/change-other-password')
      .send({
        userId: 1,
        password: 'newpassword',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it("should not change other user's password when not logged in", async () => {
    await request(app.getHttpServer())
      .patch('/api/users/change-other-password')
      .send({
        userId: 1,
        password: 'newerpassword',
      })
      .expect(401);
  });

  it("should not change other user's password if not an admin", async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'planner@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    await request(app.getHttpServer())
      .patch('/api/users/change-other-password')
      .send({
        userId: 1,
        password: 'newerpassword',
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);
  });

  it("should not change other user's password if password needs to be changed", async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    const res2 = await request(app.getHttpServer())
      .patch('/api/users/change-other-password')
      .send({
        userId: 1,
        password: 'newerpassword',
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(res2.body.message).toBe('Please change your password');
  });

  it("should change a user's own password", async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    await request(app.getHttpServer())
      .patch('/api/users/change-own-password')
      .send({
        userId: 5,
        password: 'betterpassword',
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'betterpassword',
      })
      .expect(200);
  });

  it('should get roles after changing password', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'admin2@test.com',
        password: 'betterpassword',
      })
      .expect(200);
    const { access_token } = res.body;

    const res2 = await request(app.getHttpServer())
      .get('/api/roles')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
    const { body } = res2;
    expect(body.length).toBe(5);
    expect(body[0].id).toBe(1);
    expect(body[0].roleName).toBe('admin');
  });

  it('should not update own password if not logged in', async () => {
    await request(app.getHttpServer())
      .patch('/api/users/change-own-password')
      .send({
        userId: 4,
        password: 'betterpassword',
      })
      .expect(401);
  });

  it("should not update other user's password", async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'planner@test.com',
        password: 'password',
      })
      .expect(200);
    const { access_token } = res.body;

    await request(app.getHttpServer())
      .patch('/api/users/change-own-password')
      .send({
        userId: 3,
        password: 'betterpassword',
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);
  });
});
