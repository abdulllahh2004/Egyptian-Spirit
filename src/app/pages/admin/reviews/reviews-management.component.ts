import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-reviews-management',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <section class="page">
      <div class="header">
        <div>
          <h2>Reviews Management</h2>
          <p>Approve, hide, or delete customer reviews.</p>
        </div>

        <a routerLink="/admin" class="back-btn">Dashboard</a>
      </div>

      @if (loading) {
        <div class="state">Loading reviews...</div>
      }

      @if (errorMessage) {
        <div class="error">{{ errorMessage }}</div>
      }

      <div class="stats">
        <div>
          <span>Total</span>
          <strong>{{ reviews.length }}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>{{ pendingCount }}</strong>
        </div>

        <div>
          <span>Approved</span>
          <strong>{{ approvedCount }}</strong>
        </div>
      </div>

      <div class="filters">
        <button [class.active]="filter === 'all'" (click)="filter = 'all'">All</button>
        <button [class.active]="filter === 'pending'" (click)="filter = 'pending'">Pending</button>
        <button [class.active]="filter === 'approved'" (click)="filter = 'approved'">Approved</button>
      </div>

      <div class="cards">
        @for (review of filteredReviews; track review.id) {
          <article class="review-card">
            <div class="card-head">
              <div class="person">
                <img [src]="review.image_url || 'assets/logo-symbol.png'" [alt]="review.name || 'Review'" />

                <div>
                  <h3>{{ review.name || 'Unknown Guest' }}</h3>
                  <p>{{ review.country || '-' }}</p>
                </div>
              </div>

              <span class="badge" [class.approved]="review.is_approved" [class.pending]="!review.is_approved">
                {{ review.is_approved ? 'Approved' : 'Pending' }}
              </span>
            </div>

            <div class="rating">
              @for (star of stars; track $index) {
                <i
                  class="fa-solid fa-star"
                  [class.empty]="($index + 1) > (review.rating || 0)"
                ></i>
              }

              <span>{{ review.rating || 0 }}/5</span>
            </div>

            <p class="comment">{{ review.comment || '-' }}</p>

            <div class="meta">
              Created: {{ review.created_at ? (review.created_at | date:'medium') : '-' }}
            </div>

            <div class="actions">
              <button class="approve" (click)="toggleApproval(review)">
                {{ review.is_approved ? 'Hide' : 'Approve' }}
              </button>

              <button class="delete" (click)="remove(review.id)">
                Delete
              </button>
            </div>
          </article>
        } @empty {
          <div class="empty-card">No reviews found.</div>
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
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 18px;
  }

  .stats div,
  .review-card,
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

  .review-card {
    padding: 20px;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 14px;
  }

  .person {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .person img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    object-fit: cover;
    background: #0d1b2a;
    border: 1px solid rgba(198,168,92,0.24);
  }

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 900;
  }

  .person p {
    margin: 5px 0 0;
    color: #667085;
  }

  .badge {
    display: inline-flex;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .badge.pending {
    background: #fef3c7;
    color: #92400e;
  }

  .badge.approved {
    background: #dcfce7;
    color: #166534;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
    color: #c6a85c;
  }

  .rating .empty {
    color: #d1d5db;
  }

  .rating span {
    margin-left: 8px;
    color: #667085;
    font-weight: 800;
    font-size: 13px;
  }

  .comment {
    background: #f8f6f1;
    border: 1px solid rgba(198,168,92,0.16);
    border-radius: 16px;
    padding: 14px;
    color: #374151;
    line-height: 1.7;
    min-height: 84px;
    margin: 0 0 12px;
  }

  .meta {
    color: #667085;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 14px;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .actions button {
    border: 0;
    padding: 9px 12px;
    font-size: 12px;
    font-weight: 900;
    cursor: pointer;
    color: #fff;
    border-radius: 999px;
    transition: 0.2s ease;
  }

  .actions button:hover {
    transform: translateY(-2px);
  }

  .approve {
    background: #16a34a;
  }

  .delete {
    background: #ef4444;
  }

  .empty-card {
    grid-column: 1 / -1;
    padding: 24px;
    text-align: center;
    color: #667085;
    font-weight: 800;
  }

  @media (max-width: 992px) {
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

    .stats {
      grid-template-columns: 1fr;
    }

    .card-head {
      flex-direction: column;
    }

    .actions button {
      width: 100%;
    }
  }
`],
})
export class ReviewsManagementComponent implements OnInit {
  reviews: any[] = [];
  loading = false;
  errorMessage = '';
  filter: 'all' | 'pending' | 'approved' = 'all';
  stars = [1, 2, 3, 4, 5];

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  get pendingCount() {
    return this.reviews.filter((review) => !review.is_approved).length;
  }

  get approvedCount() {
    return this.reviews.filter((review) => review.is_approved).length;
  }

  get filteredReviews() {
    if (this.filter === 'pending') {
      return this.reviews.filter((review) => !review.is_approved);
    }

    if (this.filter === 'approved') {
      return this.reviews.filter((review) => review.is_approved);
    }

    return this.reviews;
  }

  async ngOnInit() {
    await this.loadReviews();
  }

  async loadReviews() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const { data, error } = await this.supabaseService.getAllReviews();

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
      this.reviews = [];
      this.cdr.detectChanges();
      return;
    }

    this.reviews = data || [];
    this.cdr.detectChanges();
  }

  async toggleApproval(review: any) {
    const { error } = await this.supabaseService.toggleReviewApproval(
      review.id,
      review.is_approved
    );

    if (error) {
      alert(error.message);
      return;
    }

    await this.loadReviews();
  }

  async remove(id: number) {
    if (!confirm('Delete this review?')) return;

    const { error } = await this.supabaseService.deleteReview(id);

    if (error) {
      alert(error.message);
      return;
    }

    await this.loadReviews();
  }
}
