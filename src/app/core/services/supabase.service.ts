import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  get supabase() {
    return this.client;
  }

  // Auth
  signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string, fullName: string) {
    return this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  }

  signOut() {
    return this.client.auth.signOut();
  }

  getSession() {
    return this.client.auth.getSession();
  }

  onAuthStateChange(callback: any) {
    return this.client.auth.onAuthStateChange(callback);
  }

  async getCurrentUser() {
    const { data, error } = await this.client.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user;
  }

  // Profiles / Roles
  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error.message);
      return null;
    }

    return data;
  }

  async getProfile() {
    const user = await this.getCurrentUser();

    if (!user) return null;

    const profile = await this.getUserProfile(user.id);

    return {
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.['full_name'] || user.email,
      role: profile?.role || 'user',
    };
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (!user) return false;

    const profile = await this.getUserProfile(user.id);

    return profile?.role === 'admin' || profile?.role === 'super_admin';
  }

  // Admin Stats
  async countRows(table: string): Promise<number> {
    const { count, error } = await this.client
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`Error counting ${table}:`, error.message);
      return 0;
    }

    return count ?? 0;
  }

  async countRowsWhere(table: string, column: string, value: any): Promise<number> {
    const { count, error } = await this.client
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq(column, value);

    if (error) {
      console.error(`Error counting ${table}:`, error.message);
      return 0;
    }

    return count ?? 0;
  }

  // Custom Trips
  insertCustomTrip(payload: any) {
    return this.client.from('custom_trips').insert(payload);
  }

  // Gallery
  getGalleryPreview(limit = 6) {
    return this.client
      .from('gallery')
      .select('id, image_url, title, alt_text, category, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(limit);
  }

  // Reviews
getApprovedReviews(limit = 3) {
  return this.client
    .from('reviews')
    .select('id, name, comment, rating, country, image_url')
    .eq('is_approved', true)
    .limit(limit);
}

getAllApprovedReviews() {
  return this.client
    .from('reviews')
    .select('id, name, comment, rating, country, image_url, created_at')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
}

createReview(payload: any) {
  return this.client.from('reviews').insert(payload);
}

  // Trips - Public
  getTripBySlug(slug: string) {
    return this.client
      .from('trips')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
  }

  // Trips - Admin
  getAllTrips() {
    return this.client.from('trips').select('*').order('created_at', { ascending: false });
  }

  toggleTripStatus(id: string, isActive: boolean) {
    return this.client.from('trips').update({ is_active: !isActive }).eq('id', id);
  }

  toggleTripFeatured(id: string, isFeatured: boolean) {
    return this.client.from('trips').update({ is_featured: !isFeatured }).eq('id', id);
  }

  deleteTrip(id: string) {
    return this.client.from('trips').delete().eq('id', id);
  }

  createTrip(payload: any) {
    return this.client.from('trips').insert(payload).select().single();
  }

  uploadTripImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    return this.client.storage.from('trips').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  }

  getImageUrl(path: string) {
    return this.client.storage.from('trips').getPublicUrl(path).data.publicUrl;
  }

  getLatestBookings(limit = 5) {
    return this.client
      .from('bookings')
      .select(
        `
      id,
      name,
      email,
      travel_date,
      status,
      created_at,
      trips (
        title,
        slug
      )
    `,
      )
      .order('created_at', { ascending: false })
      .limit(limit);
  }

  getAllBookings() {
    return this.client
      .from('bookings')
      .select(
        `
      id,
      name,
      email,
      phone,
      country,
      travel_date,
      adults,
      children,
      status,
      message,
      created_at,
      trips (
        title,
        slug
      )
    `,
      )
      .order('created_at', { ascending: false });
  }

  updateBookingStatus(id: string, status: string) {
    return this.client.from('bookings').update({ status }).eq('id', id);
  }

  deleteBooking(id: string) {
    return this.client.from('bookings').delete().eq('id', id);
  }

  getAllCustomTrips() {
    return this.client.from('custom_trips').select('*').order('created_at', { ascending: false });
  }

  updateCustomTripStatus(id: number, status: string) {
    return this.client.from('custom_trips').update({ status }).eq('id', id);
  }

  updateCustomTripNotes(id: number, admin_notes: string) {
    return this.client.from('custom_trips').update({ admin_notes }).eq('id', id);
  }

  deleteCustomTrip(id: number) {
    return this.client.from('custom_trips').delete().eq('id', id);
  }

  getAllReviews() {
    return this.client.from('reviews').select('*').order('created_at', { ascending: false });
  }

  toggleReviewApproval(id: number, isApproved: boolean) {
    return this.client.from('reviews').update({ is_approved: !isApproved }).eq('id', id);
  }

  deleteReview(id: number) {
    return this.client.from('reviews').delete().eq('id', id);
  }

  // Messages - Admin
  getAllMessages() {
    return this.client.from('messages').select('*').order('created_at', { ascending: false });
  }

  updateMessageStatus(id: number, status: string) {
    return this.client.from('messages').update({ status }).eq('id', id);
  }

  updateMessageNotes(id: number, admin_notes: string) {
    return this.client.from('messages').update({ admin_notes }).eq('id', id);
  }

  deleteMessage(id: number) {
    return this.client.from('messages').delete().eq('id', id);
  }
  // Gallery - Admin
  getAllGalleryImages() {
    return this.client
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
  }

  uploadGalleryImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    return this.client.storage.from('gallery').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  }

  getGalleryImageUrl(path: string) {
    return this.client.storage.from('gallery').getPublicUrl(path).data.publicUrl;
  }

  createGalleryImage(payload: any) {
    return this.client.from('gallery').insert(payload).select().single();
  }

  updateGalleryImage(id: string, payload: any) {
    return this.client.from('gallery').update(payload).eq('id', id);
  }

  toggleGalleryImageStatus(id: string, isActive: boolean) {
    return this.client.from('gallery').update({ is_active: !isActive }).eq('id', id);
  }

  deleteGalleryImage(id: string) {
    return this.client.from('gallery').delete().eq('id', id);
  }

  createBooking(payload: any) {
    return this.client.from('bookings').insert(payload).select().single();
  }

  getAllActiveGalleryImages() {
    return this.client
      .from('gallery')
      .select('id, image_url, title, alt_text, category, sort_order, created_at')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
  }
}
