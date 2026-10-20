import { NextRequest, NextResponse } from 'next/server';
import { ALL_LOCATIONS } from '@/data/locations';
import { haversineKm } from '@/lib/geo-places';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  if (!latStr || !lngStr) {
    return NextResponse.json({ error: 'Missing lat or lng parameter' }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  // 1. Try Nominatim Reverse Geocoding (high detail in India)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'UmaTravels-CabBooking/1.0 (support@umatravels.com)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const road = addr.road || addr.street || addr.suburb || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const stateName = addr.state || '';

        const shortName = [road, city, stateName].filter(Boolean).join(', ') || data.display_name.split(',')[0].trim();
        return NextResponse.json({
          name: shortName,
          fullAddress: data.display_name,
          lat,
          lng,
        });
      }
    }
  } catch (err) {
    console.warn('[REVERSE GEOCODE] Nominatim failed, attempting Photon:', err);
  }

  // 2. Fallback to Photon Reverse Geocoding
  try {
    const photonUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
    const res = await fetch(photonUrl, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties;
        const parts = [
          props.name,
          props.street,
          props.district || props.suburb,
          props.city,
          props.state,
          props.postcode,
          'India',
        ].filter(Boolean);

        const fullAddress = parts.join(', ');
        const name = props.name || props.city || fullAddress.split(',')[0].trim();

        return NextResponse.json({
          name,
          fullAddress: fullAddress || name,
          lat,
          lng,
        });
      }
    }
  } catch (err) {
    console.warn('[REVERSE GEOCODE] Photon failed, attempting local fallback:', err);
  }

  // 3. Fallback to closest local city in ALL_LOCATIONS
  let nearest = ALL_LOCATIONS[0];
  let minD = Infinity;
  for (const loc of ALL_LOCATIONS) {
    const d = haversineKm(lat, lng, loc.lat, loc.lng);
    if (d < minD) {
      minD = d;
      nearest = loc;
    }
  }

  const fallbackAddress = `${nearest.name}, ${nearest.district}, ${nearest.state}, India`;
  return NextResponse.json({
    name: nearest.name,
    fullAddress: fallbackAddress,
    lat,
    lng,
  });
}
