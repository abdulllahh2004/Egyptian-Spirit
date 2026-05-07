import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />

    <main class="user-main">
      <router-outlet />
    </main>

    <app-footer />
  `,
  styles: [`
    :host {
      display: block;
    }

    .user-main {
      min-height: 100vh;
      background: #07111d;
    }

    /* smooth page feel */
    .user-main > * {
      animation: fadeIn 0.4s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class UserLayoutComponent {}
