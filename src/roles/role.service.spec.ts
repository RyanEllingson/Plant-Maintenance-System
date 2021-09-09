import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { getConnection } from 'typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Role])],
      providers: [RoleService],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find 5 roles', async () => {
    const roles = await service.getAllRoles();
    expect(roles.length).toBe(5);
    expect(roles[0].id).toBe(1);
    expect(roles[0].roleName).toBe('admin');
  });

  it('should find existing role', async () => {
    const role = await service.getRoleById(2);
    expect(role.id).toBe(2);
    expect(role.roleName).toBe('planner');
  });

  it('should not find non-existing role', async () => {
    const role = await service.getRoleById(100);
    expect(role).toBeUndefined();
  });
});
