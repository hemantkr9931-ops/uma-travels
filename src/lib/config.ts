// =====================================================================
// UMA TRAVELS — Business Configuration
// All factual business info is centralised here.
// Update this file when business details change.
// =====================================================================

export const SITE_CONFIG = {
  name: 'UMA TRAVELS',
  alternateNames: [
    'Uma Taxi',
    'Uma Taxi Service',
    'Uma Cab Service',
    'Uma Car Rental',
    'Uma Cab',
    'Uma Car Hire',
    'Uma Travels',
    'Uma Travels Dhanbad',
    'Uma Taxi Dhanbad',
    'Uma Cab Service Dhanbad',
    'Uma Car Rental Dhanbad',
  ],
  tagline: 'CABS. CAR RENTAL. CORPORATE TRAVELS.',
  description:
    'UMA TRAVELS — Reliable cab service, car rental, and corporate travel from Dhanbad, Jharkhand. Book outstation taxi, one-way cab, Innova cab, 7-seater cab, airport transfers, wedding car rental, and corporate travel across Jharkhand, West Bengal, Bihar, Odisha, and Uttar Pradesh. Cab near me in Dhanbad — transparent fares, verified drivers, 24/7 service.',
  email: 'umatravelsbooking@gmail.com',
  address: {
    street: 'Damkara, Barwadda',
    city: 'Dhanbad',
    district: 'Dhanbad',
    state: 'Jharkhand',
    pincode: '826004',
    country: 'India',
    full: 'Damkara, Barwadda, Dhanbad, Jharkhand – 826004, India',
  },
  // Leave phone/WhatsApp blank until a real number is confirmed.
  // These read from environment variables.
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '8789774460',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918789774460',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.uma-travels.com',
  // Approximate service-base coordinates (Dhanbad, Jharkhand) used for
  // Google Maps links and LocalBusiness structured data.
  geo: {
    latitude: 23.7957,
    longitude: 86.4304,
  },
  // Add real profile URLs (Google Business Profile, Facebook, Instagram,
  // Justdial, etc.) here so they appear as `sameAs` in structured data.
  socialProfiles: [
    'https://g.page/r/CSCaUY3qBTBqEBM',
  ] as string[],
  // Public social proof (single source of truth used across the site).
  // `googleReviewUrl` — direct link to open the review write modal on Google.
  // `googleBusinessUrl` — link to view the GMB profile and all customer reviews.
  rating: 4.9,
  reviewCount: 150,
  ridersServed: '5,000+',
  googleReviewUrl: 'https://g.page/r/CSCaUY3qBTBqEBM/review',
  googleBusinessUrl: 'https://g.page/r/CSCaUY3qBTBqEBM',
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '',
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
};

export const WHATSAPP_BOOKING_MESSAGE =
  'Hello UMA TRAVELS, I would like to enquire about a cab booking. Please assist me.';

export function getWhatsAppUrl(message?: string): string {
  const num = SITE_CONFIG.whatsapp;
  if (!num) return '#whatsapp-not-configured';
  const encoded = encodeURIComponent(message ?? WHATSAPP_BOOKING_MESSAGE);
  return `https://wa.me/${num}?text=${encoded}`;
}

export function getPhoneUrl(): string {
  const num = SITE_CONFIG.phone;
  if (!num) return '#phone-not-configured';
  const clean = num.replace(/\D/g, '');
  const dial = clean.length === 10 ? `+91${clean}` : num.startsWith('+') ? num : `+${clean}`;
  return `tel:${dial}`;
}
