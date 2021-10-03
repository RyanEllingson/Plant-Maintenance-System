import { Injectable } from '@angular/core';
import { UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanLoad {
  private user: User;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    if (this.user.roleId !== 1) {
      return this.router.parseUrl('home');
    }
    return true;
  }
}
