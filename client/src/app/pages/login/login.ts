import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { Logo } from '../../components/logo';
import { ThemeToggle } from '../../components/theme-toggle';

@Component({
  selector: 'app-login',
  imports: [FormsModule, Logo, ThemeToggle],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private api = inject(ApiService);
  private router = inject(Router);

  isSignup = signal(false);

  name = '';
  email = '';
  password = '';

  loading = signal(false);
  error = signal('');
  info = signal('');

  // Password pattern: uppercase + lowercase + number + special char
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#]).{8,}$';

  // Password strength (0-100)
  passwordStrength(): number {
    const p = this.password;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8) score += 20;
    if (p.length >= 12) score += 10;
    if (/[a-z]/.test(p)) score += 20;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[0-9]/.test(p)) score += 15;
    if (/[@$!%*?&#]/.test(p)) score += 15;
    return score;
  }

  // CSS class for the strength bar color
  strengthClass(): string {
    const s = this.passwordStrength();
    if (s < 40) return 'weak';
    if (s < 70) return 'medium';
    return 'strong';
  }

  // Label text for the strength bar
  strengthLabel(): string {
    const s = this.passwordStrength();
    if (s < 40) return 'Weak password';
    if (s < 70) return 'Medium strength';
    return 'Strong password';
  }

  toggleMode(): void {
    this.isSignup.set(!this.isSignup());
    this.error.set('');
    this.info.set('');
    // Reset fields when switching modes
    this.name = '';
    this.email = '';
    this.password = '';
  }

  submit(): void {
    this.error.set('');
    this.info.set('');
    this.loading.set(true);

    if (this.isSignup()) {
      this.api.signup(this.name, this.email, this.password).subscribe({
        next: () => {
          this.loading.set(false);
          this.info.set('Account created! Please log in.');
          this.isSignup.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          // Show backend validation errors if they exist
          if (err?.error?.errors) {
            const messages = err.error.errors.map((e: any) => e.message).join(', ');
            this.error.set(messages);
          } else {
            this.error.set(err?.error?.message || 'Signup failed');
          }
        },
      });
    } else {
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