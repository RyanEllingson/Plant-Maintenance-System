import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  @Input() control: FormControl = null;
  @Input() label: string = '';
  @Input() inputType: string = '';

  constructor() {}

  public hasError() {
    return this.control.errors && this.control.touched;
  }

  public getErrors() {
    const errors: string[] = [];
    if (this.control.errors.required) {
      errors.push('Entry is required');
    }
    if (this.control.errors.email) {
      errors.push('Entry must be a valid email');
    }
    return errors;
  }

  ngOnInit(): void {}
}
