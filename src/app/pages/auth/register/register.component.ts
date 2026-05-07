import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <form class="auth-card" (ngSubmit)="register()">
        <img src="assets/logo-symbol.png" alt="Egyptian Spirit" />

        <span>Join Egyptian Spirit</span>
        <h1>Create Account</h1>

        <input [(ngModel)]="fullName" name="fullName" placeholder="Full Name" required />
        <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required />
        <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />

        @if (successMessage) {
          <div class="success">{{ successMessage }}</div>
        }

        @if (errorMessage) {
          <div class="error">{{ errorMessage }}</div>
        }

        <button type="submit" [disabled]="loading">
          {{ loading ? 'Creating...' : 'Register' }}
        </button>

        <p class="switch">
          Already have an account?
          <a routerLink="/login">Login</a>
        </p>
      </form>
    </section>
  `,
  styles: [`
  :host {
    display: block;
    overflow-x: hidden;
  }

  .auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 20% 20%, rgba(198, 168, 92, 0.22), transparent 30%),
      linear-gradient(rgba(13, 27, 42, 0.9), rgba(13, 27, 42, 0.94)),
      url('https://images.unsplash.com/photo-1539650116574-75c0c6d1c9b4?q=80&w=1600');
    background-size: cover;
    background-position: center;
    padding: 110px 20px 32px;
  }

  .auth-card {
    width: min(430px, 100%);
    background: rgba(13, 27, 42, 0.92);
    border: 1px solid rgba(198, 168, 92, 0.36);
    border-radius: 28px;
    padding: 38px;
    color: #f8f6f1;
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.32);
    backdrop-filter: blur(14px);
  }

  img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    padding: 9px;
    border-radius: 50%;
    border: 1px solid rgba(198, 168, 92, 0.35);
    background: rgba(198, 168, 92, 0.1);
    margin-bottom: 18px;
  }

  span {
    color: #c6a85c;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 900;
  }

  h1 {
    font-family: 'Cinzel', serif;
    margin: 10px 0 24px;
    color: #f8f6f1;
    letter-spacing: 0.04em;
  }

  input {
    width: 100%;
    margin-bottom: 14px;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(198, 168, 92, 0.28);
    border-radius: 16px;
    color: #f8f6f1;
    outline: none;
    transition: 0.25s ease;
  }

  input::placeholder {
    color: rgba(248, 246, 241, 0.52);
  }

  input:focus {
    border-color: #c6a85c;
    box-shadow: 0 0 0 4px rgba(198, 168, 92, 0.16);
  }

  button {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    color: #0d1b2a;
    border: none;
    border-radius: 999px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 14px;
    cursor: pointer;
    transition: 0.25s ease;
    box-shadow: 0 14px 30px rgba(198, 168, 92, 0.25);
  }

  button:hover {
    transform: translateY(-2px);
    background: #ead7b5;
  }

  button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  .switch {
    text-align: center;
    margin: 18px 0 0;
    color: #ead7b5;
    font-size: 14px;
    line-height: 1.7;
  }

  .switch a {
    color: #c6a85c;
    text-decoration: none;
    font-weight: 800;
  }

  .success {
    margin: 0 0 14px;
    background: #dcfce7;
    color: #166534;
    padding: 13px 14px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 800;
  }

  .error {
    margin: 0 0 14px;
    background: #fee2e2;
    color: #991b1b;
    padding: 13px 14px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 800;
  }

  :host-context(body.light-mode) .auth-card {
    background: rgba(248, 246, 241, 0.94);
    color: #0d1b2a;
  }

  :host-context(body.light-mode) h1 {
    color: #0d1b2a;
  }

  :host-context(body.light-mode) input {
    background: rgba(255, 255, 255, 0.8);
    color: #0d1b2a;
  }

  :host-context(body.light-mode) input::placeholder,
  :host-context(body.light-mode) .switch {
    color: rgba(13, 27, 42, 0.65);
  }

  @media (max-width: 480px) {
    .auth-page {
      padding: 96px 14px 24px;
    }

    .auth-card {
      padding: 26px;
      border-radius: 22px;
    }
  }
`],
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  async register() {
    if (this.loading) return;

    this.successMessage = '';
    this.errorMessage = '';

    const fullName = this.fullName.trim();
    const email = this.email.trim().toLowerCase();
    const password = this.password.trim();

    if (!fullName || !email || !password) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    if (password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    try {
      const { error } = await this.supabase.signUp(email, password, fullName);

      if (error) {
        this.errorMessage = error.message;
        return;
      }

      this.successMessage = 'Account created successfully. You can login now.';

      this.fullName = '';
      this.email = '';
      this.password = '';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1200);
    } catch (err: any) {
      this.errorMessage = err?.message || 'Something went wrong. Please try again.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
