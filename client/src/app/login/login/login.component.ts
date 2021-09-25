import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService) {}

  public handleSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loginForm.markAsUntouched();
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('home');
        },
        error: (err) => {
          if (err.status === 0) {
            this.loginForm.setErrors({
              errorResponse: 'No internet connection',
            });
          } else if (err.status === 504) {
            this.loginForm.setErrors({
              errorResponse:
                'Unable to connect to the server - please try again later',
            });
          } else {
            this.loginForm.setErrors({
              errorResponse: err.error.message,
            });
          }
        },
      });
    }
  }

  ngOnInit(): void {}
}
