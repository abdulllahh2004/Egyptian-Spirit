import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h4>Egyptian Spirit</h4>

        <nav>
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="admin-link">
            Dashboard
          </a>

          <a routerLink="/admin/bookings" routerLinkActive="active" class="admin-link">
            Bookings
          </a>

          <a routerLink="/admin/custom-trips" routerLinkActive="active" class="admin-link">
            Custom Trips
          </a>

          <a routerLink="/admin/messages" routerLinkActive="active" class="admin-link">
            Messages
          </a>

          <a routerLink="/admin/reviews" routerLinkActive="active" class="admin-link">
            Reviews
          </a>

          <a routerLink="/admin/trips" routerLinkActive="active" class="admin-link">
            Trips
          </a>

          <a routerLink="/admin/gallery" routerLinkActive="active" class="admin-link">
            Gallery
          </a>
        </nav>
      </aside>

      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
 styles: [`
  .admin-layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    min-height: 100vh;
    background: #f8f6f1;
  }

  .admin-sidebar {
    background:
      radial-gradient(circle at top left, rgba(198, 168, 92, 0.16), transparent 34%),
      #0d1b2a;
    color: #f8f6f1;
    padding: 28px 22px;
    position: sticky;
    top: 0;
    height: 100vh;
    border-right: 1px solid rgba(198, 168, 92, 0.28);
  }

  h4 {
    margin: 0 0 28px;
    font-family: 'Cinzel', serif;
    font-size: 22px;
    font-weight: 900;
    color: #f8f6f1;
    letter-spacing: 0.06em;
  }

  h4::after {
    content: '';
    display: block;
    width: 56px;
    height: 2px;
    background: #c6a85c;
    margin-top: 12px;
  }

  nav {
    display: grid;
    gap: 9px;
  }

  .admin-link {
    color: #ead7b5;
    text-decoration: none;
    padding: 13px 15px;
    border-radius: 16px;
    transition: 0.25s ease;
    font-weight: 800;
    border: 1px solid transparent;
  }

  .admin-link:hover,
  .admin-link.active {
    background: rgba(198, 168, 92, 0.14);
    border-color: rgba(198, 168, 92, 0.32);
    color: #c6a85c;
  }

  .admin-content {
    min-width: 0;
    padding: 30px;
    background:
      radial-gradient(circle at top right, rgba(198, 168, 92, 0.1), transparent 30%),
      #f8f6f1;
  }

  @media (max-width: 768px) {
    .admin-layout {
      grid-template-columns: 1fr;
    }

    .admin-sidebar {
      position: static;
      height: auto;
      padding: 18px;
    }

    h4 {
      margin-bottom: 16px;
      font-size: 19px;
    }

    nav {
      grid-template-columns: repeat(2, 1fr);
    }

    .admin-link {
      text-align: center;
      padding: 12px 10px;
      font-size: 13px;
    }

    .admin-content {
      padding: 16px;
    }
  }

  @media (max-width: 420px) {
    nav {
      grid-template-columns: 1fr;
    }
  }
`],
})
export class AdminLayoutComponent {}
