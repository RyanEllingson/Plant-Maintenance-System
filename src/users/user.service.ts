import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = await this.getUserById(attrs.id);
    if (!user) {
      return null;
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
}
