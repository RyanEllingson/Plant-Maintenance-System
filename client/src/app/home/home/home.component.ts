import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public user: User;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }
}
