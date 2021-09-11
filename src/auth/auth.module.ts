import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { RoleModule } from '../roles/role.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, RoleModule],
  providers: [AuthService],
})
export class AuthModule {}
