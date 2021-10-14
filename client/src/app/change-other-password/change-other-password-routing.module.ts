import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersResolverService } from '../services/users-resolver.service';
import { ChangeOtherPasswordComponent } from './change-other-password/change-other-password.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeOtherPasswordComponent,
    resolve: { users: UsersResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeOtherPasswordRoutingModule {}
