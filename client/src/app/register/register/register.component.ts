import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { Role, RoleService } from '../../services/role.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    role: new FormControl(null),
  });

  public allRoles: Role[] = [];

  constructor(
    private roleService: RoleService,
    private registerService: RegisterService,
  ) {}

  public handleSubmit() {}

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe({
      next: (allRoles) => {
        this.allRoles = allRoles;
      },
      error: (err) => {},
    });
  }
}
