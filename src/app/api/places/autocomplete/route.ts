import { NextRequest, NextResponse } from 'next/server';
import { ALL_LOCATIONS } from '@/data/locations';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

export interface PlaceSuggestion {
  id: string;
  name: string;
  fullAddress: string;
  lat: number;
  lng: number;
}

interface NominatimItem {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
}

interface PhotonFeature {
  properties: {
    name?: string;
    city?: string;
    street?: string;
    state?: string;
    country?: string;
  };
  geometry?: { coordinates?: number[] };
}

export async function GET(request: NextRequest) {
  // Rate limiting — 30 lookups per minute per IP (protects upstream geocoders)
  const ip = getClientIp(request.headers);
  if (isRateLimited('places:autocomplete', ip, 30, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim().slice(0, 120);

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const queryLower = q.toLowerCase();
  const results: PlaceSuggestion[] = [];
  const seenIds = new Set<string>();

  // 1. Instant match from verified local database (Dhanbad, Ranchi, Bokaro, Kolkata, Patna, etc.)
  ALL_LOCATIONS.forEach((loc) => {
    if (
      loc.name.toLowerCase().includes(queryLower) ||
      loc.district.toLowerCase().includes(queryLower) ||
      loc.state.toLowerCase().includes(queryLower)
    ) {
      const id = `local-${loc.slug}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        results.push({
          id,
          name: loc.name,
          fullAddress: `${loc.name}, ${loc.district}, ${loc.state}, India`,
          lat: loc.lat,
          lng: loc.lng,
        });
      }
    }
  });

  // 2. Fetch from OpenStreetMap Nominatim with proper User-Agent header (prevents 403 / CORS)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}&countrycodes=in&limit=6&addressdetails=1`;

    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'UmaTravels-CabBooking/1.0 (support@umatravels.com)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        (data as NominatimItem[]).forEach((item) => {
          const id = `osm-${item.place_id}`;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            const mainName = item.display_name.split(',')[0].trim();
            results.push({
              id,
              name: mainName,
              fullAddress: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            });
          }
        });
      }
    }
  } catch (err) {
    console.error('Nominatim search error, trying Photon fallback:', err);
  }

  // 3. Fallback to Photon (OpenStreetMap search engine) if fewer than 3 results
  if (results.length < 3) {
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        q
      )}&limit=6`;
      const res = await fetch(photonUrl, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (data.features && Array.isArray(data.features)) {
          data.features.forEach((feat: PhotonFeature) => {
            const props = feat.properties;
            const coords = feat.geometry?.coordinates;
            if (coords && coords.length >= 2) {
              const name = props.name || props.city || props.street || q;
              const fullAddress = [
                props.name,
                props.street,
                props.city,
                props.state,
                props.country,
              ]
                .filter(Boolean)
                .join(', ');
              const id = `photon-${coords[0]}-${coords[1]}`;
              if (!seenIds.has(id)) {
                seenIds.add(id);
                results.push({
                  id,
                  name,
                  fullAddress: fullAddress || name,
                  lat: coords[1],
                  lng: coords[0],
                });
              }
            }
          });
        }
      }
    } catch (photonErr) {
      console.error('Photon fallback error:', photonErr);
    }
  }

  return NextResponse.json({ suggestions: results.slice(0, 8) });
}
