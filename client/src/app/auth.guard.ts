import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private token: string;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.token$.subscribe((token) => {
      this.token = token;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree {
    if (this.token === null) {
      return this.router.parseUrl('/login');
    }
    return true;
  }
}
