import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { getClientIp, isRateLimited } from '@/lib/rate-limit';
import { ALL_LOCATIONS } from '@/data/locations';
import {
  VEHICLES,
  FARE_CONFIG,
  calculateFare,
  calculateNightHalts,
  isKolkataLocation,
  isKolkataCoordinates,
  type VehicleCategory,
} from '@/data/vehicles';

// ─── Reference ID ─────────────────────────────────────────────────────────────

function generateReferenceId(): string {
  const prefix = 'UT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ─── Indian mobile normalisation ──────────────────────────────────────────────

function normalizePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, '');
}

// ─── Local Packages Matrix ───────────────────────────────────────────────────

const LOCAL_BASE_PRICES: Record<string, Record<string, number>> = {
  '4hr': { sedan: 1480, ertiga: 2099, innova: 2099, suv: 2099, tempo: 3500 },
  '8hr': { sedan: 2120, ertiga: 2599, innova: 3399, suv: 3399, tempo: 5199 },
  '10hr': { sedan: 2599, ertiga: 2799, innova: 3499, suv: 3499, tempo: 6499 },
};

const LOCAL_PACKAGES_META: Record<string, { label: string; hrs: number; km: number }> = {
  '4hr': { label: '4 Hrs / 40 Km', hrs: 4, km: 40 },
  '8hr': { label: '8 Hrs / 80 Km', hrs: 8, km: 80 },
  '10hr': { label: '10 Hrs / 100 Km', hrs: 10, km: 100 },
};

function getLocalPriceGroup(vehicleId: string): 'sedan' | 'ertiga' | 'innova' | 'tempo' {
  if (vehicleId === 'sedan') return 'sedan';
  if (vehicleId === 'ertiga') return 'ertiga';
  if (vehicleId.includes('tempo')) return 'tempo';
  return 'innova';
}

// ─── Flexible Input Schema ───────────────────────────────────────────────────

const rawBookingSchema = z.object({
  // Locations (accepts both pickupName/dropName and from/to)
  pickupName: z.string().optional(),
  from: z.string().optional(),
  dropName: z.string().optional(),
  to: z.string().optional(),

  // Coordinates (optional)
  pickupLat: z.coerce.number().optional(),
  pickupLng: z.coerce.number().optional(),
  dropLat: z.coerce.number().optional(),
  dropLng: z.coerce.number().optional(),

  // Trip configuration
  tripType: z.string().default('one-way'),
  pickupDate: z.string().min(1),
  pickupTime: z.string().optional(),
  returnDate: z.string().optional().or(z.literal('')),
  returnTime: z.string().optional(),

  // Vehicle (accepts vehicleId or vehicleCategory)
  vehicleId: z.string().optional(),
  vehicleCategory: z.string().optional(),
  localPackageId: z.string().optional(),

  // Customer
  passengers: z.coerce.number().min(1).max(25).default(1),
  name: z.string().min(2).max(100),
  countryCode: z.string().default('+91'),
  phone: z.string().min(6).max(25),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().max(500).optional(),

  // Client telemetry / estimates
  clientDistanceKm: z.coerce.number().optional(),
  clientTotalFare: z.coerce.number().optional(),
  fareEstimate: z.any().optional(),
  website: z.string().max(300).optional(),
});

// ─── Distance Helpers ─────────────────────────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findLocationCoords(name: string): { lat: number; lng: number } | null {
  if (!name) return null;
  const clean = name.toLowerCase().trim();
  const loc = ALL_LOCATIONS.find(
    (l) =>
      l.name.toLowerCase() === clean ||
      l.slug.toLowerCase() === clean ||
      clean.includes(l.name.toLowerCase()) ||
      l.name.toLowerCase().includes(clean)
  );
  return loc ? { lat: loc.lat, lng: loc.lng } : null;
}

async function getRoadDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): Promise<number | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${lng1},${lat1};${lng2},${lat2}?overview=false`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'UmaTravels-CabBooking/1.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return null;
    return Math.round((data.routes[0].distance / 1000) * 10) / 10;
  } catch {
    return null;
  }
}

// ─── Internal Normalized Booking Structure ────────────────────────────────────

interface ProcessedBooking {
  referenceId: string;
  tripType: 'one-way' | 'round-trip' | 'local';
  pickupName: string;
  dropName: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  vehicleId: string;
  vehicleName: string;
  passengers: number;
  name: string;
  countryCode: string;
  phone: string;
  email?: string;
  notes?: string;
  // Fare details
  distanceKm?: number;
  ratePerKm?: number;
  baseCharge: number;
  nightHaltCount: number;
  nightHaltCharge: number;
  totalFare: number;
  // Local package details
  localPackageLabel?: string;
  localPackageHrs?: number;
  localPackageKm?: number;
}

// ─── WhatsApp & Phone Link Helpers ──────────────────────────────────────────

function getWhatsAppDirectUrl(countryCode: string, phone: string, b: ProcessedBooking): string {
  const cCodeDigits = countryCode.replace(/\D/g, '') || '91';
  let phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.startsWith('0')) {
    phoneDigits = phoneDigits.substring(1);
  }
  const fullPhone = phoneDigits.startsWith(cCodeDigits) ? phoneDigits : `${cCodeDigits}${phoneDigits}`;
  const isLocal = b.tripType === 'local';
  const tripLabel = isLocal ? 'Local City Rental' : b.tripType === 'round-trip' ? 'Round Trip' : 'One Way';

  const msg = [
    `Namaste ${b.name}!`,
    `Thank you for contacting Uma Travels. We received your booking request:`,
    `🚕 Cab: ${b.vehicleName} (${tripLabel})`,
    `📍 Pickup: ${b.pickupName}`,
    !isLocal ? `🏁 Drop: ${b.dropName}` : '',
    `📅 Schedule: ${b.pickupDate} at ${b.pickupTime}`,
    b.returnDate ? `🔄 Return: ${b.returnDate}${b.returnTime ? ` at ${b.returnTime}` : ''}` : '',
    b.totalFare > 0 ? `💰 Estimated Total: Rs. ${b.totalFare.toLocaleString('en-IN')}` : '',
    `\nWe are confirming your cab availability. Let us know if you need any adjustments!`,
  ].filter(Boolean).join('\n');

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
}

function getTelUrl(countryCode: string, phone: string): string {
  const cCodeDigits = countryCode.replace(/\D/g, '') || '91';
  let phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.startsWith('0')) {
    phoneDigits = phoneDigits.substring(1);
  }
  const fullPhone = phoneDigits.startsWith(cCodeDigits) ? phoneDigits : `${cCodeDigits}${phoneDigits}`;
  return `tel:+${fullPhone}`;
}

// ─── HTML Email Templates ─────────────────────────────────────────────────────

function buildBusinessEmail(b: ProcessedBooking): string {
  const isLocal = b.tripType === 'local';
  const isRound = b.tripType === 'round-trip';
  const tripLabel = isLocal ? 'Local City Rental' : isRound ? 'Round Trip' : 'One Way';
  const waUrl = getWhatsAppDirectUrl(b.countryCode, b.phone, b);
  const telUrl = getTelUrl(b.countryCode, b.phone);

  const mapsLinkRow = !isLocal && b.dropName
    ? `<tr><td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;border-bottom:1px solid #E2E8F0;">Directions</td><td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #E2E8F0;"><a href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(b.pickupName)}&destination=${encodeURIComponent(b.dropName)}" target="_blank" style="color:#0284C7;text-decoration:none;font-weight:700;">🗺️ Open in Google Maps</a></td></tr>`
    : '';

  const returnRow =
    isRound && b.returnDate
      ? `<tr style="background:#F8FAFC;"><td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;border-bottom:1px solid #E2E8F0;">Return Schedule</td><td style="padding:10px 14px;font-weight:700;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">${b.returnDate}${b.returnTime ? ` at ${b.returnTime}` : ''}</td></tr>`
      : '';

  const nightRow =
    b.nightHaltCount > 0
      ? `<tr><td style="padding:9px 14px;color:#475569;font-size:13px;border-bottom:1px solid #E2E8F0;">Night Halts</td><td style="padding:9px 14px;font-weight:700;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">${b.nightHaltCount} night(s) = ₹${b.nightHaltCharge.toLocaleString('en-IN')}</td></tr>`
      : '';

  const fareRows = isLocal
    ? `
      <tr><td style="padding:9px 14px;color:#475569;font-size:13px;border-bottom:1px solid #E2E8F0;">Rental Package</td><td style="padding:9px 14px;font-weight:700;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">${b.localPackageLabel || 'Local City Rental'}</td></tr>
      <tr style="background:#F8FAFC;"><td style="padding:9px 14px;color:#475569;font-size:13px;border-bottom:1px solid #E2E8F0;">Included Limit</td><td style="padding:9px 14px;font-weight:600;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">${b.localPackageHrs || 8} Hours / ${b.localPackageKm || 80} Km</td></tr>
      <tr><td style="padding:9px 14px;color:#475569;font-size:13px;border-bottom:1px solid #E2E8F0;">Package Base Price</td><td style="padding:9px 14px;font-weight:700;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">₹${b.baseCharge.toLocaleString('en-IN')}</td></tr>
      <tr style="background:#ECFDF5;"><td style="padding:12px 14px;color:#065F46;font-size:14px;font-weight:900;">ESTIMATED TOTAL</td><td style="padding:12px 14px;font-weight:900;font-size:19px;color:#047857;">₹${b.totalFare.toLocaleString('en-IN')}</td></tr>
    `
    : `
      <tr><td style="padding:9px 14px;color:#475569;font-size:13px;border-bottom:1px solid #E2E8F0;">Road Distance</td><td style="padding:9px 14px;font-weight:700;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">~${b.distanceKm || 0} km (${isRound ? 'one-way distance, cab stays with you' : 'one-way'})</td></tr>
      <tr style="background:#F8FAFC;"><td style="padding:9px 14px;color:#475569;font-size:13px;border-bottom:1px solid #E2E8F0;">Base Distance Charge</td><td style="padding:9px 14px;font-weight:600;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">₹${b.baseCharge.toLocaleString('en-IN')}</td></tr>
      ${nightRow}
      <tr style="background:#ECFDF5;"><td style="padding:12px 14px;color:#065F46;font-size:14px;font-weight:900;">ESTIMATED TOTAL FARE</td><td style="padding:12px 14px;font-weight:900;font-size:19px;color:#047857;">₹${b.totalFare.toLocaleString('en-IN')}</td></tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>New Cab Booking — ${b.name}</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:24px 12px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);border:1px solid #E2E8F0;max-width:100%;">

      <!-- Header with Amber Gradient -->
      <tr><td style="background:linear-gradient(135deg,#D97706 0%,#B45309 50%,#78350F 100%);padding:26px 30px;text-align:center;">
        <div style="display:inline-block;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.3);padding:4px 14px;border-radius:20px;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#FFFFFF;margin-bottom:8px;">
          UMA TRAVELS CAB SERVICE
        </div>
        <h1 style="margin:4px 0 6px;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
          🚕 New ${tripLabel} Booking
        </h1>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.92);font-weight:500;">
          Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} IST
        </p>
      </td></tr>

      <!-- Prominent Route Visualizer Bar -->
      <tr><td style="background:#0F172A;padding:18px 26px;color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;width:45%;">
              <span style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;font-weight:700;display:block;margin-bottom:3px;">PICKUP LOCATION</span>
              <p style="margin:0;color:#34D399;font-size:14px;font-weight:800;line-height:1.3;">📍 ${b.pickupName}</p>
            </td>
            <td align="center" style="vertical-align:middle;width:10%;color:#F59E0B;font-size:22px;font-weight:900;">
              ${isLocal ? '🏙️' : '➔'}
            </td>
            <td style="vertical-align:top;width:45%;text-align:right;">
              <span style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;font-weight:700;display:block;margin-bottom:3px;">${isLocal ? 'RENTAL TYPE' : 'DESTINATION'}</span>
              <p style="margin:0;color:#FDE68A;font-size:14px;font-weight:800;line-height:1.3;">
                ${isLocal ? 'City Rental Package' : `🏁 ${b.dropName}`}
              </p>
            </td>
          </tr>
        </table>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.12);text-align:center;">
          <span style="font-size:12px;color:#CBD5E1;font-weight:600;">
            🚗 ${b.vehicleName} &nbsp;|&nbsp; 📅 ${b.pickupDate} at ${b.pickupTime} &nbsp;|&nbsp; 🏷️ ${tripLabel}
          </span>
        </div>
      </td></tr>

      <!-- Body Container -->
      <tr><td style="padding:26px 28px;">

        <!-- ⚡ DIRECT ACTION BUTTONS (WhatsApp & Call) -->
        <div style="background:#F0FDF4;border:2px solid #86EFAC;border-radius:14px;padding:16px 18px;margin-bottom:24px;text-align:center;">
          <p style="margin:0 0 12px;font-size:12px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:1px;">
            ⚡ Instant Customer Contact (One-Click)
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:0 6px;">
                <a href="${waUrl}" target="_blank" style="display:block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:900;font-size:14px;padding:12px 18px;border-radius:10px;box-shadow:0 3px 10px rgba(37,211,102,0.4);text-align:center;">
                  💬 Chat on WhatsApp
                </a>
              </td>
              <td align="center" style="padding:0 6px;">
                <a href="${telUrl}" style="display:block;background:#0F172A;color:#ffffff;text-decoration:none;font-weight:900;font-size:14px;padding:12px 18px;border-radius:10px;box-shadow:0 3px 10px rgba(15,23,42,0.3);text-align:center;">
                  📞 Call Customer
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:10px 0 0;font-size:11px;color:#15803D;font-weight:600;">
            Customer: <strong style="color:#0F172A;">${b.name}</strong> (${b.countryCode} ${b.phone})
          </p>
        </div>

        <!-- Customer Card -->
        <h2 style="margin:0 0 10px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#B45309;">
          👤 Customer Details
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:22px;border-collapse:separate;">
          <tr style="background:#F8FAFC;">
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;width:35%;border-bottom:1px solid #E2E8F0;">Full Name</td>
            <td style="padding:10px 14px;font-weight:800;font-size:14px;color:#0F172A;border-bottom:1px solid #E2E8F0;">${b.name}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;border-bottom:1px solid #E2E8F0;">Mobile Number</td>
            <td style="padding:10px 14px;font-weight:800;font-size:14px;color:#0F172A;border-bottom:1px solid #E2E8F0;">
              <a href="${telUrl}" style="color:#0F172A;text-decoration:none;">${b.countryCode} ${b.phone}</a>
              <span style="display:inline-block;margin-left:8px;">
                <a href="${waUrl}" target="_blank" style="display:inline-block;background:#DCFCE7;color:#15803D;border:1px solid #86EFAC;padding:2px 8px;border-radius:6px;font-size:11px;text-decoration:none;font-weight:700;">
                  Open WhatsApp
                </a>
              </span>
            </td>
          </tr>
          ${b.notes ? `
          <tr style="background:#F8FAFC;">
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;">Customer Notes</td>
            <td style="padding:10px 14px;font-size:13px;color:#0F172A;font-weight:600;">${b.notes}</td>
          </tr>` : ''}
        </table>

        <!-- Journey & Vehicle Card -->
        <h2 style="margin:0 0 10px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#B45309;">
          🗺️ Trip & Vehicle Schedule
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:22px;border-collapse:separate;">
          <tr style="background:#F8FAFC;">
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;width:35%;border-bottom:1px solid #E2E8F0;">Trip Type</td>
            <td style="padding:10px 14px;font-weight:800;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">${tripLabel}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;border-bottom:1px solid #E2E8F0;">Selected Cab</td>
            <td style="padding:10px 14px;font-weight:800;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">${b.vehicleName}</td>
          </tr>
          <tr style="background:#F8FAFC;">
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;border-bottom:1px solid #E2E8F0;">Pickup Location</td>
            <td style="padding:10px 14px;font-weight:700;font-size:13px;color:#059669;border-bottom:1px solid #E2E8F0;">
              ${b.pickupName}
            </td>
          </tr>
          ${!isLocal ? `
          <tr>
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;border-bottom:1px solid #E2E8F0;">Drop Location</td>
            <td style="padding:10px 14px;font-weight:700;font-size:13px;color:#D97706;border-bottom:1px solid #E2E8F0;">
              ${b.dropName}
            </td>
          </tr>` : ''}
          <tr style="background:#F8FAFC;">
            <td style="padding:10px 14px;color:#64748B;font-size:13px;font-weight:600;border-bottom:1px solid #E2E8F0;">Pickup Date & Time</td>
            <td style="padding:10px 14px;font-weight:700;font-size:13px;color:#0F172A;border-bottom:1px solid #E2E8F0;">
              ${b.pickupDate} at ${b.pickupTime}
            </td>
          </tr>
          ${returnRow}
          ${mapsLinkRow}
        </table>

        <!-- Fare Summary Card -->
        <h2 style="margin:0 0 10px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#B45309;">
          💰 Estimated Fare Breakdown
        </h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:16px;border-collapse:separate;">
          ${fareRows}
        </table>

        <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:10px 14px;border-radius:6px;font-size:11px;color:#92400E;line-height:1.5;">
          ${isLocal
            ? '📌 <strong>Local Rental Policy:</strong> Extra km and extra hours are applicable as per actual usage at the end of the trip. Toll charges & parking charges are excluded. Garage to garage calculation.'
            : '📌 <strong>Outstation Policy:</strong> Toll charges and parking charges are excluded (payable as per actuals by customer). Zero Advance required.'
          }
        </div>

      </td></tr>

      <!-- Clean Footer -->
      <tr><td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:18px 28px;text-align:center;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#475569;">UMA TRAVELS — Premium Car & Taxi Rental Service</p>
        <p style="margin:4px 0 0;font-size:11px;color:#94A3B8;">Damkara, Barwadda, Dhanbad, Jharkhand 826004 • Call/WhatsApp: +91 8789774460</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function buildCustomerEmail(b: ProcessedBooking): string {
  const isLocal = b.tripType === 'local';
  const isRound = b.tripType === 'round-trip';
  const tripLabel = isLocal ? 'Local City Rental' : isRound ? 'Round Trip' : 'One Way';

  const returnRow =
    isRound && b.returnDate
      ? `<tr><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Return Date</td><td style="padding:8px 14px;font-weight:600;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">${b.returnDate}${b.returnTime ? ` at ${b.returnTime}` : ''}</td></tr>`
      : '';

  const fareRows = isLocal
    ? `
      <tr><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Package</td><td style="padding:8px 14px;font-weight:700;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">${b.localPackageLabel || 'Local City Rental'}</td></tr>
      <tr><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Included Limit</td><td style="padding:8px 14px;font-weight:600;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">${b.localPackageHrs || 8} Hours / ${b.localPackageKm || 80} Km</td></tr>
      <tr style="background:#ECFDF5;"><td style="padding:10px 14px;color:#065F46;font-size:14px;font-weight:900;">Estimated Package Fare</td><td style="padding:10px 14px;font-weight:900;font-size:18px;color:#047857;">₹${b.totalFare.toLocaleString('en-IN')}</td></tr>
    `
    : `
      <tr><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Distance</td><td style="padding:8px 14px;font-weight:600;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">~${b.distanceKm || 0} km (${isRound ? 'one-way distance, cab stays with you' : 'one-way'})</td></tr>
      <tr><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Base Fare</td><td style="padding:8px 14px;font-weight:600;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">₹${b.baseCharge.toLocaleString('en-IN')}</td></tr>
      ${b.nightHaltCount > 0 ? `<tr><td style="padding:8px 14px;color:#1D4ED8;font-size:13px;border-bottom:1px solid #E5E7EB;">Night Halt Charge</td><td style="padding:8px 14px;font-weight:600;font-size:13px;color:#1D4ED8;border-bottom:1px solid #E5E7EB;">${b.nightHaltCount} night(s) = ₹${b.nightHaltCharge.toLocaleString('en-IN')}</td></tr>` : ''}
      <tr style="background:#ECFDF5;"><td style="padding:10px 14px;color:#065F46;font-size:14px;font-weight:900;">Estimated Total Fare</td><td style="padding:10px 14px;font-weight:900;font-size:18px;color:#047857;">₹${b.totalFare.toLocaleString('en-IN')}</td></tr>
    `;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Booking Confirmed — ${b.referenceId}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:24px 12px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:100%;">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:24px 28px;text-align:center;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.85);">UMA TRAVELS</p>
        <h1 style="margin:6px 0 4px;font-size:22px;font-weight:900;color:#ffffff;">✅ Booking Enquiry Confirmed</h1>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.9);">Reference ID: <strong style="font-family:monospace;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:4px;">${b.referenceId}</strong></p>
      </td></tr>

      <!-- Greeting -->
      <tr><td style="padding:20px 28px 12px;">
        <p style="margin:0;font-size:15px;color:#1F2937;">Dear <strong>${b.name}</strong>,</p>
        <p style="margin:6px 0 0;font-size:14px;color:#4B5563;line-height:1.6;">
          Thank you for choosing <strong>UMA TRAVELS</strong>. We have successfully received your ${tripLabel.toLowerCase()} booking request. Our team will contact you shortly to confirm the cab and driver details.
        </p>
      </td></tr>

      <!-- Route Banner -->
      <tr><td style="padding:0 28px 16px;">
        <div style="background:#1E293B;border-radius:12px;padding:14px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#34D399;font-size:13px;font-weight:700;">📍 ${b.pickupName}</td>
              <td align="center" style="color:#FBBF24;font-size:18px;">${isLocal ? '🏙️' : '→'}</td>
              <td align="right" style="color:#FDE68A;font-size:13px;font-weight:700;">${isLocal ? 'Local City Rental' : `📍 ${b.dropName}`}</td>
            </tr>
          </table>
        </div>
      </td></tr>

      <!-- Summary -->
      <tr><td style="padding:0 28px 20px;">
        <h2 style="margin:0 0 10px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#059669;">Booking Summary</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;">
          <tr style="background:#F9FAFB;"><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Vehicle</td><td style="padding:8px 14px;font-weight:700;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">${b.vehicleName}</td></tr>
          <tr><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Trip Type</td><td style="padding:8px 14px;font-weight:600;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">${tripLabel}</td></tr>
          <tr style="background:#F9FAFB;"><td style="padding:8px 14px;color:#4B5563;font-size:13px;border-bottom:1px solid #E5E7EB;">Pickup Date & Time</td><td style="padding:8px 14px;font-weight:600;font-size:13px;color:#1F2937;border-bottom:1px solid #E5E7EB;">${b.pickupDate}${b.pickupTime ? ` at ${b.pickupTime}` : ''}</td></tr>
          ${returnRow}
          ${fareRows}
        </table>
      </td></tr>

      <!-- Contact Helpline -->
      <tr><td style="background:#FFFBEB;border-top:2px solid #FDE68A;padding:16px 28px;text-align:center;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#92400E;">Need instant assistance or have custom requirements?</p>
        <p style="margin:4px 0 0;font-size:13px;color:#78716C;">Call / WhatsApp: <strong>+91 8789774460</strong></p>
        <p style="margin:2px 0 0;font-size:13px;color:#78716C;">Email: <a href="mailto:umatravelsbooking@gmail.com" style="color:#D97706;text-decoration:none;">umatravelsbooking@gmail.com</a></p>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#F8FAFC;border-top:1px solid #E5E7EB;padding:14px 28px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#94A3B8;">UMA TRAVELS · Damkara, Barwadda, Dhanbad, Jharkhand 826004</p>
        <p style="margin:4px 0 0;font-size:11px;color:#CBD5E1;">Keep reference ID <strong>${b.referenceId}</strong> handy for any questions.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Resend Dispatch ──────────────────────────────────────────────────────────

async function dispatchEmails(b: ProcessedBooking): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured in environment variables');
    return { success: false, error: 'Email service is not configured' };
  }
  const resend = new Resend(apiKey);
  const recipientEmail = process.env.BOOKING_RECIPIENT_EMAIL || 'umatravelsbooking@gmail.com';
  const fromAddress = process.env.RESEND_FROM_ADDRESS || 'onboarding@resend.dev';

  const isLocal = b.tripType === 'local';
  const tripLabel = isLocal ? 'Local City Rental' : b.tripType === 'round-trip' ? 'Round Trip' : 'One Way';
  const routeSummary = isLocal ? b.pickupName : `${b.pickupName} → ${b.dropName}`;
  const subject = `🚕 New Booking [${b.referenceId}] — ${tripLabel}: ${routeSummary} (${b.vehicleName}, ₹${b.totalFare.toLocaleString('en-IN')})`;

  const errors: string[] = [];

  // 1. Business notification (mandatory — only 1 consolidated email sent upon submit)
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: recipientEmail,
      subject,
      html: buildBusinessEmail(b),
      replyTo: b.email && b.email.trim() ? b.email.trim() : undefined,
    });
    if (error) {
      console.error('[RESEND] Business notification error:', error);
      errors.push(`Business: ${JSON.stringify(error)}`);
    } else {
      console.info(`[RESEND] Single business notification dispatched successfully for ${b.referenceId}`);
    }
  } catch (err) {
    console.error('[RESEND] Business dispatch exception:', err);
    errors.push(`Business exception: ${String(err)}`);
  }

  return errors.length === 0
    ? { success: true }
    : { success: false, error: errors.join('; ') };
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (isRateLimited('booking', ip, 10, 60_000)) {
    return NextResponse.json(
      { error: 'Too many booking requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const parsed = rawBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const raw = parsed.data;

  // Anti-spam honeypot
  if (raw.website && raw.website.trim().length > 0) {
    return NextResponse.json({ success: true, referenceId: generateReferenceId() });
  }

  // Normalize locations
  const pickupName = (raw.pickupName || raw.from || '').trim();
  const rawTripType = (raw.tripType || 'one-way').toLowerCase();
  const isLocal = rawTripType === 'local';
  const isRound = rawTripType === 'round-trip';
  const tripType: 'one-way' | 'round-trip' | 'local' = isLocal
    ? 'local'
    : isRound
    ? 'round-trip'
    : 'one-way';

  const dropName = isLocal
    ? 'Local City Tour'
    : (raw.dropName || raw.to || '').trim();

  if (!pickupName || pickupName.length < 2) {
    return NextResponse.json({ error: 'Please enter a valid pickup location.' }, { status: 422 });
  }

  if (!isLocal && (!dropName || dropName.length < 2)) {
    return NextResponse.json({ error: 'Please enter a valid drop destination.' }, { status: 422 });
  }

  // Normalize phone
  const normalizedPhone = normalizePhone(raw.phone);
  if (raw.countryCode === '+91' && !/^[6-9]\d{9}$/.test(normalizedPhone)) {
    return NextResponse.json(
      { error: 'Please enter a valid 10-digit Indian mobile number.' },
      { status: 422 }
    );
  }

  // Normalize vehicle
  const vehicleRaw = (raw.vehicleId || raw.vehicleCategory || 'sedan').toLowerCase();
  let vehicleId: string = vehicleRaw;
  if (vehicleRaw === 'suv' || vehicleRaw === 'ertiga') vehicleId = 'ertiga';
  else if (vehicleRaw.includes('innova')) vehicleId = 'innova';
  else if (vehicleRaw.includes('carens')) vehicleId = 'carens';
  else if (vehicleRaw.includes('tempo')) vehicleId = 'tempo-traveller';
  else if (vehicleRaw === 'sedan' || vehicleRaw === 'dzire') vehicleId = 'sedan';

  const matchedVehicle = VEHICLES.find((v) => v.id === vehicleId) || VEHICLES[0];
  const vehicleName =
    vehicleId === 'tempo-traveller'
      ? 'Tempo Traveller (12/17 Seater)'
      : matchedVehicle?.name || 'Cab / Taxi';

  // ─── Calculate Fares & Details ─────────────────────────────────────────────

  let baseCharge = 0;
  let nightHaltCount = 0;
  let nightHaltCharge = 0;
  let totalFare = 0;
  let distanceKm: number | undefined = undefined;
  let ratePerKm: number | undefined = undefined;
  let localPackageLabel: string | undefined = undefined;
  let localPackageHrs: number | undefined = undefined;
  let localPackageKm: number | undefined = undefined;

  if (isLocal) {
    const pkgId = raw.localPackageId || '8hr';
    const group = getLocalPriceGroup(vehicleId);
    const meta = LOCAL_PACKAGES_META[pkgId] || LOCAL_PACKAGES_META['8hr'];
    const price = LOCAL_BASE_PRICES[pkgId]?.[group] ?? (group === 'sedan' ? 2120 : group === 'ertiga' ? 2599 : group === 'tempo' ? 5199 : 3399);

    localPackageLabel = meta.label;
    localPackageHrs = meta.hrs;
    localPackageKm = meta.km;
    baseCharge = price;
    totalFare = price;
  } else {
    // Resolve coordinates if missing
    let pLat = raw.pickupLat;
    let pLng = raw.pickupLng;
    let dLat = raw.dropLat;
    let dLng = raw.dropLng;

    if (!pLat || !pLng) {
      const pCoords = findLocationCoords(pickupName);
      if (pCoords) {
        pLat = pCoords.lat;
        pLng = pCoords.lng;
      }
    }
    if (!dLat || !dLng) {
      const dCoords = findLocationCoords(dropName);
      if (dCoords) {
        dLat = dCoords.lat;
        dLng = dCoords.lng;
      }
    }

    // Try road distance first
    if (pLat && pLng && dLat && dLng) {
      const roadD = await getRoadDistanceKm(pLat, pLng, dLat, dLng);
      if (roadD !== null && roadD > 0) {
        distanceKm = roadD;
      } else {
        const straight = haversineKm(pLat, pLng, dLat, dLng);
        distanceKm = Math.round(straight * 1.25);
      }
    } else if (raw.clientDistanceKm && raw.clientDistanceKm > 0) {
      distanceKm = raw.clientDistanceKm;
    } else {
      distanceKm = 100; // sensible default if unknown
    }

    // Check if Kolkata bidirectional route
    const isKolkata =
      isKolkataLocation(pickupName) ||
      isKolkataLocation(dropName) ||
      (pLat && pLng ? isKolkataCoordinates(pLat, pLng) : false) ||
      (dLat && dLng ? isKolkataCoordinates(dLat, dLng) : false);

    // Fare calculation
    const vehCat: VehicleCategory = (['sedan', 'ertiga', 'innova', 'carens'].includes(vehicleId)
      ? vehicleId
      : 'sedan') as VehicleCategory;

    try {
      const fare = calculateFare({
        distanceKm,
        vehicleId: vehCat,
        tripType: tripType as 'one-way' | 'round-trip',
        pickupDate: raw.pickupDate,
        returnDate: raw.returnDate || undefined,
        isKolkataRoute: isKolkata,
      });
      ratePerKm = fare.ratePerKm;
      baseCharge = fare.baseDistanceCharge;
      nightHaltCount = fare.nightHaltCount;
      nightHaltCharge = fare.nightHaltCharge;
      totalFare = fare.totalFare;
    } catch {
      // Fallback calculation for custom vehicles like tempo
      const rate = vehicleId === 'tempo-traveller' ? 28 : (FARE_CONFIG[vehCat]?.roundTripPerKm ?? 14);
      ratePerKm = rate;
      const requiresReturnFare = tripType === 'one-way' && distanceKm > 200 && !isKolkata;
      const factor = isRound || requiresReturnFare ? 2 : 1;
      baseCharge = Math.round(distanceKm * rate * factor);
      if (isRound && raw.pickupDate && raw.returnDate) {
        nightHaltCount = calculateNightHalts(raw.pickupDate, raw.returnDate);
        nightHaltCharge = nightHaltCount * 1000;
      }
      const shortRental = distanceKm < 50 ? 700 : 0;
      totalFare = baseCharge + shortRental + nightHaltCharge;
    }
  }

  // Client fare override check if client already presented an accurate fare
  if (raw.clientTotalFare && raw.clientTotalFare > 0 && Math.abs(raw.clientTotalFare - totalFare) < 200) {
    totalFare = raw.clientTotalFare;
  }

  const referenceId = generateReferenceId();

  const processed: ProcessedBooking = {
    referenceId,
    tripType,
    pickupName,
    dropName,
    pickupDate: raw.pickupDate,
    pickupTime: raw.pickupTime || '09:00',
    returnDate: raw.returnDate || undefined,
    returnTime: raw.returnTime || undefined,
    vehicleId,
    vehicleName,
    passengers: raw.passengers,
    name: raw.name.trim(),
    countryCode: raw.countryCode,
    phone: normalizedPhone,
    email: raw.email?.trim() || undefined,
    notes: raw.notes?.trim() || undefined,
    distanceKm,
    ratePerKm,
    baseCharge,
    nightHaltCount,
    nightHaltCharge,
    totalFare,
    localPackageLabel,
    localPackageHrs,
    localPackageKm,
  };

  console.info(
    `[BOOKING SUCCESS] ${referenceId} | ${tripType.toUpperCase()} | ` +
    `${pickupName} → ${dropName} | ${vehicleName} | ₹${totalFare} | ` +
    `${processed.name} (${processed.countryCode} ${processed.phone})`
  );

  // Dispatch emails (non-blocking notification)
  const emailRes = await dispatchEmails(processed);

  return NextResponse.json({
    success: true,
    referenceId,
    tripType,
    distanceKm,
    totalFare,
    vehicleName,
    notificationSent: emailRes.success,
  });
}
