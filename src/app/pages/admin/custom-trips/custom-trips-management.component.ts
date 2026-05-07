import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-custom-trips-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  template: `
    <section class="page">
      <div class="header">
        <div>
          <h2>Custom Trips</h2>
          <p>Manage custom journey requests submitted by visitors.</p>
        </div>

        <a routerLink="/admin" class="back-btn">Dashboard</a>
      </div>

      @if (loading) {
        <div class="state">Loading custom trips...</div>
      }

      @if (errorMessage) {
        <div class="error">{{ errorMessage }}</div>
      }

      <div class="stats">
        <div>
          <span>Total</span>
          <strong>{{ requests.length }}</strong>
        </div>

        <div>
          <span>New</span>
          <strong>{{ countByStatus('new') }}</strong>
        </div>

        <div>
          <span>Contacted</span>
          <strong>{{ countByStatus('contacted') }}</strong>
        </div>

        <div>
          <span>Closed</span>
          <strong>{{ countByStatus('closed') }}</strong>
        </div>
      </div>

      <div class="cards">
        @for (item of requests; track item.id) {
          <article class="request-card">
            <div class="card-head">
              <div>
                <h3>{{ item.name || 'Unknown Client' }}</h3>
                <p>{{ item.email || '-' }} · {{ item.phone || '-' }}</p>
              </div>

              <span class="badge" [ngClass]="item.status || 'new'">
                {{ item.status || 'new' }}
              </span>
            </div>

            <div class="info-grid">
              <div>
                <span>Title</span>
                <strong>{{ item.title || '-' }}</strong>
              </div>

              <div>
                <span>Country</span>
                <strong>{{ item.country || '-' }}</strong>
              </div>

              <div>
                <span>Departure</span>
                <strong>{{ item.departure_date || '-' }}</strong>
              </div>

              <div>
                <span>Arrival</span>
                <strong>{{ item.arrival_date || '-' }}</strong>
              </div>

              <div>
                <span>Adults</span>
                <strong>{{ item.adults || 0 }}</strong>
              </div>

              <div>
                <span>Children</span>
                <strong>
                  {{ item.children_under_6 || 0 }} under 6 /
                  {{ item.children_under_12 || 0 }} under 12
                </strong>
              </div>

              <div>
                <span>Infants</span>
                <strong>{{ item.infants || 0 }}</strong>
              </div>

              <div>
                <span>Budget</span>
                <strong>{{ item.budget || '-' }}</strong>
              </div>
            </div>

            @if (item.notes) {
              <div class="notes">
                <span>Client Notes</span>
                <p>{{ item.notes }}</p>
              </div>
            }

            <div class="admin-notes">
              <label>Admin Notes</label>
              <textarea [(ngModel)]="item.admin_notes" placeholder="Write internal notes..."></textarea>

              <button type="button" class="save-notes" (click)="saveNotes(item)">
                Save Notes
              </button>
            </div>

            <div class="actions">
              <button class="new" (click)="changeStatus(item.id, 'new')">New</button>
              <button class="contacted" (click)="changeStatus(item.id, 'contacted')">Contacted</button>
              <button class="closed" (click)="changeStatus(item.id, 'closed')">Closed</button>
              <button class="delete" (click)="remove(item.id)">Delete</button>
            </div>

            <small class="created">
              Created: {{ item.created_at ? (item.created_at | date:'medium') : '-' }}
            </small>
          </article>
        } @empty {
          <div class="empty-card">No custom trip requests found.</div>
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
    font-weight: 900;
    white-space: nowrap;
    border-radius: 999px;
  }

  .back-btn:hover,
  .save-notes:hover {
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
  .request-card,
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

  .cards {
    display: grid;
    gap: 18px;
  }

  .request-card {
    padding: 20px;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .card-head h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 900;
  }

  .card-head p {
    margin: 6px 0 0;
    color: #667085;
  }

  .badge {
    display: inline-flex;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    background: #dbeafe;
    color: #1e40af;
    white-space: nowrap;
  }

  .badge.contacted {
    background: #fef3c7;
    color: #92400e;
  }

  .badge.closed {
    background: #dcfce7;
    color: #166534;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }

  .info-grid div,
  .notes {
    background: #f8f6f1;
    border: 1px solid rgba(198,168,92,0.16);
    border-radius: 14px;
    padding: 12px;
  }

  .info-grid span,
  .notes span,
  .admin-notes label {
    display: block;
    color: #667085;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .info-grid strong {
    font-size: 13px;
    color: #0d1b2a;
  }

  .notes {
    margin-bottom: 16px;
  }

  .notes p {
    margin: 0;
    color: #374151;
    line-height: 1.7;
  }

  .admin-notes {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
  }

  textarea {
    width: 100%;
    min-height: 90px;
    resize: vertical;
    border: 1px solid rgba(198,168,92,0.24);
    border-radius: 16px;
    padding: 12px 14px;
    outline: none;
    background: #fff;
    color: #0d1b2a;
  }

  textarea:focus {
    border-color: #c6a85c;
    box-shadow: 0 0 0 4px rgba(198,168,92,0.16);
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  button {
    border: 0;
    padding: 9px 12px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    color: #fff;
    border-radius: 999px;
    transition: 0.2s ease;
  }

  button:hover {
    transform: translateY(-2px);
  }

  .save-notes {
    background: #0d1b2a;
    justify-self: start;
  }

  .new {
    background: #2563eb;
  }

  .contacted {
    background: #f59e0b;
  }

  .closed {
    background: #16a34a;
  }

  .delete {
    background: #ef4444;
  }

  .created {
    color: #667085;
    font-weight: 700;
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

    .info-grid {
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

    .card-head {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .stats,
    .info-grid {
      grid-template-columns: 1fr;
    }

    .actions button,
    .save-notes {
      width: 100%;
    }
  }
`],
})
export class CustomTripsManagementComponent implements OnInit {
  requests: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadRequests();
  }

  async loadRequests() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const { data, error } = await this.supabaseService.getAllCustomTrips();

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
      this.requests = [];
      this.cdr.detectChanges();
      return;
    }

    this.requests = data || [];
    this.cdr.detectChanges();
  }

  countByStatus(status: string) {
    return this.requests.filter((item) => item.status === status).length;
  }

  async changeStatus(id: number, status: string) {
    const { error } = await this.supabaseService.updateCustomTripStatus(id, status);

    if (error) {
      alert(error.message);
      return;
    }

    await this.loadRequests();
  }

  async saveNotes(item: any) {
    const { error } = await this.supabaseService.updateCustomTripNotes(
      item.id,
      item.admin_notes || ''
    );

    if (error) {
      alert(error.message);
      return;
    }

    alert('Notes saved');
  }

  async remove(id: number) {
    if (!confirm('Delete this custom trip request?')) return;

    const { error } = await this.supabaseService.deleteCustomTrip(id);

    if (error) {
      alert(error.message);
      return;
    }

    await this.loadRequests();
  }
}
