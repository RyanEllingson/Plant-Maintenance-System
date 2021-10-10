import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatchPassword } from '../../validators/match-password';
import { UserService } from '../../services/user.service';
import { Role } from '../../services/role.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl(null, Validators.required),
    },
    [this.matchPassword.validate],
  );

  public allRoles: Role[];

  constructor(
    private userService: UserService,
    private matchPassword: MatchPassword,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {
    this.route.data.subscribe(({ roles }) => {
      this.allRoles = roles;
    });
  }

  public handleSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.registerForm.markAsUntouched();
      const { firstName, lastName, email, password, role } =
        this.registerForm.value;
      this.userService
        .register({ firstName, lastName, email, password, roleId: role.id })
        .subscribe({
          next: () => {
            this.registerForm.reset();
            this.toastService.toastMessage$.next(
              `User ${firstName} ${lastName} successfully created!`,
            );
          },
          error: (err) => {
            if (err.status === 0) {
              this.registerForm.setErrors({
                errorResponse: 'No internet connection',
              });
            } else if (err.status === 504) {
              this.registerForm.setErrors({
                errorResponse:
                  'Unable to connect to the server - please try again later',
              });
            } else {
              this.registerForm.setErrors({
                errorResponse: err.error.message,
              });
            }
          },
        });
    }
  }

  ngOnInit(): void {}
}
