import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-gallery-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  template: `
    <section class="page">
      <div class="header">
        <div>
          <h2>Gallery Management</h2>
          <p>Upload, organize, and manage gallery images.</p>
        </div>

        <a routerLink="/admin" class="back-btn">Dashboard</a>
      </div>

      @if (loading) {
        <div class="state">Loading gallery...</div>
      }

      @if (errorMessage) {
        <div class="error">{{ errorMessage }}</div>
      }

      <div class="upload-card">
        <h3>Add Gallery Image</h3>

        <div class="form-grid">
          <input [(ngModel)]="form.title" placeholder="Title" />
          <input [(ngModel)]="form.category" placeholder="Category" />
          <input [(ngModel)]="form.alt_text" placeholder="Alt Text" />
          <input [(ngModel)]="form.sort_order" type="number" placeholder="Sort Order" />
        </div>

        <input type="file" accept="image/*" (change)="onFileSelected($event)" />

        @if (previewUrl) {
          <img class="preview" [src]="previewUrl" alt="Preview" />
        }

        <button class="save-btn" type="button" (click)="createImage()" [disabled]="saving">
          {{ saving ? 'Saving...' : '+ Upload Image' }}
        </button>
      </div>

      <div class="stats">
        <div>
          <span>Total</span>
          <strong>{{ images.length }}</strong>
        </div>

        <div>
          <span>Active</span>
          <strong>{{ activeCount }}</strong>
        </div>

        <div>
          <span>Inactive</span>
          <strong>{{ inactiveCount }}</strong>
        </div>
      </div>

      <div class="gallery-grid">
        @if (!loading && images.length === 0) {
          <div class="empty-card">No gallery images found.</div>
        }

        @for (img of images; track img.id) {
          <article class="image-card">
            <div class="image-wrap">
              <img
                [src]="img.image_url || 'assets/logo-symbol.png'"
                [alt]="img.alt_text || img.title || 'Gallery image'"
              />

              <span class="badge" [class.active]="img.is_active" [class.inactive]="!img.is_active">
                {{ img.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <div class="card-body">
              <input [(ngModel)]="img.title" placeholder="Title" />
              <input [(ngModel)]="img.category" placeholder="Category" />
              <input [(ngModel)]="img.alt_text" placeholder="Alt Text" />
              <input [(ngModel)]="img.sort_order" type="number" placeholder="Sort Order" />

              <small>
                Created: {{ img.created_at ? (img.created_at | date: 'medium') : '-' }}
              </small>

              <div class="actions">
                <button class="update" type="button" (click)="updateImage(img)">Save</button>

                <button class="toggle" type="button" (click)="toggleStatus(img)">
                  {{ img.is_active ? 'Deactivate' : 'Activate' }}
                </button>

                <button class="delete" type="button" (click)="remove(img.id)">Delete</button>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [
    `
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
      .save-btn:hover,
      .update:hover {
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
      .upload-card,
      .stats div,
      .image-card,
      .empty-card {
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 22px;
        box-shadow: 0 18px 45px rgba(13, 27, 42, 0.08);
      }
      .upload-card {
        padding: 20px;
        margin-bottom: 20px;
        display: grid;
        gap: 14px;
      }
      .upload-card h3 {
        margin: 0;
        font-size: 22px;
        font-weight: 900;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
      }
      input {
        width: 100%;
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 16px;
        padding: 12px 14px;
        outline: none;
        background: #fff;
        color: #0d1b2a;
      }
      input:focus {
        border-color: #c6a85c;
        box-shadow: 0 0 0 4px rgba(198, 168, 92, 0.16);
      }
      .preview {
        width: 100%;
        max-height: 260px;
        object-fit: cover;
        border-radius: 18px;
        border: 1px solid rgba(198, 168, 92, 0.24);
      }
      .save-btn {
        background: #0d1b2a;
        color: #fff;
        border: 0;
        padding: 13px 18px;
        font-weight: 900;
        border-radius: 999px;
        cursor: pointer;
        justify-self: start;
      }
      .save-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        margin-bottom: 20px;
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
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }
      .image-card {
        overflow: hidden;
      }
      .image-wrap {
        position: relative;
        height: 220px;
        background: #0d1b2a;
      }
      .image-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .badge {
        position: absolute;
        top: 12px;
        right: 12px;
        display: inline-flex;
        padding: 7px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 900;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .badge.active {
        background: #dcfce7;
        color: #166534;
      }
      .badge.inactive {
        background: #fee2e2;
        color: #991b1b;
      }
      .card-body {
        padding: 16px;
        display: grid;
        gap: 10px;
      }
      .card-body small {
        color: #667085;
        font-weight: 700;
      }
      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
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
      .update {
        background: #0d1b2a;
      }
      .toggle {
        background: #2563eb;
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

      @media (max-width: 1200px) {
        .gallery-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .form-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .page {
          padding: 14px;
        }
        .header {
          flex-direction: column;
        }
        .back-btn,
        .save-btn {
          width: 100%;
          text-align: center;
        }
        .stats,
        .gallery-grid,
        .form-grid {
          grid-template-columns: 1fr;
        }
        .actions {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class GalleryManagementComponent implements OnInit {
  images: any[] = [];
  loading = false;
  saving = false;
  errorMessage = '';

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  form = {
    title: '',
    category: '',
    alt_text: '',
    sort_order: 0,
    is_active: true,
  };

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  get activeCount() {
    return this.images.filter((img) => img.is_active).length;
  }

  get inactiveCount() {
    return this.images.filter((img) => !img.is_active).length;
  }

  async ngOnInit() {
    await this.loadImages();
  }

  async loadImages() {
    this.loading = true;
    this.errorMessage = '';
    this.images = [];
    this.cdr.detectChanges();

    try {
      const response: any = await Promise.race([
        this.supabaseService.getAllGalleryImages(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout. Supabase did not respond.')), 10000),
        ),
      ]);

      console.log('Gallery response:', response);

      if (response?.error) {
        this.zone.run(() => {
          this.errorMessage = response.error.message || 'Failed to load gallery.';
          this.images = [];
          this.loading = false;
          this.cdr.detectChanges();
        });
        return;
      }

      this.zone.run(() => {
        this.images = [...(response?.data || [])];
        this.loading = false;
        this.cdr.detectChanges();
      });
    } catch (err: any) {
      console.error('Gallery error:', err);

      this.zone.run(() => {
        this.errorMessage = err?.message || 'Unexpected error while loading gallery.';
        this.images = [];
        this.loading = false;
        this.cdr.detectChanges();
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.zone.run(() => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      });
    };

    reader.readAsDataURL(file);
  }

  async createImage() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image first.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const { data: uploadData, error: uploadError } =
        await this.supabaseService.uploadGalleryImage(this.selectedFile);

      if (uploadError) {
        this.errorMessage = uploadError.message;
        this.saving = false;
        this.cdr.detectChanges();
        return;
      }

      const imageUrl = this.supabaseService.getGalleryImageUrl(uploadData.path);

      const payload = {
        image_url: imageUrl,
        title: this.form.title,
        category: this.form.category,
        alt_text: this.form.alt_text || this.form.title,
        sort_order: Number(this.form.sort_order) || 0,
        is_active: true,
      };

      const { data, error } = await this.supabaseService.createGalleryImage(payload);

      if (error) {
        this.errorMessage = error.message;
        this.saving = false;
        this.cdr.detectChanges();
        return;
      }

      this.images = data ? [data, ...this.images] : [...this.images];

      this.form = {
        title: '',
        category: '',
        alt_text: '',
        sort_order: 0,
        is_active: true,
      };

      this.selectedFile = null;
      this.previewUrl = null;
      this.saving = false;
      this.cdr.detectChanges();
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to upload image.';
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  async updateImage(img: any) {
    const payload = {
      title: img.title,
      category: img.category,
      alt_text: img.alt_text,
      sort_order: Number(img.sort_order) || 0,
      is_active: img.is_active,
    };

    const { error } = await this.supabaseService.updateGalleryImage(img.id, payload);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Image updated');
  }

  async toggleStatus(img: any) {
    const { error } = await this.supabaseService.toggleGalleryImageStatus(img.id, img.is_active);

    if (error) {
      alert(error.message);
      return;
    }

    img.is_active = !img.is_active;
    this.images = [...this.images];
    this.cdr.detectChanges();
  }

  async remove(id: string) {
    if (!confirm('Delete this gallery image?')) return;

    const { error } = await this.supabaseService.deleteGalleryImage(id);

    if (error) {
      alert(error.message);
      return;
    }

    this.images = this.images.filter((img) => img.id !== id);
    this.cdr.detectChanges();
  }
}
