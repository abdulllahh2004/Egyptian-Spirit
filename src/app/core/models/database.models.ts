export interface Trip {
  id: string;
  title: string;
  slug: string;
  duration: string;
  description: string;
  price: number;
  image_url: string;
  destination?: string;
  category?: string;
  location?: string;
  is_featured?: boolean;
  is_active?: boolean;
  max_people?: number;
  start_from_price?: boolean;
  included?: string[];
  excluded?: string[];
  itinerary?: any;
}

export interface Booking {
  id?: string;
  trip_id?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  language?: string;
  message?: string;
  status?: string;
  adults?: number;
  children?: number;
  travel_date?: string;
  notes?: string;
}
