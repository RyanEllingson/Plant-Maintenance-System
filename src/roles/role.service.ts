import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  public getAllRoles(): Promise<Role[]> {
    return this.repo.find();
  }
}
