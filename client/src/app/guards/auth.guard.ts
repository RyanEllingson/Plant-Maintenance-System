import { Injectable } from '@angular/core';
import { UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  private token: string;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.token$.subscribe((token) => {
      this.token = token;
    });
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    if (this.token === null) {
      return this.router.parseUrl('');
    }
    return true;
  }
}
