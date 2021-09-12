import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/roles')
export class RoleController {
  constructor(private service: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public getAllRoles(): Promise<Role[]> {
    return this.service.getAllRoles();
  }
}
