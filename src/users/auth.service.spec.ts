import { Test } from '@nestjs/testing';
import { scrypt as _scrypt } from 'crypto';
import { Role } from '../roles/role.entity';
import { RoleService } from '../roles/role.service';
import { promisify } from 'util';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

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
            email,
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
          id: 0,
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
    expect(user.id).toBe(0);
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
});
