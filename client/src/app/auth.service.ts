import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public token: string;
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<string> {
    return new Observable((subscriber) => {
      this.http.post('/api/login', { email, password }).subscribe({
        next: (response: any) => {
          this.token = response.access_token;
          console.log(this.token);
          subscriber.next('');
        },
        error: (err: any) => {
          subscriber.error(err.error.message);
        },
      });
    });
  }
}
