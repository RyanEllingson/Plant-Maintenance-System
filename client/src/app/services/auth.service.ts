import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

interface LoginResponse {
  access_token: string;
}

export interface User {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token$: BehaviorSubject<string>;
  public user$ = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('jwt_token');
    this.token$ = new BehaviorSubject<string>(token);
    if (token) {
      this.user$.next(jwt_decode<User>(token));
    }
  }

  public login(email: string, password: string) {
    return this.http
      .post<LoginResponse>('/api/login', { email, password })
      .pipe(
        tap((response) => {
          const { access_token } = response;
          this.token$.next(access_token);
          this.user$.next(jwt_decode<User>(access_token));
          localStorage.setItem('jwt_token', access_token);
        }),
      );
  }

  public logout(): void {
    this.token$.next(null);
    this.user$.next(null);
    localStorage.removeItem('jwt_token');
  }
}
