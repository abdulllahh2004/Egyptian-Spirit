import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-bookings-management',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <section class="page">
      <div class="header">
        <div>
          <h2>Bookings Management</h2>
          <p>Review and manage all trip booking requests.</p>
        </div>

        <a routerLink="/admin" class="back-btn">Dashboard</a>
      </div>

      @if (loading) {
        <div class="state">Loading bookings...</div>
      }

      @if (errorMessage) {
        <div class="error">{{ errorMessage }}</div>
      }

      <div class="stats">
        <div>
          <span>Total</span>
          <strong>{{ bookings.length }}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>{{ countByStatus('pending') }}</strong>
        </div>

        <div>
          <span>Approved</span>
          <strong>{{ countByStatus('approved') }}</strong>
        </div>

        <div>
          <span>Rejected</span>
          <strong>{{ countByStatus('rejected') }}</strong>
        </div>
      </div>

      <div class="table-card desktop-view">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Trip</th>
                <th>Travel Date</th>
                <th>People</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              @for (booking of bookings; track booking.id) {
                <tr>
                  <td>
                    <div class="client">
                      <strong>{{ booking.name || '-' }}</strong>
                      <small>{{ booking.email || '-' }}</small>
                      <small>{{ booking.phone || '-' }}</small>
                    </div>
                  </td>

                  <td>
                    <strong>{{ booking.trips?.title || '-' }}</strong>
                    <small>{{ booking.country || '-' }}</small>
                  </td>

                  <td>{{ booking.travel_date || '-' }}</td>

                  <td>
                    {{ booking.adults || 0 }} Adults /
                    {{ booking.children || 0 }} Children
                  </td>

                  <td>
                    <span class="badge" [ngClass]="booking.status">
                      {{ booking.status || 'pending' }}
                    </span>
                  </td>

                  <td>{{ booking.created_at | date:'mediumDate' }}</td>

                  <td>
                    <div class="actions">
                      <button class="approve" (click)="changeStatus(booking.id, 'approved')">
                        Approve
                      </button>

                      <button class="reject" (click)="changeStatus(booking.id, 'rejected')">
                        Reject
                      </button>

                      <button class="delete" (click)="remove(booking.id)">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="empty">No bookings found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="mobile-view">
        @for (booking of bookings; track booking.id) {
          <article class="booking-card">
            <div class="card-head">
              <div>
                <h3>{{ booking.name || '-' }}</h3>
                <p>{{ booking.email || '-' }}</p>
              </div>

              <span class="badge" [ngClass]="booking.status">
                {{ booking.status || 'pending' }}
              </span>
            </div>

            <div class="card-info">
              <div>
                <span>Trip</span>
                <strong>{{ booking.trips?.title || '-' }}</strong>
              </div>

              <div>
                <span>Travel Date</span>
                <strong>{{ booking.travel_date || '-' }}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{{ booking.phone || '-' }}</strong>
              </div>

              <div>
                <span>People</span>
                <strong>{{ booking.adults || 0 }} Adults / {{ booking.children || 0 }} Children</strong>
              </div>
            </div>

            @if (booking.message) {
              <p class="message">{{ booking.message }}</p>
            }

            <div class="card-actions">
              <button class="approve" (click)="changeStatus(booking.id, 'approved')">Approve</button>
              <button class="reject" (click)="changeStatus(booking.id, 'rejected')">Reject</button>
              <button class="delete" (click)="remove(booking.id)">Delete</button>
            </div>
          </article>
        } @empty {
          <div class="empty-card">No bookings found.</div>
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

  .back-btn {
    background: #0d1b2a;
    color: #fff;
    text-decoration: none;
    padding: 13px 18px;
    border-radius: 999px;
    font-weight: 900;
    white-space: nowrap;
  }

  .back-btn:hover {
    background: #c6a85c;
    color: #0d1b2a;
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

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }

  .stats div,
  .table-card,
  .booking-card,
  .empty-card {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(198,168,92,0.24);
    border-radius: 22px;
    box-shadow: 0 18px 45px rgba(13,27,42,0.08);
  }

  .stats div {
    padding: 18px;
  }

  .stats span,
  .stats strong {
    display: block;
  }

  .stats span {
    color: #667085;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .stats strong {
    font-size: 30px;
    font-weight: 900;
    color: #0d1b2a;
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
    min-width: 1100px;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 16px;
    border-bottom: 1px solid rgba(198,168,92,0.16);
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #fbfaf7;
    color: #667085;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 0.6px;
  }

  .client strong,
  .client small,
  td small {
    display: block;
  }

  .client small,
  td small {
    color: #667085;
    margin-top: 4px;
  }

  .badge {
    display: inline-flex;
    padding: 7px 11px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    background: #fef3c7;
    color: #92400e;
  }

  .badge.approved {
    background: #dcfce7;
    color: #166534;
  }

  .badge.rejected {
    background: #fee2e2;
    color: #991b1b;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  button {
    border: 0;
    border-radius: 999px;
    padding: 9px 12px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    color: #fff;
    transition: 0.2s ease;
  }

  button:hover {
    transform: translateY(-2px);
  }

  .approve {
    background: #16a34a;
  }

  .reject {
    background: #f59e0b;
  }

  .delete {
    background: #ef4444;
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

  .booking-card {
    padding: 16px;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 14px;
  }

  .card-head h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 900;
  }

  .card-head p {
    margin: 5px 0 0;
    color: #667085;
    font-size: 13px;
  }

  .card-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }

  .card-info div {
    background: #f8f6f1;
    border-radius: 14px;
    padding: 10px;
  }

  .card-info span {
    display: block;
    color: #667085;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .card-info strong {
    font-size: 13px;
  }

  .message {
    background: #f8f6f1;
    padding: 12px;
    border-radius: 14px;
    color: #374151;
    line-height: 1.6;
  }

  .card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }

  .card-actions button {
    min-height: 40px;
  }

  .empty-card {
    padding: 24px;
    text-align: center;
    color: #667085;
    font-weight: 800;
  }

  @media (max-width: 992px) {
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .page {
      padding: 14px;
    }

    .header {
      flex-direction: column;
    }

    .back-btn {
      width: 100%;
      text-align: center;
    }

    .desktop-view {
      display: none;
    }

    .mobile-view {
      display: grid;
      gap: 14px;
    }

    .stats {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .stats,
    .card-info,
    .card-actions {
      grid-template-columns: 1fr;
    }
  }
`],
})
export class BookingsManagementComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadBookings();
  }

  async loadBookings() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const { data, error } = await this.supabaseService.getAllBookings();

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
      this.bookings = [];
      this.cdr.detectChanges();
      return;
    }

    this.bookings = data || [];
    this.cdr.detectChanges();
  }

  countByStatus(status: string) {
    return this.bookings.filter((booking) => booking.status === status).length;
  }

  async changeStatus(id: string, status: string) {
    const { error } = await this.supabaseService.updateBookingStatus(id, status);

    if (error) {
      alert(error.message);
      return;
    }

    await this.loadBookings();
  }

  async remove(id: string) {
    if (!confirm('Delete this booking?')) return;

    const { error } = await this.supabaseService.deleteBooking(id);

    if (error) {
      alert(error.message);
      return;
    }

    await this.loadBookings();
  }
}
