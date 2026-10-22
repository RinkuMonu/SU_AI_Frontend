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
}

export type BrandUpdate = Partial<BrandCreate>;