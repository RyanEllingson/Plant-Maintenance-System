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
  public submissionError = '';

  constructor(private router: Router, private authService: AuthService) {}

  public hasError(field: string) {
    const control = this.loginForm.get(field);
    return control.errors && control.touched;
  }

  public getErrors(field: string) {
    const errors = [];
    const control = this.loginForm.get(field);
    if (control.errors.required) {
      errors.push('Entry is required');
    }
    if (control.errors.email) {
      errors.push('Entry must be a valid email');
    }
    return errors;
  }

  public handleSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loginForm.markAsUntouched();
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('');
        },
        error: (err) => {
          this.submissionError = err;
        },
      });
    }
  }

  ngOnInit(): void {}
}
