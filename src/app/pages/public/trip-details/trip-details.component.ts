import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe, TranslateModule],
  template: `
    @if (loading) {
      <section class="state">{{ 'TRIP.LOADING' | translate }}</section>
    }

    @if (notFound) {
      <section class="state error">{{ 'TRIP.NOT_FOUND' | translate }}</section>
    }

    @if (!loading && trip) {
      <section class="trip-page">
        <header
          class="hero"
          [style.background-image]="'url(' + (trip.image_url || 'assets/logo-symbol.png') + ')'"
        >
          <div class="hero-overlay"></div>

          <div class="hero-content">
            <a routerLink="/trips" class="back-link">
              {{ 'TRIP.BACK_TO_TRIPS' | translate }}
            </a>

            <span class="category">
              {{ trip.category || trip.destination || ('TRIP.DEFAULT_CATEGORY' | translate) }}
            </span>

            <h1>{{ trip.title }}</h1>

            <p>{{ trip.description || ('TRIP.NO_DESCRIPTION' | translate) }}</p>

            <div class="hero-meta">
              <span>
                <i class="fa-solid fa-location-dot"></i>
                {{ trip.location || trip.destination || ('TRIP.EGYPT' | translate) }}
              </span>

              <span>
                <i class="fa-solid fa-clock"></i>
                {{ trip.duration || ('TRIP.FLEXIBLE_DURATION' | translate) }}
              </span>

              <span>
                <i class="fa-solid fa-users"></i>
                {{ 'TRIP.MAX_PEOPLE' | translate }} {{ trip.max_people || '-' }}
              </span>
            </div>
          </div>
        </header>

        <main class="content">
          <section class="main-column">
            <div class="section-card overview">
              <span class="eyebrow">{{ 'TRIP.OVERVIEW_LABEL' | translate }}</span>
              <h2>{{ 'TRIP.ABOUT' | translate }}</h2>
              <p>{{ trip.description || ('TRIP.NO_DESCRIPTION' | translate) }}</p>
            </div>

            <div class="details-grid">
              <div class="section-card">
                <h3>{{ 'TRIP.INCLUDED' | translate }}</h3>

                @if (included.length) {
                  <ul class="check-list included">
                    @for (item of included; track $index) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                } @else {
                  <p class="muted">{{ 'TRIP.NO_INCLUDED' | translate }}</p>
                }
              </div>

              <div class="section-card">
                <h3>{{ 'TRIP.EXCLUDED' | translate }}</h3>

                @if (excluded.length) {
                  <ul class="check-list excluded">
                    @for (item of excluded; track $index) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                } @else {
                  <p class="muted">{{ 'TRIP.NO_EXCLUDED' | translate }}</p>
                }
              </div>
            </div>

            <div class="section-card itinerary-card">
              <div class="section-head">
                <span class="eyebrow">{{ 'TRIP.JOURNEY_PLAN' | translate }}</span>
                <h2>{{ 'TRIP.ITINERARY' | translate }}</h2>
              </div>

              @if (itinerary.length) {
                <div class="timeline">
                  @for (day of itinerary; track $index; let i = $index) {
                    <div class="timeline-item">
                      <div class="day-number">{{ i + 1 }}</div>

                      <div class="day-content">
                        <strong>{{ 'TRIP.DAY' | translate }} {{ i + 1 }}</strong>
                        <h4>{{ day.title || ('TRIP.EXPERIENCE_DAY' | translate) }}</h4>

                        @if (day.activities?.length) {
                          <ul>
                            @for (activity of day.activities; track $index) {
                              <li>{{ activity }}</li>
                            }
                          </ul>
                        } @else if (day.description || day.details || day.text) {
                          <p>{{ day.description || day.details || day.text }}</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="muted">{{ 'TRIP.NO_ITINERARY' | translate }}</p>
              }
            </div>

            <div class="section-card reviews-card">
              <div class="section-head">
                <span class="eyebrow">{{ 'TRIP.REVIEWS_LABEL' | translate }}</span>
                <h2>{{ 'TRIP.REVIEWS_TITLE' | translate }}</h2>
              </div>

              @if (reviews.length) {
                <div class="reviews-list">
                  @for (review of reviews; track review.id) {
                    <article class="review-item">
                      <div class="review-top">
                        <div class="review-avatar">
                          @if (review.image_url) {
                            <img [src]="review.image_url" [alt]="review.name || 'Traveler'" />
                          } @else {
                            <span>{{ review.name?.charAt(0) || 'E' }}</span>
                          }
                        </div>

                        <div>
                          <strong>{{ review.name || 'Traveler' }}</strong>
                          <small>{{ review.country || 'Egyptian Spirit Guest' }}</small>
                        </div>
                      </div>

                      <div class="stars">
                        @for (star of getStars(review.rating); track $index) {
                          <i class="fa-solid fa-star"></i>
                        }
                      </div>

                      <p>“{{ review.comment }}”</p>

                      <small class="review-date">
                        {{ review.created_at ? (review.created_at | date:'mediumDate') : '' }}
                      </small>
                    </article>
                  }
                </div>
              } @else {
                <p class="muted">{{ 'TRIP.NO_REVIEWS' | translate }}</p>
              }

              <div class="review-form">
                <h3>{{ 'TRIP.LEAVE_REVIEW' | translate }}</h3>

                <div class="rating-picker">
                  @for (rate of [1, 2, 3, 4, 5]; track rate) {
                    <button
                      type="button"
                      [class.active]="reviewForm.rating >= rate"
                      (click)="setRating(rate)"
                      aria-label="Set rating"
                    >
                      <i class="fa-solid fa-star"></i>
                    </button>
                  }
                </div>

                <div class="review-grid">
                  <input
                    [(ngModel)]="reviewForm.name"
                    name="reviewName"
                    [placeholder]="'TRIP.REVIEW_NAME' | translate"
                  />

                  <input
                    [(ngModel)]="reviewForm.country"
                    name="reviewCountry"
                    [placeholder]="'TRIP.REVIEW_COUNTRY' | translate"
                  />
                </div>

                <textarea
                  [(ngModel)]="reviewForm.comment"
                  name="reviewComment"
                  [placeholder]="'TRIP.REVIEW_COMMENT' | translate"
                ></textarea>

                @if (reviewSuccess) {
                  <div class="success-box">
                    {{ 'TRIP.REVIEW_SUCCESS' | translate }}
                  </div>
                }

                @if (reviewError) {
                  <div class="error-box">{{ reviewError }}</div>
                }

                <button
                  class="submit-review"
                  type="button"
                  [disabled]="reviewSubmitting"
                  (click)="submitReview()"
                >
                  {{
                    reviewSubmitting
                      ? ('TRIP.REVIEW_SENDING' | translate)
                      : ('TRIP.SUBMIT_REVIEW' | translate)
                  }}
                </button>
              </div>
            </div>
          </section>

          <aside class="booking-card">
            <div class="price-box">
              <span>
                {{ trip.start_from_price ? ('TRIP.START_FROM' | translate) : ('TRIP.PRICE' | translate) }}
              </span>

              <strong>
                @if (trip.price) {
                  {{ trip.price | currency:'USD':'symbol':'1.0-0' }}
                } @else {
                  {{ 'TRIP.CONTACT_PRICE' | translate }}
                }
              </strong>
            </div>

            <div class="quick-info">
              <div>
                <span>{{ 'TRIP.DURATION' | translate }}</span>
                <strong>{{ trip.duration || '-' }}</strong>
              </div>

              <div>
                <span>{{ 'TRIP.DESTINATION' | translate }}</span>
                <strong>{{ trip.destination || trip.location || '-' }}</strong>
              </div>

              <div>
                <span>{{ 'TRIP.MAX_PEOPLE' | translate }}</span>
                <strong>{{ trip.max_people || '-' }}</strong>
              </div>
            </div>

            <a [routerLink]="['/book', trip.slug]" class="book-btn">
              {{ 'TRIP.BOOK_NOW' | translate }}
            </a>
          </aside>
        </main>
      </section>
    }
  `,
  styles: [`
  :host {
    display: block;
    background: #f8f6f1;
    overflow-x: hidden;
  }

  .state {
    min-height: 70vh;
    display: grid;
    place-items: center;
    padding: 40px;
    background: #f8f6f1;
    color: #0d1b2a;
    font-family: 'Cinzel', serif;
    font-size: 28px;
    font-weight: 800;
    text-align: center;
  }

  .state.error {
    color: #8b2d2d;
  }

  .trip-page {
    background: #f8f6f1;
    color: #111827;
    min-height: 100vh;
  }

  .hero {
    position: relative;
    min-height: 640px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-end;
    padding: 150px 7% 86px;
    color: #fff;
    overflow: hidden;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 70%, rgba(198, 168, 92, 0.25), transparent 34%),
      linear-gradient(to top, rgba(13, 27, 42, 0.98), rgba(13, 27, 42, 0.62), rgba(13, 27, 42, 0.18));
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 940px;
  }

  .back-link {
    display: inline-flex;
    color: #ead7b5;
    text-decoration: none;
    font-weight: 900;
    margin-bottom: 22px;
    transition: 0.25s ease;
  }

  .back-link:hover {
    color: #c6a85c;
    transform: translateX(-4px);
  }

  :host-context([dir='rtl']) .back-link:hover {
    transform: translateX(4px);
  }

  .category,
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #c6a85c;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 1.8px;
    font-size: 12px;
    margin-bottom: 12px;
  }

  .category::before,
  .eyebrow::before {
    content: '';
    width: 30px;
    height: 1px;
    background: #c6a85c;
  }

  h1 {
    font-family: 'Cinzel', serif;
    font-size: clamp(42px, 6vw, 82px);
    line-height: 1.04;
    margin: 0 0 20px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .hero-content p {
    font-size: 18px;
    line-height: 1.85;
    max-width: 780px;
    color: #f8f6f1;
    margin-bottom: 28px;
  }

  .hero-meta {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .hero-meta span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.11);
    border: 1px solid rgba(198, 168, 92, 0.38);
    padding: 11px 16px;
    border-radius: 999px;
    font-weight: 800;
    backdrop-filter: blur(10px);
  }

  .hero-meta i {
    color: #c6a85c;
  }

  .content {
    width: min(1180px, calc(100% - 32px));
    margin: -58px auto 0;
    position: relative;
    z-index: 5;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 370px;
    gap: 24px;
    padding-bottom: 82px;
  }

  .main-column {
    display: grid;
    gap: 24px;
  }

  .section-card,
  .booking-card {
    background: rgba(255, 255, 255, 0.93);
    border: 1px solid rgba(198, 168, 92, 0.24);
    border-radius: 26px;
    padding: 30px;
    box-shadow: 0 22px 55px rgba(13, 27, 42, 0.1);
  }

  .section-card h2,
  .section-card h3 {
    margin: 0 0 16px;
    font-family: 'Cinzel', serif;
    font-weight: 800;
    color: #0d1b2a;
  }

  .section-card h2 {
    font-size: clamp(28px, 4vw, 36px);
  }

  .section-card h3 {
    font-size: 24px;
  }

  .overview p {
    margin: 0;
    color: #4b5563;
    line-height: 1.9;
    font-size: 16px;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .check-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 11px;
  }

  .check-list li {
    position: relative;
    padding-left: 32px;
    color: #374151;
    font-weight: 700;
    line-height: 1.55;
  }

  .check-list.included li::before,
  .check-list.excluded li::before {
    position: absolute;
    left: 0;
    top: -1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 900;
    font-size: 13px;
  }

  .check-list.included li::before {
    content: "✓";
    color: #0d1b2a;
    background: #c6a85c;
  }

  .check-list.excluded li::before {
    content: "×";
    color: #fff;
    background: #8b2d2d;
  }

  .muted {
    color: #6b7280;
    margin: 0;
  }

  .section-head {
    margin-bottom: 20px;
  }

  .section-head h2 {
    margin: 0;
  }

  .timeline {
    display: grid;
    gap: 18px;
  }

  .timeline-item {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 16px;
    align-items: flex-start;
  }

  .day-number {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    color: #0d1b2a;
    display: grid;
    place-items: center;
    font-weight: 900;
    box-shadow: 0 0 0 8px rgba(198, 168, 92, 0.18);
  }

  .day-content {
    border: 1px solid rgba(198, 168, 92, 0.22);
    border-radius: 20px;
    padding: 22px;
    background: #fbfaf7;
  }

  .day-content strong {
    display: block;
    color: #a8873e;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
    font-weight: 900;
  }

  .day-content h4 {
    margin: 0 0 12px;
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #0d1b2a;
  }

  .day-content ul {
    margin: 0;
    padding-left: 18px;
    color: #374151;
  }

  .day-content li {
    margin-bottom: 8px;
    line-height: 1.65;
  }

  .day-content p {
    color: #4b5563;
    margin: 0;
    line-height: 1.85;
  }

  .reviews-card {
    display: grid;
    gap: 20px;
  }

  .reviews-list {
    display: grid;
    gap: 16px;
  }

  .review-item {
    background: #fbfaf7;
    border: 1px solid rgba(198, 168, 92, 0.22);
    border-radius: 20px;
    padding: 20px;
  }

  .review-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .review-avatar {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    color: #0d1b2a;
    display: grid;
    place-items: center;
    font-weight: 900;
    flex-shrink: 0;
  }

  .review-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .review-top strong {
    display: block;
    color: #0d1b2a;
    font-weight: 900;
  }

  .review-top small,
  .review-date {
    color: #6b7280;
    font-weight: 700;
  }

  .stars {
    color: #c6a85c;
    display: flex;
    gap: 4px;
    margin-bottom: 10px;
  }

  .review-item p {
    margin: 0 0 10px;
    color: #4b5563;
    line-height: 1.8;
  }

  .review-form {
    border-top: 1px solid rgba(198, 168, 92, 0.22);
    padding-top: 24px;
    display: grid;
    gap: 14px;
  }

  .rating-picker {
    display: flex;
    gap: 8px;
  }

  .rating-picker button {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid rgba(198, 168, 92, 0.35);
    background: #fff;
    color: #c6a85c;
    cursor: pointer;
    transition: 0.25s ease;
  }

  .rating-picker button.active,
  .rating-picker button:hover {
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    color: #0d1b2a;
  }

  .review-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .review-form input,
  .review-form textarea {
    width: 100%;
    border: 1px solid rgba(198, 168, 92, 0.24);
    border-radius: 16px;
    padding: 14px 16px;
    outline: none;
    background: #fff;
    color: #0d1b2a;
  }

  .review-form textarea {
    min-height: 120px;
    resize: vertical;
  }

  .submit-review {
    border: 0;
    border-radius: 999px;
    padding: 15px;
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    color: #0d1b2a;
    font-weight: 900;
    text-transform: uppercase;
    cursor: pointer;
  }

  .submit-review:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .success-box,
  .error-box {
    padding: 14px 16px;
    border-radius: 16px;
    font-weight: 800;
  }

  .success-box {
    background: #dcfce7;
    color: #166534;
  }

  .error-box {
    background: #fee2e2;
    color: #991b1b;
  }

  .booking-card {
    position: sticky;
    top: 104px;
    align-self: start;
    background:
      radial-gradient(circle at top right, rgba(198, 168, 92, 0.14), transparent 34%),
      linear-gradient(180deg, #ffffff, #fbfaf7);
  }

  .price-box {
    border-bottom: 1px solid rgba(198, 168, 92, 0.24);
    padding-bottom: 18px;
    margin-bottom: 18px;
  }

  .price-box span {
    display: block;
    color: #6b7280;
    font-weight: 900;
    margin-bottom: 5px;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .price-box strong {
    display: block;
    font-size: 40px;
    color: #0d1b2a;
    font-weight: 900;
  }

  .quick-info {
    display: grid;
    gap: 10px;
    margin-bottom: 24px;
  }

  .quick-info div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    background: #f8f6f1;
    border: 1px solid rgba(198, 168, 92, 0.16);
    border-radius: 16px;
    padding: 14px;
  }

  .quick-info span {
    color: #6b7280;
    font-weight: 800;
  }

  .quick-info strong {
    text-align: right;
    color: #0d1b2a;
  }

  .book-btn {
    display: block;
    width: 100%;
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    color: #0d1b2a;
    text-align: center;
    text-decoration: none;
    padding: 15px;
    border-radius: 999px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    transition: 0.25s ease;
    box-shadow: 0 14px 30px rgba(198, 168, 92, 0.25);
  }

  .book-btn:hover {
    transform: translateY(-2px);
    background: #0d1b2a;
    color: #fff;
  }

  :host-context([dir='rtl']) .check-list li {
    padding-left: 0;
    padding-right: 32px;
  }

  :host-context([dir='rtl']) .check-list.included li::before,
  :host-context([dir='rtl']) .check-list.excluded li::before {
    left: auto;
    right: 0;
  }

  :host-context([dir='rtl']) .quick-info strong {
    text-align: left;
  }

  :host-context(body:not(.light-mode)) {
    background: #07111d;
  }

  :host-context(body:not(.light-mode)) .trip-page,
  :host-context(body:not(.light-mode)) .state {
    background: #07111d;
    color: #f8f6f1;
  }

  :host-context(body:not(.light-mode)) .section-card,
  :host-context(body:not(.light-mode)) .booking-card {
    background: rgba(13, 27, 42, 0.93);
    border-color: rgba(198, 168, 92, 0.32);
  }

  :host-context(body:not(.light-mode)) .section-card h2,
  :host-context(body:not(.light-mode)) .section-card h3,
  :host-context(body:not(.light-mode)) .price-box strong,
  :host-context(body:not(.light-mode)) .quick-info strong,
  :host-context(body:not(.light-mode)) .day-content h4,
  :host-context(body:not(.light-mode)) .review-top strong,
  :host-context(body:not(.light-mode)) .review-form h3 {
    color: #f8f6f1;
  }

  :host-context(body:not(.light-mode)) .overview p,
  :host-context(body:not(.light-mode)) .check-list li,
  :host-context(body:not(.light-mode)) .muted,
  :host-context(body:not(.light-mode)) .day-content p,
  :host-context(body:not(.light-mode)) .day-content li,
  :host-context(body:not(.light-mode)) .price-box span,
  :host-context(body:not(.light-mode)) .quick-info span,
  :host-context(body:not(.light-mode)) .review-item p,
  :host-context(body:not(.light-mode)) .review-top small,
  :host-context(body:not(.light-mode)) .review-date {
    color: #ead7b5;
  }

  :host-context(body:not(.light-mode)) .day-content,
  :host-context(body:not(.light-mode)) .quick-info div,
  :host-context(body:not(.light-mode)) .review-item,
  :host-context(body:not(.light-mode)) .review-form input,
  :host-context(body:not(.light-mode)) .review-form textarea,
  :host-context(body:not(.light-mode)) .rating-picker button {
    background: rgba(255, 255, 255, 0.055);
    border-color: rgba(198, 168, 92, 0.26);
    color: #f8f6f1;
  }

  :host-context(body:not(.light-mode)) .review-form input::placeholder,
  :host-context(body:not(.light-mode)) .review-form textarea::placeholder {
    color: rgba(248, 246, 241, 0.5);
  }

  @media (max-width: 992px) {
    .hero {
      min-height: 570px;
      padding: 132px 24px 72px;
    }

    .content {
      grid-template-columns: 1fr;
    }

    .booking-card {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .hero {
      min-height: 560px;
      padding: 122px 18px 62px;
    }

    .hero-content p {
      font-size: 15px;
    }

    .hero-meta span {
      width: 100%;
      border-radius: 16px;
    }

    .details-grid,
    .review-grid {
      grid-template-columns: 1fr;
    }

    .content {
      width: calc(100% - 24px);
      margin-top: -36px;
      padding-bottom: 60px;
    }

    .section-card,
    .booking-card {
      padding: 20px;
      border-radius: 20px;
    }

    .timeline-item {
      grid-template-columns: 42px 1fr;
      gap: 12px;
    }

    .day-number {
      width: 42px;
      height: 42px;
      box-shadow: 0 0 0 6px rgba(198, 168, 92, 0.16);
    }

    .price-box strong {
      font-size: 32px;
    }
  }

  @media (max-width: 480px) {
    .category,
    .eyebrow {
      letter-spacing: 1.2px;
    }

    .category::before,
    .eyebrow::before {
      width: 22px;
    }

    .quick-info div {
      flex-direction: column;
    }

    .quick-info strong {
      text-align: left;
    }

    :host-context([dir='rtl']) .quick-info strong {
      text-align: right;
    }
  }
`],
})
export class TripDetailsComponent implements OnInit {
  trip: any = null;
  included: string[] = [];
  excluded: string[] = [];
  itinerary: any[] = [];
  reviews: any[] = [];

  loading = true;
  notFound = false;

  reviewSubmitting = false;
  reviewSuccess = false;
  reviewError = '';

  reviewForm = {
    name: '',
    country: '',
    rating: 5,
    comment: '',
  };

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.loading = false;
      this.notFound = true;
      this.cdr.detectChanges();
      return;
    }

    const { data, error } = await this.supabase.getTripBySlug(slug);

    this.loading = false;

    if (error || !data) {
      this.notFound = true;
      this.cdr.detectChanges();
      return;
    }

    this.trip = data;
    this.included = Array.isArray(data.included) ? data.included : [];
    this.excluded = Array.isArray(data.excluded) ? data.excluded : [];

    this.itinerary = Array.isArray(data.itinerary?.days)
      ? data.itinerary.days
      : Array.isArray(data.itinerary)
        ? data.itinerary
        : [];

    await this.loadReviews();

    this.cdr.detectChanges();
  }

  async loadReviews() {
    const { data, error } = await this.supabase.getAllApprovedReviews();

    if (!error && data) {
      this.reviews = [...data];
    }

    this.cdr.detectChanges();
  }

  getStars(rating: number) {
    return Array(Math.max(0, Math.min(Number(rating) || 0, 5)));
  }

  setRating(rate: number) {
    this.reviewForm.rating = rate;
    this.cdr.detectChanges();
  }

  async submitReview() {
    this.reviewSuccess = false;
    this.reviewError = '';

    const user = await this.supabase.getCurrentUser();

    if (!user) {
      this.reviewError = 'Please login first before submitting your review.';
      this.cdr.detectChanges();
      return;
    }

    const name = String(this.reviewForm.name || '').trim();
    const country = String(this.reviewForm.country || '').trim();
    const comment = String(this.reviewForm.comment || '').trim();
    const rating = Number(this.reviewForm.rating);

    if (!name || !comment || !rating) {
      this.reviewError = 'Please add your name, rating, and review before submitting.';
      this.cdr.detectChanges();
      return;
    }

    this.reviewSubmitting = true;
    this.cdr.detectChanges();

    const payload = {
      name,
      country,
      comment,
      rating,
      is_approved: false,
    };

    const { error } = await this.supabase.createReview(payload);

    this.reviewSubmitting = false;

    if (error) {
      this.reviewError = 'Something went wrong. Please try again.';
      this.cdr.detectChanges();
      return;
    }

    this.reviewSuccess = true;

    this.reviewForm = {
      name: '',
      country: '',
      rating: 5,
      comment: '',
    };

    this.cdr.detectChanges();
  }
}
