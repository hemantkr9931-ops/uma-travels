// =====================================================================
// /routes/[routeSlug]/page.tsx — Dynamic Route Page
// Full SEO: on-page, technical, schema, keyword-rich 2000+ word content
// =====================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Navigation, Info, ArrowLeftRight, ChevronDown } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import HeroSlideshow from '@/components/common/HeroSlideshow';
import { RouteMapSection } from '@/components/common/MapSection';
import VehicleCard from '@/components/cards/VehicleCard';
import FareCalculatorSection from '@/components/common/FareCalculatorSection';
import ServiceCard from '@/components/cards/ServiceCard';
import RouteContentSection from '@/components/seo/RouteContentSection';
import AssuranceStrip from '@/components/common/AssuranceStrip';
import RouteComparisonSection from '@/components/common/RouteComparisonSection';
import TestimonialsSection from '@/components/common/TestimonialsSection';
import { ALL_ROUTES, getRouteBySlug, getRouteFare, getRouteFareMap } from '@/data/routes';
import { getLocationBySlug } from '@/data/locations';
import { VEHICLES } from '@/data/vehicles';
import { SERVICES } from '@/data/services';
import { buildMetadata, getBreadcrumbSchema, getFAQSchema, getWebPageSchema, getArticleSchema, getHowToSchema } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/config';

interface PageProps {
  params: Promise<{ routeSlug: string }>;
}


function parseRouteSlug(slug: string): { originSlug: string; destinationSlug: string } | null {
  // Expected pattern: origin-to-destination  e.g. dhanbad-to-ranchi
  const match = slug.match(/^(.+)-to-(.+)$/);
  if (!match) return null;
  return { originSlug: match[1], destinationSlug: match[2] };
}

export async function generateStaticParams() {
  return ALL_ROUTES.filter((r) => r.status === 'published').map((r) => ({
    routeSlug: `${r.originSlug}-to-${r.destinationSlug}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { routeSlug } = await params;
  const parsed = parseRouteSlug(routeSlug);
  if (!parsed) return { title: 'Route Not Found' };

  const route = getRouteBySlug(parsed.originSlug, parsed.destinationSlug);
  if (!route || route.status === 'noindex') return { title: 'Route Not Found' };

  const durationHours = Math.floor(route.approxDurationMin / 60);
  const durationMins = route.approxDurationMin % 60;
  const durationStr = durationMins > 0 ? `${durationHours}h ${durationMins}m` : `${durationHours}h`;

  const sedanFareEstimate = getRouteFare(route, 'sedan');
  const innovaFareEstimate = getRouteFare(route, 'innova');

  return buildMetadata({
    title: `${route.originName} to ${route.destinationName} Cab | Taxi, Car Rental & Booking`,
    description: `Book ${route.originName} to ${route.destinationName} cab with UMA TRAVELS. Sedan from ₹${sedanFareEstimate.toLocaleString('en-IN')}, Innova from ₹${innovaFareEstimate.toLocaleString('en-IN')} one-way. ~${route.approxDistanceKm} km, ~${durationStr} drive. One-way cab, round-trip, outstation cab, car rental, Innova cab from ${route.originName}. Verified drivers, transparent pricing, 24/7.`,
    canonicalPath: `/routes/${routeSlug}/`,
    noIndex: route.status === 'draft',
    // No keyword array — meta keywords are ignored by Google and flagged as spam.
    // All keyword variants appear naturally in the page content.
  });
}

export const instant = false;

export default async function RoutePage({ params }: PageProps) {
  const { routeSlug } = await params;
  const parsed = parseRouteSlug(routeSlug);

  if (!parsed) notFound();

  const route = getRouteBySlug(parsed.originSlug, parsed.destinationSlug);
  if (!route || route.status === 'noindex') notFound();

  const originCity = getLocationBySlug(route.originSlug);
  const destCity = getLocationBySlug(route.destinationSlug);

  const reverseSlug = `${route.destinationSlug}-to-${route.originSlug}`;
  const reverseRoute = getRouteBySlug(route.destinationSlug, route.originSlug);

  // Calculate fares for all vehicles (route-aware, fixed-price aware)
  const fareMap = getRouteFareMap(route);
  const vehicleFares = VEHICLES.map((v) => ({
    vehicle: v,
    fare: { estimatedTotal: fareMap[v.id] },
  }));

  // Applicable services on route pages (exclude local)
  const routeServices = SERVICES.filter((s) => s.applicableOnRoutePages);

  const durationHours = Math.floor(route.approxDurationMin / 60);
  const durationMins = route.approxDurationMin % 60;
  const durationStr = durationMins > 0 ? `${durationHours}h ${durationMins}m` : `${durationHours}h`;

  const sedanFare = fareMap['sedan'] ?? 0;
  const innovaFare = fareMap['innova'] ?? 0;

  const routeFaqs = [
    {
      question: `How far is ${route.originName} from ${route.destinationName} by road?`,
      answer: `The approximate road distance from ${route.originName} to ${route.destinationName} is ${route.approxDistanceKm} km. Actual distance may vary based on the specific route taken and road conditions.`,
    },
    {
      question: `How long does it take to travel from ${route.originName} to ${route.destinationName} by cab?`,
      answer: `The estimated drive time from ${route.originName} to ${route.destinationName} is approximately ${durationStr}. Actual travel time depends on traffic, road conditions, and stops along the way.`,
    },
    {
      question: `What is the taxi fare from ${route.originName} to ${route.destinationName}?`,
      answer: `Cab fares from ${route.originName} to ${route.destinationName} start from approximately ₹${sedanFare.toLocaleString('en-IN')} for a sedan (one-way). Toyota Innova fare is approximately ₹${innovaFare.toLocaleString('en-IN')} one-way. Fares vary by vehicle category and trip type. Final fares are confirmed at booking.`,
    },
    {
      question: `Are there tolls on the ${route.originName} to ${route.destinationName} route?`,
      answer: route.tollApplicable
        ? `Yes, toll charges are likely on this route. Toll costs are payable by the passenger and will be charged as per the applicable toll plazas. Your driver will inform you about specific tolls during the journey.`
        : `No significant toll charges are anticipated on this route based on current information. Actual conditions may vary.`,
    },
    {
      question: `Can I book a round trip from ${route.originName} to ${route.destinationName}?`,
      answer: `Yes, UMA TRAVELS offers round-trip cab booking from ${route.originName} to ${route.destinationName}. The same driver and vehicle will be available for your return journey. Use the booking form above and select 'Round-Trip'.`,
    },
    {
      question: `Is there a one-way cab available from ${route.originName} to ${route.destinationName}?`,
      answer: `Yes. UMA TRAVELS offers one-way cab service from ${route.originName} to ${route.destinationName}. You pay only for the one-way distance — no return fare is charged for one-way bookings.`,
    },
    {
      question: `Can I book an Innova cab from ${route.originName} to ${route.destinationName}?`,
      answer: `Yes. Toyota Innova Crysta (7-seater) is available for booking from ${route.originName} to ${route.destinationName} with UMA TRAVELS. Innova fare for this route is approximately ₹${innovaFare.toLocaleString('en-IN')} one-way.`,
    },
    {
      question: `Is there a 7 seater cab from ${route.originName} to ${route.destinationName}?`,
      answer: `Yes. Toyota Innova (7 seats) is available for the ${route.originName} to ${route.destinationName} route with UMA TRAVELS.`,
    },
    {
      question: `Is car rental available from ${route.originName} to ${route.destinationName}?`,
      answer: `Yes. UMA TRAVELS provides car rental service from ${route.originName} to ${route.destinationName} with driver. Choose from sedan, Ertiga, Innova, or Tempo Traveller for outstation car rental with transparent per-km pricing.`,
    },
    {
      question: `How to book a cab from ${route.originName} to ${route.destinationName}?`,
      answer: `Use the booking form on this page to submit your cab enquiry. Enter pickup in ${route.originName}, drop in ${route.destinationName}, date, and vehicle preference. UMA TRAVELS will confirm the fare and assign a verified driver. You can also WhatsApp or call us directly.`,
    },
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Routes', url: '/routes/' },
    { name: `${route.originName} to ${route.destinationName}`, url: `/routes/${routeSlug}/` },
  ]);
  const faqSchema = getFAQSchema(routeFaqs);
  const webPageSchema = getWebPageSchema({
    title: `${route.originName} to ${route.destinationName} Cab | Taxi Fare, Distance & Booking`,
    description: `Book a ${route.originName} to ${route.destinationName} cab with UMA TRAVELS. One-way, round-trip, outstation, Innova and 7-seater cabs. ~${route.approxDistanceKm} km, ~${durationStr} drive.`,
    url: `/routes/${routeSlug}/`,
  });

  // Route-specific TaxiService schema
  const routeServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: `${route.originName} to ${route.destinationName} Cab Service`,
    description: `UMA TRAVELS provides cab and taxi service from ${route.originName} to ${route.destinationName}. One-way, round-trip, outstation, and corporate cab options available. ~${route.approxDistanceKm} km, ~${durationStr} drive.`,
    url: `${SITE_CONFIG.siteUrl}/routes/${routeSlug}/`,
    provider: {
      '@type': 'Organization',
      name: 'UMA TRAVELS',
      url: SITE_CONFIG.siteUrl,
      telephone: SITE_CONFIG.phone,
    },
    areaServed: [
      { '@type': 'City', name: route.originName },
      { '@type': 'City', name: route.destinationName },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${route.originName} to ${route.destinationName} Cab Options`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `One-Way Cab from ${route.originName} to ${route.destinationName}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Round-Trip Cab from ${route.originName} to ${route.destinationName}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Innova Cab from ${route.originName} to ${route.destinationName}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Outstation Taxi from ${route.originName} to ${route.destinationName}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Airport Transfer from ${route.originName} to ${route.destinationName}` } },
      ],
    },
    offers: vehicleFares.map(({ vehicle, fare }) => ({
      '@type': 'Offer',
      name: `${vehicle.name} Cab from ${route.originName} to ${route.destinationName}`,
      description: `${vehicle.name} (${vehicle.seatingCapacity} seats) one-way cab from ${route.originName} to ${route.destinationName}, ~${route.approxDistanceKm} km`,
      price: fare.estimatedTotal,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    })),
  };

  // Article schema — GEO: helps appear in AI-generated summaries and answers
  const articleSchema = getArticleSchema({
    headline: `${route.originName} to ${route.destinationName} Cab | Taxi, Car Rental & Booking`,
    description: `UMA TRAVELS provides one-way cab, round-trip cab, outstation taxi, car rental, Innova cab and 7-seater from ${route.originName} to ${route.destinationName}. ~${route.approxDistanceKm} km, ~${durationStr} drive. Sedan from ₹${sedanFare.toLocaleString('en-IN')} one-way.`,
    url: `/routes/${routeSlug}/`,
    dateModified: route.lastVerified,
  });

  // HowTo schema — AEO: answers 'how to book cab from X to Y' queries in AI Overviews
  const howToSchema = getHowToSchema({
    name: `How to Book a Cab from ${route.originName} to ${route.destinationName}`,
    description: `Step-by-step booking guide for ${route.originName} to ${route.destinationName} cab with UMA TRAVELS.`,
    steps: [
      { name: 'Select your trip details', text: `Fill the booking form on this page. Enter ${route.originName} as pickup and ${route.destinationName} as destination, select your travel date and choose one-way or round-trip.` },
      { name: 'Choose your vehicle', text: `Pick from sedan (~₹${sedanFare.toLocaleString('en-IN')}), Innova (~₹${innovaFare.toLocaleString('en-IN')}), Ertiga, or Tempo Traveller based on group size.` },
      { name: 'Receive confirmation', text: `UMA TRAVELS confirms availability, shares the exact fare, and assigns a verified driver for the ${route.originName}–${route.destinationName} route.` },
      { name: 'Travel comfortably', text: `Your driver arrives on time. Pay only after reaching ${route.destinationName} — zero advance payment required.` },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(routeServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <Breadcrumb items={[
        { label: 'Routes', href: '/routes/' },
        { label: `${route.originName} → ${route.destinationName}` },
      ]} />

      {/* Hero with slideshow background */}
      <section className="relative" style={{ minHeight: '520px' }}>
        <HeroSlideshow overlayClassName="" />
        <div className="relative z-20">
          <div className="container-site py-6 sm:py-12">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="w-full order-2 lg:order-1 glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80">
                <span className="section-label">Route</span>
                <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  <span className="text-gradient-gold">{route.originName}</span>
                  <span className="text-[var(--color-text-muted)] mx-3">→</span>
                  <span className="text-gradient-gold">{route.destinationName}</span>
                  <br />
                  <span className="text-xl font-bold text-[var(--color-text-secondary)]">Cab / Taxi Service</span>
                </h1>

                {/* Keyword chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    `One-Way Cab`,
                    `Outstation Taxi`,
                    `Round-Trip`,
                    `Innova Cab`,
                    `7 Seater`,
                    `Airport Transfer`,
                    `Corporate Cab`,
                  ].map((kw) => (
                    <span key={kw} className="px-2.5 py-1 rounded-full text-[0.65rem] font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)]">
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Route stats */}
                <div className="flex flex-wrap gap-4 mb-5">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                    <MapPin size={16} style={{ color: 'var(--color-gold-400)' }} />
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Distance</p>
                      <p className="font-bold text-sm">~{route.approxDistanceKm} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                    <Clock size={16} style={{ color: 'var(--color-blue-400)' }} />
                    <div>
                      <p className="text-xs text-[var(--color-text-muted)]">Drive Time</p>
                      <p className="font-bold text-sm">~{durationStr}</p>
                    </div>
                  </div>
                  {route.tollApplicable && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--color-gold-glow)', border: '1px solid var(--color-border-gold)' }}>
                      <Info size={16} style={{ color: 'var(--color-gold-400)' }} />
                      <p className="text-xs text-[var(--color-gold-400)] font-medium">Tolls may apply</p>
                    </div>
                  )}
                </div>

                {route.viaPoints && route.viaPoints.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                      Route Passes Through
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {route.viaPoints.map((via) => (
                        <span key={via} className="px-3 py-1 rounded-full text-xs border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          {via}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {route.travelPurposes.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                      Common Travel Reasons
                    </p>
                    <ul className="space-y-1">
                      {route.travelPurposes.map((tp) => (
                        <li key={tp} className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                          <span style={{ color: 'var(--color-gold-400)' }}>•</span>
                          {tp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-lg text-xs text-[var(--color-text-muted)]" style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                  <p className="flex gap-2">
                    <Info size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--color-gold-400)' }} />
                    Distance and duration are approximate estimates. Actual values depend on the specific route, traffic conditions, and stops.
                  </p>
                </div>

                {reverseRoute && (
                  <div className="mt-4">
                    <Link
                      href={`/routes/${reverseSlug}/`}
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-blue-400)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      <ArrowLeftRight size={14} />
                      View reverse: {route.destinationName} → {route.originName}
                    </Link>
                  </div>
                )}
              </div>

              {/* Enhanced Booking Form */}
              <div className="w-full order-1 lg:order-2 glass-booking rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden" id="booking">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 min-w-0">
                    Book {route.originName} → {route.destinationName}
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Cabs
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                  Transparent per-km billing • Zero advance needed • Verified drivers
                </p>
                <EnhancedBookingForm
                  prefillFrom={route.originName}
                  prefillTo={route.destinationName}
                  prefillTrip="one-way"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking assurance */}
      <AssuranceStrip variant="muted" />

      {/* Vehicle fare cards */}
      <section className="section-padding bg-[var(--color-bg-secondary)]">
        <div className="container-site">
          <h2 className="text-2xl font-black mb-2">
            Vehicle Options &amp; Fare Estimates — {route.originName} to {route.destinationName}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-7">
            Choose from our fleet for the {route.originName} to {route.destinationName} journey:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicleFares.map(({ vehicle, fare }) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                routeFrom={route.originSlug}
                routeTo={route.destinationSlug}
                estimatedFare={fare.estimatedTotal}
                href={`/routes/${routeSlug}/#booking`}
              />
            ))}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4 flex gap-2">
            <Info size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--color-gold-400)' }} />
            Fare estimates are based on one-way distance. Final fares are confirmed at booking. Toll charges are additional.
          </p>
        </div>
      </section>

      {/* Applicable services */}
      <section className="section-padding">
        <div className="container-site">
          <h2 className="text-2xl font-black mb-6">
            Booking Options for {route.originName} to {route.destinationName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {routeServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                href={`/routes/${routeSlug}/#booking`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Rich SEO Content (2000+ words, all keyword variants) ── */}
      <RouteContentSection
        route={route}
        vehicles={VEHICLES}
        fareMap={fareMap}
        originCity={originCity}
        destCity={destCity}
      />

      {/* Cab vs Train vs Bus comparison */}
      <RouteComparisonSection
        originName={route.originName}
        destinationName={route.destinationName}
        distanceKm={route.approxDistanceKm}
      />

      {/* Customer reviews (renders when real reviews exist) */}
      <TestimonialsSection variant="plain" limit={3} idSuffix="-route" />

      {/* City links */}
      {(originCity || destCity) && (
        <section className="section-padding bg-[var(--color-bg-secondary)]">
          <div className="container-site">
            <h2 className="text-xl font-bold mb-5">
              Explore Origin &amp; Destination Cities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {originCity && (
                <Link
                  href={`/cities/${originCity.slug}/`}
                  className="card-dark group p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="font-black text-base text-slate-900 group-hover:text-amber-800 transition-colors block">
                          {originCity.name}
                        </span>
                        <span className="text-[0.68rem] font-bold text-amber-700 uppercase tracking-wider">Pickup Origin City</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {originCity.excerpt}
                  </p>
                  <span className="text-xs font-bold text-amber-700 group-hover:text-amber-800 flex items-center gap-1.5 transition-all">
                    <span>Explore All Cabs in {originCity.name}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              )}
              {destCity && (
                <Link
                  href={`/cities/${destCity.slug}/`}
                  className="card-dark group p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Navigation size={18} />
                      </div>
                      <div>
                        <span className="font-black text-base text-slate-900 group-hover:text-blue-800 transition-colors block">
                          {destCity.name}
                        </span>
                        <span className="text-[0.68rem] font-bold text-blue-700 uppercase tracking-wider">Drop Destination City</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {destCity.excerpt}
                  </p>
                  <span className="text-xs font-bold text-blue-700 group-hover:text-blue-800 flex items-center gap-1.5 transition-all">
                    <span>Explore All Cabs in {destCity.name}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="section-padding">
        <div className="container-site max-w-3xl mx-auto">
          <h2 className="text-2xl font-black mb-6">
            FAQs — {route.originName} to {route.destinationName} Taxi
          </h2>
          <div className="space-y-3.5">
            {routeFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="card-dark group rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 open:border-amber-400/80 open:shadow-md transition-all duration-200 overflow-hidden"
              >
                <summary className="list-none cursor-pointer p-5 sm:p-6 flex items-start justify-between gap-4 font-bold text-slate-900 group-hover:text-amber-800 transition-colors select-none">
                  <span className="text-base pr-4 leading-snug">{faq.question}</span>
                  <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-amber-100/80 group-open:bg-amber-500 group-open:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                    <ChevronDown
                      size={16}
                      className="text-slate-500 group-open:text-white group-open:rotate-180 transition-transform duration-300"
                    />
                  </span>
                </summary>
                <div className="px-5 sm:px-6 pb-6 pt-1">
                  <div className="h-px bg-slate-100 mb-4" />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Route Map Section */}
      {originCity && destCity && (
        <RouteMapSection
          origin={{ lat: originCity.lat, lng: originCity.lng, name: route.originName }}
          destination={{ lat: destCity.lat, lng: destCity.lng, name: route.destinationName }}
          distanceKm={route.approxDistanceKm}
          durationMin={route.approxDurationMin}
        />
      )}

      {/* Fare Calculator */}
      <FareCalculatorSection
        subtitle={`Get an indicative fare for your ${route.originName} to ${route.destinationName} journey. Final fares are confirmed at booking.`}
      />
    </>
  );
}
