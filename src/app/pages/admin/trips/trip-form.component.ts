import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="page">
      <div class="header">
        <div>
          <span class="eyebrow">{{ isEdit ? 'Edit Tour' : 'New Tour' }}</span>
          <h2>{{ isEdit ? 'Edit Trip' : 'Add New Trip' }}</h2>
          <p>
            {{
              isEdit
                ? 'Update tour content, itinerary, pricing, and visibility.'
                : 'Create full trip content for the website.'
            }}
          </p>
        </div>

        <a routerLink="/admin/trips">Back to Trips</a>
      </div>

      @if (loadingPage) {
        <div class="state">Loading trip data...</div>
      }

      @if (!loadingPage) {
        <form (ngSubmit)="submit()" class="form">
          <div class="section">
            <div class="section-head">
              <h4>Basic Information</h4>
            </div>

            <div class="grid">
              <input [(ngModel)]="trip.title" name="title" placeholder="Title" required />
              <input [(ngModel)]="trip.slug" name="slug" placeholder="Slug" required />
              <input [(ngModel)]="trip.destination" name="destination" placeholder="Destination" />
              <input [(ngModel)]="trip.location" name="location" placeholder="Location" />
              <input [(ngModel)]="trip.category" name="category" placeholder="Category" />
              <input [(ngModel)]="trip.duration" name="duration" placeholder="Duration" />
              <input [(ngModel)]="trip.price" name="price" type="number" placeholder="Price" />
              <input
                [(ngModel)]="trip.max_people"
                name="max_people"
                type="number"
                placeholder="Max People"
              />
            </div>
          </div>

          <div class="section">
            <div class="section-head">
              <h4>Trip Image</h4>
            </div>

            <div class="image-upload">
              <input
                [(ngModel)]="trip.image_url"
                name="image_url"
                placeholder="Paste image link here"
              />

              @if (trip.image_url) {
                <img [src]="trip.image_url" alt="Trip preview" />
              }
            </div>
          </div>

          <div class="section">
            <div class="section-head">
              <h4>Description</h4>
            </div>

            <textarea
              [(ngModel)]="trip.description"
              name="description"
              placeholder="Description"
            ></textarea>
          </div>

          <div class="section">
            <div class="section-head">
              <h4>Included</h4>
              <button type="button" (click)="addIncluded()">+ Add</button>
            </div>

            @for (item of included; track $index) {
              <div class="dynamic-row">
                <input
                  [(ngModel)]="included[$index]"
                  name="included{{ $index }}"
                  placeholder="Included item"
                />
                <button type="button" class="remove-btn" (click)="removeIncluded($index)">X</button>
              </div>
            }

            @if (!included.length) {
              <p class="empty">No included items yet.</p>
            }
          </div>

          <div class="section">
            <div class="section-head">
              <h4>Excluded</h4>
              <button type="button" (click)="addExcluded()">+ Add</button>
            </div>

            @for (item of excluded; track $index) {
              <div class="dynamic-row">
                <input
                  [(ngModel)]="excluded[$index]"
                  name="excluded{{ $index }}"
                  placeholder="Excluded item"
                />
                <button type="button" class="remove-btn" (click)="removeExcluded($index)">X</button>
              </div>
            }

            @if (!excluded.length) {
              <p class="empty">No excluded items yet.</p>
            }
          </div>

          <div class="section">
            <div class="section-head">
              <h4>Itinerary</h4>
              <button type="button" (click)="addDay()">+ Add Day</button>
            </div>

            @for (day of itinerary; track $index; let dayIndex = $index) {
              <div class="day-box">
                <div class="day-head">
                  <div class="day-number">Day {{ dayIndex + 1 }}</div>

                  <input
                    [(ngModel)]="day.title"
                    name="dayTitle{{ dayIndex }}"
                    placeholder="Day title e.g. Cairo Arrival"
                  />

                  <button type="button" class="remove-day" (click)="removeDay(dayIndex)">
                    Remove
                  </button>
                </div>

                @for (activity of day.activities; track $index; let activityIndex = $index) {
                  <div class="dynamic-row">
                    <input
                      [(ngModel)]="day.activities[activityIndex]"
                      name="activity{{ dayIndex }}_{{ activityIndex }}"
                      placeholder="Activity"
                    />

                    <button
                      type="button"
                      class="remove-btn"
                      (click)="removeActivity(dayIndex, activityIndex)"
                    >
                      X
                    </button>
                  </div>
                }

                <button type="button" class="mini-add" (click)="addActivity(dayIndex)">
                  + Activity
                </button>
              </div>
            }

            @if (!itinerary.length) {
              <p class="empty">No itinerary days yet.</p>
            }
          </div>

          <div class="grid-2">
            <label>
              <input type="checkbox" [(ngModel)]="trip.is_active" name="is_active" />
              Active
            </label>

            <label>
              <input type="checkbox" [(ngModel)]="trip.is_featured" name="is_featured" />
              Featured
            </label>

            <label>
              <input type="checkbox" [(ngModel)]="trip.start_from_price" name="start_from_price" />
              Start From Price
            </label>
          </div>

          @if (error) {
            <div class="error">{{ error }}</div>
          }

          <button type="submit" class="btn-save" [disabled]="saving">
            {{ saving ? 'Saving...' : isEdit ? 'Update Trip' : 'Create Trip' }}
          </button>
        </form>
      }
    </section>
  `,
  styles: [
    `
      .page {
        padding: 28px;
        max-width: 1050px;
        margin: auto;
        color: #0d1b2a;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 24px;
      }

      .eyebrow {
        display: inline-block;
        color: #c6a85c;
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 6px;
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

      .header a {
        text-decoration: none;
        background: #0d1b2a;
        color: #fff;
        padding: 13px 18px;
        border-radius: 999px;
        font-weight: 900;
        white-space: nowrap;
      }

      .header a:hover {
        background: #c6a85c;
        color: #0d1b2a;
      }

      .state {
        background: #fff;
        border: 1px solid rgba(198, 168, 92, 0.24);
        padding: 22px;
        border-radius: 18px;
        font-weight: 900;
        color: #0d1b2a;
        box-shadow: 0 18px 45px rgba(13, 27, 42, 0.08);
      }

      .form {
        display: grid;
        gap: 18px;
        background: rgba(255, 255, 255, 0.94);
        padding: 24px;
        border-radius: 24px;
        border: 1px solid rgba(198, 168, 92, 0.24);
        box-shadow: 0 18px 45px rgba(13, 27, 42, 0.08);
      }

      .section,
      .grid-2,
      .day-box {
        background: #f8f6f1;
        border: 1px solid rgba(198, 168, 92, 0.18);
        border-radius: 18px;
      }

      .section {
        padding: 16px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
      }

      .grid-2 {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        padding: 14px;
      }

      input,
      textarea {
        padding: 14px 16px;
        border: 1px solid rgba(198, 168, 92, 0.24);
        border-radius: 16px;
        font-size: 14px;
        width: 100%;
        outline: none;
        transition: 0.2s;
        background: #fff;
        color: #0d1b2a;
      }

      input:focus,
      textarea:focus {
        border-color: #c6a85c;
        box-shadow: 0 0 0 4px rgba(198, 168, 92, 0.16);
      }

      textarea {
        min-height: 145px;
        resize: vertical;
      }

      .image-upload {
        display: grid;
        gap: 12px;
      }

      .image-upload img {
        width: 100%;
        max-height: 280px;
        object-fit: cover;
        border-radius: 18px;
        border: 1px solid rgba(198, 168, 92, 0.24);
      }

      .section-head,
      .day-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .section h4 {
        margin: 0;
        font-size: 18px;
        font-weight: 900;
      }

      .section-head button,
      .mini-add,
      .remove-day,
      .btn-save,
      .remove-btn {
        border: 0;
        border-radius: 999px;
        font-weight: 900;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .section-head button,
      .mini-add {
        background: #0d1b2a;
        color: #fff;
        padding: 9px 13px;
        font-size: 12px;
        white-space: nowrap;
      }

      .section-head button:hover,
      .mini-add:hover,
      .btn-save:hover {
        background: #c6a85c;
        color: #0d1b2a;
      }

      .dynamic-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }

      .remove-btn,
      .remove-day {
        background: #ef4444;
        color: #fff;
      }

      .remove-btn {
        padding: 0 13px;
      }

      .day-box {
        padding: 14px;
        margin-bottom: 12px;
        background: #fff;
      }

      .day-number {
        background: #c6a85c;
        color: #0d1b2a;
        padding: 11px 13px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 900;
        white-space: nowrap;
      }

      .day-head input {
        flex: 1;
      }

      .remove-day {
        padding: 10px 13px;
        white-space: nowrap;
      }

      .grid-2 label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
      }

      .grid-2 input {
        width: auto;
      }

      .btn-save {
        background: linear-gradient(135deg, #c6a85c, #ead7b5);
        color: #0d1b2a;
        padding: 16px;
        font-size: 14px;
        box-shadow: 0 14px 30px rgba(198, 168, 92, 0.22);
      }

      .btn-save:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .error {
        background: #fee2e2;
        color: #991b1b;
        padding: 14px 16px;
        border-radius: 16px;
        font-weight: 800;
      }

      .empty {
        margin: 0;
        color: #667085;
        background: #fff;
        padding: 12px;
        border-radius: 14px;
        font-weight: 700;
      }

      @media (max-width: 768px) {
        .page {
          padding: 14px;
        }

        .header,
        .section-head,
        .day-head {
          flex-direction: column;
          align-items: stretch;
        }

        .header a {
          text-align: center;
        }

        .form {
          padding: 18px;
          border-radius: 22px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .dynamic-row {
          align-items: stretch;
        }

        .remove-btn {
          min-width: 44px;
        }

        .section-head button,
        .mini-add,
        .remove-day {
          width: 100%;
        }
      }
    `,
  ],
})
export class TripFormComponent implements OnInit {
  isEdit = false;
  loadingPage = false;
  saving = false;
  error = '';

  included: string[] = [];
  excluded: string[] = [];
  itinerary: { title: string; activities: string[] }[] = [];

  trip: any = {
    id: null,
    title: '',
    slug: '',
    destination: '',
    location: '',
    category: '',
    duration: '',
    price: null,
    max_people: null,
    description: '',
    image_url: '',
    is_active: true,
    is_featured: false,
    start_from_price: true,
  };

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.isEdit = true;
    this.loadingPage = true;
    this.cdr.detectChanges();

    const { data, error } = await this.supabase.supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    this.loadingPage = false;

    if (error || !data) {
      this.error = error?.message || 'Trip not found.';
      this.cdr.detectChanges();
      return;
    }

    this.trip = {
      ...this.trip,
      ...data,
    };

    this.included = Array.isArray(data.included) ? data.included : [];
    this.excluded = Array.isArray(data.excluded) ? data.excluded : [];

    this.itinerary = Array.isArray(data.itinerary?.days)
      ? data.itinerary.days.map((day: any) => ({
          title: day.title || '',
          activities: Array.isArray(day.activities) ? day.activities : [],
        }))
      : [];

    this.cdr.detectChanges();
  }

  addIncluded() {
    this.included.push('');
  }

  removeIncluded(i: number) {
    this.included.splice(i, 1);
  }

  addExcluded() {
    this.excluded.push('');
  }

  removeExcluded(i: number) {
    this.excluded.splice(i, 1);
  }

  addDay() {
    this.itinerary.push({
      title: '',
      activities: [''],
    });
  }

  removeDay(i: number) {
    this.itinerary.splice(i, 1);
  }

  addActivity(dayIndex: number) {
    this.itinerary[dayIndex].activities.push('');
  }

  removeActivity(dayIndex: number, activityIndex: number) {
    this.itinerary[dayIndex].activities.splice(activityIndex, 1);
  }

  cleanArray(items: string[]) {
    return items.map((item) => item?.trim()).filter((item) => !!item);
  }

  async submit() {
    this.saving = true;
    this.error = '';
    this.cdr.detectChanges();

    const payload = {
      title: this.trip.title?.trim(),
      slug: this.trip.slug?.trim(),
      destination: this.trip.destination || null,
      location: this.trip.location || null,
      category: this.trip.category || null,
      duration: this.trip.duration || null,
      description: this.trip.description || null,
      image_url: this.trip.image_url || null,
      price: this.trip.price ? Number(this.trip.price) : null,
      max_people: this.trip.max_people ? Number(this.trip.max_people) : null,
      is_active: !!this.trip.is_active,
      is_featured: !!this.trip.is_featured,
      start_from_price: !!this.trip.start_from_price,
      included: this.cleanArray(this.included),
      excluded: this.cleanArray(this.excluded),
      itinerary: {
        days: this.itinerary
          .map((day) => ({
            title: day.title?.trim(),
            activities: this.cleanArray(day.activities),
          }))
          .filter((day) => day.title || day.activities.length),
      },
    };

    const { error } = this.isEdit
      ? await this.supabase.supabase.from('trips').update(payload).eq('id', this.trip.id)
      : await this.supabase.createTrip(payload);

    this.saving = false;

    if (error) {
      this.error = error.message;
      this.cdr.detectChanges();
      return;
    }

    this.router.navigate(['/admin/trips']);
  }
}
