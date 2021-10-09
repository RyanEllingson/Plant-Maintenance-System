import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserData, UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UsersResolverService implements Resolve<UserData[]> {
  constructor(private userService: UserService, private router: Router) {}

  public resolve(): Observable<UserData[]> {
    return this.userService.getAllUsers().pipe(
      catchError(() => {
        this.router.navigateByUrl('/logout');
        return EMPTY;
      }),
    );
  }
}
