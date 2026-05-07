import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <section class="gallery-hero">
      <div class="overlay"></div>

      <div class="container hero-content">
        <span class="section-label">{{ 'GALLERY_PAGE.LABEL' | translate }}</span>
        <h1>{{ 'GALLERY_PAGE.TITLE' | translate }}</h1>
        <p>{{ 'GALLERY_PAGE.SUBTITLE' | translate }}</p>
      </div>
    </section>

    <section class="gallery-section">
      <div class="container">

        @if (loading) {
          <div class="state">{{ 'GALLERY_PAGE.LOADING' | translate }}</div>
        }

        @if (!loading && errorMessage) {
          <div class="state error">{{ errorMessage }}</div>
        }

        @if (!loading && !errorMessage && filteredImages.length) {
          <div class="gallery-grid">
            @for (image of filteredImages; track image.id) {
              <article class="gallery-card" (click)="openImage(image)">
                <img
                  [src]="image.image_url || 'assets/logo-symbol.png'"
                  [alt]="image.alt_text || image.title || 'Gallery image'"
                />

                <div class="card-overlay">
                  <span>{{ image.category || ('GALLERY_PAGE.DEFAULT_CATEGORY' | translate) }}</span>
                  <h3>{{ image.title || ('GALLERY_PAGE.UNTITLED' | translate) }}</h3>
                </div>
              </article>
            }
          </div>
        }

        @if (!loading && !errorMessage && !filteredImages.length) {
          <div class="state empty">
            {{ 'GALLERY_PAGE.NO_IMAGES' | translate }}
          </div>
        }
      </div>
    </section>

    @if (selectedImage) {
      <div class="lightbox" (click)="closeImage()">
        <button type="button" class="close-btn" (click)="closeImage()">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <img
            [src]="selectedImage.image_url"
            [alt]="selectedImage.alt_text || selectedImage.title || 'Gallery image'"
          />

          <div class="lightbox-caption">
            <span>{{
              selectedImage.category || ('GALLERY_PAGE.DEFAULT_CATEGORY' | translate)
            }}</span>
            <h3>{{ selectedImage.title || ('GALLERY_PAGE.UNTITLED' | translate) }}</h3>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        background: #f8f6f1;
        overflow-x: hidden;
      }

      .gallery-hero {
        position: relative;
        min-height: 450px;
        background: #0d1b2a;
        display: flex;
        align-items: center;
        color: #f8f6f1;
        padding-top: 96px;
        overflow: hidden;
      }

      .gallery-hero::before {
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

      h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(42px, 6vw, 72px);
        line-height: 1.05;
        margin: 0 0 18px;
        letter-spacing: 0.04em;
      }

      .gallery-hero p {
        color: #ead7b5;
        max-width: 720px;
        font-size: 17px;
        line-height: 1.85;
        margin: 0;
      }

      .gallery-section {
        background:
          radial-gradient(circle at top left, rgba(198, 168, 92, 0.11), transparent 30%), #f8f6f1;
        padding: 72px 0;
        min-height: 60vh;
      }

      .filters-card {
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 24px;
        box-shadow: 0 22px 55px rgba(13, 27, 42, 0.08);
        padding: 18px;
        margin-bottom: 34px;
        display: grid;
        grid-template-columns: 1fr 260px;
        gap: 14px;
      }

      input,
      select {
        width: 100%;
        border: 1px solid rgba(198, 168, 92, 0.24);
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

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
      }

      .gallery-card {
        position: relative;
        height: 315px;
        overflow: hidden;
        border-radius: 26px;
        background: #0d1b2a;
        cursor: pointer;
        box-shadow: 0 22px 55px rgba(13, 27, 42, 0.1);
        border: 1px solid rgba(198, 168, 92, 0.24);
      }

      .gallery-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: 0.45s ease;
      }

      .gallery-card:hover img {
        transform: scale(1.08);
        opacity: 0.82;
      }

      .card-overlay {
        position: absolute;
        inset: auto 0 0;
        padding: 24px;
        background: linear-gradient(to top, rgba(13, 27, 42, 0.96), transparent);
        color: #fff;
      }

      .card-overlay span {
        color: #c6a85c;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.2px;
      }

      .card-overlay h3 {
        font-family: 'Cinzel', serif;
        margin: 8px 0 0;
        font-size: 22px;
        line-height: 1.28;
      }

      .state {
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 24px;
        padding: 32px;
        text-align: center;
        color: #0d1b2a;
        font-family: 'Cinzel', serif;
        font-size: 24px;
        font-weight: 800;
      }

      .state.empty {
        color: #6b7280;
      }

      .state.error {
        color: #991b1b;
        background: #fee2e2;
      }

      .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(13, 27, 42, 0.94);
        z-index: 2000;
        display: grid;
        place-items: center;
        padding: 24px;
        backdrop-filter: blur(10px);
      }

      .lightbox-content {
        width: min(980px, 100%);
        background: #0d1b2a;
        border: 1px solid rgba(198, 168, 92, 0.35);
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
      }

      .lightbox-content img {
        width: 100%;
        max-height: 72vh;
        object-fit: contain;
        display: block;
        background: #050b12;
      }

      .lightbox-caption {
        padding: 20px 24px;
        color: #fff;
      }

      .lightbox-caption span {
        color: #c6a85c;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.2px;
      }

      .lightbox-caption h3 {
        font-family: 'Cinzel', serif;
        margin: 8px 0 0;
      }

      .close-btn {
        position: fixed;
        top: 22px;
        right: 22px;
        width: 46px;
        height: 46px;
        border: 1px solid rgba(198, 168, 92, 0.45);
        border-radius: 50%;
        background: #0d1b2a;
        color: #c6a85c;
        font-size: 20px;
        z-index: 2001;
        transition: 0.25s ease;
      }

      .close-btn:hover {
        background: #c6a85c;
        color: #0d1b2a;
      }

      :host-context([dir='rtl']) .close-btn {
        right: auto;
        left: 22px;
      }

      :host-context(body:not(.light-mode)) {
        background: #07111d;
      }

      :host-context(body:not(.light-mode)) .gallery-section {
        background:
          radial-gradient(circle at top left, rgba(198, 168, 92, 0.12), transparent 30%), #07111d;
      }

      :host-context(body:not(.light-mode)) .filters-card,
      :host-context(body:not(.light-mode)) .state {
        background: rgba(13, 27, 42, 0.93);
        border-color: rgba(198, 168, 92, 0.32);
      }

      :host-context(body:not(.light-mode)) input,
      :host-context(body:not(.light-mode)) select {
        background: rgba(255, 255, 255, 0.07);
        color: #f8f6f1;
        border-color: rgba(198, 168, 92, 0.28);
      }

      :host-context(body:not(.light-mode)) input::placeholder {
        color: rgba(248, 246, 241, 0.5);
      }

      :host-context(body:not(.light-mode)) select option {
        background: #0d1b2a;
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) .state {
        color: #f8f6f1;
      }

      :host-context(body:not(.light-mode)) .state.empty {
        color: #ead7b5;
      }

      :host-context(body.light-mode) .lightbox {
        background: rgba(248, 246, 241, 0.92);
      }

      :host-context(body.light-mode) .lightbox-content {
        background: #f8f6f1;
        border-color: rgba(198, 168, 92, 0.42);
      }

      :host-context(body.light-mode) .lightbox-content img {
        background: #ead7b5;
      }

      :host-context(body.light-mode) .lightbox-caption {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) .lightbox-caption h3 {
        color: #0d1b2a;
      }

      :host-context(body.light-mode) .close-btn {
        background: #f8f6f1;
        color: #8b6f2f;
        border-color: rgba(139, 111, 47, 0.45);
      }

      :host-context(body.light-mode) .close-btn:hover {
        background: #c6a85c;
        color: #0d1b2a;
      }

      @media (max-width: 1200px) {
        .gallery-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .gallery-hero {
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

        .gallery-section {
          padding: 48px 0;
        }

        .filters-card,
        .gallery-grid {
          grid-template-columns: 1fr;
        }

        .gallery-card {
          height: 260px;
          border-radius: 22px;
        }

        .lightbox {
          padding: 14px;
        }

        .lightbox-content {
          border-radius: 18px;
        }
      }

      @media (max-width: 480px) {
        .gallery-card {
          height: 235px;
        }

        .filters-card {
          padding: 14px;
          border-radius: 20px;
        }

        .close-btn {
          top: 14px;
          right: 14px;
        }

        :host-context([dir='rtl']) .close-btn {
          right: auto;
          left: 14px;
        }
      }
    `,
  ],
})
export class GalleryComponent implements OnInit {
  images: any[] = [];
  loading = true;
  errorMessage = '';

  searchTerm = '';
  selectedCategory = 'all';
  selectedImage: any = null;

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  get categories(): string[] {
    return Array.from(new Set(this.images.map((img) => img.category).filter(Boolean)));
  }

  get filteredImages(): any[] {
    return this.images.filter((img) => {
      const search = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        img.title?.toLowerCase().includes(search) ||
        img.category?.toLowerCase().includes(search) ||
        img.alt_text?.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'all' || img.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const { data, error } = await this.supabaseService.getAllActiveGalleryImages();

    this.loading = false;

    if (error) {
      this.errorMessage = error.message;
      this.images = [];
      this.cdr.detectChanges();
      return;
    }

    this.images = data || [];
    this.cdr.detectChanges();
  }

  openImage(image: any) {
    this.selectedImage = image;
  }

  closeImage() {
    this.selectedImage = null;
  }
}
