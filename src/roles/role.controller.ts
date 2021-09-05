import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {
  constructor(private service: RoleService) {}

  @Get()
  public getAllRoles(): Promise<Role[]> {
    return this.service.getAllRoles();
  }
}
