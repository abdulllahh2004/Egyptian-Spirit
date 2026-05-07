import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink],
  template: `
    <section class="contact-hero">
      <div class="overlay"></div>

      <div class="container hero-content">
        <span class="section-label">{{ 'CONTACT_PAGE.LABEL' | translate }}</span>
        <h1>{{ 'CONTACT_PAGE.TITLE' | translate }}</h1>
        <p>{{ 'CONTACT_PAGE.SUBTITLE' | translate }}</p>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-cards">
          <div class="info-card">
            <i class="fa-solid fa-envelope"></i>
            <span>{{ 'CONTACT_PAGE.EMAIL_LABEL' | translate }}</span>
            <strong>info@egyptianspirit.com</strong>
          </div>

          <div class="info-card">
            <i class="fa-solid fa-phone"></i>
            <span>{{ 'CONTACT_PAGE.PHONE_LABEL' | translate }}</span>
            <strong>+20 100 000 0000</strong>
          </div>

          <div class="info-card">
            <i class="fa-solid fa-location-dot"></i>
            <span>{{ 'CONTACT_PAGE.LOCATION_LABEL' | translate }}</span>
            <strong>Cairo, Egypt</strong>
          </div>
        </div>

        <div class="contact-grid">
          <div class="left-panel">
            <span class="section-label dark">{{ 'CONTACT_PAGE.FORM_LABEL' | translate }}</span>
            <h2>{{ 'CONTACT_PAGE.FORM_TITLE' | translate }}</h2>
            <p>{{ 'CONTACT_PAGE.FORM_TEXT' | translate }}</p>

            <div class="mini-list">
              <div>
                <i class="fa-solid fa-check"></i>
                {{ 'CONTACT_PAGE.BENEFITS.FAST' | translate }}
              </div>

              <div>
                <i class="fa-solid fa-check"></i>
                {{ 'CONTACT_PAGE.BENEFITS.CUSTOM' | translate }}
              </div>

              <div>
                <i class="fa-solid fa-check"></i>
                {{ 'CONTACT_PAGE.BENEFITS.SUPPORT' | translate }}
              </div>
            </div>

            <a routerLink="/custom-trip" class="plan-link">
              {{ 'CONTACT_PAGE.PLAN_LINK' | translate }}
            </a>
          </div>

          <form class="contact-form" (ngSubmit)="submit()">
            <div class="grid">
              <input
                [(ngModel)]="form.name"
                name="name"
                [placeholder]="'CONTACT_PAGE.FORM.NAME' | translate"
                required
              />

              <input
                [(ngModel)]="form.email"
                name="email"
                type="email"
                [placeholder]="'CONTACT_PAGE.FORM.EMAIL' | translate"
                required
              />

              <input
                [(ngModel)]="form.phone"
                name="phone"
                [placeholder]="'CONTACT_PAGE.FORM.PHONE' | translate"
              />

              <input
                [(ngModel)]="form.subject"
                name="subject"
                [placeholder]="'CONTACT_PAGE.FORM.SUBJECT' | translate"
              />
            </div>

            <textarea
              [(ngModel)]="form.message"
              name="message"
              [placeholder]="'CONTACT_PAGE.FORM.MESSAGE' | translate"
              required
            ></textarea>

            @if (success) {
              <div class="success">{{ 'CONTACT_PAGE.SUCCESS' | translate }}</div>
            }

            @if (errorMessage) {
              <div class="error">{{ errorMessage }}</div>
            }

            <button type="submit" [disabled]="loading">
              {{ loading ? ('CONTACT_PAGE.SENDING' | translate) : ('CONTACT_PAGE.SEND' | translate) }}
            </button>
          </form>
        </div>

        <div class="faq-section">
          <div class="faq-head">
            <span class="section-label dark">{{ 'CONTACT_PAGE.FAQ_LABEL' | translate }}</span>
            <h2>{{ 'CONTACT_PAGE.FAQ_TITLE' | translate }}</h2>
          </div>

          <div class="faq-grid">
            <article>
              <h3>{{ 'CONTACT_PAGE.FAQ.Q1' | translate }}</h3>
              <p>{{ 'CONTACT_PAGE.FAQ.A1' | translate }}</p>
            </article>

            <article>
              <h3>{{ 'CONTACT_PAGE.FAQ.Q2' | translate }}</h3>
              <p>{{ 'CONTACT_PAGE.FAQ.A2' | translate }}</p>
            </article>

            <article>
              <h3>{{ 'CONTACT_PAGE.FAQ.Q3' | translate }}</h3>
              <p>{{ 'CONTACT_PAGE.FAQ.A3' | translate }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
  :host {
    display: block;
    background: #f8f6f1;
    overflow-x: hidden;
  }

  .contact-hero {
    position: relative;
    min-height: 450px;
    background: #0d1b2a;
    display: flex;
    align-items: center;
    color: #f8f6f1;
    padding-top: 96px;
    overflow: hidden;
  }

  .contact-hero::before {
    content: "";
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
    max-width: 860px;
    letter-spacing: 0.04em;
  }

  .contact-hero p {
    color: #ead7b5;
    max-width: 760px;
    font-size: 17px;
    line-height: 1.85;
    margin: 0;
  }

  .contact-section {
    background:
      radial-gradient(circle at top left, rgba(198, 168, 92, 0.11), transparent 30%),
      #f8f6f1;
    padding: 72px 0;
    min-height: 60vh;
  }

  .contact-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 28px;
  }

  .info-card,
  .left-panel,
  .contact-form,
  .faq-grid article {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(198, 168, 92, 0.24);
    border-radius: 24px;
    box-shadow: 0 22px 55px rgba(13, 27, 42, 0.08);
  }

  .info-card {
    padding: 26px;
    display: grid;
    gap: 8px;
    transition: 0.25s ease;
  }

  .info-card:hover {
    transform: translateY(-5px);
  }

  .info-card i {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #0d1b2a;
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    font-size: 23px;
    margin-bottom: 8px;
  }

  .info-card span {
    color: #6b7280;
    font-weight: 900;
    font-size: 12px;
    text-transform: uppercase;
  }

  .info-card strong {
    color: #0d1b2a;
    font-size: 17px;
    word-break: break-word;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: minmax(300px, 0.85fr) minmax(0, 1.15fr);
    gap: 26px;
    align-items: stretch;
    margin-bottom: 62px;
  }

  .left-panel,
  .contact-form {
    padding: 30px;
  }

  .left-panel h2,
  .faq-head h2 {
    font-family: 'Cinzel', serif;
    color: #0d1b2a;
    font-size: clamp(30px, 4vw, 44px);
    margin: 0 0 16px;
    line-height: 1.18;
  }

  .left-panel p {
    color: #4c5560;
    line-height: 1.85;
    margin: 0 0 22px;
  }

  .mini-list {
    display: grid;
    gap: 12px;
    margin-bottom: 24px;
  }

  .mini-list div {
    display: flex;
    gap: 10px;
    align-items: center;
    color: #0d1b2a;
    font-weight: 800;
  }

  .mini-list i {
    color: #c6a85c;
  }

  .plan-link {
    display: inline-flex;
    background: #0d1b2a;
    color: #fff;
    text-decoration: none;
    padding: 14px 20px;
    border-radius: 999px;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.8px;
    transition: 0.25s ease;
  }

  .plan-link:hover {
    transform: translateY(-2px);
    background: #c6a85c;
    color: #0d1b2a;
  }

  .contact-form {
    display: grid;
    gap: 14px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  input,
  textarea {
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

  input:focus,
  textarea:focus {
    border-color: #c6a85c;
    box-shadow: 0 0 0 4px rgba(198, 168, 92, 0.16);
  }

  textarea {
    min-height: 150px;
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
  .error {
    padding: 14px 16px;
    border-radius: 16px;
    font-weight: 800;
  }

  .success {
    background: #dcfce7;
    color: #166534;
  }

  .error {
    background: #fee2e2;
    color: #991b1b;
  }

  .faq-head {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 28px;
  }

  .faq-head .section-label {
    justify-content: center;
  }

  .faq-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .faq-grid article {
    padding: 26px;
  }

  .faq-grid h3 {
    font-family: 'Cinzel', serif;
    margin: 0 0 10px;
    color: #0d1b2a;
    font-size: 20px;
  }

  .faq-grid p {
    color: #4c5560;
    line-height: 1.75;
    margin: 0;
  }

  :host-context(body:not(.light-mode)) {
    background: #07111d;
  }

  :host-context(body:not(.light-mode)) .contact-section {
    background:
      radial-gradient(circle at top left, rgba(198, 168, 92, 0.12), transparent 30%),
      #07111d;
  }

  :host-context(body:not(.light-mode)) .info-card,
  :host-context(body:not(.light-mode)) .left-panel,
  :host-context(body:not(.light-mode)) .contact-form,
  :host-context(body:not(.light-mode)) .faq-grid article {
    background: rgba(13, 27, 42, 0.93);
    border-color: rgba(198, 168, 92, 0.32);
  }

  :host-context(body:not(.light-mode)) .info-card strong,
  :host-context(body:not(.light-mode)) .left-panel h2,
  :host-context(body:not(.light-mode)) .faq-head h2,
  :host-context(body:not(.light-mode)) .faq-grid h3,
  :host-context(body:not(.light-mode)) .mini-list div {
    color: #f8f6f1;
  }

  :host-context(body:not(.light-mode)) .info-card span,
  :host-context(body:not(.light-mode)) .left-panel p,
  :host-context(body:not(.light-mode)) .faq-grid p {
    color: #ead7b5;
  }

  :host-context(body:not(.light-mode)) input,
  :host-context(body:not(.light-mode)) textarea {
    background: rgba(255, 255, 255, 0.07);
    color: #f8f6f1;
    border-color: rgba(198, 168, 92, 0.28);
  }

  :host-context(body:not(.light-mode)) input::placeholder,
  :host-context(body:not(.light-mode)) textarea::placeholder {
    color: rgba(248, 246, 241, 0.5);
  }

  @media (max-width: 992px) {
    .contact-cards,
    .faq-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .contact-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .contact-hero {
      min-height: 400px;
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

    .contact-section {
      padding: 48px 0;
    }

    .contact-cards,
    .faq-grid,
    .grid {
      grid-template-columns: 1fr;
    }

    .left-panel,
    .contact-form,
    .info-card,
    .faq-grid article {
      padding: 22px;
      border-radius: 22px;
    }

    .info-card {
      text-align: center;
      justify-items: center;
    }

    .mini-list div {
      justify-content: center;
      text-align: center;
    }

    .plan-link,
    button {
      width: 100%;
      justify-content: center;
      text-align: center;
    }
  }
`],
})
export class ContactComponent {
  loading = false;
  success = false;
  errorMessage = '';

  form: any = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  async submit() {
    this.loading = true;
    this.success = false;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const { error } = await this.supabaseService.supabase
      .from('messages')
      .insert({
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        message: this.form.subject
          ? `${this.form.subject}\n\n${this.form.message}`
          : this.form.message,
        status: 'new',
      });

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
      this.cdr.detectChanges();
      return;
    }

    this.success = true;
    this.form = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    };

    this.cdr.detectChanges();
  }
}
