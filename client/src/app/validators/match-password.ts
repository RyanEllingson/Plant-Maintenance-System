import { Injectable } from '@angular/core';
import { FormGroup, Validator } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class MatchPassword implements Validator {
  public validate(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    if (
      passwordControl.touched &&
      confirmPasswordControl.touched &&
      passwordControl.value !== confirmPasswordControl.value
    ) {
      return {
        errorResponse: 'Password and confirm password must match',
      };
    }
    return null;
  }
}
