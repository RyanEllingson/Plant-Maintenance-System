import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatchPassword } from 'src/app/validators/match-password';
import { ToastService } from '../../services/toast.service';
import { UserData, UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-other-password',
  templateUrl: './change-other-password.component.html',
  styleUrls: ['./change-other-password.component.css'],
})
export class ChangeOtherPasswordComponent implements OnInit {
  public allUsers: UserData[];
  public selectUserForm = new FormGroup({
    user: new FormControl(null),
  });
  public changePasswordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    [this.matchPassword.validate],
  );

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private matchPassword: MatchPassword,
  ) {
    this.route.data.subscribe(({ users }) => {
      this.allUsers = users;
    });
  }

  public handleSubmit(): void {
    this.changePasswordForm.markAllAsTouched();
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.markAsUntouched();
      const { password } = this.changePasswordForm.value;
      const { user } = this.selectUserForm.value;
      this.userService
        .changeOtherPassword({ userId: user.id, password })
        .subscribe({
          next: () => {
            this.selectUserForm.reset();
            this.changePasswordForm.reset();
            this.toastService.toastMessage$.next(
              `User ${user.firstName} ${user.lastName}'s password successfully changed!'`,
            );
          },
          error: (err) => {
            if (err.status === 0) {
              this.changePasswordForm.setErrors({
                errorResponse: 'No internet connection',
              });
            } else if (err.status === 504) {
              this.changePasswordForm.setErrors({
                errorResponse:
                  'Unable to connect to the server - please try again later',
              });
            } else {
              this.changePasswordForm.setErrors({
                errorResponse: err.error.message,
              });
            }
          },
        });
    }
  }

  ngOnInit(): void {
    this.selectUserForm.valueChanges.subscribe(() => {
      this.changePasswordForm.reset();
    });
  }
}
