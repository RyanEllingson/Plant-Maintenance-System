import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesResolverService } from '../services/roles-resolver.service';
import { UsersResolverService } from '../services/users-resolver.service';
import { UpdateUserComponent } from './update-user/update-user.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateUserComponent,
    resolve: {
      users: UsersResolverService,
      roles: RolesResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateUserRoutingModule {}
