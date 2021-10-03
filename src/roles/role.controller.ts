import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('roles')
export class RoleController {
  constructor(private service: RoleService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  @Get()
  public getAllRoles(): Promise<Role[]> {
    return this.service.getAllRoles();
  }
}
