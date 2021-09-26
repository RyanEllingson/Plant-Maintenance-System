import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class Role {
  constructor(public id: number, public roleName: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  public getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('/api/roles');
  }
}
