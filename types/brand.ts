export interface ContactInfo {
    phone?: string;
    email?: string;
}

export interface LocationInfo {
    city?: string;
    state?: string;
}

export interface BrandKit {
    id: string;
    business_id: string;

    logo_url?: string;

    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;

    font?: string;
    tone?: string;

    brand_description?: string;
    business_description?: string;
    target_audience?: string;

    website?: string;
    instagram?: string;

    contact?: ContactInfo;
    location?: LocationInfo;

    social_style?: string;

    // Rich Business Information
    business_name?: string;
    business_type?: string;
    registration_number?: string;
    business_model?: string;
    selling_model?: string;
    business_category?: string;
    age_group?: string;
    gender?: string;
    customer_type?: string;
    location_focus?: string;

    // Website Onboarding Extracted & Brand Kit Fields
    palette?: string[];
    brand_colors?: string[];
    tones?: string[];
    business_types?: string[];
    primary_business_type?: string;
    sub_category?: string;
    city?: string;
    differentiators?: string[];
    products_services?: string[];
    selected_photos?: string[];
    target_audience_summary?: string;
    services_products_summary?: string[];
    tagline?: string;
    language?: string;
    marketplaces?: string[];
    marketplace_listings?: string[];
    b2b_platforms?: string[];
    b2b_listings?: string[];

    created_at?: string;
    updated_at?: string;
}

export interface BrandCreate {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    font?: string;
    tone?: string;
    brand_description?: string;
    business_description?: string;
    target_audience?: string;
    website?: string;
    instagram?: string;
    contact?: ContactInfo;
    location?: LocationInfo;
    social_style?: string;

    // Rich Business Information
    business_name?: string;
    business_type?: string;
    registration_number?: string;
    business_model?: string;
    selling_model?: string;
    business_category?: string;
    age_group?: string;
    gender?: string;
    customer_type?: string;
    location_focus?: string;

    // Website Onboarding Extracted & Brand Kit Fields
    palette?: string[];
    brand_colors?: string[];
    tones?: string[];
    business_types?: string[];
    primary_business_type?: string;
    sub_category?: string;
    city?: string;
    differentiators?: string[];
    products_services?: string[];
    selected_photos?: string[];
    target_audience_summary?: string;
    services_products_summary?: string[];
    tagline?: string;
    language?: string;
    marketplaces?: string[];
    marketplace_listings?: string[];
    b2b_platforms?: string[];
    b2b_listings?: string[];
}

export type BrandUpdate = Partial<BrandCreate>;
export interface AILogoVariationItem {
    logo_url: string;
    seed: number;
    style: string;
}

export interface AILogoGenerateRequest {
    business_name?: string;
    brand_name?: string;
    business_category?: string;
    style?: string;
    preferred_colors?: string[];
    prompt?: string;
    tagline?: string;
    brand_voice?: string;
    personality?: string;
    font?: string;
    transparent_background?: boolean;
    variation_seed?: number;
    num_variations?: number;
    save_to_brand_kit?: boolean;
}

export interface AILogoGenerateResponse {
    logo_url: string;
    business_name: string;
    style: string;
    prompt: string;
    seed?: number;
    variations?: AILogoVariationItem[];
}
