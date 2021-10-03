import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role, RoleService } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class RolesResolverService implements Resolve<Role[]> {
  constructor(private roleService: RoleService, private router: Router) {}

  public resolve(): Observable<Role[]> {
    return this.roleService.getAllRoles().pipe(
      catchError(() => {
        this.router.navigateByUrl('/logout');
        return EMPTY;
      }),
    );
  }
}
