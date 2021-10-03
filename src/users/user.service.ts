import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  public getUserById(id: number): Promise<User> {
    return this.repo.findOne(id);
  }

  public getUsersByEmail(email: string): Promise<User[]> {
    return this.repo.find({ email });
  }

  public getAllUsers(): Promise<User[]> {
    return this.repo.find();
  }

  public addUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role,
  ): Promise<User> {
    const user = this.repo.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    return this.repo.save(user);
  }

  public async updateUser(attrs: Partial<User>): Promise<User> {
    if (!attrs.id) {
      throw new BadRequestException('User ID is required');
    }
    const user = await this.getUserById(attrs.id);
    if (!user) {
      throw new NotFoundException(`User ID ${attrs.id} not found`);
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
}
