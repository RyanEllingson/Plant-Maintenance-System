import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  public handleLogout(event: any) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {}
}
