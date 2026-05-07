import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TripsService } from '../../../core/services/trips.service';
import { Trip } from '../../../core/models/database.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, TranslateModule],
  template: `
    <section class="trips-hero">
      <div class="overlay"></div>
      <div class="container hero-content">
        <span class="section-label">{{ 'TRIPS_PAGE.LABEL' | translate }}</span>
        <h1>{{ 'TRIPS_PAGE.TITLE' | translate }}</h1>
        <p>{{ 'TRIPS_PAGE.SUBTITLE' | translate }}</p>
      </div>
    </section>

    <section class="trips-section">
      <div class="container">
        @if (loading) {
          <div class="state">{{ 'TRIPS_PAGE.LOADING' | translate }}</div>
        }

        @if (!loading && errorMessage) {
          <div class="state error">{{ errorMessage }}</div>
        }

        @if (!loading && !errorMessage && filteredTrips.length) {
          <div class="trips-grid">
            @for (trip of filteredTrips; track trip.id) {
              <article class="trip-card">
                <div class="image-wrap">
                  <img
                    [src]="trip.image_url || 'assets/logo-symbol.png'"
                    [alt]="trip.title || 'Trip'"
                  />

                  <span class="category">
                    {{
                      trip.category ||
                        trip.destination ||
                        ('TRIPS_PAGE.DEFAULT_CATEGORY' | translate)
                    }}
                  </span>
                </div>

                <div class="card-body">
                  <div class="meta">
                    <span><i class="fa-solid fa-clock"></i>{{ trip.duration || '-' }}</span>
                    <span
                      ><i class="fa-solid fa-location-dot"></i
                      >{{
                        trip.destination || trip.location || ('TRIPS_PAGE.EGYPT' | translate)
                      }}</span
                    >
                  </div>

                  <h3>{{ trip.title || '-' }}</h3>

                  <p>{{ trip.description || ('TRIPS_PAGE.NO_DESCRIPTION' | translate) }}</p>

                  <div class="price">
                    <small>{{ 'TRIPS_PAGE.START_FROM' | translate }}</small>
                    <strong>
                      @if (trip.price) {
                        {{ trip.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                      } @else {
                        {{ 'TRIPS_PAGE.CONTACT_PRICE' | translate }}
                      }
                    </strong>
                  </div>

                  <div class="actions">
                    <a class="details-btn" [routerLink]="['/trips', trip.slug]">
                      {{ 'TRIPS_PAGE.VIEW_DETAILS' | translate }}
                    </a>

                    <a class="book-btn" [routerLink]="['/book', trip.slug]">
                      {{ 'TRIPS_PAGE.BOOK_NOW' | translate }}
                    </a>
                  </div>
                </div>
              </article>
            }
          </div>
        }

        @if (!loading && !errorMessage && !filteredTrips.length) {
          <div class="state empty">{{ 'TRIPS_PAGE.NO_TRIPS' | translate }}</div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: #f8f6f1;
        overflow-x: hidden;
      }

      .trips-hero {
        position: relative;
        min-height: 460px;
        background: #0d1b2a;
        display: flex;
        align-items: center;
        color: #f8f6f1;
        padding-top: 96px;
        overflow: hidden;
      }

      .trips-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: url('/assets/logo-symbol.png') center/360px no-repeat;
        opacity: 0.08;
        animation: floatLogo 8s ease-in-out infinite;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 18% 75%, rgba(198, 168, 92, 0.24), transparent 34%),
          linear-gradient(
            110deg,
            rgba(13, 27, 42, 0.98),
            rgba(13, 27, 42, 0.82),
            rgba(13, 27, 42, 0.55)
          );
      }

      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 900px;
      }

      .section-label {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: #c6a85c;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 4px;
        margin-bottom: 16px;
      }

      .section-label::before {
        content: '';
        width: 34px;
        height: 1px;
        background: #c6a85c;
      }

      h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(42px, 6vw, 72px);
        line-height: 1.05;
        margin: 0 0 18px;
        letter-spacing: 0.04em;
      }

      .trips-hero p {
        color: #ead7b5;
        max-width: 720px;
        font-size: 17px;
        line-height: 1.85;
        margin: 0;
      }

      .trips-section {
        background:
          radial-gradient(circle at top left, rgba(198, 168, 92, 0.11), transparent 30%), #f8f6f1;
        padding: 72px 0;
        min-height: 60vh;
      }

      .filters-card {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(198, 168, 92, 0.26);
        box-shadow: 0 18px 45px rgba(13, 27, 42, 0.08);
        border-radius: 24px;
        padding: 18px;
        margin-bottom: 34px;
        display: grid;
        grid-template-columns: 1fr 260px;
        gap: 14px;
      }

      input,
      select {
        width: 100%;
        border: 1px solid rgba(198, 168, 92, 0.26);
        border-radius: 999px;
        padding: 14px 18px;
        outline: none;
        font-size: 14px;
        background: #fff;
        color: #0d1b2a;
        transition: 0.25s ease;
      }

      input:focus,
      select:focus {
        border-color: #c6a85c;
        box-shadow: 0 0 0 4px rgba(198, 168, 92, 0.16);
      }

      .trips-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 26px;
      }

      .trip-card {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 26px;
        box-shadow: 0 18px 45px rgba(13, 27, 42, 0.08);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        transition: 0.3s ease;
      }

      .trip-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 26px 60px rgba(13, 27, 42, 0.14);
      }

      .image-wrap {
        height: 250px;
        position: relative;
        overflow: hidden;
        background: #0d1b2a;
      }

      .image-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: 0.45s ease;
      }

      .trip-card:hover .image-wrap img {
        transform: scale(1.08);
        opacity: 0.86;
      }

      .category {
        position: absolute;
        top: 16px;
        left: 16px;
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .card-body {
        padding: 24px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .meta {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }

      .meta span {
        color: #65717e;
        font-size: 12px;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .meta i {
        color: #c6a85c;
      }

      h3 {
        font-family: 'Cinzel', serif;
        font-size: 22px;
        color: #0d1b2a;
        margin: 0 0 12px;
        line-height: 1.35;
      }

      .card-body p {
        color: #4c5560;
        line-height: 1.75;
        margin: 0 0 18px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 82px;
      }

      .price {
        border-top: 1px solid rgba(198, 168, 92, 0.22);
        padding-top: 16px;
        margin-top: auto;
        margin-bottom: 14px;
      }

      .price small,
      .price strong {
        display: block;
      }

      .price small {
        color: #65717e;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .price strong {
        color: #0d1b2a;
        font-size: 24px;
        font-weight: 900;
      }

      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .details-btn,
      .book-btn {
        text-decoration: none;
        text-align: center;
        padding: 12px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        transition: 0.25s ease;
        white-space: nowrap;
      }

      .details-btn {
        background: #0d1b2a;
        color: #f8f6f1;
      }

      .book-btn {
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
      }

      .details-btn:hover,
      .book-btn:hover {
        transform: translateY(-2px);
        background: #ead7b5;
        color: #0d1b2a;
      }

      .state {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(198, 168, 92, 0.28);
        border-radius: 24px;
        padding: 32px;
        text-align: center;
        color: #0d1b2a;
        font-family: 'Cinzel', serif;
        font-size: 24px;
        font-weight: 800;
      }

      .state.empty {
        color: #65717e;
      }

      .state.error {
        color: #991b1b;
        background: #fee2e2;
      }

      :host-context([dir='rtl']) .category {
        left: auto;
        right: 16px;
      }

      :host-context(body:not(.light-mode)) {
        background: #07111d;
      }

      :host-context(body:not(.light-mode)) .trips-section {
        background:
          radial-gradient(circle at top left, rgba(198, 168, 92, 0.12), transparent 30%), #07111d;
      }

      :host-context(body:not(.light-mode)) .filters-card,
      :host-context(body:not(.light-mode)) .trip-card,
      :host-context(body:not(.light-mode)) .state {
        background: rgba(13, 27, 42, 0.9);
        border-color: rgba(198, 168, 92, 0.32);
      }

      :host-context(body:not(.light-mode)) input,
      :host-context(body:not(.light-mode)) select {
        background: rgba(255, 255, 255, 0.07);
        color: #f8f6f1;
        border-color: rgba(198, 168, 92, 0.28);
      }

      :host-context(body:not(.light-mode)) select option {
        background: #0d1b2a;
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) h3,
      :host-context(body:not(.light-mode)) .price strong,
      :host-context(body:not(.light-mode)) .state {
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) .card-body p,
      :host-context(body:not(.light-mode)) .meta span,
      :host-context(body:not(.light-mode)) .price small,
      :host-context(body:not(.light-mode)) .state.empty {
        color: #ead7b5;
      }

      :host-context(body:not(.light-mode)) .details-btn {
        background: #ead7b5;
        color: #0d1b2a;
      }

      :host-context(body:not(.light-mode)) .details-btn:hover {
        background: #ead7b5;
        color: #0d1b2a;
      }

      :host-context(body:not(.light-mode)) .book-btn {
        color: #0d1b2a;
      }

      @keyframes floatLogo {
        0%,
        100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-12px) scale(1.03);
        }
      }

      @media (max-width: 1200px) {
        .trips-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .trips-hero {
          min-height: 390px;
          padding-top: 112px;
          text-align: center;
        }

        .hero-content {
          max-width: 100%;
        }

        .section-label {
          justify-content: center;
          letter-spacing: 3px;
        }

        .section-label::before {
          width: 24px;
        }

        .trips-section {
          padding: 48px 0;
        }

        .filters-card,
        .trips-grid {
          grid-template-columns: 1fr;
        }

        .actions {
          grid-template-columns: 1fr;
        }

        .image-wrap {
          height: 225px;
        }
      }

      @media (max-width: 480px) {
        .filters-card {
          padding: 14px;
          border-radius: 20px;
        }

        .card-body {
          padding: 22px;
        }

        .image-wrap {
          height: 210px;
        }

        .state {
          font-size: 20px;
          padding: 24px;
        }
      }
    `,
  ],
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  loading = true;
  errorMessage = '';

  searchTerm = '';
  selectedCategory = 'all';

  constructor(
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef,
  ) {}

  get categories(): string[] {
    return Array.from(new Set(this.trips.map((trip: any) => trip.category).filter(Boolean)));
  }

  get filteredTrips(): Trip[] {
    return this.trips.filter((trip: any) => {
      const search = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        trip.title?.toLowerCase().includes(search) ||
        trip.destination?.toLowerCase().includes(search) ||
        trip.location?.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'all' || trip.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const { data, error } = await this.tripsService.getActiveTrips();

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
      this.trips = [];
      this.cdr.detectChanges();
      return;
    }

    this.trips = data || [];
    this.cdr.detectChanges();
  }
}
