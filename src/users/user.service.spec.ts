import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { getConnection } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);

    await getConnection().query('call set_known_good_state()');
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should find user by ID', async () => {
    const user = await service.getUserById(1);
    expect(user.firstName).toBe('testy');
    expect(user.lastName).toBe('testerson');
    expect(user.email).toBe('test1@test.com');
    expect(user.password).toBe('password');
    expect(user.passwordNeedsReset).toBe(true);
    expect(user.role.id).toBe(1);
    expect(user.role.roleName).toBe('admin');
  });
});
