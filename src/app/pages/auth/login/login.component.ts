import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <form class="auth-card" (ngSubmit)="login()">
        <img src="assets/logo-symbol.png" alt="Egyptian Spirit" />

        <span>Welcome Back</span>
        <h1>Login</h1>

        <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required />
        <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />

        <button type="submit" [disabled]="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="switch">
          Don’t have an account?
          <a routerLink="/register">Create Account</a>
        </p>

        @if (errorMessage) {
          <div class="error">{{ errorMessage }}</div>
        }
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
    margin-top: 8px;
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

  .switch a:hover {
    color: #ead7b5;
  }

  .error {
    margin-top: 14px;
    background: #8b2d2d;
    color: #fff;
    padding: 13px 14px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
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
`]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async login() {
    this.errorMessage = '';
    this.loading = true;

    const { error } = await this.supabase.signIn(this.email, this.password);

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
      return;
    }

    const isAdmin = await this.supabase.isAdmin();
    this.router.navigate([isAdmin ? '/admin' : '/']);
  }
}
