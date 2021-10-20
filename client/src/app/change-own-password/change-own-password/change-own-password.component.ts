import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { MatchPassword } from '../../validators/match-password';

@Component({
  selector: 'app-change-own-password',
  templateUrl: './change-own-password.component.html',
  styleUrls: ['./change-own-password.component.css'],
})
export class ChangeOwnPasswordComponent implements OnInit {
  private user: User;
  public changePasswordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    [this.matchPassword.validate],
  );

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService,
    private matchPassword: MatchPassword,
  ) {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  public handleSubmit(): void {
    this.changePasswordForm.markAllAsTouched();
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.markAsUntouched();
      const { password } = this.changePasswordForm.value;
      const { sub } = this.user;
      this.userService.changeMyPassword({ userId: sub, password }).subscribe({
        next: () => {
          this.changePasswordForm.reset();
          this.toastService.toastMessage$.next(
            'Password successfully changed!',
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

  ngOnInit(): void {}
}
