import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

type MessageStatus = 'new' | 'read' | 'archived';

@Component({
  selector: 'app-messages-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  template: `
    <section class="page">
      <div class="header">
        <div>
          <h2>Messages</h2>
          <p>Manage contact messages submitted by website visitors.</p>
        </div>

        <a routerLink="/admin" class="back-btn">Dashboard</a>
      </div>

      @if (loading) {
        <div class="state">Loading messages...</div>
      }

      @if (errorMessage) {
        <div class="error">{{ errorMessage }}</div>
      }

      <div class="stats">
        <div>
          <span>Total</span>
          <strong>{{ messages.length }}</strong>
        </div>

        <div>
          <span>New</span>
          <strong>{{ countByStatus('new') }}</strong>
        </div>

        <div>
          <span>Read</span>
          <strong>{{ countByStatus('read') }}</strong>
        </div>

        <div>
          <span>Archived</span>
          <strong>{{ countByStatus('archived') }}</strong>
        </div>
      </div>

      <div class="filters">
        <button type="button" [class.active]="filter === 'all'" (click)="setFilter('all')">All</button>
        <button type="button" [class.active]="filter === 'new'" (click)="setFilter('new')">New</button>
        <button type="button" [class.active]="filter === 'read'" (click)="setFilter('read')">Read</button>
        <button type="button" [class.active]="filter === 'archived'" (click)="setFilter('archived')">Archived</button>
      </div>

      <div class="cards">
        @if (!loading && displayMessages.length === 0) {
          <div class="empty-card">No messages found.</div>
        }

        @for (msg of displayMessages; track msg.id) {
          <article class="message-card">
            <div class="card-head">
              <div>
                <h3>{{ msg.name || 'Unknown Sender' }}</h3>
                <p>{{ msg.email || '-' }} · {{ msg.phone || '-' }}</p>
              </div>

              <span class="badge" [ngClass]="msg.status || 'new'">
                {{ msg.status || 'new' }}
              </span>
            </div>

            <div class="message-body">
              <span>Message</span>
              <p>{{ msg.message || '-' }}</p>
            </div>

            <div class="admin-notes">
              <label>Admin Notes</label>
              <textarea [(ngModel)]="msg.admin_notes" placeholder="Write internal notes..."></textarea>

              <button type="button" class="save-notes" (click)="saveNotes(msg)">
                Save Notes
              </button>
            </div>

            <div class="actions">
              <button type="button" class="new" (click)="changeStatus(msg.id, 'new')">New</button>
              <button type="button" class="read" (click)="changeStatus(msg.id, 'read')">Read</button>
              <button type="button" class="archived" (click)="changeStatus(msg.id, 'archived')">Archive</button>
              <button type="button" class="delete" (click)="remove(msg.id)">Delete</button>
            </div>

            <small class="created">
              Created: {{ msg.created_at ? (msg.created_at | date:'medium') : '-' }}
            </small>
          </article>
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
      margin-bottom: 18px;
    }

    .stats div,
    .message-card,
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

    .filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }

    .filters button {
      border: 1px solid rgba(198,168,92,0.28);
      background: #fff;
      color: #0d1b2a;
      padding: 10px 15px;
      border-radius: 999px;
      font-weight: 900;
      cursor: pointer;
    }

    .filters button.active {
      background: linear-gradient(135deg, #c6a85c, #ead7b5);
      border-color: #c6a85c;
      color: #0d1b2a;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    .message-card {
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

    .badge.read {
      background: #dcfce7;
      color: #166534;
    }

    .badge.archived {
      background: #e5e7eb;
      color: #374151;
    }

    .message-body {
      background: #f8f6f1;
      border: 1px solid rgba(198,168,92,0.16);
      border-radius: 16px;
      padding: 14px;
      margin-bottom: 16px;
    }

    .message-body span,
    .admin-notes label {
      display: block;
      color: #667085;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .message-body p {
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

    .read {
      background: #16a34a;
    }

    .archived {
      background: #6b7280;
    }

    .delete {
      background: #ef4444;
    }

    .created {
      color: #667085;
      font-weight: 700;
    }

    .empty-card {
      grid-column: 1 / -1;
      padding: 24px;
      text-align: center;
      color: #667085;
      font-weight: 800;
    }

    @media (max-width: 992px) {
      .stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .cards {
        grid-template-columns: 1fr;
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
      .stats {
        grid-template-columns: 1fr;
      }

      .actions button,
      .save-notes {
        width: 100%;
      }
    }
  `],
})
export class MessagesManagementComponent implements OnInit {
  messages: any[] = [];
  displayMessages: any[] = [];
  loading = false;
  errorMessage = '';
  filter: 'all' | MessageStatus = 'all';

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    await this.loadMessages();
  }

  setFilter(value: 'all' | MessageStatus) {
    this.filter = value;
    this.applyFilter();
  }

  applyFilter() {
    if (this.filter === 'all') {
      this.displayMessages = [...this.messages];
    } else {
      this.displayMessages = this.messages.filter(
        (msg) => (msg.status || 'new') === this.filter
      );
    }

    this.cdr.detectChanges();
  }

  async loadMessages() {
    this.loading = true;
    this.errorMessage = '';
    this.messages = [];
    this.displayMessages = [];
    this.cdr.detectChanges();

    try {
      const response: any = await Promise.race([
        this.supabaseService.getAllMessages(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout. Supabase did not respond.')), 10000)
        ),
      ]);

      console.log('Messages response:', response);

      if (response?.error) {
        this.zone.run(() => {
          this.errorMessage = response.error.message || 'Failed to load messages.';
          this.messages = [];
          this.displayMessages = [];
          this.loading = false;
          this.cdr.detectChanges();
        });
        return;
      }

      this.zone.run(() => {
        this.messages = [...(response?.data || [])];
        this.loading = false;
        this.applyFilter();
        this.cdr.detectChanges();
      });
    } catch (err: any) {
      console.error('Messages error:', err);

      this.zone.run(() => {
        this.errorMessage = err?.message || 'Unexpected error while loading messages.';
        this.messages = [];
        this.displayMessages = [];
        this.loading = false;
        this.cdr.detectChanges();
      });
    }
  }

  countByStatus(status: MessageStatus) {
    return this.messages.filter((msg) => (msg.status || 'new') === status).length;
  }

  async changeStatus(id: number, status: MessageStatus) {
    try {
      const { error } = await this.supabaseService.updateMessageStatus(id, status);

      if (error) {
        alert(error.message);
        return;
      }

      const target = this.messages.find((msg) => msg.id === id);

      if (target) {
        target.status = status;
      }

      this.applyFilter();
    } catch (err: any) {
      alert(err?.message || 'Failed to update message status.');
    }
  }

  async saveNotes(msg: any) {
    try {
      const { error } = await this.supabaseService.updateMessageNotes(
        msg.id,
        msg.admin_notes || ''
      );

      if (error) {
        alert(error.message);
        return;
      }

      alert('Notes saved');
    } catch (err: any) {
      alert(err?.message || 'Failed to save notes.');
    }
  }

  async remove(id: number) {
    if (!confirm('Delete this message?')) return;

    try {
      const { error } = await this.supabaseService.deleteMessage(id);

      if (error) {
        alert(error.message);
        return;
      }

      this.messages = this.messages.filter((msg) => msg.id !== id);
      this.applyFilter();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete message.');
    }
  }
}
