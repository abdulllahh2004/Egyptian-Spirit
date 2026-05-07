import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Booking } from '../models/database.models';

@Injectable({ providedIn: 'root' })
export class TripsService {
  constructor(private db: SupabaseService) {}

  getActiveTrips() {
    return this.db.supabase
      .from('trips')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
  }

  getTripBySlug(slug: string) {
    return this.db.supabase
      .from('trips')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
  }

  createBooking(payload: Booking) {
    return this.db.supabase.from('bookings').insert(payload);
  }

  getFeaturedTrips(limit = 3) {
    return this.db.supabase
      .from('trips')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(limit);
  }
}
