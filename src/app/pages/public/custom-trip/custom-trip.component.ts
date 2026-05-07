import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-custom-trip',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  template: `
    <section class="custom-hero">
      <div class="overlay"></div>

      <div class="container hero-content">
        <a routerLink="/trips" class="back-link">
          {{ 'CUSTOM_TRIP_PAGE.BACK_TO_TRIPS' | translate }}
        </a>

        <span class="section-label">{{ 'CUSTOM_TRIP_PAGE.LABEL' | translate }}</span>
        <h1>{{ 'CUSTOM_TRIP_PAGE.TITLE' | translate }}</h1>
        <p>{{ 'CUSTOM_TRIP_PAGE.SUBTITLE' | translate }}</p>
      </div>
    </section>

    <section class="custom-section">
      <div class="container">
        <div class="custom-grid">
          <aside class="info-card">
            <span class="section-label dark">{{ 'CUSTOM_TRIP_PAGE.INFO_LABEL' | translate }}</span>
            <h2>{{ 'CUSTOM_TRIP_PAGE.INFO_TITLE' | translate }}</h2>
            <p>{{ 'CUSTOM_TRIP_PAGE.INFO_TEXT' | translate }}</p>

            <div class="steps">
              <div>
                <strong>01</strong>
                <span>{{ 'CUSTOM_TRIP_PAGE.STEPS.STEP_1' | translate }}</span>
              </div>

              <div>
                <strong>02</strong>
                <span>{{ 'CUSTOM_TRIP_PAGE.STEPS.STEP_2' | translate }}</span>
              </div>

              <div>
                <strong>03</strong>
                <span>{{ 'CUSTOM_TRIP_PAGE.STEPS.STEP_3' | translate }}</span>
              </div>
            </div>
          </aside>

          <form class="custom-form" (ngSubmit)="submit()">
            <div class="form-head">
              <span class="section-label dark">{{ 'CUSTOM_TRIP_PAGE.FORM_LABEL' | translate }}</span>
              <h2>{{ 'CUSTOM_TRIP_PAGE.FORM_TITLE' | translate }}</h2>
              <p>{{ 'CUSTOM_TRIP_PAGE.FORM_HINT' | translate }}</p>
            </div>

            <div class="grid">
              <input
                [(ngModel)]="form.title"
                name="title"
                [placeholder]="'CUSTOM_TRIP_PAGE.FORM.TRIP_TITLE' | translate"
              />

              <input
                [(ngModel)]="form.name"
                name="name"
                [placeholder]="'CUSTOM_TRIP_PAGE.FORM.NAME' | translate"
                required
              />

              <input
                [(ngModel)]="form.email"
                name="email"
                type="email"
                [placeholder]="'CUSTOM_TRIP_PAGE.FORM.EMAIL' | translate"
                required
              />

              <input
                [(ngModel)]="form.phone"
                name="phone"
                [placeholder]="'CUSTOM_TRIP_PAGE.FORM.PHONE' | translate"
              />

              <select [(ngModel)]="form.country" name="country" required>
                <option value="" disabled>
                  {{ 'CUSTOM_TRIP_PAGE.FORM.COUNTRY' | translate }}
                </option>

                @for (country of countries; track country) {
                  <option [value]="country">{{ country }}</option>
                }
              </select>

              <select [(ngModel)]="form.language" name="language" required>
                <option value="" disabled>Preferred Language</option>

                @for (lang of languages; track lang.value) {
                  <option [value]="lang.label">{{ lang.label }}</option>
                }
              </select>

              <input
                [(ngModel)]="form.budget"
                name="budget"
                type="number"
                min="0"
                [placeholder]="'CUSTOM_TRIP_PAGE.FORM.BUDGET' | translate"
              />

              <div class="field">
                <label>{{ 'CUSTOM_TRIP_PAGE.FORM.DEPARTURE' | translate }}</label>
                <input [(ngModel)]="form.departure_date" name="departure_date" type="date" />
              </div>

              <div class="field">
                <label>{{ 'CUSTOM_TRIP_PAGE.FORM.ARRIVAL' | translate }}</label>
                <input [(ngModel)]="form.arrival_date" name="arrival_date" type="date" />
              </div>

              <div class="field">
                <label>{{ 'CUSTOM_TRIP_PAGE.FORM.ADULTS' | translate }}</label>
                <input [(ngModel)]="form.adults" name="adults" type="number" min="1" />
              </div>

              <div class="field">
                <label>{{ 'CUSTOM_TRIP_PAGE.FORM.INFANTS' | translate }}</label>
                <input [(ngModel)]="form.infants" name="infants" type="number" min="0" />
              </div>

              <div class="field">
                <label>{{ 'CUSTOM_TRIP_PAGE.FORM.CHILDREN_UNDER_6' | translate }}</label>
                <input
                  [(ngModel)]="form.children_under_6"
                  name="children_under_6"
                  type="number"
                  min="0"
                />
              </div>

              <div class="field">
                <label>{{ 'CUSTOM_TRIP_PAGE.FORM.CHILDREN_UNDER_12' | translate }}</label>
                <input
                  [(ngModel)]="form.children_under_12"
                  name="children_under_12"
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <textarea
              [(ngModel)]="form.notes"
              name="notes"
              [placeholder]="'CUSTOM_TRIP_PAGE.FORM.NOTES' | translate"
            ></textarea>

            @if (success) {
              <div class="success">
                {{ 'CUSTOM_TRIP_PAGE.SUCCESS' | translate }}
              </div>
            }

            @if (errorMessage) {
              <div class="error-box">{{ errorMessage }}</div>
            }

            <button type="submit" [disabled]="submitting">
              {{
                submitting
                  ? ('CUSTOM_TRIP_PAGE.SENDING' | translate)
                  : ('CUSTOM_TRIP_PAGE.SUBMIT' | translate)
              }}
            </button>
          </form>
        </div>
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

      .custom-hero {
        position: relative;
        min-height: 470px;
        background: #0d1b2a;
        display: flex;
        align-items: center;
        color: #f8f6f1;
        padding-top: 96px;
        overflow: hidden;
      }

      .custom-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: url('/assets/logo-symbol.png') center/360px no-repeat;
        opacity: 0.08;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 18% 72%, rgba(198, 168, 92, 0.24), transparent 34%),
          linear-gradient(110deg, rgba(13, 27, 42, 0.98), rgba(13, 27, 42, 0.82), rgba(13, 27, 42, 0.55));
      }

      .hero-content {
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

      .section-label {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #c6a85c;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 3.5px;
        margin-bottom: 14px;
      }

      .section-label::before {
        content: '';
        width: 30px;
        height: 1px;
        background: #c6a85c;
      }

      .section-label.dark {
        color: #9b7a2f;
      }

      h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(42px, 6vw, 76px);
        line-height: 1.05;
        margin: 0 0 18px;
        max-width: 920px;
        letter-spacing: 0.04em;
      }

      .custom-hero p {
        color: #ead7b5;
        max-width: 760px;
        font-size: 17px;
        line-height: 1.85;
        margin: 0;
      }

      .custom-section {
        background:
          radial-gradient(circle at top left, rgba(198, 168, 92, 0.11), transparent 30%),
          #f8f6f1;
        padding: 76px 0;
        min-height: 60vh;
      }

      .custom-grid {
        display: grid;
        grid-template-columns: minmax(300px, 0.85fr) minmax(0, 1.15fr);
        gap: 26px;
        align-items: start;
      }

      .info-card,
      .custom-form {
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 26px;
        box-shadow: 0 22px 55px rgba(13, 27, 42, 0.09);
        padding: 30px;
      }

      .info-card {
        position: sticky;
        top: 110px;
      }

      .info-card h2,
      .custom-form h2 {
        font-family: 'Cinzel', serif;
        color: #0d1b2a;
        font-size: clamp(28px, 4vw, 42px);
        margin: 0 0 16px;
        line-height: 1.18;
      }

      .info-card p,
      .form-head p {
        color: #4c5560;
        line-height: 1.85;
        margin: 0 0 22px;
      }

      .steps {
        display: grid;
        gap: 14px;
      }

      .steps div {
        display: grid;
        grid-template-columns: 54px 1fr;
        gap: 14px;
        align-items: center;
        background: #f8f6f1;
        border: 1px solid rgba(198, 168, 92, 0.16);
        border-radius: 18px;
        padding: 14px;
      }

      .steps strong {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        font-weight: 900;
        border-radius: 50%;
      }

      .steps span {
        color: #0d1b2a;
        font-weight: 800;
        line-height: 1.5;
      }

      .custom-form {
        display: grid;
        gap: 18px;
      }

      .form-head p {
        margin-bottom: 0;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
      }

      .field {
        display: grid;
        gap: 7px;
      }

      .field label {
        color: #6b7280;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.4px;
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
        min-height: 135px;
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

      :host-context([dir='rtl']) .back-link:hover {
        transform: translateX(4px);
      }

      :host-context(body:not(.light-mode)) {
        background: #07111d;
      }

      :host-context(body:not(.light-mode)) .custom-section {
        background:
          radial-gradient(circle at top left, rgba(198, 168, 92, 0.12), transparent 30%),
          #07111d;
      }

      :host-context(body:not(.light-mode)) .info-card,
      :host-context(body:not(.light-mode)) .custom-form {
        background: rgba(13, 27, 42, 0.93);
        border-color: rgba(198, 168, 92, 0.32);
      }

      :host-context(body:not(.light-mode)) .info-card h2,
      :host-context(body:not(.light-mode)) .custom-form h2,
      :host-context(body:not(.light-mode)) .steps span {
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) .info-card p,
      :host-context(body:not(.light-mode)) .form-head p,
      :host-context(body:not(.light-mode)) .field label {
        color: #ead7b5;
      }

      :host-context(body:not(.light-mode)) .steps div {
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
        .custom-grid {
          grid-template-columns: 1fr;
        }

        .info-card {
          position: static;
        }
      }

      @media (max-width: 768px) {
        .custom-hero {
          min-height: 410px;
          padding-top: 112px;
          text-align: center;
        }

        .section-label {
          justify-content: center;
          letter-spacing: 3px;
        }

        .section-label::before {
          width: 24px;
        }

        .custom-section {
          padding: 48px 0;
        }

        .info-card,
        .custom-form {
          padding: 22px;
          border-radius: 22px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        button {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .steps div {
          grid-template-columns: 1fr;
          text-align: center;
        }

        .steps strong {
          margin: 0 auto;
        }
      }
    `,
  ],
})
export class CustomTripComponent {
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
    'Argentina',
    'Australia',
    'Austria',
    'Bahrain',
    'Belgium',
    'Brazil',
    'Canada',
    'China',
    'Denmark',
    'Egypt',
    'France',
    'Germany',
    'Greece',
    'India',
    'Indonesia',
    'Ireland',
    'Italy',
    'Japan',
    'Jordan',
    'Kuwait',
    'Lebanon',
    'Malaysia',
    'Morocco',
    'Netherlands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palestine',
    'Portugal',
    'Qatar',
    'Russia',
    'Saudi Arabia',
    'South Africa',
    'Spain',
    'Sweden',
    'Switzerland',
    'Turkey',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
  ];

  form: any = {
    title: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    departure_date: '',
    arrival_date: '',
    adults: null,
    infants: null,
    children_under_6: null,
    children_under_12: null,
    budget: null,
    notes: '',
  };

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async submit() {
    this.success = false;
    this.errorMessage = '';

    const title = String(this.form.title || '').trim();
    const name = String(this.form.name || '').trim();
    const email = String(this.form.email || '').trim();
    const phone = String(this.form.phone || '').trim();
    const country = String(this.form.country || '').trim();
    const language = String(this.form.language || '').trim();
    const notes = String(this.form.notes || '').trim();

    const adults = Number(this.form.adults);
    const infants = Number(this.form.infants || 0);
    const childrenUnder6 = Number(this.form.children_under_6 || 0);
    const childrenUnder12 = Number(this.form.children_under_12 || 0);
    const budget = this.form.budget ? Number(this.form.budget) : null;

    if (
      !title ||
      !name ||
      !email ||
      !phone ||
      !country ||
      !language ||
      !this.form.departure_date ||
      !this.form.arrival_date ||
      !adults ||
      adults < 1 ||
      !notes
    ) {
      this.errorMessage = 'Please fill in all required custom trip details before sending.';
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.cdr.detectChanges();

    const finalNotes = `Preferred Language: ${language}\n\n${notes}`;

    const payload = {
      title,
      name,
      email,
      phone,
      country,
      departure_date: this.form.departure_date,
      arrival_date: this.form.arrival_date,
      adults,
      infants,
      children_under_6: childrenUnder6,
      children_under_12: childrenUnder12,
      budget,
      notes: finalNotes,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const { error } = await this.supabaseService.insertCustomTrip(payload);

    this.submitting = false;

    if (error) {
      this.errorMessage = error.message;
      this.cdr.detectChanges();
      return;
    }

    this.success = true;

    this.form = {
      title: '',
      name: '',
      email: '',
      phone: '',
      country: '',
      language: '',
      departure_date: '',
      arrival_date: '',
      adults: null,
      infants: null,
      children_under_6: null,
      children_under_12: null,
      budget: null,
      notes: '',
    };

    this.cdr.detectChanges();
  }
}
