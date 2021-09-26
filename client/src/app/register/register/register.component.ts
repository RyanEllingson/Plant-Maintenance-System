import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe((allRoles) => {
      this.allRoles = allRoles;
    });
  }
}
