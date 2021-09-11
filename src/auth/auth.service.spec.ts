import { Test } from '@nestjs/testing';
import { scrypt as _scrypt } from 'crypto';
import { Role } from '../roles/role.entity';
import { RoleService } from '../roles/role.service';
import { promisify } from 'util';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';

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
            role: {
              id: 1,
              roleName: 'admin',
            } as Role,
          } as User);
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
    };
    const roleService: Partial<RoleService> = {
      getRoleById(roleId: number): Promise<Role> {
        let result = null;
        if (roleId === 1) {
          result = Promise.resolve({
            id: 1,
            roleName: 'admin',
          } as Role);
        }
        return Promise.resolve(result);
      },
    };
    const module = await Test.createTestingModule({
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

  it('should successfully login with correct email and password', async () => {
    const user = await service.login('bla@bla.com', 'password');
    expect(user.id).toBe(1);
    expect(user.firstName).toBe('TestFirstName');
    expect(user.lastName).toBe('TestLastName');
    expect(user.email).toBe('bla@bla.com');
    expect(user.role.id).toBe(1);
    expect(user.role.roleName).toBe('admin');
  });

  it('should not login with non-existing email', async () => {
    try {
      await service.login('bogus@email.com', 'password');
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('Email bogus@email.com not found');
      expect(error.name).toBe('NotFoundException');
    }
  });

  it('should not login with incorrect password', async () => {
    try {
      await service.login('bla@bla.com', 'wrongpassword');
      expect(false).toBe(true);
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe('Invalid password');
      expect(error.name).toBe('BadRequestException');
    }
  });
});
