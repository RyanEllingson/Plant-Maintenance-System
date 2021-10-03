import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { getConnection } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';
import { RoleService } from '../roles/role.service';

describe('UserService', () => {
  let service: UserService;
  let roleService: RoleService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User, Role])],
      providers: [UserService, RoleService],
    }).compile();

    service = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);

    await getConnection().query('call set_known_good_state()');
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find existing ID', async () => {
    const user = await service.getUserById(1);
    expect(user.firstName).toBe('testy');
    expect(user.lastName).toBe('testerson');
    expect(user.email).toBe('test1@test.com');
    expect(user.password).toBe('password');
    expect(user.passwordNeedsReset).toBe(true);
    expect(user.role.id).toBe(1);
    expect(user.role.roleName).toBe('admin');
  });

  it('should not find non-existing ID', async () => {
    const user = await service.getUserById(0);
    expect(user).toBeUndefined();
  });

  it('should find existing email', async () => {
    const users = await service.getUsersByEmail('test1@test.com');
    expect(users.length).toBe(1);
    expect(users[0].firstName).toBe('testy');
    expect(users[0].lastName).toBe('testerson');
    expect(users[0].email).toBe('test1@test.com');
    expect(users[0].password).toBe('password');
    expect(users[0].passwordNeedsReset).toBe(true);
    expect(users[0].role.id).toBe(1);
    expect(users[0].role.roleName).toBe('admin');
  });

  it('should not find non-existing email', async () => {
    const users = await service.getUsersByEmail('bla@bla.com');
    expect(users.length).toBe(0);
  });

  it('should find all users', async () => {
    const users = await service.getAllUsers();
    expect(users.length).toBe(4);
    expect(users[0].firstName).toBe('testy');
    expect(users[0].lastName).toBe('testerson');
    expect(users[0].email).toBe('test1@test.com');
    expect(users[0].password).toBe('password');
    expect(users[0].passwordNeedsReset).toBe(true);
    expect(users[0].role.id).toBe(1);
    expect(users[0].role.roleName).toBe('admin');
  });

  it('should add user', async () => {
    const roles = await roleService.getAllRoles();
    const user = await service.addUser(
      'testy',
      'tester',
      'test3@test.com',
      'password',
      roles[2],
    );
    expect(user.id).toBe(5);

    const addedUser = await service.getUserById(5);
    expect(addedUser.firstName).toBe('testy');
    expect(addedUser.lastName).toBe('tester');
    expect(addedUser.email).toBe('test3@test.com');
    expect(addedUser.password).toBe('password');
    expect(addedUser.passwordNeedsReset).toBe(true);
    expect(addedUser.role.id).toBe(3);
    expect(addedUser.role.roleName).toBe('maintenance');
  });

  it('should update existing user', async () => {
    const roles = await roleService.getAllRoles();
    const user = await service.updateUser({
      id: 2,
      password: 'betterpassword',
      passwordNeedsReset: false,
      role: roles[4],
    });
    expect(user).toBeDefined();
    const updatedUser = await service.getUserById(2);
    expect(updatedUser.firstName).toBe('testus');
    expect(updatedUser.lastName).toBe('testerino');
    expect(updatedUser.email).toBe('test2@test.com');
    expect(updatedUser.password).toBe('betterpassword');
    expect(updatedUser.passwordNeedsReset).toBe(false);
    expect(updatedUser.role.id).toBe(5);
    expect(updatedUser.role.roleName).toBe('engineering');
  });

  it('should not update non-existing user', async () => {
    try {
      await service.updateUser({
        id: 7,
        passwordNeedsReset: false,
      });
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('User ID 7 not found');
      expect(error.name).toBe('NotFoundException');
    }
  });

  it('should not update user with no ID', async () => {
    try {
      await service.updateUser({ email: 'test8@test.com' });
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe('User ID is required');
      expect(error.name).toBe('BadRequestException');
    }
  });
});
