import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, CurrencyPipe],
  template: `
    <section class="booking-page">
      @if (loading) {
        <div class="state">{{ 'BOOKING.LOADING' | translate }}</div>
      }

      @if (notFound) {
        <div class="state error">{{ 'BOOKING.NOT_FOUND' | translate }}</div>
      }

      @if (!loading && trip) {
        <div class="booking-hero">
          <div class="overlay"></div>

          <div class="container">
            <a routerLink="/trips" class="back-link">
              {{ 'BOOKING.BACK_TO_TRIPS' | translate }}
            </a>

            <span>{{ 'BOOKING.PAGE_LABEL' | translate }}</span>
            <h1>{{ 'BOOKING.TITLE' | translate }}</h1>
            <p>{{ trip.title }}</p>
          </div>
        </div>

        <div class="container booking-wrap">
          <div class="trip-summary">
            <img [src]="trip.image_url || 'assets/logo-symbol.png'" [alt]="trip.title" />

            <div class="summary-body">
              <span class="label">
                {{ trip.category || trip.destination || ('BOOKING.TRIP' | translate) }}
              </span>

              <h2>{{ trip.title }}</h2>

              <p>{{ trip.description }}</p>

              <div class="summary-grid">
                <div>
                  <span>{{ 'BOOKING.DURATION' | translate }}</span>
                  <strong>{{ trip.duration || '-' }}</strong>
                </div>

                <div>
                  <span>{{ 'BOOKING.DESTINATION' | translate }}</span>
                  <strong>{{ trip.destination || trip.location || '-' }}</strong>
                </div>

                <div>
                  <span>{{ 'BOOKING.PRICE' | translate }}</span>
                  <strong>
                    @if (trip.price) {
                      {{ trip.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                    } @else {
                      {{ 'BOOKING.CONTACT_PRICE' | translate }}
                    }
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <form class="booking-form" (ngSubmit)="submit()">
            <div class="form-head">
              <span>{{ 'BOOKING.FORM_LABEL' | translate }}</span>
              <h2>{{ 'BOOKING.REQUEST_DETAILS' | translate }}</h2>
              <p>{{ 'BOOKING.FORM_HINT' | translate }}</p>
            </div>

            <div class="grid">
              <input
                [(ngModel)]="form.name"
                name="name"
                [placeholder]="'BOOKING.FORM.NAME' | translate"
                required
              />

              <input
                [(ngModel)]="form.email"
                name="email"
                type="email"
                [placeholder]="'BOOKING.FORM.EMAIL' | translate"
                required
              />

              <input
                [(ngModel)]="form.phone"
                name="phone"
                [placeholder]="'BOOKING.FORM.PHONE' | translate"
              />

              <select [(ngModel)]="form.country" name="country" required>
                <option value="" disabled>
                  {{ 'BOOKING.FORM.COUNTRY' | translate }}
                </option>

                @for (country of countries; track country) {
                  <option [value]="country">{{ country }}</option>
                }
              </select>

              <input [(ngModel)]="form.travel_date" name="travel_date" type="date" />

              <select [(ngModel)]="form.language" name="language" required>
                <option value="" disabled>
                  {{ 'BOOKING.FORM.LANGUAGE' | translate }}
                </option>

                @for (lang of languages; track lang.value) {
                  <option [value]="lang.label">{{ lang.label }}</option>
                }
              </select>

              <input
                [(ngModel)]="form.adults"
                name="adults"
                type="number"
                min="1"
                [placeholder]="'BOOKING.FORM.ADULTS' | translate"
              />

              <input
                [(ngModel)]="form.children"
                name="children"
                type="number"
                min="0"
                [placeholder]="'BOOKING.FORM.CHILDREN' | translate"
              />
            </div>

            <textarea
              [(ngModel)]="form.notes"
              name="notes"
              [placeholder]="'BOOKING.FORM.NOTES' | translate"
            ></textarea>

            @if (success) {
              <div class="success">
                {{ 'BOOKING.SUCCESS' | translate }}
              </div>
            }

            @if (errorMessage) {
              <div class="error-box">{{ errorMessage }}</div>
            }

            <button type="submit" [disabled]="submitting">
              {{ submitting ? ('BOOKING.SENDING' | translate) : ('BOOKING.SUBMIT' | translate) }}
            </button>
          </form>
        </div>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: #f8f6f1;
        overflow-x: hidden;
      }

      .booking-page {
        background: #f8f6f1;
        min-height: 100vh;
        color: #0d1b2a;
      }

      .state {
        min-height: 70vh;
        display: grid;
        place-items: center;
        font-family: 'Cinzel', serif;
        font-size: 28px;
        font-weight: 800;
        text-align: center;
        padding: 40px;
      }

      .state.error {
        color: #8b2d2d;
      }

      .booking-hero {
        position: relative;
        min-height: 450px;
        background:
          url('/assets/logo-symbol.png') center/360px no-repeat,
          #0d1b2a;
        display: flex;
        align-items: center;
        color: #fff;
        padding-top: 96px;
        overflow: hidden;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 18% 72%, rgba(198, 168, 92, 0.24), transparent 34%),
          linear-gradient(
            110deg,
            rgba(13, 27, 42, 0.98),
            rgba(13, 27, 42, 0.82),
            rgba(13, 27, 42, 0.55)
          );
      }

      .booking-hero .container {
        position: relative;
        z-index: 2;
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

      .booking-hero span,
      .label,
      .form-head span {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #c6a85c;
        text-transform: uppercase;
        font-weight: 900;
        letter-spacing: 1.7px;
        font-size: 12px;
        margin-bottom: 10px;
      }

      .booking-hero span::before,
      .label::before,
      .form-head span::before {
        content: '';
        width: 30px;
        height: 1px;
        background: #c6a85c;
      }

      h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(40px, 6vw, 70px);
        margin: 0 0 14px;
        line-height: 1.05;
        letter-spacing: 0.04em;
      }

      .booking-hero p {
        color: #ead7b5;
        font-size: 20px;
        font-weight: 700;
        margin: 0;
      }

      .booking-wrap {
        display: grid;
        grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
        gap: 26px;
        margin-top: -62px;
        position: relative;
        z-index: 5;
        padding-bottom: 82px;
      }

      .trip-summary,
      .booking-form {
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 26px;
        overflow: hidden;
        box-shadow: 0 22px 55px rgba(13, 27, 42, 0.1);
      }

      .trip-summary img {
        width: 100%;
        height: 315px;
        object-fit: cover;
        display: block;
        background: #111827;
      }

      .summary-body {
        padding: 26px;
      }

      .summary-body h2,
      .form-head h2 {
        font-family: 'Cinzel', serif;
        font-weight: 800;
        margin: 0 0 14px;
        color: #0d1b2a;
        line-height: 1.25;
      }

      .summary-body p,
      .form-head p {
        color: #4b5563;
        line-height: 1.85;
        margin: 0 0 18px;
      }

      .summary-grid {
        display: grid;
        gap: 10px;
      }

      .summary-grid div {
        background: #f8f6f1;
        border: 1px solid rgba(198, 168, 92, 0.16);
        border-radius: 16px;
        padding: 14px;
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .summary-grid span {
        color: #6b7280;
        font-weight: 800;
      }

      .summary-grid strong {
        text-align: right;
        color: #0d1b2a;
      }

      .booking-form {
        padding: 28px;
        display: grid;
        gap: 16px;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 13px;
      }

      input,
      textarea,
      select {
        width: 100%;
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 16px;
        padding: 14px 16px;
        outline: none;
        font-size: 14px;
        background: #fff;
        color: #0d1b2a;
        transition: 0.25s ease;
      }

      select {
        cursor: pointer;
        appearance: auto;
      }

      input:focus,
      textarea:focus,
      select:focus {
        border-color: #c6a85c;
        box-shadow: 0 0 0 4px rgba(198, 168, 92, 0.16);
      }

      textarea {
        min-height: 125px;
        resize: vertical;
      }

      button {
        border: 0;
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        padding: 16px;
        border-radius: 999px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        cursor: pointer;
        transition: 0.25s ease;
        box-shadow: 0 14px 30px rgba(198, 168, 92, 0.25);
      }

      button:hover {
        transform: translateY(-2px);
        background: #0d1b2a;
        color: #fff;
      }

      button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
      }

      .success,
      .error-box {
        padding: 14px 16px;
        border-radius: 16px;
        font-weight: 800;
      }

      .success {
        background: #dcfce7;
        color: #166534;
      }

      .error-box {
        background: #fee2e2;
        color: #991b1b;
      }

      :host-context([dir='rtl']) .summary-grid strong {
        text-align: left;
      }

      :host-context([dir='rtl']) .back-link:hover {
        transform: translateX(4px);
      }

      :host-context(body:not(.light-mode)) {
        background: #07111d;
      }

      :host-context(body:not(.light-mode)) .booking-page,
      :host-context(body:not(.light-mode)) .state {
        background: #07111d;
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) .trip-summary,
      :host-context(body:not(.light-mode)) .booking-form {
        background: rgba(13, 27, 42, 0.93);
        border-color: rgba(198, 168, 92, 0.32);
      }

      :host-context(body:not(.light-mode)) .summary-body h2,
      :host-context(body:not(.light-mode)) .form-head h2,
      :host-context(body:not(.light-mode)) .summary-grid strong {
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) .summary-body p,
      :host-context(body:not(.light-mode)) .form-head p,
      :host-context(body:not(.light-mode)) .summary-grid span {
        color: #ead7b5;
      }

      :host-context(body:not(.light-mode)) .summary-grid div {
        background: rgba(255, 255, 255, 0.055);
        border-color: rgba(198, 168, 92, 0.26);
      }

      :host-context(body:not(.light-mode)) input,
      :host-context(body:not(.light-mode)) textarea,
      :host-context(body:not(.light-mode)) select {
        background: rgba(255, 255, 255, 0.07);
        color: #f8f6f1;
        border-color: rgba(198, 168, 92, 0.28);
      }

      :host-context(body:not(.light-mode)) select option {
        background: #0d1b2a;
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) input::placeholder,
      :host-context(body:not(.light-mode)) textarea::placeholder {
        color: rgba(248, 246, 241, 0.5);
      }

      @media (max-width: 992px) {
        .booking-wrap {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .booking-hero {
          min-height: 390px;
          padding-top: 112px;
          text-align: center;
        }

        .booking-hero span,
        .label,
        .form-head span {
          justify-content: center;
        }

        .booking-wrap {
          margin-top: -40px;
          padding-bottom: 54px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .booking-form,
        .summary-body {
          padding: 20px;
        }

        .trip-summary img {
          height: 245px;
        }

        .summary-grid div {
          flex-direction: column;
        }

        .summary-grid strong {
          text-align: left;
        }

        :host-context([dir='rtl']) .summary-grid strong {
          text-align: right;
        }
      }

      @media (max-width: 480px) {
        .booking-wrap {
          gap: 20px;
        }

        .trip-summary,
        .booking-form {
          border-radius: 20px;
        }

        .booking-hero span::before,
        .label::before,
        .form-head span::before {
          width: 22px;
        }
      }
    `,
  ],
})
export class BookingComponent implements OnInit {
  trip: any = null;
  loading = true;
  notFound = false;

  submitting = false;
  success = false;
  errorMessage = '';

  languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'de', label: 'German' },
    { value: 'fr', label: 'French' },
    { value: 'it', label: 'Italian' },
    { value: 'es', label: 'Spanish' },
  ];

  countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahrain',
    'Bangladesh',
    'Belgium',
    'Brazil',
    'Bulgaria',
    'Canada',
    'China',
    'Croatia',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Egypt',
    'Estonia',
    'Finland',
    'France',
    'Georgia',
    'Germany',
    'Greece',
    'Hungary',
    'India',
    'Indonesia',
    'Iraq',
    'Ireland',
    'Italy',
    'Japan',
    'Jordan',
    'Kuwait',
    'Lebanon',
    'Libya',
    'Malaysia',
    'Maldives',
    'Mexico',
    'Morocco',
    'Netherlands',
    'New Zealand',
    'Norway',
    'Oman',
    'Pakistan',
    'Palestine',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Saudi Arabia',
    'South Africa',
    'South Korea',
    'Spain',
    'Sudan',
    'Sweden',
    'Switzerland',
    'Syria',
    'Thailand',
    'Tunisia',
    'Turkey',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
  ];

  form: any = {
    name: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    travel_date: '',
    adults: null,
    children: null,
    notes: '',
  };

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.loading = false;
      this.notFound = true;
      this.cdr.detectChanges();
      return;
    }

    const { data, error } = await this.supabaseService.getTripBySlug(slug);

    this.loading = false;

    if (error || !data) {
      this.notFound = true;
      this.cdr.detectChanges();
      return;
    }

    this.trip = data;
    this.cdr.detectChanges();
  }

  async submit() {
    this.success = false;
    this.errorMessage = '';

    const name = String(this.form.name || '').trim();
    const email = String(this.form.email || '').trim();
    const phone = String(this.form.phone || '').trim();
    const country = String(this.form.country || '').trim();
    const language = String(this.form.language || '').trim();
    const adults = Number(this.form.adults);
    const children = Number(this.form.children || 0);

    if (!name || !email || !phone || !country || !this.form.travel_date || !language || !adults || adults < 1) {
      this.errorMessage = 'Please fill in all required booking details before sending.';
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.cdr.detectChanges();

    const user = await this.supabaseService.getCurrentUser();

    if (!user) {
      this.submitting = false;
      this.errorMessage = 'Please login first before sending a booking request.';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      trip_id: this.trip.id,
      user_id: user.id,
      name,
      email,
      phone,
      country,
      language,
      travel_date: this.form.travel_date,
      adults,
      children,
      notes: this.form.notes,
      message: this.form.notes,
      status: 'pending',
    };

    const { error } = await this.supabaseService.createBooking(payload);

    this.submitting = false;

    if (error) {
      this.errorMessage = 'Something went wrong. Please try again.';
      this.cdr.detectChanges();
      return;
    }

    this.success = true;

    this.form = {
      name: '',
      email: '',
      phone: '',
      country: '',
      language: '',
      travel_date: '',
      adults: null,
      children: null,
      notes: '',
    };

    this.cdr.detectChanges();
  }
}
