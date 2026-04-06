import { Component, signal } from '@angular/core';
import {Router,RouterOutlet,RouterLink,RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}