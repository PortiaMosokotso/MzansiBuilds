import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    const payload = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error);
      }
    });
  }
}
