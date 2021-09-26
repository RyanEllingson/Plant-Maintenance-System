import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  private token: string;

  constructor(private authService: AuthService) {
    console.log('creating AuthHttpInterceptor');
    this.authService.token$.subscribe((token) => {
      this.token = token;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.token}`),
    });
    return next.handle(authReq);
  }
}
