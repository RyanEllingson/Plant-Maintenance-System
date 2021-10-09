import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../services/role.service';
import { UserData, UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  public allUsers: UserData[];
  public selectUserForm = new FormGroup({
    user: new FormControl(null),
  });
  public updateUserForm: AbstractControl;
  public allRoles: Role[];

  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.route.data.subscribe(({ users, roles }) => {
      this.allUsers = users;
      this.allRoles = roles;
    });
  }

  ngOnInit(): void {
    this.selectUserForm.valueChanges.subscribe((value: { user: UserData }) => {
      const { user } = value;
      console.log(user);
      this.updateUserForm = new FormGroup({
        firstName: new FormControl(user.firstName, [Validators.required]),
        lastName: new FormControl(user.lastName, [Validators.required]),
        email: new FormControl(user.email, [
          Validators.required,
          Validators.email,
        ]),
        role: new FormControl(user.role, [Validators.required]),
      });
    });
  }

  public handleSubmit(): void {
    this.updateUserForm.markAllAsTouched();
    if (this.updateUserForm.valid) {
      this.updateUserForm.markAsUntouched();
      const { firstName, lastName, email, role } = this.updateUserForm.value;
      const { id } = this.selectUserForm.value.user;
      this.userService
        .updateUser({ userId: id, firstName, lastName, email, roleId: role.id })
        .subscribe({
          next: () => {
            console.log('user updated!');
          },
          error: (err) => {
            if (err.status === 0) {
              this.updateUserForm.setErrors({
                errorResponse: 'No internet connection',
              });
            } else if (err.status === 504) {
              this.updateUserForm.setErrors({
                errorResponse:
                  'Unable to connect to the server - please try again later',
              });
            } else {
              this.updateUserForm.setErrors({
                errorResponse: err.error.message,
              });
            }
          },
        });
    }
  }

  public compareRoles(role1: Role, role2: Role): boolean {
    return role1 && role2 ? role1.id === role2.id : role1 === role2;
  }
}
