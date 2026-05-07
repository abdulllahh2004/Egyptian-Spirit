import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { TripsService } from '../../../core/services/trips.service';
import { Trip } from '../../../core/models/database.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule, CurrencyPipe],
  template: `
    <section class="hero">
      <div class="hero-overlay"></div>

      <div class="container-fluid hero-content px-5">
        <div class="hero-text">
          <span class="section-label">{{ 'HOME.HERO_SUBTITLE' | translate }}</span>

          <h1>
            {{ 'HOME.HERO_TITLE_1' | translate }} <br />
            {{ 'HOME.HERO_TITLE_2' | translate }}
            <span>{{ 'HOME.HERO_TITLE_GOLD' | translate }}</span>
          </h1>

          <p>{{ 'HOME.HERO_DESC' | translate }}</p>

          <div class="hero-actions">
            <a routerLink="/trips" class="btn btn-gold">{{ 'HOME.EXPLORE_TRIPS' | translate }}</a>
            <a routerLink="/custom-trip" class="btn btn-outline-gold">{{
              'HOME.PLAN_CUSTOM_TRIP' | translate
            }}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section ivory">
      <div class="container">
        <div class="section-head">
          <span class="section-label">{{ 'HOME.FEATURED_LABEL' | translate }}</span>
          <h2>{{ 'HOME.FEATURED_TITLE' | translate }}</h2>
          <p>{{ 'HOME.FEATURED_DESC' | translate }}</p>
        </div>

        <div class="row g-4 mt-3">
          <div class="col-md-4">
            <div class="feature-card">
              <i class="fa-solid fa-landmark"></i>
              <h3>{{ 'HOME.FEATURE_1_TITLE' | translate }}</h3>
              <p>{{ 'HOME.FEATURE_1_DESC' | translate }}</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="feature-card">
              <i class="fa-solid fa-crown"></i>
              <h3>{{ 'HOME.FEATURE_2_TITLE' | translate }}</h3>
              <p>{{ 'HOME.FEATURE_2_DESC' | translate }}</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="feature-card">
              <i class="fa-solid fa-compass"></i>
              <h3>{{ 'HOME.FEATURE_3_TITLE' | translate }}</h3>
              <p>{{ 'HOME.FEATURE_3_DESC' | translate }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section featured-trips-section">
      <div class="container">
        <div class="title-row">
          <div>
            <span class="section-label">{{ 'HOME.FEATURED_TRIPS_LABEL' | translate }}</span>
            <h2>{{ 'HOME.FEATURED_TRIPS_TITLE' | translate }}</h2>
          </div>

          <a routerLink="/trips" class="view-link">{{ 'HOME.VIEW_ALL_TRIPS' | translate }}</a>
        </div>

        <div class="row g-4" *ngIf="featuredTrips.length > 0; else noFeaturedTrips">
          <div class="col-lg-4 col-md-6" *ngFor="let trip of featuredTrips">
            <div class="featured-trip-card">
              <div class="trip-image">
                <img [src]="trip.image_url" [alt]="trip.title" />
                <span class="trip-category">{{ trip.category || 'Egypt' }}</span>
              </div>

              <div class="trip-content">
                <h3>{{ trip.title }}</h3>

                <p class="trip-location">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ trip.destination || trip.location || 'Egypt' }}
                </p>

                <p class="trip-description">{{ trip.description }}</p>

                <div class="trip-bottom">
                  <span>{{ trip.duration }}</span>
                  <strong>
                    {{ trip.start_from_price ? ('HOME.START_FROM' | translate) : '' }}
                    {{ trip.price | currency: 'USD' }}
                  </strong>
                </div>

                <a [routerLink]="['/trips', trip.slug]" class="btn trip-btn">
                  {{ 'HOME.VIEW_DETAILS' | translate }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noFeaturedTrips>
          <div class="empty-gallery">{{ 'HOME.NO_FEATURED_TRIPS' | translate }}</div>
        </ng-template>
      </div>
    </section>

    <section class="section stats-section">
      <div class="container">
        <div class="stats-grid">
          <div>
            <strong>500+</strong>
            <span>{{ 'HOME.STAT_1' | translate }}</span>
          </div>
          <div>
            <strong>50+</strong>
            <span>{{ 'HOME.STAT_2' | translate }}</span>
          </div>
          <div>
            <strong>10+</strong>
            <span>{{ 'HOME.STAT_3' | translate }}</span>
          </div>
          <div>
            <strong>6</strong>
            <span>{{ 'HOME.STAT_4' | translate }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="title-row">
          <div>
            <span class="section-label">{{ 'HOME.SIGNATURE_LABEL' | translate }}</span>
            <h2>{{ 'HOME.SIGNATURE_TITLE' | translate }}</h2>
          </div>
          <a routerLink="/trips" class="view-link">{{ 'HOME.VIEW_ALL_TRIPS' | translate }}</a>
        </div>

        <div class="row g-4">
          <div class="col-lg-4">
            <div class="experience-card">
              <div class="exp-img pyramids"></div>
              <div class="exp-content">
                <h3>{{ 'HOME.EXPERIENCE_1_TITLE' | translate }}</h3>
                <p>{{ 'HOME.EXPERIENCE_1_DESC' | translate }}</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="experience-card">
              <div class="exp-img nile"></div>
              <div class="exp-content">
                <h3>{{ 'HOME.EXPERIENCE_2_TITLE' | translate }}</h3>
                <p>{{ 'HOME.EXPERIENCE_2_DESC' | translate }}</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="experience-card">
              <div class="exp-img desert"></div>
              <div class="exp-content">
                <h3>{{ 'HOME.EXPERIENCE_3_TITLE' | translate }}</h3>
                <p>{{ 'HOME.EXPERIENCE_3_DESC' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section why-section">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <span class="section-label">{{ 'HOME.WHY_LABEL' | translate }}</span>
            <h2>{{ 'HOME.WHY_TITLE' | translate }}</h2>
            <p>{{ 'HOME.WHY_DESC' | translate }}</p>
          </div>

          <div class="col-lg-6">
            <div class="why-grid">
              <div>
                <strong>01</strong><span>{{ 'HOME.WHY_1' | translate }}</span>
              </div>
              <div>
                <strong>02</strong><span>{{ 'HOME.WHY_2' | translate }}</span>
              </div>
              <div>
                <strong>03</strong><span>{{ 'HOME.WHY_3' | translate }}</span>
              </div>
              <div>
                <strong>04</strong><span>{{ 'HOME.WHY_4' | translate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section ivory">
      <div class="container">
        <div class="title-row">
          <div>
            <span class="section-label">{{ 'HOME.GALLERY_LABEL' | translate }}</span>
            <h2>{{ 'HOME.GALLERY_TITLE' | translate }}</h2>
          </div>
          <a routerLink="/gallery" class="view-link">{{ 'HOME.OPEN_GALLERY' | translate }}</a>
        </div>

        <div class="gallery-grid" *ngIf="gallery.length > 0; else noGallery">
          <div class="gallery-item" *ngFor="let item of gallery">
            <img
              [src]="item.image_url"
              [alt]="item.alt_text || item.title || 'Egyptian Spirit Gallery'"
            />

            <div class="gallery-caption">
              <span>{{ item.category || 'Egypt' }}</span>
              <h4>{{ item.title || 'Egyptian Spirit' }}</h4>
            </div>
          </div>
        </div>

        <ng-template #noGallery>
          <div class="empty-gallery">{{ 'HOME.NO_IMAGES' | translate }}</div>
        </ng-template>
      </div>
    </section>

    <section class="section reviews-section">
      <div class="container">
        <div class="section-head">
          <span class="section-label">{{ 'HOME.REVIEWS_LABEL' | translate }}</span>
          <h2>{{ 'HOME.REVIEWS_TITLE' | translate }}</h2>
          <p>{{ 'HOME.REVIEWS_DESC' | translate }}</p>
        </div>

        <div class="row g-4" *ngIf="reviews.length > 0; else noReviews">
          <div class="col-lg-4" *ngFor="let review of reviews">
            <div class="review-card">
              <div class="stars">
                <i class="fa-solid fa-star" *ngFor="let star of getStars(review.rating)"></i>
              </div>

              <p>“{{ review.comment }}”</p>

              <div class="review-user">
                <img *ngIf="review.image_url" [src]="review.image_url" [alt]="review.name" />
                <div class="review-avatar" *ngIf="!review.image_url">
                  {{ review.name?.charAt(0) || 'E' }}
                </div>

                <div>
                  <strong>{{ review.name }}</strong>
                  <small>{{ review.country || 'Traveler' }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noReviews>
          <div class="empty-gallery">{{ 'HOME.NO_REVIEWS' | translate }}</div>
        </ng-template>
      </div>
    </section>

    <section class="section custom-form-section">
      <div class="container">
        <div class="row g-5 align-items-center">
          <div class="col-lg-5">
            <span class="section-label">{{ 'HOME.CUSTOM_LABEL' | translate }}</span>
            <h2>{{ 'HOME.CUSTOM_TITLE' | translate }}</h2>
            <p>{{ 'HOME.CUSTOM_DESC' | translate }}</p>

            <div class="form-points">
              <div><i class="fa-solid fa-check"></i> {{ 'HOME.CUSTOM_POINT_1' | translate }}</div>
              <div><i class="fa-solid fa-check"></i> {{ 'HOME.CUSTOM_POINT_2' | translate }}</div>
              <div><i class="fa-solid fa-check"></i> {{ 'HOME.CUSTOM_POINT_3' | translate }}</div>
            </div>
          </div>

          <div class="col-lg-7">
            <form
              *ngIf="customTripForm"
              class="custom-trip-form"
              [formGroup]="customTripForm"
              (ngSubmit)="submitCustomTrip()"
            >
              <div class="row g-3">
                <div class="col-md-6">
                  <label>{{ 'FORM.NAME' | translate }}</label>
                  <input
                    type="text"
                    formControlName="name"
                    [placeholder]="'FORM.NAME_PLACEHOLDER' | translate"
                  />
                </div>

                <div class="col-md-6">
                  <label>{{ 'FORM.EMAIL' | translate }}</label>
                  <input
                    type="email"
                    formControlName="email"
                    [placeholder]="'FORM.EMAIL_PLACEHOLDER' | translate"
                  />
                </div>

                <div class="col-md-6">
                  <label>{{ 'FORM.PHONE' | translate }}</label>
                  <input
                    type="text"
                    formControlName="phone"
                    [placeholder]="'FORM.PHONE_PLACEHOLDER' | translate"
                  />
                </div>

                <div class="col-md-6">
                  <label>{{ 'FORM.COUNTRY' | translate }}</label>
                  <input
                    type="text"
                    formControlName="country"
                    [placeholder]="'FORM.COUNTRY_PLACEHOLDER' | translate"
                  />
                </div>

                <div class="col-md-6">
                  <label>{{ 'FORM.DEPARTURE_DATE' | translate }}</label>
                  <input type="date" formControlName="departure_date" />
                </div>

                <div class="col-md-6">
                  <label>{{ 'FORM.ARRIVAL_DATE' | translate }}</label>
                  <input type="date" formControlName="arrival_date" />
                </div>

                <div class="col-md-4">
                  <label>{{ 'FORM.ADULTS' | translate }}</label>
                  <input type="number" formControlName="adults" min="1" />
                </div>

                <div class="col-md-4">
                  <label>{{ 'FORM.CHILDREN_UNDER_12' | translate }}</label>
                  <input type="number" formControlName="children_under_12" min="0" />
                </div>

                <div class="col-md-4">
                  <label>{{ 'FORM.BUDGET' | translate }}</label>
                  <input
                    type="number"
                    formControlName="budget"
                    [placeholder]="'FORM.BUDGET_PLACEHOLDER' | translate"
                  />
                </div>

                <div class="col-12">
                  <label>{{ 'FORM.NOTES' | translate }}</label>
                  <textarea
                    rows="4"
                    formControlName="notes"
                    [placeholder]="'FORM.NOTES_PLACEHOLDER' | translate"
                  ></textarea>
                </div>

                <div class="col-12">
                  <button class="btn btn-gold w-100" type="submit" [disabled]="isSubmitting">
                    {{
                      isSubmitting
                        ? ('FORM.SENDING' | translate)
                        : ('FORM.SEND_CUSTOM_TRIP' | translate)
                    }}
                  </button>
                </div>

                <div class="col-12" *ngIf="successMessage">
                  <div class="alert-success-custom">{{ successMessage }}</div>
                </div>

                <div class="col-12" *ngIf="errorMessage">
                  <div class="alert-error-custom">{{ errorMessage }}</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="container">
        <h2>{{ 'HOME.FINAL_CTA_TITLE' | translate }}</h2>
        <p>{{ 'HOME.FINAL_CTA_DESC' | translate }}</p>
        <a routerLink="/trips" class="btn btn-gold">{{ 'HOME.EXPLORE_TRIPS' | translate }}</a>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        overflow-x: hidden;
        background: #f8f6f1;
      }

      .hero {
        position: relative;
        min-height: 100vh;
        padding: 150px 0 90px;
        display: flex;
        align-items: center;
        background-image: url('https://www.propertyfinder.eg/blog/wp-content/uploads/2025/11/shutterstock_2689457771-1-800x534.jpg');
        background-size: cover;
        background-position: center;
        color: #f8f6f1;
        overflow: hidden;
      }

      .hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 18% 30%, rgba(198, 168, 92, 0.22), transparent 30%),
          linear-gradient(
            90deg,
            rgba(13, 27, 42, 0.98) 0%,
            rgba(13, 27, 42, 0.82) 48%,
            rgba(13, 27, 42, 0.28) 100%
          );
        z-index: 1;
      }

      .hero-overlay {
        display: none;
      }

      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 1320px;
      }

      .hero-text {
        max-width: 790px;
        animation: fadeUp 0.7s ease both;
      }

      .section-label {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-family: 'Montserrat', sans-serif;
        color: #c6a85c;
        letter-spacing: 4px;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: 800;
      }

      .section-label::before {
        content: '';
        width: 34px;
        height: 1px;
        background: #c6a85c;
      }

      .section-head {
        text-align: center;
        max-width: 790px;
        margin: 0 auto 42px;
      }

      .section-head .section-label {
        justify-content: center;
      }

      .section-head .section-label::after {
        content: '';
        width: 34px;
        height: 1px;
        background: #c6a85c;
      }

      h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(2.45rem, 6vw, 4.65rem);
        line-height: 1.12;
        margin: 24px 0;
        color: #f8f6f1;
        letter-spacing: 0.04em;
      }

      h1 span {
        color: #c6a85c;
      }

      h2 {
        font-family: 'Cinzel', serif;
        color: #0d1b2a;
        font-size: clamp(2rem, 4vw, 2.9rem);
        line-height: 1.22;
        margin: 14px 0 16px;
        letter-spacing: 0.035em;
      }

      h3 {
        font-family: 'Playfair Display', serif;
        color: #0d1b2a;
        font-size: 25px;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
        line-height: 1.85;
        color: #53606c;
      }

      .hero p {
        color: #ead7b5;
        font-size: 18px;
        max-width: 680px;
        margin-bottom: 34px;
      }

      .hero-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .btn-gold,
      .btn-outline-gold,
      .trip-btn {
        border-radius: 999px;
        padding: 14px 30px;
        font-weight: 900;
        letter-spacing: 0.9px;
        text-transform: uppercase;
        transition: 0.25s ease;
      }

      .btn-gold {
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        border: 1px solid #c6a85c;
        box-shadow: 0 14px 30px rgba(198, 168, 92, 0.28);
      }

      .btn-outline-gold,
      .trip-btn {
        border: 1px solid #c6a85c;
        color: #c6a85c;
        background: transparent;
      }

      .btn-gold:hover,
      .btn-outline-gold:hover,
      .trip-btn:hover {
        transform: translateY(-3px);
        background: #ead7b5;
        border-color: #ead7b5;
        color: #0d1b2a;
      }

      .section {
        padding: 96px 0;
        background: #f8f6f1;
      }

      .ivory {
        background:
          radial-gradient(circle at top left, rgba(198, 168, 92, 0.12), transparent 28%), #f8f6f1;
      }

      .feature-card,
      .experience-card,
      .featured-trip-card,
      .review-card {
        height: 100%;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(198, 168, 92, 0.28);
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 18px 45px rgba(13, 27, 42, 0.08);
        transition: 0.3s ease;
      }

      .featured-trip-card {
        display: flex;
        flex-direction: column;
      }

      .trip-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .feature-card {
        padding: 36px;
      }

      .feature-card:hover,
      .experience-card:hover,
      .featured-trip-card:hover,
      .review-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 24px 55px rgba(13, 27, 42, 0.13);
      }

      .feature-card i {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #0d1b2a;
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        font-size: 27px;
        margin-bottom: 22px;
      }

      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: end;
        margin-bottom: 40px;
        gap: 22px;
      }

      .view-link {
        color: #c6a85c;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 900;
        font-size: 13px;
        white-space: nowrap;
      }

      .experience-card {
        background: #fff;
      }

      .exp-img {
        height: 285px;
        background-size: cover;
        background-position: center;
      }

      .pyramids {
        background-image: url('https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200');
      }

      .nile {
        background-image: url('https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1200');
      }

      .desert {
        background-image: url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200');
      }

      .exp-content,
      .trip-content {
        padding: 28px;
      }

      .trip-image {
        position: relative;
        height: 255px;
        background: #0d1b2a;
        overflow: hidden;
      }

      .trip-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.5s ease;
      }

      .featured-trip-card:hover .trip-image img {
        transform: scale(1.08);
        opacity: 0.84;
      }

      .trip-category {
        position: absolute;
        top: 18px;
        left: 18px;
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1px;
        text-transform: uppercase;
      }

      :host-context([dir='rtl']) .trip-category {
        left: auto;
        right: 18px;
      }

      .trip-location {
        color: #a8873e;
        font-size: 13px;
        margin-bottom: 12px;
        font-weight: 800;
      }

      .trip-location i {
        margin-inline-end: 6px;
      }

      .trip-description {
        font-size: 14px;
        line-height: 1.75;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        min-height: 74px;
      }

      .trip-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid rgba(198, 168, 92, 0.25);
        padding-top: 18px;
        margin-top: auto;
        gap: 12px;
      }

      .trip-bottom span {
        color: #53606c;
        font-size: 13px;
      }

      .trip-bottom strong {
        color: #0d1b2a;
        font-size: 15px;
      }

      .trip-btn {
        width: 100%;
        margin-top: 20px;
        text-align: center;
        padding: 12px;
      }

      .stats-section,
      .why-section {
        background:
          radial-gradient(circle at top right, rgba(198, 168, 92, 0.15), transparent 30%),
          linear-gradient(135deg, #0d1b2a, #07111d);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
      }

      .stats-grid div,
      .why-grid div {
        border: 1px solid rgba(198, 168, 92, 0.32);
        border-radius: 22px;
        padding: 34px 22px;
        text-align: center;
        background: rgba(255, 255, 255, 0.045);
        backdrop-filter: blur(10px);
      }

      .stats-grid strong,
      .why-grid strong {
        display: block;
        color: #c6a85c;
        font-family: 'Cinzel', serif;
        font-size: 40px;
        margin-bottom: 8px;
      }

      .stats-grid span,
      .why-grid span {
        color: #f8f6f1;
        font-weight: 800;
        font-size: 13px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .why-section h2 {
        color: #f8f6f1;
      }

      .why-section p {
        color: #ead7b5;
      }

      .why-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 18px;
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
      }

      .gallery-item {
        position: relative;
        overflow: hidden;
        height: 270px;
        border-radius: 24px;
        border: 1px solid rgba(198, 168, 92, 0.28);
        background: #0d1b2a;
        box-shadow: 0 18px 40px rgba(13, 27, 42, 0.09);
      }

      .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.5s ease;
      }

      .gallery-item:hover img {
        transform: scale(1.08);
        opacity: 0.76;
      }

      .gallery-caption {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 26px;
        background: linear-gradient(to top, rgba(13, 27, 42, 0.94), transparent);
        color: #f8f6f1;
      }

      .gallery-caption span {
        color: #c6a85c;
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .gallery-caption h4 {
        font-family: 'Playfair Display', serif;
        margin: 6px 0 0;
        font-size: 21px;
        color: #f8f6f1;
      }

      .reviews-section,
      .custom-form-section {
        background: #fff;
      }

      .review-card {
        padding: 32px;
      }

      .stars {
        color: #c6a85c;
        margin-bottom: 18px;
        display: flex;
        gap: 4px;
      }

      .review-card p {
        font-style: italic;
        min-height: 92px;
      }

      .review-user {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 24px;
      }

      .review-user img,
      .review-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      .review-avatar {
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
      }

      .review-user strong {
        display: block;
        color: #0d1b2a;
      }

      .review-user small {
        color: #53606c;
      }

      .empty-gallery {
        padding: 36px;
        border: 1px dashed rgba(198, 168, 92, 0.55);
        border-radius: 22px;
        color: #0d1b2a;
        text-align: center;
        background: rgba(198, 168, 92, 0.06);
      }

      .form-points {
        margin-top: 24px;
        display: grid;
        gap: 12px;
        color: #0d1b2a;
        font-weight: 700;
      }

      .form-points i {
        color: #c6a85c;
        margin-inline-end: 8px;
      }

      .custom-trip-form {
        background:
          radial-gradient(circle at top right, rgba(198, 168, 92, 0.12), transparent 32%), #0d1b2a;
        padding: 34px;
        border-radius: 28px;
        border: 1px solid rgba(198, 168, 92, 0.35);
        box-shadow: 0 24px 60px rgba(13, 27, 42, 0.18);
      }

      .custom-trip-form label {
        color: #ead7b5;
        font-size: 13px;
        margin-bottom: 7px;
        display: block;
        font-weight: 700;
      }

      .custom-trip-form input,
      .custom-trip-form textarea {
        width: 100%;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(198, 168, 92, 0.28);
        color: #f8f6f1;
        border-radius: 15px;
        padding: 13px 14px;
        outline: none;
        transition: 0.25s ease;
      }

      .custom-trip-form input:focus,
      .custom-trip-form textarea:focus {
        border-color: #c6a85c;
        background: rgba(255, 255, 255, 0.1);
      }

      .custom-trip-form input::placeholder,
      .custom-trip-form textarea::placeholder {
        color: rgba(248, 246, 241, 0.45);
      }

      .alert-success-custom,
      .alert-error-custom {
        padding: 14px 16px;
        border-radius: 16px;
        font-weight: 800;
      }

      .alert-success-custom {
        color: #0d1b2a;
        background: #ead7b5;
      }

      .alert-error-custom {
        color: #fff;
        background: #8b2d2d;
      }

      .final-cta {
        text-align: center;
        padding: 96px 16px;
        background:
          linear-gradient(rgba(13, 27, 42, 0.9), rgba(13, 27, 42, 0.9)),
          url('https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=1600');
        background-size: cover;
        background-position: center;
      }

      .final-cta h2 {
        color: #f8f6f1;
      }

      .final-cta p {
        color: #ead7b5;
        margin-bottom: 28px;
      }

      :host-context(body.light-mode) .section,
      :host-context(body.light-mode) .ivory {
        background: #f8f6f1;
      }

      :host-context(body.light-mode) .reviews-section,
      :host-context(body.light-mode) .custom-form-section {
        background: #fff;
      }

      :host-context(body.light-mode) .feature-card,
      :host-context(body.light-mode) .experience-card,
      :host-context(body.light-mode) .featured-trip-card,
      :host-context(body.light-mode) .review-card {
        background: rgba(255, 255, 255, 0.92);
      }

      :host-context(body.light-mode) h2,
      :host-context(body.light-mode) h3,
      :host-context(body.light-mode) .trip-bottom strong,
      :host-context(body.light-mode) .review-user strong,
      :host-context(body.light-mode) .form-points {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) p,
      :host-context(body.light-mode) .trip-description,
      :host-context(body.light-mode) .trip-bottom span,
      :host-context(body.light-mode) .review-user small {
        color: #53606c;
      }

      :host-context(body:not(.light-mode)) .section,
      :host-context(body:not(.light-mode)) .ivory,
      :host-context(body:not(.light-mode)) .reviews-section,
      :host-context(body:not(.light-mode)) .custom-form-section {
        background: #07111d;
      }

      :host-context(body:not(.light-mode)) .feature-card,
      :host-context(body:not(.light-mode)) .experience-card,
      :host-context(body:not(.light-mode)) .featured-trip-card,
      :host-context(body:not(.light-mode)) .review-card {
        background: rgba(13, 27, 42, 0.88);
        border-color: rgba(198, 168, 92, 0.32);
      }

      :host-context(body:not(.light-mode)) h2,
      :host-context(body:not(.light-mode)) h3,
      :host-context(body:not(.light-mode)) .trip-bottom strong,
      :host-context(body:not(.light-mode)) .review-user strong,
      :host-context(body:not(.light-mode)) .form-points {
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) p,
      :host-context(body:not(.light-mode)) .trip-description,
      :host-context(body:not(.light-mode)) .trip-bottom span,
      :host-context(body:not(.light-mode)) .review-user small {
        color: #ead7b5;
      }

      :host-context(body:not(.light-mode)) .empty-gallery {
        color: #f8f6f1;
        background: rgba(198, 168, 92, 0.08);
      }

      :host-context(body.light-mode) .stats-section {
        background:
          radial-gradient(circle at top right, rgba(198, 168, 92, 0.12), transparent 30%), #f8f6f1;
      }

      :host-context(body.light-mode) .stats-grid div {
        background: rgba(255, 255, 255, 0.7);
        border-color: rgba(198, 168, 92, 0.35);
      }

      :host-context(body.light-mode) .stats-grid span {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) .stats-grid strong {
        color: #c6a85c;
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(22px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 1199px) {
        .section {
          padding: 82px 0;
        }

        .hero-content {
          padding-inline: 34px !important;
        }
      }

      @media (max-width: 992px) {
        .hero {
          min-height: calc(100vh - 78px);
          padding: 56px 0 72px;
          background-position: center;
        }

        .title-row {
          display: block;
        }

        .view-link {
          display: inline-flex;
          margin-top: 8px;
        }

        .gallery-grid,
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .custom-trip-form {
          margin-top: 10px;
        }
      }

      @media (max-width: 768px) {
        .section {
          padding: 66px 0;
        }

        .hero {
          text-align: center;
        }

        .hero-actions {
          margin-top: 22px;
        }

        .hero::before {
          background: linear-gradient(rgba(13, 27, 42, 0.9), rgba(13, 27, 42, 0.86));
        }

        .hero-text {
          margin: 0 auto;
        }

        .section-label,
        .section-head .section-label {
          justify-content: center;
          letter-spacing: 3px;
          font-size: 11px;
        }

        .section-label::before,
        .section-head .section-label::after {
          width: 24px;
        }

        .hero-actions {
          justify-content: center;
        }

        .btn-gold,
        .btn-outline-gold {
          width: 100%;
          justify-content: center;
        }

        .trip-bottom {
          align-items: flex-start;
          flex-direction: column;
        }
      }

      @media (max-width: 576px) {
        .hero-content {
          padding-inline: 20px !important;
        }

        .hero p {
          font-size: 15px;
        }

        .gallery-grid,
        .why-grid,
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .feature-card,
        .exp-content,
        .trip-content,
        .review-card {
          padding: 24px;
        }

        .gallery-item,
        .exp-img,
        .trip-image {
          height: 230px;
        }

        .custom-trip-form {
          padding: 22px;
          border-radius: 22px;
        }

        .final-cta {
          padding: 70px 16px;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  gallery: any[] = [];
  featuredTrips: Trip[] = [];
  reviews: any[] = [];

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  customTripForm: any;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.customTripForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      country: [''],
      departure_date: [''],
      arrival_date: [''],
      adults: [1, Validators.required],
      children_under_12: [0],
      budget: [null],
      notes: [''],
    });

    await Promise.all([this.loadGallery(), this.loadFeaturedTrips(), this.loadReviews()]);

    this.cdr.detectChanges();
  }

  async loadGallery() {
    const { data, error } = await this.supabaseService.getGalleryPreview(6);

    if (!error && data) {
      this.gallery = [...data];
    }
  }

  async loadFeaturedTrips() {
    const { data, error } = await this.tripsService.getFeaturedTrips(3);

    if (!error && data) {
      this.featuredTrips = [...data];
    }
  }

  async loadReviews() {
    const { data, error } = await this.supabaseService.getApprovedReviews(3);

    if (!error && data) {
      this.reviews = [...data];
    }
  }

  getStars(rating: number) {
    return Array(Math.max(0, Math.min(rating || 0, 5)));
  }

  async submitCustomTrip() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.customTripForm.invalid) {
      this.errorMessage = 'Please fill in your name and a valid email.';
      return;
    }

    this.isSubmitting = true;

    const formValue = this.customTripForm.value;

    const payload = {
      title: 'Custom Trip Request',
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      country: formValue.country,
      departure_date: formValue.departure_date || null,
      arrival_date: formValue.arrival_date || null,
      adults: formValue.adults || 1,
      children_under_12: formValue.children_under_12 || 0,
      children_under_6: 0,
      infants: 0,
      budget: formValue.budget || null,
      notes: formValue.notes,
      status: 'pending',
    };

    const { error } = await this.supabaseService.insertCustomTrip(payload);

    this.isSubmitting = false;

    if (error) {
      this.errorMessage = 'Something went wrong. Please try again.';
      return;
    }

    this.successMessage = 'Your custom trip request has been sent successfully.';

    this.customTripForm.reset({
      adults: 1,
      children_under_12: 0,
    });
  }
}
