import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  role;

  constructor(public authService: AuthService) {
    this.role = authService.fetchRole();
  }
}
