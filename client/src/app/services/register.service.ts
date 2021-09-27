import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  public register(credentials: RegisterCredentials) {
    return this.http.post('/api/register', credentials);
  }
}
