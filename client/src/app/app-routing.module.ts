import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: 'logout', component: LogoutComponent },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((mod) => mod.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((mod) => mod.RegisterModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
