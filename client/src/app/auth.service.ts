import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

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
  public token: string = null;
  public user: User;
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<void> {
    return new Observable((subscriber) => {
      this.http.post('/api/login', { email, password }).subscribe({
        next: (response: any) => {
          this.token = response.access_token;
          this.user = jwt_decode<User>(this.token);
          subscriber.next();
        },
        error: (err: any) => {
          subscriber.error(err.error.message);
        },
      });
    });
  }

  public logout(): void {
    this.token = null;
    this.user = null;
  }
}
