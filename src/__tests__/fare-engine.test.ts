/**
 * UMA TRAVELS — Automated Fare Engine Tests
 * Run with: npx tsx src/__tests__/fare-engine.test.ts
 *
 * Tests cover:
 * - All vehicle rates (one-way and round-trip)
 * - Night halt calculation
 * - Round-trip fare formula
 * - Vehicle eligibility rules
 * - Kolkata exception
 * - Trip type auto-conversion
 * - Invalid inputs
 */

import {
  calculateFare,
  calculateNightHalts,
  getEligibleVehicles,
  getEffectiveTripType,
  isKolkataCoordinates,
  FARE_CONFIG,
  VEHICLES,
  ONE_WAY_MAX_KM,
} from '../data/vehicles';

// ─── Simple test runner ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${(err as Error).message}`);
    failures.push(`${name}: ${(err as Error).message}`);
    failed++;
  }
}

function expect(val: unknown) {
  return {
    toBe: (expected: unknown) => {
      if (val !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
    },
    toEqual: (expected: unknown) => {
      if (JSON.stringify(val) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
      }
    },
    toThrow: (fn: () => void) => {
      try { fn(); throw new Error('Expected function to throw, but it did not'); }
      catch { /* expected */ }
    },
    toBeGreaterThan: (n: number) => {
      if ((val as number) <= n) throw new Error(`Expected ${val} > ${n}`);
    },
    toBeLessThanOrEqual: (n: number) => {
      if ((val as number) > n) throw new Error(`Expected ${val} <= ${n}`);
    },
    toContain: (item: unknown) => {
      if (!Array.isArray(val) || !val.includes(item)) {
        throw new Error(`Expected array to contain ${JSON.stringify(item)}, got ${JSON.stringify(val)}`);
      }
    },
    notToContain: (item: unknown) => {
      if (Array.isArray(val) && val.includes(item)) {
        throw new Error(`Expected array not to contain ${JSON.stringify(item)}`);
      }
    },
    toBeTruthy: () => {
      if (!val) throw new Error(`Expected truthy value, got ${JSON.stringify(val)}`);
    },
    toBeFalsy: () => {
      if (val) throw new Error(`Expected falsy value, got ${JSON.stringify(val)}`);
    },
  };
}

function expectThrows(label: string, fn: () => void) {
  try {
    fn();
    throw new Error(`Expected "${label}" to throw, but it did not`);
  } catch (err) {
    if ((err as Error).message.startsWith('Expected')) throw err;
    // Expected throw — ok
  }
}

// ─── FARE CONFIGURATION TESTS ─────────────────────────────────────────────────

console.log('\n📋 Fare Configuration');

test('Sedan one-way rate is ₹21/km', () => {
  expect(FARE_CONFIG.sedan.oneWayPerKm).toBe(21);
});

test('Sedan round-trip rate is ₹14/km', () => {
  expect(FARE_CONFIG.sedan.roundTripPerKm).toBe(14);
});

test('Sedan night halt is ₹500', () => {
  expect(FARE_CONFIG.sedan.nightHaltCharge).toBe(500);
});

test('Ertiga one-way rate is ₹26/km', () => {
  expect(FARE_CONFIG.ertiga.oneWayPerKm).toBe(26);
});

test('Ertiga round-trip rate is ₹20/km', () => {
  expect(FARE_CONFIG.ertiga.roundTripPerKm).toBe(20);
});

test('Ertiga night halt is ₹1000', () => {
  expect(FARE_CONFIG.ertiga.nightHaltCharge).toBe(1000);
});

test('Innova one-way rate is null (not available)', () => {
  expect(FARE_CONFIG.innova.oneWayPerKm).toBe(null);
});

test('Innova round-trip rate is ₹35/km', () => {
  expect(FARE_CONFIG.innova.roundTripPerKm).toBe(35);
});

test('Innova night halt is ₹1000', () => {
  expect(FARE_CONFIG.innova.nightHaltCharge).toBe(1000);
});

test('ONE_WAY_MAX_KM is 200', () => {
  expect(ONE_WAY_MAX_KM).toBe(200);
});

// ─── FLEET DEFINITION ─────────────────────────────────────────────────────────

console.log('\n🚗 Fleet Definition');

test('Fleet contains exactly 3 vehicles', () => {
  expect(VEHICLES.length).toBe(3);
});

test('No Tempo Traveller in fleet', () => {
  expect(VEHICLES.map(v => v.id)).notToContain('tempo-traveller');
});

test('No Luxury Car in fleet', () => {
  expect(VEHICLES.map(v => v.id)).notToContain('luxury');
});

test('Sedan supportsOneWay is true', () => {
  expect(VEHICLES.find(v => v.id === 'sedan')!.supportsOneWay).toBeTruthy();
});

test('Ertiga supportsOneWay is true', () => {
  expect(VEHICLES.find(v => v.id === 'ertiga')!.supportsOneWay).toBeTruthy();
});

test('Innova supportsOneWay is false', () => {
  expect(VEHICLES.find(v => v.id === 'innova')!.supportsOneWay).toBeFalsy();
});

// ─── ONE-WAY FARE TESTS (from spec examples) ─────────────────────────────────

console.log('\n💰 One-Way Fares (spec examples: 100 km)');

test('Sedan one-way 100 km = ₹2,100', () => {
  const fare = calculateFare({ distanceKm: 100, vehicleId: 'sedan', tripType: 'one-way' });
  expect(fare.totalFare).toBe(2100);
  expect(fare.nightHaltCount).toBe(0);
  expect(fare.nightHaltCharge).toBe(0);
});

test('Ertiga one-way 100 km = ₹2,600', () => {
  const fare = calculateFare({ distanceKm: 100, vehicleId: 'ertiga', tripType: 'one-way' });
  expect(fare.totalFare).toBe(2600);
  expect(fare.nightHaltCount).toBe(0);
  expect(fare.nightHaltCharge).toBe(0);
});

test('Innova one-way throws (not available)', () => {
  expectThrows('innova one-way', () =>
    calculateFare({ distanceKm: 100, vehicleId: 'innova', tripType: 'one-way' })
  );
});

// ─── ROUND-TRIP FARE TESTS (from spec examples) ───────────────────────────────

console.log('\n💰 Round-Trip Fares (spec examples: 100 km, 1 night)');

test('Sedan round-trip 100 km 1 night = ₹3,300', () => {
  const fare = calculateFare({
    distanceKm: 100, vehicleId: 'sedan', tripType: 'round-trip',
    pickupDate: '2026-11-01', returnDate: '2026-11-02',
  });
  // 2 × 100 × ₹14 = ₹2800, + ₹500 night halt = ₹3300
  expect(fare.baseDistanceCharge).toBe(2800);
  expect(fare.nightHaltCount).toBe(1);
  expect(fare.nightHaltCharge).toBe(500);
  expect(fare.totalFare).toBe(3300);
});

test('Ertiga round-trip 100 km 1 night = ₹5,000', () => {
  const fare = calculateFare({
    distanceKm: 100, vehicleId: 'ertiga', tripType: 'round-trip',
    pickupDate: '2026-11-01', returnDate: '2026-11-02',
  });
  // 2 × 100 × ₹20 = ₹4000, + ₹1000 night halt = ₹5000
  expect(fare.baseDistanceCharge).toBe(4000);
  expect(fare.nightHaltCount).toBe(1);
  expect(fare.nightHaltCharge).toBe(1000);
  expect(fare.totalFare).toBe(5000);
});

test('Innova round-trip 100 km 1 night = ₹8,000', () => {
  const fare = calculateFare({
    distanceKm: 100, vehicleId: 'innova', tripType: 'round-trip',
    pickupDate: '2026-11-01', returnDate: '2026-11-02',
  });
  // 2 × 100 × ₹35 = ₹7000, + ₹1000 night halt = ₹8000
  expect(fare.baseDistanceCharge).toBe(7000);
  expect(fare.nightHaltCount).toBe(1);
  expect(fare.nightHaltCharge).toBe(1000);
  expect(fare.totalFare).toBe(8000);
});

// ─── NIGHT HALT CALCULATION ────────────────────────────────────────────────────

console.log('\n🌙 Night Halt Calculation');

test('Same date = 0 nights', () => {
  expect(calculateNightHalts('2026-11-01', '2026-11-01')).toBe(0);
});

test('Next day = 1 night', () => {
  expect(calculateNightHalts('2026-11-01', '2026-11-02')).toBe(1);
});

test('Two days later = 2 nights', () => {
  expect(calculateNightHalts('2026-11-01', '2026-11-03')).toBe(2);
});

test('5 days later = 5 nights', () => {
  expect(calculateNightHalts('2026-11-01', '2026-11-06')).toBe(5);
});

test('Zero nights on same date gives no night halt charge', () => {
  const fare = calculateFare({
    distanceKm: 100, vehicleId: 'sedan', tripType: 'round-trip',
    pickupDate: '2026-11-01', returnDate: '2026-11-01',
  });
  expect(fare.nightHaltCount).toBe(0);
  expect(fare.nightHaltCharge).toBe(0);
  expect(fare.totalFare).toBe(2800); // 2 × 100 × 14 = 2800
});

test('Round-trip without dates gives 0 nights', () => {
  const fare = calculateFare({
    distanceKm: 100, vehicleId: 'sedan', tripType: 'round-trip',
  });
  expect(fare.nightHaltCount).toBe(0);
  expect(fare.nightHaltCharge).toBe(0);
});

// ─── VEHICLE ELIGIBILITY ──────────────────────────────────────────────────────

console.log('\n🚫 Vehicle Eligibility Rules');

test('One-way 100 km (non-Kolkata): sedan and ertiga only', () => {
  const eligible = getEligibleVehicles('one-way', 100, false);
  expect(eligible).toContain('sedan');
  expect(eligible).toContain('ertiga');
  expect(eligible).notToContain('innova');
});

test('One-way exactly 200 km (non-Kolkata): sedan and ertiga eligible', () => {
  const eligible = getEligibleVehicles('one-way', 200, false);
  expect(eligible).toContain('sedan');
  expect(eligible).toContain('ertiga');
});

test('One-way 201 km (non-Kolkata): no vehicles eligible', () => {
  const eligible = getEligibleVehicles('one-way', 201, false);
  expect(eligible.length).toBe(0);
});

test('One-way 500 km to Kolkata: sedan and ertiga eligible (Kolkata exception)', () => {
  const eligible = getEligibleVehicles('one-way', 500, true);
  expect(eligible).toContain('sedan');
  expect(eligible).toContain('ertiga');
});

test('One-way 500 km to Kolkata: innova still NOT eligible (Kolkata exception applies only to sedan/ertiga)', () => {
  const eligible = getEligibleVehicles('one-way', 500, true);
  expect(eligible).notToContain('innova');
});

test('Round-trip: all 3 vehicles eligible regardless of distance', () => {
  const eligible = getEligibleVehicles('round-trip', 500, false);
  expect(eligible).toContain('sedan');
  expect(eligible).toContain('ertiga');
  expect(eligible).toContain('innova');
});

// ─── TRIP TYPE AUTO-CONVERSION ────────────────────────────────────────────────

console.log('\n🔄 Trip Type Auto-Conversion');

test('One-way 100 km non-Kolkata: no conversion', () => {
  const result = getEffectiveTripType('one-way', 100, false);
  expect(result.tripType).toBe('one-way');
  expect(result.wasAutoConverted).toBeFalsy();
});

test('One-way 200 km non-Kolkata: no conversion (boundary)', () => {
  const result = getEffectiveTripType('one-way', 200, false);
  expect(result.tripType).toBe('one-way');
  expect(result.wasAutoConverted).toBeFalsy();
});

test('One-way 201 km non-Kolkata: auto-converts to round-trip', () => {
  const result = getEffectiveTripType('one-way', 201, false);
  expect(result.tripType).toBe('round-trip');
  expect(result.wasAutoConverted).toBeTruthy();
});

test('One-way 500 km to Kolkata: no conversion (Kolkata exception)', () => {
  const result = getEffectiveTripType('one-way', 500, true);
  expect(result.tripType).toBe('one-way');
  expect(result.wasAutoConverted).toBeFalsy();
});

test('Round-trip requested: always stays round-trip', () => {
  const result = getEffectiveTripType('round-trip', 100, false);
  expect(result.tripType).toBe('round-trip');
  expect(result.wasAutoConverted).toBeFalsy();
});

// ─── KOLKATA DETECTION ─────────────────────────────────────────────────────────

console.log('\n📍 Kolkata Geographic Detection');

test('Central Kolkata coordinates recognised', () => {
  // 22.5726°N 88.3639°E — Kolkata city centre
  expect(isKolkataCoordinates(22.5726, 88.3639)).toBeTruthy();
});

test('Howrah coordinates recognised as Kolkata metro', () => {
  // 22.5958°N 88.2636°E — Howrah (west bank, same metro)
  expect(isKolkataCoordinates(22.5958, 88.2636)).toBeTruthy();
});

test('Dhanbad coordinates NOT recognised as Kolkata', () => {
  // 23.7957°N 86.4304°E
  expect(isKolkataCoordinates(23.7957, 86.4304)).toBeFalsy();
});

test('Patna coordinates NOT recognised as Kolkata', () => {
  // 25.5941°N 85.1376°E
  expect(isKolkataCoordinates(25.5941, 85.1376)).toBeFalsy();
});

test('Mumbai coordinates NOT recognised as Kolkata', () => {
  expect(isKolkataCoordinates(19.076, 72.8777)).toBeFalsy();
});

// ─── FARE FORMULA VALIDATION ──────────────────────────────────────────────────

console.log('\n🔢 Fare Formula Validation');

test('Round-trip base = 2 × distance × rate', () => {
  const distanceKm = 150;
  const rate = FARE_CONFIG.sedan.roundTripPerKm;
  const fare = calculateFare({
    distanceKm, vehicleId: 'sedan', tripType: 'round-trip',
    pickupDate: '2026-11-01', returnDate: '2026-11-01', // same date = 0 nights
  });
  expect(fare.baseDistanceCharge).toBe(2 * distanceKm * rate);
  expect(fare.totalFare).toBe(2 * distanceKm * rate);
});

test('Night halt charge = nights × vehicle nightHaltCharge', () => {
  const fare = calculateFare({
    distanceKm: 100, vehicleId: 'ertiga', tripType: 'round-trip',
    pickupDate: '2026-11-01', returnDate: '2026-11-04', // 3 nights
  });
  expect(fare.nightHaltCount).toBe(3);
  expect(fare.nightHaltCharge).toBe(3 * FARE_CONFIG.ertiga.nightHaltCharge);
  expect(fare.totalFare).toBe(fare.baseDistanceCharge + fare.nightHaltCharge);
});

test('One-way fare = distance × one-way rate (no night halts)', () => {
  const distanceKm = 75;
  const rate = FARE_CONFIG.sedan.oneWayPerKm!;
  const fare = calculateFare({ distanceKm, vehicleId: 'sedan', tripType: 'one-way' });
  expect(fare.totalFare).toBe(distanceKm * rate);
  expect(fare.nightHaltCount).toBe(0);
  expect(fare.nightHaltCharge).toBe(0);
});

test('One-way fare has no night halt even if dates provided (no effect)', () => {
  const fare = calculateFare({
    distanceKm: 100, vehicleId: 'sedan', tripType: 'one-way',
    pickupDate: '2026-11-01', returnDate: '2026-11-05',
  });
  // Dates should be irrelevant for one-way
  expect(fare.nightHaltCount).toBe(0);
  expect(fare.nightHaltCharge).toBe(0);
  expect(fare.totalFare).toBe(100 * 21);
});

// ─── UNKNOWN VEHICLE ──────────────────────────────────────────────────────────

console.log('\n⚠️  Edge Cases');

test('Unknown vehicle ID throws', () => {
  expectThrows('unknown vehicle', () =>
    calculateFare({ distanceKm: 100, vehicleId: 'tempo-traveller' as never, tripType: 'one-way' })
  );
});

test('Return date before pickup gives negative nights (clamped to 0)', () => {
  // calculateNightHalts is used before saving, API should reject this
  const nights = calculateNightHalts('2026-11-05', '2026-11-01');
  expect(nights).toBe(0); // clamped
});

// ─── SUMMARY ──────────────────────────────────────────────────────────────────

console.log('\n' + '─'.repeat(60));
console.log(`\n✅ Passed: ${passed}`);
if (failed > 0) {
  console.error(`❌ Failed: ${failed}`);
  console.error('\nFailed tests:');
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('All tests passed!\n');
}
