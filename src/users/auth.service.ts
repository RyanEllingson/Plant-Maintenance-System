import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.entity';
import { RoleService } from '../roles/role.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roleId: number,
  ): Promise<User> {
    const role = await this.roleService.getRoleById(roleId);
    if (!role) {
      throw new NotFoundException(`Role ID ${roleId} not found`);
    }

    const users = await this.userService.getUsersByEmail(email);
    if (users.length > 0) {
      throw new BadRequestException(`Email ${email} already in use`);
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPass = salt + '.' + hash.toString('hex');

    return this.userService.addUser(
      firstName,
      lastName,
      email,
      hashedPass,
      role,
    );
  }
}
