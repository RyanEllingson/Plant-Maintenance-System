import { Test } from '@nestjs/testing';
import { scrypt as _scrypt } from 'crypto';
import { Role } from '../roles/role.entity';
import { RoleService } from '../roles/role.service';
import { promisify } from 'util';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';
import { JwtModule } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

describe('AuthService', () => {
  let service: AuthService;
  beforeAll(async () => {
    const userService: Partial<UserService> = {
      getUsersByEmail(email: string): Promise<User[]> {
        const result = [];
        if (email === 'bla@bla.com') {
          result.push({
            id: 1,
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            email,
            password:
              'ef29aaed6b959cb5.aedc7d941163911fc8452dd454f15e2418c0ae3790a88334b113c33c441e6335',
            passwordNeedsReset: false,
            role: {
              id: 1,
              roleName: 'admin',
            } as Role,
          });
        }
        return Promise.resolve(result);
      },
      addUser(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: Role,
      ): Promise<User> {
        return Promise.resolve({
          id: 100,
          firstName,
          lastName,
          email,
          password,
          role,
        } as User);
      },
      updateUser(user: Partial<User>): Promise<User> {
        const updatedUser = {
          id: 1,
          firstName: 'testy',
          lastName: 'tester',
          email: 'test@test.com',
          password: 'password',
          passwordNeedsReset: false,
          role: {
            id: 1,
            roleName: 'admin',
          } as Role,
        } as User;
        Object.assign(updatedUser, user);
        return Promise.resolve(updatedUser);
      },
    };
    const roleService: Partial<RoleService> = {
      getRoleById(roleId: number): Promise<Role> {
        let result = null;
        if (roleId === 1) {
          result = {
            id: 1,
            roleName: 'admin',
          } as Role;
        }
        return Promise.resolve(result);
      },
    };
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: RoleService, useValue: roleService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user with salted and hashed password', async () => {
    const user = await service.register(
      'testy',
      'tester',
      'test@test.com',
      'password',
      1,
    );
    const [salt, actual] = user.password.split('.');
    const expected = (await scrypt('password', salt, 32)) as Buffer;
    expect(actual).toBe(expected.toString('hex'));
    expect(user.id).toBe(100);
  });

  it('should not register user with existing email', async () => {
    try {
      await service.register('testy', 'tester', 'bla@bla.com', 'password', 1);
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe('Email bla@bla.com already in use');
      expect(error.name).toBe('BadRequestException');
    }
  });

  it('should not register user with non-existing roleId', async () => {
    try {
      await service.register('testy', 'tester', 'test@test.com', 'password', 2);
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('Role ID 2 not found');
      expect(error.name).toBe('NotFoundException');
    }
  });

  it('should successfully authenticate with correct email and password', async () => {
    const user = await service.authenticate('bla@bla.com', 'password');
    expect(user.id).toBe(1);
    expect(user.firstName).toBe('TestFirstName');
    expect(user.lastName).toBe('TestLastName');
    expect(user.email).toBe('bla@bla.com');
    expect(user.role.id).toBe(1);
    expect(user.role.roleName).toBe('admin');
  });

  it('should not authenticate with non-existing email', async () => {
    try {
      await service.authenticate('bogus@email.com', 'password');
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('Email bogus@email.com not found');
      expect(error.name).toBe('NotFoundException');
    }
  });

  it('should not authenticate with incorrect password', async () => {
    try {
      await service.authenticate('bla@bla.com', 'wrongpassword');
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe('Invalid password');
      expect(error.name).toBe('BadRequestException');
    }
  });

  it('should return a signed JWT', async () => {
    const result = await service.login({
      id: 1,
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      email: 'test@test.com',
      password:
        'ef29aaed6b959cb5.aedc7d941163911fc8452dd454f15e2418c0ae3790a88334b113c33c441e6335',
      passwordNeedsReset: false,
      role: {
        id: 1,
        roleName: 'admin',
      } as Role,
    });
    expect(typeof result.access_token).toBe('string');
    expect(result.access_token.split('.').length).toBe(3);
  });

  it('should successfully update a user', async () => {
    const user = await service.update(
      1,
      'testus',
      'testensen',
      'test1@test.com',
      1,
    );
    expect(user.id).toBe(1);
    expect(user.firstName).toBe('testus');
    expect(user.lastName).toBe('testensen');
    expect(user.email).toBe('test1@test.com');
    expect(user.password).toBe('password');
    expect(user.passwordNeedsReset).toBe(false);
    expect(user.role.id).toBe(1);
    expect(user.role.roleName).toBe('admin');
  });

  it('should not update to an existing email', async () => {
    try {
      await service.update(1, 'testus', 'testensen', 'bla@bla.com', 1);
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe('Email bla@bla.com already in use');
      expect(error.name).toBe('BadRequestException');
    }
  });

  it('should not update to non-existing roleId', async () => {
    try {
      await service.update(1, 'testus', 'testensen', 'test1@test.com', 2);
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('Role ID 2 not found');
      expect(error.name).toBe('NotFoundException');
    }
  });
});
