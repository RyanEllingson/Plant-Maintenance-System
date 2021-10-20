import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangeOwnPasswordComponent } from './change-own-password/change-own-password.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeOwnPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeOwnPasswordRoutingModule {}
