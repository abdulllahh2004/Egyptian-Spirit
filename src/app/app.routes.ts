import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },

      {
        path: 'trips',
        loadComponent: () =>
          import('./pages/admin/trips/trips-management.component').then(
            (m) => m.TripsManagementComponent,
          ),
      },

      {
        path: 'trips/new',
        loadComponent: () =>
          import('./pages/admin/trips/trip-form.component').then((m) => m.TripFormComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./pages/admin/bookings/bookings-management.component').then(
            (m) => m.BookingsManagementComponent,
          ),
      },
      {
        path: 'custom-trips',
        loadComponent: () =>
          import('./pages/admin/custom-trips/custom-trips-management.component').then(
            (m) => m.CustomTripsManagementComponent,
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./pages/admin/reviews/reviews-management.component').then(
            (m) => m.ReviewsManagementComponent,
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/admin/messages/messages-management.component').then(
            (m) => m.MessagesManagementComponent,
          ),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./pages/admin/gallery/gallery-management.component').then(
            (m) => m.GalleryManagementComponent,
          ),
      },
      {
        path: 'trips/edit/:id',
        loadComponent: () =>
          import('./pages/admin/trips/trip-form.component').then((m) => m.TripFormComponent),
      },
    ],
  },

  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/public/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'trips',
        loadComponent: () =>
          import('./pages/public/trips/trips.component').then((m) => m.TripsComponent),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./pages/public/gallery/gallery.component').then((m) => m.GalleryComponent),
      },
      {
        path: 'trips/:slug',
        loadComponent: () =>
          import('./pages/public/trip-details/trip-details.component').then(
            (m) => m.TripDetailsComponent,
          ),
      },
      {
        path: 'book/:slug',
        loadComponent: () =>
          import('./pages/public/booking/booking.component').then((m) => m.BookingComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/public/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'custom-trip',
        loadComponent: () =>
          import('./pages/public/custom-trip/custom-trip.component').then(
            (m) => m.CustomTripComponent,
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/public/contact/contact.component').then((m) => m.ContactComponent),
      },
    ],
  },
];
