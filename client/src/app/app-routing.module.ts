import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: 'logout', component: LogoutComponent },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((mod) => mod.HomeModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((mod) => mod.RegisterModule),
    canLoad: [AuthGuard, AdminGuard],
  },
  {
    path: 'update-user',
    loadChildren: () =>
      import('./update-user/update-user.module').then(
        (mod) => mod.UpdateUserModule,
      ),
    canLoad: [AuthGuard, AdminGuard],
  },
  {
    path: 'change-other-password',
    loadChildren: () =>
      import('./change-other-password/change-other-password.module').then(
        (mod) => mod.ChangeOtherPasswordModule,
      ),
    canLoad: [AuthGuard, AdminGuard],
  },
  {
    path: 'change-my-password',
    loadChildren: () =>
      import('./change-own-password/change-own-password.module').then(
        (mod) => mod.ChangeOwnPasswordModule,
      ),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
