import { NextRequest, NextResponse } from 'next/server';
import { ALL_LOCATIONS } from '@/data/locations';
import {
  VEHICLES,
  FARE_CONFIG,
  calculateFare,
  calculateNightHalts,
  getEligibleVehicles,
  getEffectiveTripType,
  isKolkataCoordinates,
  type VehicleCategory,
} from '@/data/vehicles';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ResolvedLocation {
  lat: number;
  lng: number;
  name: string;
}

// ─── Geocoder ──────────────────────────────────────────────────────────────────

async function geocodeQuery(query: string): Promise<ResolvedLocation | null> {
  const cleanQ = query.trim();
  const qLower = cleanQ.toLowerCase();

  // 1. Match verified local database first (instant, no network)
  const local = ALL_LOCATIONS.find(
    (l) =>
      l.status === 'published' &&
      (qLower === l.name.toLowerCase() ||
        qLower === l.slug ||
        l.name.toLowerCase().includes(qLower) ||
        qLower.includes(l.name.toLowerCase()))
  );
  if (local) {
    return { lat: local.lat, lng: local.lng, name: local.name };
  }

  // 2. Photon (OpenStreetMap-based, no rate limit concerns for server-side use)
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&limit=1&lang=en`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'UmaTravels-CabBooking/1.0' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.features?.length > 0) {
        const feat = data.features[0];
        const coords = feat.geometry?.coordinates;
        if (coords?.length >= 2) {
          const name = feat.properties?.name || cleanQ;
          return { lat: coords[1], lng: coords[0], name };
        }
      }
    }
  } catch {
    // continue to next geocoder
  }

  // 3. Nominatim fallback (India-scoped)
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json` +
      `&q=${encodeURIComponent(cleanQ)}&countrycodes=in&limit=1`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { 'User-Agent': 'UmaTravels-CabBooking/1.0 (umatravelsbooking@gmail.com)' },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name.split(',')[0].trim(),
        };
      }
    }
  } catch {
    // exhausted
  }

  return null;
}

// ─── Road routing via OSRM ─────────────────────────────────────────────────────
// We use the public OSRM demo server. It is suitable for development and
// low-volume production. For high volume, self-host OSRM or use a paid
// routing API. We never fall back to straight-line distance — if routing
// fails we return an error so the user can retry.

async function getRoadDistanceKm(
  pickupLat: number,
  pickupLng: number,
  dropLat: number,
  dropLng: number
): Promise<{ distanceKm: number; durationMinutes: number } | null> {
  const osrmUrl =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${pickupLng},${pickupLat};${dropLng},${dropLat}?overview=false&geometries=polyline`;

  try {
    const res = await fetch(osrmUrl, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'UmaTravels-CabBooking/1.0' },
    });

    if (!res.ok) {
      console.warn(`OSRM returned HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) {
      console.warn('OSRM: no route found', data.code);
      return null;
    }

    const route = data.routes[0];
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
    const durationMinutes = Math.round(route.duration / 60);
    return { distanceKm, durationMinutes };
  } catch (err) {
    console.warn('OSRM routing error:', err);
    return null;
  }
}

// ─── Request Schema ────────────────────────────────────────────────────────────

interface RouteRequestBody {
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
  pickupQuery?: string;
  dropQuery?: string;
  pickupName?: string;
  dropName?: string;
  tripType?: string;
  pickupDate?: string;
  returnDate?: string;
}

// ─── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (isRateLimited('places:route', ip, 20, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  let body: RouteRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const {
    pickupQuery,
    dropQuery,
    pickupDate,
    returnDate,
    tripType: rawTripType,
  } = body;

  let { pickupLat, pickupLng, dropLat, dropLng, pickupName, dropName } = body;

  // ── Resolve coordinates ──────────────────────────────────────────────────
  if ((!pickupLat || !pickupLng) && pickupQuery) {
    const geo = await geocodeQuery(pickupQuery);
    if (geo) {
      pickupLat = geo.lat;
      pickupLng = geo.lng;
      if (!pickupName) pickupName = geo.name;
    }
  }

  if ((!dropLat || !dropLng) && dropQuery) {
    const geo = await geocodeQuery(dropQuery);
    if (geo) {
      dropLat = geo.lat;
      dropLng = geo.lng;
      if (!dropName) dropName = geo.name;
    }
  }

  if (!pickupLat || !pickupLng || !dropLat || !dropLng) {
    return NextResponse.json(
      { error: 'Could not resolve pickup or drop location. Please refine your search and try again.' },
      { status: 400 }
    );
  }

  // Ensure same-location guard
  if (Math.abs(pickupLat - dropLat) < 0.001 && Math.abs(pickupLng - dropLng) < 0.001) {
    return NextResponse.json(
      { error: 'Pickup and destination appear to be the same location. Please choose different locations.' },
      { status: 400 }
    );
  }

  // ── Get road distance (OSRM only — no straight-line fallback) ───────────
  const routing = await getRoadDistanceKm(pickupLat, pickupLng, dropLat, dropLng);

  if (!routing) {
    return NextResponse.json(
      {
        error:
          'Road distance could not be calculated at this time. ' +
          'The routing service may be temporarily unavailable. Please try again in a moment.',
        routingFailed: true,
      },
      { status: 503 }
    );
  }

  const { distanceKm, durationMinutes } = routing;

  // ── Determine if destination is Kolkata ───────────────────────────────────
  const destinationIsKolkata = isKolkataCoordinates(dropLat, dropLng);

  // ── Resolve effective trip type ───────────────────────────────────────────
  const requestedTripType = rawTripType === 'round-trip' ? 'round-trip' : 'one-way';
  const { tripType, wasAutoConverted } = getEffectiveTripType(
    requestedTripType,
    distanceKm,
    destinationIsKolkata
  );

  // ── Validate dates for round-trip ─────────────────────────────────────────
  let nightHaltCount = 0;
  if (tripType === 'round-trip' && pickupDate && returnDate) {
    if (returnDate < pickupDate) {
      return NextResponse.json(
        { error: 'Return date cannot be before pickup date.' },
        { status: 400 }
      );
    }
    nightHaltCount = calculateNightHalts(pickupDate, returnDate);
  }

  // ── Calculate fares for all eligible vehicles ─────────────────────────────
  const eligibleVehicleIds = getEligibleVehicles(tripType, distanceKm, destinationIsKolkata);

  const vehicleFares = eligibleVehicleIds.map((vehicleId) => {
    const vehicle = VEHICLES.find((v) => v.id === vehicleId)!;
    const fareConfig = FARE_CONFIG[vehicleId];

    let ratePerKm: number;
    let baseDistanceCharge: number;
    let nightHaltCharge = 0;
    let totalFare: number;

    if (tripType === 'one-way') {
      ratePerKm = fareConfig.oneWayPerKm!;
      baseDistanceCharge = Math.round(distanceKm * ratePerKm);
      totalFare = baseDistanceCharge;
    } else {
      ratePerKm = fareConfig.roundTripPerKm;
      baseDistanceCharge = Math.round(2 * distanceKm * ratePerKm);
      if (pickupDate && returnDate) {
        nightHaltCharge = nightHaltCount * vehicle.nightHaltCharge;
      }
      totalFare = baseDistanceCharge + nightHaltCharge;
    }

    return {
      vehicleId,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.image,
      seatingCapacity: vehicle.seatingCapacity,
      models: vehicle.models,
      tripType,
      oneWayDistanceKm: distanceKm,
      ratePerKm,
      baseDistanceCharge,
      nightHaltCount: tripType === 'round-trip' ? nightHaltCount : 0,
      nightHaltCharge: tripType === 'round-trip' ? nightHaltCharge : 0,
      perNightHaltRate: vehicle.nightHaltCharge,
      totalFare,
    };
  });

  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const durationFormatted = hours > 0 ? `${hours} hr ${mins} min` : `${durationMinutes} min`;

  return NextResponse.json({
    ok: true,
    distanceKm,
    durationMinutes,
    durationFormatted,
    tripType,
    wasAutoConverted,
    autoConvertedMessage: wasAutoConverted
      ? `One-way trips are only available for distances up to ${200} km. Since this route is ${distanceKm} km, the trip has been automatically changed to Round Trip. Please select a return date to get the complete quote.`
      : null,
    destinationIsKolkata,
    nightHaltCount: tripType === 'round-trip' ? nightHaltCount : 0,
    pickupName: pickupName || pickupQuery || 'Pickup Location',
    dropName: dropName || dropQuery || 'Drop Location',
    pickupLat,
    pickupLng,
    dropLat,
    dropLng,
    vehicleFares,
    disclaimer:
      tripType === 'round-trip'
        ? 'Quoted fare includes applicable round-trip night halt charges. Toll charges, parking charges, and driver allowance are not included and may be payable separately where applicable.'
        : 'Toll charges, parking charges, and driver allowance are not included and may be payable separately where applicable.',
  });
}
