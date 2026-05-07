import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <section class="admin-dashboard">
      <div class="page-head">
        <div>
          <p class="eyebrow">Admin Overview</p>
          <h1>Dashboard</h1>
          <span>Monitor bookings, custom requests, reviews, and messages.</span>
        </div>

        <div class="quick-actions">
          <a routerLink="/" class="home-action">Home Page</a>
          <a routerLink="/admin/trips/new">+ Add Trip</a>
          <a routerLink="/admin/bookings">Bookings</a>
        </div>
      </div>

      @if (loading) {
        <div class="state">Loading dashboard data...</div>
      }

      @if (errorMessage) {
        <div class="error">{{ errorMessage }}</div>
      }

      <div class="stats-grid">
        <a routerLink="/admin/bookings" class="stat-card danger">
          <p>Pending Bookings</p>
          <h2>{{ stats.pendingBookings }}</h2>
        </a>

        <a routerLink="/admin/custom-trips" class="stat-card warning">
          <p>New Custom Trips</p>
          <h2>{{ stats.newCustomTrips }}</h2>
        </a>

        <a routerLink="/admin/messages" class="stat-card info">
          <p>New Messages</p>
          <h2>{{ stats.newMessages }}</h2>
        </a>

        <a routerLink="/admin/reviews" class="stat-card success">
          <p>Pending Reviews</p>
          <h2>{{ stats.pendingReviews }}</h2>
        </a>
      </div>

      <div class="content-grid">
        <div class="panel">
          <div class="panel-head">
            <h3>Latest Bookings</h3>
            <a routerLink="/admin/bookings">View all</a>
          </div>

          @if (latestBookings.length) {
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Trip</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  @for (booking of latestBookings; track booking.id) {
                    <tr>
                      <td>
                        <strong>{{ booking.name || '-' }}</strong>
                        <small>{{ booking.email || '-' }}</small>
                      </td>

                      <td>{{ booking.trips?.title || '-' }}</td>
                      <td>{{ booking.travel_date || '-' }}</td>

                      <td>
                        <span class="badge" [ngClass]="booking.status || 'pending'">
                          {{ booking.status || 'pending' }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="empty">No bookings yet.</p>
          }
        </div>

        <div class="panel">
          <div class="panel-head">
            <h3>Custom Trip Requests</h3>
            <a routerLink="/admin/custom-trips">View all</a>
          </div>

          <div class="request-list">
            @for (item of latestCustomTrips; track item.id) {
              <div class="request-card">
                <div>
                  <strong>{{ item.name || 'Unknown Client' }}</strong>
                  <small>{{ item.country || '-' }} · Budget: {{ item.budget || '-' }}</small>
                </div>
                <span class="badge new">{{ item.status || 'new' }}</span>
              </div>
            } @empty {
              <p class="empty">No custom requests.</p>
            }
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <h3>Pending Reviews</h3>
            <a routerLink="/admin/reviews">View all</a>
          </div>

          <div class="request-list">
            @for (review of pendingReviews; track review.id) {
              <div class="review-card">
                <div>
                  <strong>{{ review.name || '-' }}</strong>
                  <small>{{ review.country || '-' }} · Rating: {{ review.rating }}/5</small>
                </div>
                <p>{{ review.comment }}</p>
              </div>
            } @empty {
              <p class="empty">No pending reviews.</p>
            }
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <h3>Latest Messages</h3>
            <a routerLink="/admin/messages">View all</a>
          </div>

          <div class="request-list">
            @for (msg of latestMessages; track msg.id) {
              <div class="request-card">
                <div>
                  <strong>{{ msg.name || '-' }}</strong>
                  <small>{{ msg.email || '-' }}</small>
                </div>
                <span class="badge new">{{ msg.status || 'new' }}</span>
              </div>
            } @empty {
              <p class="empty">No messages yet.</p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .admin-dashboard {
        padding: 8px;
        color: #0d1b2a;
      }

      .page-head {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: center;
        margin-bottom: 24px;
      }

      .eyebrow {
        margin: 0 0 6px;
        color: #c6a85c;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.2px;
      }

      h1 {
        margin: 0;
        font-family: 'Cinzel', serif;
        font-size: clamp(32px, 4vw, 42px);
        font-weight: 900;
      }

      .page-head span {
        display: block;
        color: #667085;
        margin-top: 6px;
      }

      .quick-actions {
        display: flex;
        gap: 10px;
      }

      .quick-actions a {
        text-decoration: none;
        background: #0d1b2a;
        color: #fff;
        padding: 12px 18px;
        border-radius: 999px;
        font-weight: 900;
        transition: 0.2s ease;
      }

      .quick-actions a:first-child {
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
      }

      .quick-actions a:hover {
        transform: translateY(-2px);
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

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 18px;
      }

      .stat-card,
      .panel {
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 22px;
        box-shadow: 0 18px 45px rgba(13, 27, 42, 0.08);
      }

      .stat-card {
        display: block;
        text-decoration: none;
        color: #0d1b2a;
        padding: 22px;
        border-top: 5px solid #0d1b2a;
        transition: 0.2s ease;
      }

      .stat-card:hover {
        transform: translateY(-4px);
      }

      .stat-card p {
        margin: 0 0 10px;
        color: #667085;
        font-weight: 800;
      }

      .stat-card h2 {
        margin: 0;
        font-size: 36px;
        font-weight: 900;
      }

      .danger {
        border-top-color: #ef4444;
      }
      .warning {
        border-top-color: #f59e0b;
      }
      .info {
        border-top-color: #2563eb;
      }
      .success {
        border-top-color: #16a34a;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        gap: 18px;
      }

      .panel {
        padding: 20px;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        gap: 12px;
      }

      .panel-head h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 900;
      }

      .panel-head a {
        color: #c6a85c;
        font-weight: 900;
        text-decoration: none;
        font-size: 13px;
        white-space: nowrap;
      }

      .table-wrap {
        overflow-x: auto;
      }

      table {
        width: 100%;
        min-width: 520px;
        border-collapse: collapse;
      }

      th {
        text-align: left;
        font-size: 12px;
        text-transform: uppercase;
        color: #667085;
        padding: 12px;
        border-bottom: 1px solid rgba(198, 168, 92, 0.18);
      }

      td {
        padding: 14px 12px;
        border-bottom: 1px solid rgba(198, 168, 92, 0.12);
        vertical-align: top;
      }

      td strong,
      td small {
        display: block;
      }

      td small {
        color: #667085;
        margin-top: 4px;
      }

      .request-list {
        display: grid;
        gap: 12px;
      }

      .request-card,
      .review-card,
      .empty {
        border: 1px solid rgba(198, 168, 92, 0.18);
        background: #f8f6f1;
        padding: 14px;
        border-radius: 16px;
      }

      .request-card {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
      }

      .request-card strong,
      .request-card small,
      .review-card strong,
      .review-card small {
        display: block;
      }

      .request-card small,
      .review-card small {
        color: #667085;
        margin-top: 4px;
      }

      .review-card p {
        margin: 10px 0 0;
        color: #374151;
        line-height: 1.6;
      }

      .badge {
        display: inline-flex;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        white-space: nowrap;
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

      .badge.new {
        background: #dbeafe;
        color: #1e40af;
      }

      .empty {
        color: #667085;
        margin: 0;
      }

      .quick-actions a.home-action {
        background: #ffffff;
        color: #0d1b2a;
        border: 1px solid rgba(198, 168, 92, 0.35);
      }

      .quick-actions a.home-action:hover {
        background: #ead7b5;
        color: #0d1b2a;
      }

      @media (max-width: 1200px) {
        .stats-grid,
        .content-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 768px) {
        .admin-dashboard {
          padding: 0;
        }

        .page-head {
          flex-direction: column;
          align-items: flex-start;
        }

        .stats-grid,
        .content-grid {
          grid-template-columns: 1fr;
        }

        .quick-actions {
          width: 100%;
          flex-direction: column;
        }

        .quick-actions a {
          text-align: center;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';

  stats = {
    pendingBookings: 0,
    newCustomTrips: 0,
    newMessages: 0,
    pendingReviews: 0,
  };

  latestBookings: any[] = [];
  latestCustomTrips: any[] = [];
  pendingReviews: any[] = [];
  latestMessages: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    await this.loadDashboard();
  }

  async loadDashboard() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    await Promise.all([
      this.loadStats(),
      this.loadLatestBookings(),
      this.loadLatestCustomTrips(),
      this.loadPendingReviews(),
      this.loadLatestMessages(),
    ]);

    this.loading = false;
    this.cdr.detectChanges();
  }

  async loadStats() {
    this.stats.pendingBookings = await this.supabaseService.countRowsWhere(
      'bookings',
      'status',
      'pending',
    );
    this.stats.newCustomTrips = await this.supabaseService.countRowsWhere(
      'custom_trips',
      'status',
      'new',
    );
    this.stats.newMessages = await this.supabaseService.countRowsWhere('messages', 'status', 'new');
    this.stats.pendingReviews = await this.supabaseService.countRowsWhere(
      'reviews',
      'is_approved',
      false,
    );
  }

  async loadLatestBookings() {
    const { data, error } = await this.supabaseService.getLatestBookings(5);

    if (error) {
      console.error('Latest bookings error:', error.message);
      return;
    }

    this.latestBookings = data || [];
  }

  async loadLatestCustomTrips() {
    const { data, error } = await this.supabaseService.supabase
      .from('custom_trips')
      .select('id, name, country, budget, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error) this.latestCustomTrips = data || [];
  }

  async loadPendingReviews() {
    const { data, error } = await this.supabaseService.supabase
      .from('reviews')
      .select('id, name, country, rating, comment, created_at')
      .eq('is_approved', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error) this.pendingReviews = data || [];
  }

  async loadLatestMessages() {
    const { data, error } = await this.supabaseService.supabase
      .from('messages')
      .select('id, name, email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error) this.latestMessages = data || [];
  }
}
