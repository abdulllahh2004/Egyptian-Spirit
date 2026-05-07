import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-trips-management',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  template: `
    <section class="page">
      <div class="header">
        <div>
          <h2>Trips Management</h2>
          <p>Manage all trips shown on the website.</p>
        </div>

        <a routerLink="/admin/trips/new" class="btn-add">+ Add Trip</a>
      </div>

      @if (loading) {
        <div class="state">Loading trips...</div>
      }

      @if (errorMessage) {
        <div class="error">{{ errorMessage }}</div>
      }

      <div class="table-card desktop-view">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Trip</th>
                <th>Price</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              @for (trip of trips; track trip.id) {
                <tr>
                  <td>
                    <div class="trip-info">
                      <img [src]="trip.image_url || 'assets/logo-symbol.png'" [alt]="trip.title || 'Trip'" />

                      <div>
                        <strong>{{ trip.title || '-' }}</strong>
                        <small>{{ trip.destination || trip.location || '-' }}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{{ trip.price ? (trip.price | currency:'USD':'symbol':'1.0-0') : '-' }}</strong>
                  </td>

                  <td>
                    <span class="badge" [class.active]="trip.is_active" [class.inactive]="!trip.is_active">
                      {{ trip.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>

                  <td>
                    <span class="badge" [class.featured]="trip.is_featured">
                      {{ trip.is_featured ? 'Featured' : 'Normal' }}
                    </span>
                  </td>

                  <td>{{ trip.created_at ? (trip.created_at | date:'mediumDate') : '-' }}</td>

                  <td>
                    <div class="actions">
                      <a class="btn-edit" [routerLink]="['/admin/trips/edit', trip.id]">
                        Edit
                      </a>

                      <button class="btn-action" (click)="toggle(trip)">
                        {{ trip.is_active ? 'Deactivate' : 'Activate' }}
                      </button>

                      <button class="btn-delete" (click)="remove(trip.id)">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="empty">No trips found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="mobile-view">
        @for (trip of trips; track trip.id) {
          <article class="trip-card">
            <div class="card-top">
              <img [src]="trip.image_url || 'assets/logo-symbol.png'" [alt]="trip.title || 'Trip'" />

              <div>
                <h3>{{ trip.title || '-' }}</h3>
                <p>{{ trip.destination || trip.location || '-' }}</p>
              </div>
            </div>

            <div class="card-meta">
              <div>
                <span>Price</span>
                <strong>{{ trip.price ? (trip.price | currency:'USD':'symbol':'1.0-0') : '-' }}</strong>
              </div>

              <div>
                <span>Created</span>
                <strong>{{ trip.created_at ? (trip.created_at | date:'mediumDate') : '-' }}</strong>
              </div>
            </div>

            <div class="card-badges">
              <span class="badge" [class.active]="trip.is_active" [class.inactive]="!trip.is_active">
                {{ trip.is_active ? 'Active' : 'Inactive' }}
              </span>

              <span class="badge" [class.featured]="trip.is_featured">
                {{ trip.is_featured ? 'Featured' : 'Normal' }}
              </span>
            </div>

            <div class="card-actions">
              <a class="btn-edit" [routerLink]="['/admin/trips/edit', trip.id]">
                Edit
              </a>

              <button class="btn-action" (click)="toggle(trip)">
                {{ trip.is_active ? 'Deactivate' : 'Activate' }}
              </button>

              <button class="btn-delete" (click)="remove(trip.id)">
                Delete
              </button>
            </div>
          </article>
        } @empty {
          <div class="empty-card">No trips found.</div>
        }
      </div>
    </section>
  `,
  styles: [`
    .page {
      padding: 24px;
      color: #0d1b2a;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }

    h2 {
      margin: 0;
      font-family: 'Cinzel', serif;
      font-size: clamp(28px, 4vw, 38px);
      font-weight: 900;
      color: #0d1b2a;
    }

    .header p {
      margin: 8px 0 0;
      color: #667085;
    }

    .btn-add {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #c6a85c, #ead7b5);
      color: #0d1b2a;
      text-decoration: none;
      font-weight: 900;
      padding: 14px 22px;
      min-height: 50px;
      border-radius: 999px;
      white-space: nowrap;
      transition: 0.25s ease;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      background: #0d1b2a;
      color: #fff;
    }

    .state,
    .error {
      margin-bottom: 16px;
      padding: 14px 16px;
      border-radius: 16px;
      font-weight: 800;
    }

    .state {
      background: #ead7b5;
      color: #0d1b2a;
    }

    .error {
      background: #fee2e2;
      color: #991b1b;
    }

    .table-card,
    .trip-card,
    .empty-card {
      background: rgba(255,255,255,0.94);
      border: 1px solid rgba(198,168,92,0.24);
      border-radius: 22px;
      box-shadow: 0 18px 45px rgba(13,27,42,0.08);
    }

    .table-card {
      overflow: hidden;
    }

    .table-wrap {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      min-width: 1080px;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 16px;
      border-bottom: 1px solid rgba(198,168,92,0.16);
      text-align: left;
      vertical-align: middle;
    }

    th {
      background: #fbfaf7;
      color: #667085;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 900;
      letter-spacing: 0.6px;
    }

    tbody tr:hover {
      background: #fbfaf7;
    }

    .trip-info {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 260px;
    }

    .trip-info img {
      width: 58px;
      height: 58px;
      object-fit: cover;
      border-radius: 16px;
      background: #0d1b2a;
      border: 1px solid rgba(198,168,92,0.24);
      flex-shrink: 0;
    }

    .trip-info strong,
    .trip-info small {
      display: block;
    }

    .trip-info strong {
      max-width: 260px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 900;
    }

    .trip-info small {
      color: #667085;
      margin-top: 4px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 7px 11px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 900;
      background: #eef2f7;
      color: #4b5563;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .badge.active {
      background: #dcfce7;
      color: #166534;
    }

    .badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge.featured {
      background: #fef3c7;
      color: #92400e;
    }

    .actions,
    .card-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .btn-edit,
    .btn-action,
    .btn-delete {
      border: 0;
      border-radius: 999px;
      padding: 9px 12px;
      font-weight: 900;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
      transition: 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 36px;
    }

    .btn-edit:hover,
    .btn-action:hover,
    .btn-delete:hover {
      transform: translateY(-2px);
    }

    .btn-edit {
      background: #c6a85c;
      color: #0d1b2a;
    }

    .btn-action {
      background: #0d1b2a;
      color: #fff;
    }

    .btn-delete {
      background: #ef4444;
      color: #fff;
    }

    .empty {
      text-align: center;
      padding: 36px;
      color: #667085;
      font-weight: 800;
    }

    .mobile-view {
      display: none;
    }

    .trip-card {
      padding: 14px;
    }

    .card-top {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .card-top img {
      width: 70px;
      height: 70px;
      object-fit: cover;
      border-radius: 16px;
      background: #0d1b2a;
      flex-shrink: 0;
    }

    .card-top h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 900;
      line-height: 1.3;
    }

    .card-top p {
      margin: 5px 0 0;
      color: #667085;
      font-size: 13px;
    }

    .card-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 14px 0;
    }

    .card-meta div {
      background: #f8f6f1;
      border: 1px solid rgba(198,168,92,0.16);
      border-radius: 14px;
      padding: 10px;
    }

    .card-meta span,
    .card-meta strong {
      display: block;
    }

    .card-meta span {
      color: #667085;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .card-meta strong {
      font-size: 13px;
    }

    .card-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    .card-actions {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    .card-actions a,
    .card-actions button {
      width: 100%;
      min-height: 40px;
    }

    .empty-card {
      padding: 24px;
      text-align: center;
      color: #667085;
      font-weight: 800;
    }

    @media (max-width: 992px) {
      .page {
        padding: 18px;
      }
    }

    @media (max-width: 768px) {
      .page {
        padding: 14px;
      }

      .header {
        flex-direction: column;
      }

      .btn-add {
        width: 100%;
      }

      .desktop-view {
        display: none;
      }

      .mobile-view {
        display: grid;
        gap: 14px;
      }
    }

    @media (max-width: 480px) {
      .page {
        padding: 12px;
      }

      .card-top {
        align-items: flex-start;
      }

      .card-top img {
        width: 62px;
        height: 62px;
      }

      .card-meta,
      .card-actions {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class TripsManagementComponent implements OnInit {
  trips: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadTrips();
  }

  async loadTrips() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const { data, error } = await this.supabaseService.getAllTrips();

    if (error) {
      this.errorMessage = error.message;
      this.trips = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.trips = data || [];
    this.loading = false;
    this.cdr.detectChanges();
  }

  async toggle(trip: any) {
    const { error } = await this.supabaseService.toggleTripStatus(trip.id, trip.is_active);

    if (error) {
      alert(error.message);
      return;
    }

    trip.is_active = !trip.is_active;
  }

  async remove(id: string) {
    if (!confirm('Delete this trip?')) return;

    const { error } = await this.supabaseService.deleteTrip(id);

    if (error) {
      alert(error.message);
      return;
    }

    this.trips = this.trips.filter((trip) => trip.id !== id);
  }
}
