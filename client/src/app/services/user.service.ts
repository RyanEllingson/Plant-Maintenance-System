import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from './role.service';

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserCredentials {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public register(credentials: RegisterCredentials): Observable<void> {
    return this.http.post<void>('/api/register', credentials);
  }

  public getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>('/api/users');
  }

  public updateUser(credentials: UpdateUserCredentials): Observable<void> {
    console.log(credentials);
    return this.http.patch<void>('/api/users/update', credentials);
  }
}
