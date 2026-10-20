import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/rate-limit';
import { ALL_LOCATIONS } from '@/data/locations';
import { haversineKm } from '@/lib/geo-places';

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request.headers);

  // If local / private IP, query outbound public IP rather than assuming Dhanbad
  const isLocalIp =
    !clientIp ||
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp.startsWith('192.168.') ||
    clientIp.startsWith('10.') ||
    clientIp.startsWith('172.');

  let lat: number | null = null;
  let lng: number | null = null;
  let detectedCity = '';
  let detectedState = '';

  // 1. Try ipwho.is (fast and highly accurate for Indian ISPs like Airtel, Jio, etc.)
  try {
    const ipwhoUrl = isLocalIp ? 'https://ipwho.is/' : `https://ipwho.is/${clientIp}`;
    const res = await fetch(ipwhoUrl, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.latitude && data.longitude) {
        lat = Number(data.latitude);
        lng = Number(data.longitude);
        detectedCity = data.city || '';
        detectedState = data.region || '';
      }
    }
  } catch (err) {
    console.warn('ipwho.is lookup failed:', err);
  }

  // 2. Fallback to ipapi.co
  if (lat === null || lng === null) {
    try {
      const ipapiUrl = isLocalIp ? 'https://ipapi.co/json/' : `https://ipapi.co/${clientIp}/json/`;
      const res = await fetch(ipapiUrl, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          lat = Number(data.latitude);
          lng = Number(data.longitude);
          detectedCity = data.city || detectedCity;
          detectedState = data.region || detectedState;
        }
      }
    } catch (err) {
      console.warn('ipapi.co lookup failed:', err);
    }
  }

  // 3. Fallback to ipinfo.io
  if (lat === null || lng === null) {
    try {
      const res = await fetch('https://ipinfo.io/json', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.loc) {
          const [lt, lg] = data.loc.split(',').map(Number);
          if (!isNaN(lt) && !isNaN(lg)) {
            lat = lt;
            lng = lg;
            detectedCity = data.city || detectedCity;
            detectedState = data.region || detectedState;
          }
        }
      }
    } catch { /* ignore */ }
  }

  // Final fallback if completely offline
  if (lat === null || lng === null) {
    lat = 23.7957;
    lng = 86.4304;
    detectedCity = 'Dhanbad';
    detectedState = 'Jharkhand';
  }

  // Reverse geocode these coordinates to get a full street/area address
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const geoRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'UmaTravels-CabBooking/1.0 (support@umatravels.com)',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData?.display_name) {
        const addr = geoData.address || {};
        const road = addr.road || addr.suburb || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.village || detectedCity;
        const stateName = addr.state || detectedState;
        const shortName = [road, city, stateName].filter(Boolean).join(', ') || geoData.display_name.split(',')[0].trim();

        return NextResponse.json({
          name: shortName,
          fullAddress: geoData.display_name,
          lat,
          lng,
          source: isLocalIp ? 'default-hub' : 'ip-geo',
        });
      }
    }
  } catch (err) {
    console.warn('[LIVE LOCATION] Reverse geocode failed:', err);
  }

  // Fallback to nearest local database match
  let nearest = ALL_LOCATIONS[0];
  let minD = Infinity;
  for (const loc of ALL_LOCATIONS) {
    const d = haversineKm(lat, lng, loc.lat, loc.lng);
    if (d < minD) {
      minD = d;
      nearest = loc;
    }
  }

  return NextResponse.json({
    name: nearest.name,
    fullAddress: `${nearest.name}, ${nearest.district}, ${nearest.state}, India`,
    lat: nearest.lat,
    lng: nearest.lng,
    source: 'local-nearest',
  });
}
