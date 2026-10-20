// =====================================================================
// UMA TRAVELS — Vehicle Categories & Fare Engine
// Authoritative server-side source for all rates, eligibility rules,
// and fare calculations. Never trust client-submitted fare values.
// =====================================================================

export type VehicleCategory = 'sedan' | 'ertiga' | 'innova';

export interface Vehicle {
  id: VehicleCategory;
  name: string;
  slug: string;
  image: string;
  /** Representative model names (not guaranteed availability) */
  models: string[];
  seatingCapacity: number;
  luggageCapacity: string;
  features: string[];
  bestFor: string[];
  /** One-way rate per km (INR). Null = one-way not available for this vehicle. */
  oneWayRatePerKm: number | null;
  /** Round-trip rate per km (INR) */
  roundTripRatePerKm: number;
  /** Night halt charge per night (INR) for round-trip bookings */
  nightHaltCharge: number;
  /** Whether this vehicle can be booked as one-way at all */
  supportsOneWay: boolean;
  description: string;
  excerpt: string;
  hasAC: boolean;
  /** Frontend display starting rate per km for vehicle showcase cards & fleet pages */
  displayRatePerKm: number;
  /**
   * @deprecated Use oneWayRatePerKm or roundTripRatePerKm instead.
   * Kept for backward-compatibility with existing fleet/city/route pages.
   * Resolves to the round-trip rate (conservative display rate).
   */
  basePerKm: number;
  /**
   * @deprecated Minimum fare concept removed from new fare engine.
   * Kept for backward-compatibility only.
   */
  minimumFare: number;
}

// ─── AUTHORITATIVE FARE CONFIGURATION ────────────────────────────────────────
// These are the single source of truth. Override via server-only env vars if needed.
// NOTE: process.env values are only safe server-side. Do not expose to client.

export const FARE_CONFIG = {
  sedan: {
    oneWayPerKm: 21,
    roundTripPerKm: 14,
    nightHaltCharge: 500,
  },
  ertiga: {
    oneWayPerKm: 26,
    roundTripPerKm: 20,
    nightHaltCharge: 1000,
  },
  innova: {
    oneWayPerKm: null,       // One-way not available
    roundTripPerKm: 35,
    nightHaltCharge: 1000,
  },
} as const satisfies Record<VehicleCategory, {
  oneWayPerKm: number | null;
  roundTripPerKm: number;
  nightHaltCharge: number;
}>;

// ─── ONE-WAY DISTANCE THRESHOLD ───────────────────────────────────────────────
// Sedan and Ertiga can only do one-way if distance ≤ this value,
// UNLESS the destination is Kolkata (special exception).
export const ONE_WAY_MAX_KM = 200;

// ─── KOLKATA BOUNDING BOX ─────────────────────────────────────────────────────
// Used server-side to determine if resolved coordinates are within Kolkata.
// Kolkata municipal area: roughly 22.4–22.7°N, 88.2–88.5°E
export const KOLKATA_BBOX = {
  latMin: 22.38,
  latMax: 22.75,
  lngMin: 88.15,
  lngMax: 88.55,
} as const;

/** Returns true if the given coordinates fall within the Kolkata geographic bounding box. */
export function isKolkataCoordinates(lat: number, lng: number): boolean {
  return (
    lat >= KOLKATA_BBOX.latMin &&
    lat <= KOLKATA_BBOX.latMax &&
    lng >= KOLKATA_BBOX.lngMin &&
    lng <= KOLKATA_BBOX.lngMax
  );
}

export const VEHICLES: Vehicle[] = [
  {
    id: 'sedan',
    name: 'Sedan',
    slug: 'sedan-cab',
    image: '/sedan.webp',
    models: ['Swift Dzire', 'Honda Amaze', 'Hyundai Xcent'],
    seatingCapacity: 4,
    luggageCapacity: '2 medium bags',
    features: ['Air conditioned', 'Comfortable seating for 4', 'Complimentary Water Bottle', 'Fresh Tissue Paper', 'Ideal for city and intercity travel'],
    bestFor: ['Small families', 'Business travel', 'Airport transfers', 'Solo and couple travel'],
    oneWayRatePerKm: FARE_CONFIG.sedan.oneWayPerKm,
    roundTripRatePerKm: FARE_CONFIG.sedan.roundTripPerKm,
    nightHaltCharge: FARE_CONFIG.sedan.nightHaltCharge,
    supportsOneWay: true,
    displayRatePerKm: 14,
    // Backward compat
    basePerKm: FARE_CONFIG.sedan.roundTripPerKm,
    minimumFare: 500,
    description:
      'Our sedan category offers comfortable, fuel-efficient cars perfect for city rides and intercity travel for up to 4 passengers. These well-maintained vehicles provide a balance of comfort and value.',
    excerpt: 'Comfortable 4-seater for city and intercity travel. Ideal for small groups.',
    hasAC: true,
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga',
    slug: 'ertiga-rental',
    image: '/ertiga.webp',
    models: ['Maruti Suzuki Ertiga'],
    seatingCapacity: 6,
    luggageCapacity: '3 medium bags',
    features: ['Air conditioned', '6 comfortable seats', 'Complimentary Water Bottle', 'Fresh Tissue Paper', 'MPV body for extra headroom', 'Fuel efficient'],
    bestFor: ['Families of 5–6', 'Outstation trips', 'Small group travel', 'Wedding guest transport'],
    oneWayRatePerKm: FARE_CONFIG.ertiga.oneWayPerKm,
    roundTripRatePerKm: FARE_CONFIG.ertiga.roundTripPerKm,
    nightHaltCharge: FARE_CONFIG.ertiga.nightHaltCharge,
    supportsOneWay: true,
    displayRatePerKm: 16,
    // Backward compat
    basePerKm: FARE_CONFIG.ertiga.roundTripPerKm,
    minimumFare: 500,
    description:
      'The Maruti Suzuki Ertiga is a popular multi-purpose vehicle well suited for family travel and outstation trips. It comfortably seats 6 passengers with a spacious cabin and efficient fuel consumption.',
    excerpt: 'Popular 6-seater MPV — ideal for families and outstation trips.',
    hasAC: true,
  },
  {
    id: 'innova',
    name: 'Toyota Innova',
    slug: 'innova-rental',
    image: '/toyota-innova.png',
    models: ['Toyota Innova Crysta', 'Toyota Innova HyCross'],
    seatingCapacity: 7,
    luggageCapacity: '4 medium bags',
    features: [
      'Air conditioned',
      '7 spacious seats',
      'Complimentary Water Bottle',
      'Fresh Tissue Paper',
      'Premium cabin quality',
      'Smooth ride on highways',
      'Trusted for long-distance travel',
    ],
    bestFor: ['Large families', 'Long-distance outstation', 'Corporate travel', 'Airport transfers for groups'],
    oneWayRatePerKm: null, // Round-trip only
    roundTripRatePerKm: FARE_CONFIG.innova.roundTripPerKm,
    nightHaltCharge: FARE_CONFIG.innova.nightHaltCharge,
    supportsOneWay: false,
    displayRatePerKm: 20,
    // Backward compat
    basePerKm: FARE_CONFIG.innova.roundTripPerKm,
    minimumFare: 500,
    description:
      "The Toyota Innova is India's most trusted premium multi-purpose vehicle for outstation and corporate travel. It comfortably seats 7 passengers with generous legroom and luggage space.",
    excerpt: "Premium 7-seater — India's most trusted vehicle for long-distance group travel.",
    hasAC: true,
  },
];


export const FRONTEND_VEHICLE_RATES: Record<VehicleCategory, number> = {
  sedan: 14,
  ertiga: 16,
  innova: 20,
};

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.slug === slug);
}

export function getVehicleById(id: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}

// ─── FARE CALCULATION ENGINE ──────────────────────────────────────────────────

export interface FareBreakdown {
  vehicleId: VehicleCategory;
  vehicleName: string;
  tripType: 'one-way' | 'round-trip';
  oneWayDistanceKm: number;
  ratePerKm: number;
  baseDistanceCharge: number;
  nightHaltCount: number;
  nightHaltCharge: number;
  totalFare: number;
  disclaimer: string;
}

export interface FareOptions {
  distanceKm: number;      // One-way road distance
  vehicleId: VehicleCategory;
  tripType: 'one-way' | 'round-trip';
  pickupDate?: string;     // ISO date string YYYY-MM-DD
  returnDate?: string;     // ISO date string YYYY-MM-DD
  isKolkataRoute?: boolean; // Bidirectional Kolkata route exception
}

/**
 * Check if a place name/address string is within Kolkata metro area.
 */
export function isKolkataLocation(text?: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return t.includes('kolkata') || t.includes('calcutta') || t.includes('howrah');
}

/**
 * Calculate the number of night halts between two calendar dates.
 * Night halts = number of calendar days difference.
 * Same date = 0 nights. Next day = 1 night. Two days later = 2 nights.
 */
export function calculateNightHalts(pickupDate: string, returnDate: string): number {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  // Reset time to midnight to compare calendar dates only
  pickup.setHours(0, 0, 0, 0);
  returnD.setHours(0, 0, 0, 0);
  const msPerDay = 24 * 60 * 60 * 1000;
  const nights = Math.round((returnD.getTime() - pickup.getTime()) / msPerDay);
  return Math.max(0, nights);
}

/**
 * Authoritative server-side fare calculation.
 * This function is the single source of truth — never trust client-submitted fare values.
 */
export function calculateFare(options: FareOptions): FareBreakdown {
  const vehicle = getVehicleById(options.vehicleId);
  if (!vehicle) throw new Error(`Unknown vehicle: ${options.vehicleId}`);

  const fareConfig = FARE_CONFIG[options.vehicleId];
  const tripType = options.tripType;

  if (tripType === 'one-way') {
    if (!vehicle.supportsOneWay || fareConfig.oneWayPerKm === null) {
      throw new Error(`${vehicle.name} is not available for one-way trips`);
    }

    // Rule: Excluding Kolkata bidirectional routes (Jharkhand <-> Kolkata),
    // any one-way route beyond 200 km charges round-trip return fare
    // because no return passengers are available, but user sees one-way fare.
    const isExemptKolkata = Boolean(options.isKolkataRoute);
    const requiresReturnFare = options.distanceKm > ONE_WAY_MAX_KM && !isExemptKolkata;

    const ratePerKm = requiresReturnFare ? fareConfig.roundTripPerKm : fareConfig.oneWayPerKm;
    const factor = requiresReturnFare ? 2 : 1;
    const baseDistanceCharge = Math.round(options.distanceKm * ratePerKm * factor);

    return {
      vehicleId: options.vehicleId,
      vehicleName: vehicle.name,
      tripType: 'one-way',
      oneWayDistanceKm: options.distanceKm,
      ratePerKm,
      baseDistanceCharge,
      nightHaltCount: 0,
      nightHaltCharge: 0,
      totalFare: baseDistanceCharge,
      disclaimer:
        'Quoted fare is for one-way travel. Toll charges, parking charges, and driver allowance are not included and may be payable separately where applicable.',
    };
  }

  // Round-trip
  const ratePerKm = fareConfig.roundTripPerKm;
  const baseDistanceCharge = Math.round(2 * options.distanceKm * ratePerKm);

  let nightHaltCount = 0;
  let nightHaltChargeTotal = 0;
  if (options.pickupDate && options.returnDate) {
    nightHaltCount = calculateNightHalts(options.pickupDate, options.returnDate);
    nightHaltChargeTotal = nightHaltCount * vehicle.nightHaltCharge;
  }

  const totalFare = baseDistanceCharge + nightHaltChargeTotal;

  return {
    vehicleId: options.vehicleId,
    vehicleName: vehicle.name,
    tripType: 'round-trip',
    oneWayDistanceKm: options.distanceKm,
    ratePerKm,
    baseDistanceCharge,
    nightHaltCount,
    nightHaltCharge: nightHaltChargeTotal,
    totalFare,
    disclaimer:
      'Quoted fare includes applicable round-trip night halt charges. Toll charges, parking charges, and driver allowance are not included and may be payable separately where applicable.',
  };
}

/**
 * Determine which vehicles are eligible for a given trip type and distance.
 * This is enforced server-side; client cannot override.
 *
 * @param tripType - 'one-way' or 'round-trip'
 * @param distanceKm - one-way road distance
 * @param isKolkata - whether the destination resolves to Kolkata geographically
 * @returns array of eligible VehicleCategory IDs
 */
export function getEligibleVehicles(
  tripType: 'one-way' | 'round-trip',
  distanceKm: number,
  isKolkata: boolean
): VehicleCategory[] {
  if (tripType === 'round-trip') {
    // All three vehicles are available for round-trips
    return ['sedan', 'ertiga', 'innova'];
  }

  // One-way: only sedan and ertiga can be one-way
  // And only if distance <= 200 km OR destination is Kolkata
  const oneWayVehicles: VehicleCategory[] = ['sedan', 'ertiga'];

  if (distanceKm <= ONE_WAY_MAX_KM || isKolkata) {
    return oneWayVehicles;
  }

  // Distance > 200 km and not Kolkata — one-way not allowed
  return [];
}

/**
 * Determine effective trip type given the distance and destination.
 * If the distance exceeds the one-way threshold and destination is not Kolkata,
 * the trip must be converted to round-trip.
 */
export function getEffectiveTripType(
  requestedTripType: 'one-way' | 'round-trip',
  distanceKm: number,
  isKolkata: boolean
): { tripType: 'one-way' | 'round-trip'; wasAutoConverted: boolean } {
  if (requestedTripType === 'round-trip') {
    return { tripType: 'round-trip', wasAutoConverted: false };
  }

  // one-way requested
  if (distanceKm <= ONE_WAY_MAX_KM || isKolkata) {
    return { tripType: 'one-way', wasAutoConverted: false };
  }

  // Must convert to round-trip
  return { tripType: 'round-trip', wasAutoConverted: true };
}

// Legacy compatibility — keep basePerKm pointing to the round-trip rate for pages
// that reference it. Prefer using FARE_CONFIG directly for new code.
export { VEHICLES as VEHICLE_LIST };
