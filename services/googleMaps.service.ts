import api from '@/lib/api';

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ||
  'AIzaSyCmTCmI8Hn8Du4M3rYzfSdhRVcx1oap59o';

export interface LocationFeature {
  type: string;
  properties: {
    formatted: string;
    city: string;
    state: string;
    country: string;
    place_id: string;
    address_line1?: string;
    address_line2?: string;
  };
}

export interface LocationSearchResult {
  success: boolean;
  data: {
    features: LocationFeature[];
    suggestions?: any[];
  };
}

export const googleMapsService = {
  getApiKey: () => GOOGLE_MAPS_API_KEY,

  /**
   * Search locations / autocomplete places via backend Google Maps integration
   */
  searchLocations: async (query: string): Promise<LocationSearchResult> => {
    if (!query || query.trim().length === 0) {
      return { success: true, data: { features: [], suggestions: [] } };
    }
    const res = await api.get(`/api/v1/influencers/locations/search?text=${encodeURIComponent(query.trim())}`);
    return res.data;
  },

  /**
   * Fetch place details using Google Maps Geocoding
   */
  getLocationDetails: async (placeId: string) => {
    const res = await api.get(`/api/v1/influencers/locations/details?place_id=${encodeURIComponent(placeId)}`);
    return res.data;
  },

  /**
   * Helper to construct a Google Maps Embed / Search URL
   */
  getEmbedUrl: (query: string) => {
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(query)}`;
  },

  /**
   * Helper to construct a Google Maps Directions URL
   */
  getDirectionsUrl: (destination: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  },

  /**
   * Dynamically loads the Google Maps JavaScript SDK in browser if needed
   */
  loadGoogleMapsScript: (): Promise<any> => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    if ((window as any).google && (window as any).google.maps) {
      return Promise.resolve((window as any).google.maps);
    }

    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve((window as any).google.maps));
        existingScript.addEventListener('error', (err) => reject(err));
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve((window as any).google.maps);
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  },
};
