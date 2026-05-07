import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <section class="about-hero">
      <div class="overlay"></div>

      <div class="container hero-content">
        <span class="section-label">{{ 'ABOUT_PAGE.LABEL' | translate }}</span>
        <h1>{{ 'ABOUT_PAGE.TITLE' | translate }}</h1>
        <p>{{ 'ABOUT_PAGE.SUBTITLE' | translate }}</p>
      </div>
    </section>

    <section class="about-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <span class="section-label dark">{{ 'ABOUT_PAGE.STORY_LABEL' | translate }}</span>
            <h2>{{ 'ABOUT_PAGE.STORY_TITLE' | translate }}</h2>
            <p>{{ 'ABOUT_PAGE.STORY_TEXT_1' | translate }}</p>
            <p>{{ 'ABOUT_PAGE.STORY_TEXT_2' | translate }}</p>
          </div>

          <div class="story-card">
            <h3>{{ 'ABOUT_PAGE.PROMISE_TITLE' | translate }}</h3>
            <p>{{ 'ABOUT_PAGE.PROMISE_TEXT' | translate }}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div>
            <strong>20+</strong>
            <span>{{ 'ABOUT_PAGE.STATS.EXPERIENCES' | translate }}</span>
          </div>

          <div>
            <strong>6</strong>
            <span>{{ 'ABOUT_PAGE.STATS.LANGUAGES' | translate }}</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>{{ 'ABOUT_PAGE.STATS.SUPPORT' | translate }}</span>
          </div>

          <div>
            <strong>100%</strong>
            <span>{{ 'ABOUT_PAGE.STATS.CUSTOM' | translate }}</span>
          </div>
        </div>

        <div class="values-head">
          <span class="section-label dark">{{ 'ABOUT_PAGE.VALUES_LABEL' | translate }}</span>
          <h2>{{ 'ABOUT_PAGE.VALUES_TITLE' | translate }}</h2>
        </div>

        <div class="values-grid">
          <article>
            <i class="fa-solid fa-landmark"></i>
            <h3>{{ 'ABOUT_PAGE.VALUES.CULTURE_TITLE' | translate }}</h3>
            <p>{{ 'ABOUT_PAGE.VALUES.CULTURE_TEXT' | translate }}</p>
          </article>

          <article>
            <i class="fa-solid fa-route"></i>
            <h3>{{ 'ABOUT_PAGE.VALUES.CURATION_TITLE' | translate }}</h3>
            <p>{{ 'ABOUT_PAGE.VALUES.CURATION_TEXT' | translate }}</p>
          </article>

          <article>
            <i class="fa-solid fa-handshake"></i>
            <h3>{{ 'ABOUT_PAGE.VALUES.TRUST_TITLE' | translate }}</h3>
            <p>{{ 'ABOUT_PAGE.VALUES.TRUST_TEXT' | translate }}</p>
          </article>
        </div>

        <div class="cta-card">
          <div>
            <span class="section-label">{{ 'ABOUT_PAGE.CTA_LABEL' | translate }}</span>
            <h2>{{ 'ABOUT_PAGE.CTA_TITLE' | translate }}</h2>
            <p>{{ 'ABOUT_PAGE.CTA_TEXT' | translate }}</p>
          </div>

          <div class="cta-actions">
            <a routerLink="/trips" class="primary-btn">
              {{ 'ABOUT_PAGE.CTA_TRIPS' | translate }}
            </a>

            <a routerLink="/custom-trip" class="secondary-btn">
              {{ 'ABOUT_PAGE.CTA_CUSTOM' | translate }}
            </a>
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

  .about-hero {
    position: relative;
    min-height: 450px;
    background: #0d1b2a;
    display: flex;
    align-items: center;
    color: #f8f6f1;
    padding-top: 96px;
    overflow: hidden;
  }

  .about-hero::before {
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

  .about-hero p {
    color: #ead7b5;
    max-width: 760px;
    font-size: 17px;
    line-height: 1.85;
    margin: 0;
  }

  .about-section {
    background:
      radial-gradient(circle at top left, rgba(198, 168, 92, 0.11), transparent 30%),
      #f8f6f1;
    padding: 76px 0;
  }

  .story-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
    gap: 28px;
    align-items: stretch;
    margin-bottom: 30px;
  }

  .story-content,
  .story-card,
  .values-grid article,
  .cta-card {
    border: 1px solid rgba(198, 168, 92, 0.24);
    border-radius: 26px;
    box-shadow: 0 22px 55px rgba(13, 27, 42, 0.09);
    overflow: hidden;
  }

  .story-content,
  .values-grid article {
    background: rgba(255, 255, 255, 0.94);
  }

  .story-content {
    padding: 34px;
  }

  .story-content h2,
  .values-head h2,
  .cta-card h2 {
    font-family: 'Cinzel', serif;
    color: #0d1b2a;
    font-size: clamp(30px, 4vw, 46px);
    margin: 0 0 18px;
    line-height: 1.18;
  }

  .story-content p,
  .story-card p,
  .values-grid p,
  .cta-card p {
    color: #4c5560;
    line-height: 1.85;
    margin: 0 0 14px;
    font-size: 15px;
  }

  .story-card {
    padding: 32px;
    background:
      radial-gradient(circle at top right, rgba(198, 168, 92, 0.18), transparent 32%),
      linear-gradient(180deg, #0d1b2a, #13263a);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .story-card h3 {
    font-family: 'Cinzel', serif;
    color: #c6a85c;
    font-size: 28px;
    margin: 0 0 14px;
  }

  .story-card p {
    color: #ead7b5;
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 62px;
  }

  .stats-grid div {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(198, 168, 92, 0.24);
    border-radius: 24px;
    padding: 26px;
    text-align: center;
    box-shadow: 0 16px 40px rgba(13, 27, 42, 0.07);
  }

  .stats-grid strong {
    display: block;
    font-family: 'Cinzel', serif;
    font-size: 38px;
    color: #0d1b2a;
    margin-bottom: 8px;
  }

  .stats-grid span {
    color: #6b7280;
    font-weight: 900;
    font-size: 13px;
    text-transform: uppercase;
  }

  .values-head {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 30px;
  }

  .values-head .section-label {
    justify-content: center;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
    margin-bottom: 62px;
  }

  .values-grid article {
    padding: 30px;
    transition: 0.25s ease;
  }

  .values-grid article:hover {
    transform: translateY(-7px);
    box-shadow: 0 26px 60px rgba(13, 27, 42, 0.13);
  }

  .values-grid i {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #0d1b2a;
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    font-size: 26px;
    margin-bottom: 20px;
  }

  .values-grid h3 {
    font-family: 'Cinzel', serif;
    color: #0d1b2a;
    font-size: 23px;
    margin: 0 0 12px;
  }

  .values-grid p {
    margin: 0;
  }

  .cta-card {
    background:
      radial-gradient(circle at 80% 20%, rgba(198, 168, 92, 0.28), transparent 34%),
      linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(13, 27, 42, 0.88));
    padding: 36px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: center;
    color: #fff;
  }

  .cta-card h2 {
    color: #fff;
  }

  .cta-card p {
    color: #ead7b5;
    margin: 0;
    max-width: 680px;
  }

  .cta-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .primary-btn,
  .secondary-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 48px;
    border-radius: 999px;
    padding: 0 20px;
    text-decoration: none;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.8px;
    transition: 0.25s ease;
    white-space: nowrap;
  }

  .primary-btn {
    background: linear-gradient(135deg, #c6a85c, #ead7b5);
    color: #0d1b2a;
  }

  .secondary-btn {
    border: 1px solid rgba(198, 168, 92, 0.55);
    color: #ead7b5;
  }

  .primary-btn:hover,
  .secondary-btn:hover {
    transform: translateY(-2px);
    background: #ead7b5;
    color: #0d1b2a;
    border-color: #ead7b5;
  }

  :host-context(body:not(.light-mode)) {
    background: #07111d;
  }

  :host-context(body:not(.light-mode)) .about-section {
    background:
      radial-gradient(circle at top left, rgba(198, 168, 92, 0.12), transparent 30%),
      #07111d;
  }

  :host-context(body:not(.light-mode)) .story-content,
  :host-context(body:not(.light-mode)) .values-grid article,
  :host-context(body:not(.light-mode)) .stats-grid div {
    background: rgba(13, 27, 42, 0.93);
    border-color: rgba(198, 168, 92, 0.32);
  }

  :host-context(body:not(.light-mode)) .story-content h2,
  :host-context(body:not(.light-mode)) .values-head h2,
  :host-context(body:not(.light-mode)) .values-grid h3,
  :host-context(body:not(.light-mode)) .stats-grid strong {
    color: #f8f6f1;
  }

  :host-context(body:not(.light-mode)) .story-content p,
  :host-context(body:not(.light-mode)) .values-grid p,
  :host-context(body:not(.light-mode)) .stats-grid span {
    color: #ead7b5;
  }

  @media (max-width: 992px) {
    .story-grid,
    .cta-card {
      grid-template-columns: 1fr;
    }

    .stats-grid,
    .values-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .cta-actions {
      justify-content: flex-start;
    }
  }

  @media (max-width: 768px) {
    .about-hero {
      min-height: 390px;
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

    .about-section {
      padding: 48px 0;
    }

    .story-content,
    .story-card,
    .values-grid article,
    .cta-card {
      padding: 22px;
      border-radius: 22px;
    }

    .stats-grid,
    .values-grid {
      grid-template-columns: 1fr;
    }

    .primary-btn,
    .secondary-btn {
      width: 100%;
    }
  }
`],
})
export class AboutComponent {}
