import { NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ||
  "AIzaSyCmTCmI8Hn8Du4M3rYzfSdhRVcx1oap59o";

export interface GooglePlaceResult {
  id: string;
  name: string;
  address: string;
  rating?: number;
  userRatingCount?: number;
  website?: string;
  phone?: string;
  photos: string[];
  types?: string[];
  googleMapsUrl: string;
  lat?: number;
  lng?: number;
}

// Helper to extract a query from various Google Maps URLs
async function extractQueryFromMapsUrl(rawUrl: string): Promise<string | null> {
  let target = rawUrl.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  try {
    // If it's a shortened share link (maps.app.goo.gl or goo.gl/maps), resolve redirects
    if (/goo\.gl|maps\.app/i.test(target)) {
      try {
        const headRes = await fetch(target, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        target = headRes.url || target;
      } catch (err) {
        console.warn("Failed to follow maps redirect:", err);
      }
    }

    // Try extracting /place/Place+Name/
    const placeMatch = target.match(/\/place\/([^/@?]+)/i);
    if (placeMatch && placeMatch[1]) {
      const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      if (decoded && !/^[0-9.,+-]+$/.test(decoded)) {
        return decoded;
      }
    }

    // Try extracting ?q=...
    const urlObj = new URL(target);
    const qParam = urlObj.searchParams.get("q") || urlObj.searchParams.get("query");
    if (qParam) {
      return decodeURIComponent(qParam.replace(/\+/g, " "));
    }

    // Try extracting /search/query/
    const searchMatch = target.match(/\/search\/([^/@?]+)/i);
    if (searchMatch && searchMatch[1]) {
      return decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
    }
  } catch (err) {
    console.warn("Error parsing maps URL:", err);
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = (searchParams.get("q") || searchParams.get("query") || "").trim();

    if (!rawQuery) {
      return NextResponse.json({ success: true, places: [] });
    }

    let searchQuery = rawQuery;

    // Check if query is a URL
    if (/^https?:\/\/|maps\.app\.goo\.gl|goo\.gl\/maps|google\.com\/maps/i.test(rawQuery)) {
      const extracted = await extractQueryFromMapsUrl(rawQuery);
      if (extracted) {
        searchQuery = extracted;
      }
    }

    // Call Google Places API (New)
    const placesUrl = "https://places.googleapis.com/v1/places:searchText";
    const fieldMask = [
      "places.id",
      "places.displayName",
      "places.formattedAddress",
      "places.rating",
      "places.userRatingCount",
      "places.photos",
      "places.websiteUri",
      "places.types",
      "places.nationalPhoneNumber",
      "places.location",
    ].join(",");

    const res = await fetch(placesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        languageCode: "en",
        maxResultCount: 8,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Places API error:", res.status, errText);
      return NextResponse.json({
        success: false,
        error: "Google Places search failed",
        searchQuery,
        places: [],
      });
    }

    const data = await res.json();
    const rawPlaces = data.places || [];

    const formattedPlaces: GooglePlaceResult[] = rawPlaces.map((p: any) => {
      const photos: string[] = (p.photos || []).slice(0, 10).map((ph: any) => {
        return `https://places.googleapis.com/v1/${ph.name}/media?maxHeightPx=800&maxWidthPx=800&key=${GOOGLE_MAPS_API_KEY}`;
      });

      return {
        id: p.id,
        name: p.displayName?.text || searchQuery,
        address: p.formattedAddress || "",
        rating: p.rating || undefined,
        userRatingCount: p.userRatingCount || undefined,
        website: p.websiteUri || undefined,
        phone: p.nationalPhoneNumber || undefined,
        photos,
        types: p.types || [],
        googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.id}`,
        lat: p.location?.latitude,
        lng: p.location?.longitude,
      };
    });

    return NextResponse.json({
      success: true,
      searchQuery,
      places: formattedPlaces,
    });
  } catch (error: any) {
    console.error("Maps search route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search places", places: [] },
      { status: 500 }
    );
  }
}
