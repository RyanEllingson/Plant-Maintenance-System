import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesResolverService } from '../services/roles-resolver.service';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    resolve: {
      roles: RolesResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
