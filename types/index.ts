// Global Types

export interface User {
  id: string;
  name: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string | null;
  accountType?: "user" | "business" | string;
  phone?: string | null;
  phone_number?: string;
  contactNumber?: string | null;
  profileImageUrl?: string | null;
  preferredLanguage?: string | null;
  phone_verified?: boolean;
  email_verified?: boolean;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
  onboarding_step?: number;
  image?: string;
  avatar?: string;
  businessName?: string;
  businessCategory?: string;
  // Business fields
  business_logo?: string | null;
  brand_color?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  business_category?: string | null;
  business_description?: string | null;
  registration_number?: string | null;
  year_established?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  area?: string | null;
  pincode?: string | null;
  full_address?: string | null;
  google_maps_url?: string | null;
  business_model?: string | null;
  selling_model?: string | null;
  target_age_group?: string[] | null;
  target_gender?: string | null;
  target_location?: string | null;
  customer_type?: string | null;
  [key: string]: any;
}

export interface Business {
  id: string;
  name: string;
  website?: string;
  instagram?: string;
  category: string;
  location: string;
  target_customer?: string;
  preferred_language?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

export interface BrandKit {
  id: string;
  businessId: string;
  logoUrl?: string;
  brandName: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  brandVoice: string;
  targetAudience?: string;
  language?: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  stock: number;
  category: string;
  sku: string;
  images: string[];
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface APIError {
  message: string;
  code?: string;
}
