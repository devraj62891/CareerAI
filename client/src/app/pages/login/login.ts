import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { Logo } from '../../components/logo';
import { ThemeToggle } from '../../components/theme-toggle';

/**
 * Login / Signup screen.
 * One component handles BOTH: a toggle switches between the two modes
 * so there's less code to read.
 */
@Component({
  selector: 'app-login',
  imports: [FormsModule, Logo, ThemeToggle],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private api = inject(ApiService);
  private router = inject(Router);

  // false = Login mode, true = Signup mode
  isSignup = signal(false);

  // Form fields (bound to inputs with [(ngModel)])
  name = '';
  email = '';
  password = '';

  loading = signal(false);
  error = signal('');
  info = signal('');

  toggleMode(): void {
    this.isSignup.set(!this.isSignup());
    this.error.set('');
    this.info.set('');
  }

  submit(): void {
    this.error.set('');
    this.info.set('');
    this.loading.set(true);

    if (this.isSignup()) {
      // --- SIGN UP ---
      this.api.signup(this.name, this.email, this.password).subscribe({
        next: () => {
          this.loading.set(false);
          this.info.set('Account created! Please log in.');
          this.isSignup.set(false); // switch back to login
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Signup failed');
        },
      });
    } else {
      // --- LOG IN ---
      this.api.login(this.email, this.password).subscribe({
        next: (res) => {
          this.api.saveLogin(res.token);
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message || 'Login failed');
        },
      });
    }
  }
}
