// =====================================================================
// /cities/[citySlug]/page.tsx  — Dynamic City Page
// Full SEO: on-page, technical, schema, keyword-rich 2000+ word content
// =====================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowLeftRight, ChevronDown } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import HeroSlideshow from '@/components/common/HeroSlideshow';
import { CityMapSection } from '@/components/common/MapSection';
import ServiceCard from '@/components/cards/ServiceCard';
import VehicleCard from '@/components/cards/VehicleCard';
import RouteCard from '@/components/cards/RouteCard';
import FareCalculatorSection from '@/components/common/FareCalculatorSection';
import CityContentSection from '@/components/seo/CityContentSection';
import AssuranceStrip from '@/components/common/AssuranceStrip';
import TestimonialsSection from '@/components/common/TestimonialsSection';
import { ALL_LOCATIONS, getLocationBySlug } from '@/data/locations';
import { getCityDetails } from '@/data/cityDetails';
import { SERVICES } from '@/data/services';
import { VEHICLES } from '@/data/vehicles';
import { getRoutesByOrigin, getRoutesByDestination } from '@/data/routes';
import { buildMetadata, getBreadcrumbSchema, getFAQSchema, getWebPageSchema, getArticleSchema, getHowToSchema } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/config';

interface PageProps {
  params: Promise<{ citySlug: string }>;
}

export const instant = false;

// Generate static params for all published cities
export async function generateStaticParams() {
  return ALL_LOCATIONS.filter((l) => l.status === 'published').map((l) => ({
    citySlug: l.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = getLocationBySlug(citySlug);
  if (!city || city.status === 'noindex') {
    return { title: 'City Not Found' };
  }

  const noIndex = city.status === 'draft';

  return buildMetadata({
    title: `Cab Service in ${city.name} | Taxi, Car Rental & Outstation Cab`,
    description: `Book cab service in ${city.name}, ${city.state} with UMA TRAVELS. Local taxi, outstation cab, one-way taxi from ${city.name}, Innova cab, 7 seater cab, car rental, airport transfer & corporate travel. Cab near me in ${city.name} — transparent pricing, verified drivers, 24/7 service.`,
    canonicalPath: `/cities/${city.slug}/`,
    noIndex,
  });
}

export default async function CityPage({ params }: PageProps) {
  const { citySlug } = await params;
  const city = getLocationBySlug(citySlug);

  if (!city || city.status === 'noindex') {
    notFound();
  }

  const cityDetails = getCityDetails(city.slug);

  // Every route involving this city (outgoing + incoming) is linked below so
  // that all related route pages are reachable from both endpoint city pages.
  const allOutgoing = getRoutesByOrigin(city.slug);
  const allIncoming = getRoutesByDestination(city.slug);

  // Services to display (all for hub, all for non-hub too — with links to booking form)
  const applicableServices = SERVICES.filter((s) => s.applicableOnCityPages);

  const cityFaqs = [
    {
      question: `How do I book a cab from ${city.name}?`,
      answer: `Use the booking form on this page to submit a cab enquiry from ${city.name}. Enter your pickup location in ${city.name}, your destination, travel date, vehicle preference, and contact details. UMA TRAVELS will confirm availability and provide a fare before your trip.`,
    },
    {
      question: `What cab services are available in ${city.name}?`,
      answer: `UMA TRAVELS provides local cab service, one-way outstation cabs, round-trip bookings, airport transfers, corporate travel arrangements, and wedding car rental from ${city.name}, ${city.state}.`,
    },
    {
      question: `Which vehicles are available for travel from ${city.name}?`,
      answer: `Available vehicles include Sedan (4 seats), Maruti Suzuki Ertiga (6 seats), Toyota Innova (7 seats), Luxury Cars, and Tempo Traveller (12–17 seats). Availability is subject to confirmation.`,
    },
    {
      question: `Does UMA TRAVELS operate outstation cabs from ${city.name}?`,
      answer: `Yes, UMA TRAVELS provides outstation cab service from ${city.name} to major cities across ${city.state}, West Bengal, Bihar, Odisha, and Uttar Pradesh.`,
    },
    {
      question: `Is there an Innova cab available in ${city.name}?`,
      answer: `Yes, UMA TRAVELS offers Toyota Innova Crysta and HyCross (7-seater) cab booking in ${city.name} for local, outstation, airport, corporate, and wedding travel.`,
    },
    {
      question: `What is the cab fare in ${city.name}?`,
      answer: `Cab fares in ${city.name} start from ₹14/km for a sedan and ₹20/km for a Toyota Innova (7-seater). Minimum fare is ₹500. All fares are confirmed before the trip with zero hidden charges.`,
    },
    {
      question: `Is there a cab near me in ${city.name}?`,
      answer: `UMA TRAVELS operates throughout ${city.name} and the ${city.district} district area. You can book a cab near you in ${city.name} by filling the form above or calling/WhatsApp-ing our team directly.`,
    },
    {
      question: `Can I get a corporate cab in ${city.name}?`,
      answer: `Yes. UMA TRAVELS provides corporate cab service in ${city.name} for businesses, factories, and government offices. We offer scheduled employee transport, executive travel, and airport pickups for clients visiting ${city.name}.`,
    },
    ...(cityDetails
      ? [
          {
            question: `Which areas in ${city.name} does UMA TRAVELS cover?`,
            answer: `UMA TRAVELS provides cab pickup and drop across ${city.name}${cityDetails.localities.length > 0 ? `, including ${cityDetails.localities.slice(0, 6).join(', ')} and other localities` : ''}. Our drivers are familiar with every major landmark and terminal in and around the city.`,
          },
          {
            question: `What is the best time to visit ${city.name}?`,
            answer: `${cityDetails.bestTime}. UMA TRAVELS operates cabs in ${city.name} throughout the year, 24 hours a day.`,
          },
          ...(cityDetails.attractions.length > 0
            ? [
                {
                  question: `What are the top attractions and day trips from ${city.name}?`,
                  answer: `Popular attractions and day trips from ${city.name} include ${cityDetails.attractions.slice(0, 4).map((a) => `${a.name} (${a.distance})`).join(', ')}. UMA TRAVELS arranges round-trip and full-day cab packages to these destinations.`,
                },
              ]
            : []),
        ]
      : []),
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: city.state, url: `/${city.stateSlug}/` },
    { name: `${city.name} Cab Service`, url: `/cities/${city.slug}/` },
  ]);

  const faqSchema = getFAQSchema(cityFaqs);
  const webPageSchema = getWebPageSchema({
    title: `Cab Service in ${city.name} | Taxi, Car Rental & Outstation Cab`,
    description: `Book cab service in ${city.name}, ${city.state} with UMA TRAVELS. Local taxi, outstation cab, one-way taxi, Innova cab, 7 seater, airport transfer & corporate travel.`,
    url: `/cities/${city.slug}/`,
  });

  // City-specific LocalBusiness schema
  const cityBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['TaxiService', 'LocalBusiness'],
    name: `UMA TRAVELS — Cab Service in ${city.name}`,
    description: `UMA TRAVELS provides local cab, outstation taxi, one-way cab, Innova cab, 7 seater taxi, airport transfer, corporate cab, and wedding car rental in ${city.name}, ${city.state}.`,
    url: `${SITE_CONFIG.siteUrl}/cities/${city.slug}/`,
    image: `${SITE_CONFIG.siteUrl}/logo.png`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.state,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.lat,
      longitude: city.lng,
    },
    areaServed: cityDetails?.localities
      ? [
          {
            '@type': 'City',
            name: city.name,
          },
          ...cityDetails.localities.map((locality) => ({
            '@type': 'Place',
            name: locality,
          })),
        ]
      : {
          '@type': 'City',
          name: city.name,
        },
    hasMap: `https://www.google.com/maps?q=${city.lat},${city.lng}`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Cab Services in ${city.name}`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Local Cab in ${city.name}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Outstation Cab from ${city.name}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `One-Way Taxi from ${city.name}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Airport Transfer from ${city.name}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Innova Cab in ${city.name}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `7 Seater Cab in ${city.name}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Corporate Cab in ${city.name}` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Wedding Car Rental in ${city.name}` } },
      ],
    },
  };

  // Place/City schema — spatial context for geo and local search engines
  const cityPlaceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${city.name}, ${city.district} District, ${city.state}`,
    description: `${city.name} is a city in ${city.state}, India, served by UMA TRAVELS cab and taxi services.`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.lat,
      longitude: city.lng,
    },
    hasMap: `https://www.google.com/maps?q=${city.lat},${city.lng}`,
    ...(cityDetails?.region ? { additionalProperty: { '@type': 'PropertyValue', name: 'Region', value: cityDetails.region } } : {}),
  };

  // Attractions ItemList schema (only when we have curated local data)
  const attractionsSchema = cityDetails && cityDetails.attractions.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Nearby Attractions & Day Trips from ${city.name}`,
        numberOfItems: cityDetails.attractions.length,
        itemListElement: cityDetails.attractions.map((attraction, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'TouristAttraction',
            name: attraction.name,
            description: attraction.note ?? `Tourist attraction near ${city.name}.`,
          },
        })),
      }
    : null;

  // Article schema — improves GEO (generative engine / AI answer inclusion)
  const articleSchema = getArticleSchema({
    headline: `Cab Service in ${city.name} | Taxi, Car Rental & Outstation Cab`,
    description: `UMA TRAVELS provides cab service, taxi, car rental, outstation cab, one-way cab, Innova cab, airport transfer, corporate cab, and wedding car rental in ${city.name}, ${city.state}. Available 24/7. Cab near me in ${city.name}.`,
    url: `/cities/${city.slug}/`,
    dateModified: city.lastVerified,
  });

  // HowTo schema — AEO: appears in AI Overviews for 'how to book a cab' queries
  const howToSchema = getHowToSchema({
    name: `How to Book a Cab in ${city.name}`,
    description: `Step-by-step guide to booking a cab in ${city.name} with UMA TRAVELS.`,
    steps: [
      { name: 'Fill the Booking Form', text: `Go to the UMA TRAVELS booking form on this page, enter your pickup location in ${city.name}, destination, travel date, and vehicle preference.` },
      { name: 'Receive Confirmation', text: 'UMA TRAVELS will contact you within minutes to confirm vehicle availability and provide the final fare — no hidden charges.' },
      { name: 'Get Driver Details', text: `A verified driver from ${city.name} will be assigned. You receive the driver\'s name and contact number before the trip.` },
      { name: 'Travel Comfortably', text: `Your driver arrives on time at your ${city.name} pickup point. Pay only after your journey is complete — zero advance required.` },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityPlaceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {attractionsSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionsSchema) }} />
      )}

      {city.status === 'draft' && (
        <div className="bg-amber-900/20 border-b border-amber-700/40 text-amber-300 text-xs text-center py-2 px-4">
          Draft page — not yet indexed. Content is being prepared for publication.
        </div>
      )}

      <Breadcrumb items={[
        { label: city.state, href: `/${city.stateSlug}/` },
        { label: `${city.name} Cab Service` },
      ]} />

      {/* Hero with slideshow background */}
      <section className="relative" style={{ minHeight: '520px' }}>
        <HeroSlideshow
          overlayClassName=""
        />
        <div className="relative z-20">
          <div className="container-site py-6 sm:py-12">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="w-full order-2 lg:order-1 glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80">
                <div className="flex items-center gap-2 mb-3">
                  <span className="section-label">Cab Service</span>
                  {city.isHub && (
                    <span className="badge-gold text-[0.6rem]">Hub City</span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Cab Service in{' '}
                  <span className="text-gradient-gold">{city.name}</span>
                  <br />
                  <span className="text-2xl md:text-3xl font-bold text-[var(--color-text-secondary)]">
                    {city.state} — Local &amp; Outstation Taxi
                  </span>
                </h1>

                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-4">
                  <MapPin size={14} style={{ color: 'var(--color-gold-400)' }} />
                  <span>{city.name}, {city.district} District, {city.state}</span>
                </div>

                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {city.excerpt}
                </p>

                {/* Keyword trust signals */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    `Cab in ${city.name}`,
                    `Taxi in ${city.name}`,
                    `Outstation Cab`,
                    `Innova Cab`,
                    `7 Seater Taxi`,
                    `Airport Transfer`,
                    `Corporate Cab`,
                    `One-Way Taxi`,
                  ].map((kw) => (
                    <span key={kw} className="px-2.5 py-1 rounded-full text-[0.65rem] font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)]">
                      {kw}
                    </span>
                  ))}
                </div>

                {city.travelPurposes && city.travelPurposes.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                      Common Travel Purposes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {city.travelPurposes.map((tp) => (
                        <span key={tp} className="px-3 py-1 rounded-full text-xs border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          {tp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {city.nearbyTerminals && city.nearbyTerminals.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                      Nearby Transport Terminals
                    </p>
                    <ul className="space-y-1">
                      {city.nearbyTerminals.map((t) => (
                        <li key={t} className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                          <span style={{ color: 'var(--color-gold-400)' }}>•</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Enhanced Booking form with GPS + fare estimate */}
              <div className="w-full order-1 lg:order-2 glass-booking rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden" id="booking">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                    Book a Cab from {city.name}
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available Now
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                  Transparent per-km billing • Zero advance needed • Verified drivers
                </p>
                <EnhancedBookingForm prefillFrom={city.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking assurance */}
      <AssuranceStrip variant="muted" />

      {/* Services */}
      <section className="section-padding bg-[var(--color-bg-secondary)]">
        <div className="container-site">
          <h2 className="text-2xl font-black mb-2">
            Cab Services in {city.name}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-7">
            UMA TRAVELS offers the following cab and taxi services from {city.name}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {applicableServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                citySlug={city.isHub ? city.slug : undefined}
                href={city.isHub ? undefined : '/#booking'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="section-padding">
        <div className="container-site">
          <h2 className="text-2xl font-black mb-2">
            Available Vehicles for Travel from {city.name}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-7">
            Choose a vehicle that suits your group size and journey type:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VEHICLES.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                citySlug={city.slug}
                isHub={city.isHub}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Routes from City */}
      {allOutgoing.length > 0 && (
        <section className="section-padding bg-[var(--color-bg-secondary)]">
          <div className="container-site">
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeftRight size={18} style={{ color: 'var(--color-gold-400)' }} />
                <h2 className="text-2xl font-black">
                  Cab Routes from {city.name}{' '}
                  <span className="text-sm font-normal text-[var(--color-text-muted)]">
                    ({allOutgoing.length} {allOutgoing.length === 1 ? 'route' : 'routes'})
                  </span>
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm">
                All verified outstation taxi routes from {city.name} with instant online booking and doorstep pickup:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allOutgoing.slice(0, 12).map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
            {allOutgoing.length > 12 && (
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                  More routes from {city.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {allOutgoing.slice(12).map((route) => (
                    <Link
                      key={route.id}
                      href={`/routes/${route.originSlug}-to-${route.destinationSlug}/`}
                      className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200/80 bg-white hover:border-amber-400/80 hover:shadow-md hover:-translate-y-0.5 transition-all text-xs"
                    >
                      <span className="truncate font-bold text-slate-800 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                        <MapPin size={13} className="text-amber-600 shrink-0" />
                        {route.originName} → {route.destinationName}
                      </span>
                      <span className="shrink-0 font-semibold px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-800 text-slate-500 transition-colors">
                        ~{route.approxDistanceKm} km
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Return / Incoming routes to this city */}
      {allIncoming.length > 0 && (
        <section className="section-padding">
          <div className="container-site">
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeftRight size={18} style={{ color: 'var(--color-gold-400)' }} />
              <h2 className="text-xl font-bold">
                Cab Routes to {city.name} (Return &amp; Inbound Cabs){' '}
                <span className="text-sm font-normal text-[var(--color-text-muted)]">
                  ({allIncoming.length} {allIncoming.length === 1 ? 'route' : 'routes'})
                </span>
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-6">
              Need a cab to {city.name}? Book verified outstation drop cabs and round-trip rides from these cities:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allIncoming.slice(0, 12).map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
            {allIncoming.length > 12 && (
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                  More routes to {city.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {allIncoming.slice(12).map((route) => (
                    <Link
                      key={route.id}
                      href={`/routes/${route.originSlug}-to-${route.destinationSlug}/`}
                      className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-200/80 bg-white hover:border-amber-400/80 hover:shadow-md hover:-translate-y-0.5 transition-all text-xs"
                    >
                      <span className="truncate font-bold text-slate-800 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                        <MapPin size={13} className="text-blue-600 shrink-0" />
                        {route.originName} → {route.destinationName}
                      </span>
                      <span className="shrink-0 font-semibold px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-800 text-slate-500 transition-colors">
                        ~{route.approxDistanceKm} km
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Rich SEO Content (2000+ words, all keyword variants) ── */}
      <CityContentSection
        city={city}
        vehicles={VEHICLES}
        outgoingRouteCount={allOutgoing.length}
        incomingRouteCount={allIncoming.length}
        popularRoutes={allOutgoing.slice(0, 6)}
      />

      {/* Customer reviews (renders when real reviews exist) */}
      <TestimonialsSection variant="plain" limit={3} idSuffix="-city" />

      {/* City FAQs */}
      <section className="section-padding bg-[var(--color-bg-secondary)]">
        <div className="container-site max-w-3xl mx-auto">
          <h2 className="text-2xl font-black mb-6">
            FAQs — Cab Service in {city.name}
          </h2>
          <div className="space-y-3.5">
            {cityFaqs.map((faq, idx) => (
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

      {/* City Map Section */}
      <CityMapSection lat={city.lat} lng={city.lng} cityName={city.name} />

      {/* Fare Calculator */}
      <FareCalculatorSection
        title={`Estimate Your Cab Fare from ${city.name}`}
        subtitle={`Get an indicative fare for your journey from ${city.name}. Final fares are confirmed at booking.`}
      />

      {/* Back to state */}
      <div className="border-t border-[var(--color-border)] py-4">
        <div className="container-site">
          <Link
            href={`/${city.stateSlug}/`}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold-400)] transition-colors"
          >
            ← All {city.state} Cities
          </Link>
        </div>
      </div>
    </>
  );
}
