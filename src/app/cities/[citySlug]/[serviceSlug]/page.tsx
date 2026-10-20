// =====================================================================
// Hub City Service & Vehicle Pages — /cities/[citySlug]/[serviceSlug]/page.tsx
// Renders dedicated landing pages for either a Service or a Vehicle
// exclusively for Hub Cities (Dhanbad, Ranchi, Bokaro, Jamshedpur).
// =====================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle, ArrowRight, Users, Luggage, Zap, IndianRupee,
  ShieldCheck, Clock, Award, MessageCircle, Droplets, Sparkles
} from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import VehicleCard from '@/components/cards/VehicleCard';
import ServiceCard from '@/components/cards/ServiceCard';
import RouteCard from '@/components/cards/RouteCard';
import FareCalculatorSection from '@/components/common/FareCalculatorSection';
import HubDetailContentSection from '@/components/seo/HubDetailContentSection';
import { HUB_CITIES, getLocationBySlug } from '@/data/locations';
import { SERVICES, getServiceBySlug } from '@/data/services';
import { VEHICLES, getVehicleBySlug } from '@/data/vehicles';
import { getRoutesByOrigin, getRouteFare } from '@/data/routes';
import { getCityDetails } from '@/data/cityDetails';
import { buildMetadata, getBreadcrumbSchema, getServiceSchema, getFAQSchema } from '@/lib/seo';
import { getWhatsAppUrl } from '@/lib/config';

interface PageProps {
  params: Promise<{ citySlug: string; serviceSlug: string }>;
}


function formatRouteDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export async function generateStaticParams() {
  const pairs: { citySlug: string; serviceSlug: string }[] = [];
  HUB_CITIES.forEach((city) => {
    SERVICES.forEach((service) => {
      pairs.push({ citySlug: city.slug, serviceSlug: service.slug });
    });
    VEHICLES.forEach((vehicle) => {
      pairs.push({ citySlug: city.slug, serviceSlug: vehicle.slug });
    });
  });
  return pairs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, serviceSlug } = await params;
  const city = getLocationBySlug(citySlug);
  if (!city || !city.isHub) return { title: 'Not Found' };

  const service = getServiceBySlug(serviceSlug);
  if (service) {
    return buildMetadata({
      title: `${service.name} in ${city.name} | ${city.state} Taxi`,
      description: `Book ${service.name.toLowerCase()} in ${city.name}, ${city.state} with UMA TRAVELS. ${service.description} Transparent pricing, verified drivers, 24/7 availability. Call or WhatsApp to confirm booking.`,
      canonicalPath: `/cities/${citySlug}/${serviceSlug}/`,
      // No keyword array — meta keywords are spam signals ignored by Google.
    });
  }

  const vehicle = getVehicleBySlug(serviceSlug);
  if (vehicle) {
    return buildMetadata({
      title: `${vehicle.name} Cab in ${city.name} | ${vehicle.seatingCapacity} Seater Taxi Booking`,
      description: `Book ${vehicle.name} cab in ${city.name}, ${city.state} with UMA TRAVELS. ${vehicle.seatingCapacity}-seater AC taxi — models: ${vehicle.models.join(', ')}. Starting ₹${vehicle.displayRatePerKm ?? vehicle.basePerKm}/km. Clean cars, verified drivers, zero advance, 24/7 service.`,
      canonicalPath: `/cities/${citySlug}/${vehicle.slug}/`,
      // No keyword array — meta keywords are spam signals ignored by Google.
    });
  }

  return { title: 'Not Found' };
}

export default async function HubDetailPage({ params }: PageProps) {
  const { citySlug, serviceSlug } = await params;
  const city = getLocationBySlug(citySlug);
  if (!city || !city.isHub) notFound();

  const service = getServiceBySlug(serviceSlug);
  const vehicle = getVehicleBySlug(serviceSlug);

  if (!service && !vehicle) notFound();

  const routesForCity = getRoutesByOrigin(city.slug);
  const routes = routesForCity.slice(0, 6);
  const outgoingRouteCount = routesForCity.length;
  const details = getCityDetails(city.slug);

  // ─────────────────────────────────────────────────────────────────────────
  // 1. VEHICLE DETAIL PAGE FOR HUB CITY
  // ─────────────────────────────────────────────────────────────────────────
  if (vehicle) {
    const breadcrumbSchema = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: city.state, url: `/${city.stateSlug}/` },
      { name: city.name, url: `/cities/${city.slug}/` },
      { name: `${vehicle.name} Cab Service`, url: `/cities/${city.slug}/${vehicle.slug}/` },
    ]);

    const vehicleFaqs = [
      {
        question: `How much does a ${vehicle.name} cab cost in ${city.name}?`,
        answer: `Our ${vehicle.name} cab rates in ${city.name} start at ₹${vehicle.displayRatePerKm ?? vehicle.basePerKm}/km with a minimum fare of ₹${vehicle.minimumFare}. For outstation trips, driver allowance and tolls are computed transparently — the fare you are quoted is the fare you pay.`,
      },
      {
        question: `How many passengers and bags can fit in ${vehicle.name}?`,
        answer: `${vehicle.name} comfortably accommodates up to ${vehicle.seatingCapacity} passengers and ${vehicle.luggageCapacity}. Models include ${vehicle.models.join(', ')}.`,
      },
      {
        question: `Can I book ${vehicle.name} for outstation travel from ${city.name}?`,
        answer: `Yes, ${vehicle.name} is available for one-way outstation, round-trip, airport transfers, weddings, and local rentals originating in ${city.name}. Popular routes from ${city.name} include ${routes.slice(0, 3).map((r) => r.destinationName).join(', ')}${routes.length > 3 ? ' and more' : ''}.`,
      },
      {
        question: `Which areas of ${city.name} does the ${vehicle.name} cab pickup cover?`,
        answer: `Our ${vehicle.name} cabs pick up and drop across ${details && details.localities.length > 0 ? details.localities.join(', ') : city.name} and surrounding neighbourhoods, including railway stations, bus stands and landmarks.`,
      },
      {
        question: `Are your ${vehicle.name} cabs air-conditioned and well-maintained?`,
        answer: `Yes, 100% of our ${vehicle.name} fleet in ${city.name} is air-conditioned, commercially licensed, clean, and driven by experienced chauffeurs who know the local and highway routes.`,
      },
      {
        question: `How do I book a ${vehicle.name} cab in ${city.name}?`,
        answer: `Book through the form on this page, call us, or send a WhatsApp message. We confirm the ${vehicle.name} fare and share your verified driver's details before pickup — with zero advance payment required.`,
      },
    ];

    const faqSchema = getFAQSchema(vehicleFaqs);
    const otherVehicles = VEHICLES.filter((v) => v.id !== vehicle.id);

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <Breadcrumb
          items={[
            { label: city.state, href: `/${city.stateSlug}/` },
            { label: city.name, href: `/cities/${city.slug}/` },
            { label: `${vehicle.name} Cab` },
          ]}
        />

        {/* Hero Section */}
        <PageHero>
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="w-full order-2 lg:order-1 glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80">
                <div className="flex items-center gap-2 mb-3">
                  <span className="section-label">{city.name} Hub Fleet</span>
                  {vehicle.hasAC && (
                    <span className="badge-gold text-[0.65rem] flex items-center gap-1">
                      <Zap size={10} /> AC Cab
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-3">
                  {vehicle.name} Cab Service in{' '}
                  <span className="text-gradient-gold">{city.name}</span>
                </h1>

                <p className="text-sm font-semibold text-[var(--color-gold-400)] mb-4">
                  Models: {vehicle.models.join(' • ')}
                </p>

                {/* Specs ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-6">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-[11px] text-[var(--color-text-muted)] flex items-center justify-center gap-1 mb-0.5">
                      <Users size={12} className="text-[var(--color-gold-400)]" /> Capacity
                    </p>
                    <p className="font-bold text-xs sm:text-sm">{vehicle.seatingCapacity} Passengers</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-[11px] text-[var(--color-text-muted)] flex items-center justify-center gap-1 mb-0.5">
                      <Luggage size={12} className="text-[var(--color-gold-400)]" /> Luggage
                    </p>
                    <p className="font-bold text-xs sm:text-sm">{vehicle.luggageCapacity}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-[11px] text-blue-300 flex items-center justify-center gap-1 mb-0.5">
                      <Droplets size={12} className="text-blue-400" /> Complimentary
                    </p>
                    <p className="font-bold text-xs sm:text-sm text-blue-200">Water Bottle</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[11px] text-emerald-300 flex items-center justify-center gap-1 mb-0.5">
                      <Sparkles size={12} className="text-emerald-400" /> Hygiene
                    </p>
                    <p className="font-bold text-xs sm:text-sm text-emerald-200">Tissue Paper</p>
                  </div>
                </div>

                {/* Vehicle image display */}
                <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-[var(--color-border-gold)] mb-6 flex items-center justify-center overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} cab in ${city.name} — UMA TRAVELS`}
                    width={480}
                    height={320}
                    sizes="(max-width: 1024px) 90vw, 480px"
                    className="h-auto w-auto max-h-56 max-w-full object-contain drop-shadow-xl"
                  />
                </div>

                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {vehicle.description}
                </p>

                {/* Features & Best for */}
                <div className="mb-6 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                      Key Highlights & Inclusions
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vehicle.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                          <CheckCircle size={14} className="text-[var(--color-gold-400)] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                      Ideal For
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.bestFor.map((item) => (
                        <span key={item} className="px-3 py-1 rounded-full text-xs border border-[var(--color-border)] text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Link
                    href={`/cities/${city.slug}/`}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold-400)] transition-colors inline-flex items-center gap-1"
                  >
                    ← Back to {city.name} Cab Guide
                  </Link>
                  <a
                    href={getWhatsAppUrl(`Hi UMA TRAVELS, I want to enquire about ${vehicle.name} cab booking from ${city.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 ml-auto"
                  >
                    <MessageCircle size={14} /> WhatsApp Enquiry
                  </a>
                </div>
              </div>

              {/* Enhanced Booking Form preselected with this vehicle */}
              <div className="w-full order-1 lg:order-2 glass-booking rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden" id="booking">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 min-w-0">
                    Book {vehicle.name} in {city.name}
                  </h2>
                  <span className="badge-gold text-[0.7rem] font-bold shrink-0">₹{vehicle.displayRatePerKm ?? vehicle.basePerKm}/km</span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                  Pickup from {city.name} — instant distance & dynamic fare estimate.
                </p>
                <EnhancedBookingForm
                  prefillFrom={city.name}
                  prefillVehicle={vehicle.id}
                />
              </div>
            </div>
        </PageHero>

        {/* Popular Intercity Routes from this hub for this vehicle */}
        {routes.length > 0 && (
          <section className="section-padding bg-[var(--color-bg-secondary)]">
            <div className="container-site">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black">
                    Popular Routes from {city.name} in {vehicle.name}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                    Verified intercity routes with estimated fares for {vehicle.name}:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {routes.map((route) => {
                  const fare = getRouteFare(route, vehicle.id);
                  const routeHref = `/routes/${route.originSlug}-to-${route.destinationSlug}/`;
                  return (
                    <div
                      key={route.id}
                      className="card-dark group p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-500">
                            ~{route.approxDistanceKm} km • ~{formatRouteDuration(route.approxDurationMin)}
                          </span>
                          <span className="badge-gold text-[0.68rem] font-bold">{vehicle.name}</span>
                        </div>
                        <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 transition-colors mb-1">
                          {route.originName} → {route.destinationName}
                        </h3>
                        {route.viaPoints && route.viaPoints.length > 0 && (
                          <p className="text-xs text-slate-500 mb-3">
                            Via {route.viaPoints.join(' • ')}
                          </p>
                        )}
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">Est. One-Way Fare</p>
                          <p className="text-xl font-black text-amber-700 flex items-center">
                            <IndianRupee size={15} />
                            {fare.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <Link
                          href={routeHref}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/70 group-hover:bg-amber-500 group-hover:text-white group-hover:border-transparent transition-all shadow-2xs"
                        >
                          <span>View Route</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Rich SEO content — complete guide to this vehicle in this hub city */}
        <HubDetailContentSection
          city={city}
          vehicle={vehicle}
          routes={routes}
          outgoingRouteCount={outgoingRouteCount}
          faqs={vehicleFaqs}
        />

        {/* Trust Badges */}
        <section className="section-padding">
          <div className="container-site">
            <h2 className="text-2xl font-black text-center mb-10">
              Why Hire {vehicle.name} with UMA TRAVELS in {city.name}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-dark p-6 text-center">
                <ShieldCheck size={32} className="mx-auto text-[var(--color-gold-400)] mb-3" />
                <h3 className="font-bold text-sm mb-1">Commercial Permits</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  All {vehicle.name} cabs have valid interstate tourist permits & commercial insurance.
                </p>
              </div>
              <div className="card-dark p-6 text-center">
                <Clock size={32} className="mx-auto text-[var(--color-gold-400)] mb-3" />
                <h3 className="font-bold text-sm mb-1">Punctual Pickups</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Guaranteed on-time arrival at your doorstep or railway/airport terminal in {city.name}.
                </p>
              </div>
              <div className="card-dark p-6 text-center">
                <IndianRupee size={32} className="mx-auto text-[var(--color-gold-400)] mb-3" />
                <h3 className="font-bold text-sm mb-1">No Hidden Charges</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Clear per-km rates, toll estimates, and driver allowances upfront with zero surge pricing.
                </p>
              </div>
              <div className="card-dark p-6 text-center">
                <Award size={32} className="mx-auto text-[var(--color-gold-400)] mb-3" />
                <h3 className="font-bold text-sm mb-1">Experienced Drivers</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Route-tested chauffeurs familiar with Jharkhand and interstate highways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Other vehicles in this Hub */}
        <section className="section-padding bg-[var(--color-bg-secondary)]">
          <div className="container-site">
            <h2 className="text-2xl font-black mb-2">
              Other Available Cabs in {city.name}
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-7">
              Explore other fleet categories available from our {city.name} travel hub:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherVehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  citySlug={city.slug}
                  isHub={true}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Applicable Services in this Hub */}
        <section className="section-padding">
          <div className="container-site">
            <h2 className="text-2xl font-black mb-2">
              Services Available with {vehicle.name} in {city.name}
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm mb-7">
              Book this vehicle for any of our tailored travel services:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SERVICES.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  citySlug={city.slug}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Fare Calculator */}
        <FareCalculatorSection
          subtitle={`Get an indicative fare for your journey from ${city.name}. Final fares are confirmed at booking.`}
        />
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SERVICE DETAIL PAGE FOR HUB CITY
  // ─────────────────────────────────────────────────────────────────────────
  if (!service) notFound();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: city.state, url: `/${city.stateSlug}/` },
    { name: city.name, url: `/cities/${city.slug}/` },
    { name: service.name, url: `/cities/${city.slug}/${service.slug}/` },
  ]);

  const serviceSchema = getServiceSchema({
    name: `${service.name} in ${city.name}`,
    description: service.longDescription,
    url: `/cities/${city.slug}/${service.slug}/`,
    areaServed: `${city.name}, ${city.state}`,
    serviceType: service.shortName,
  });

  type TripType = 'one-way' | 'round-trip' | 'local' | 'outstation' | 'wedding' | 'corporate' | 'airport-transfer';
  const tripTypeMap: Record<string, TripType> = {
    'local-cab': 'local',
    'one-way-cab': 'one-way',
    'outstation-cab': 'outstation',
    'round-trip-cab': 'round-trip',
    'wedding-car-rental': 'wedding',
    'corporate-travel': 'corporate',
    'airport-transfer': 'airport-transfer',
  };
  const prefillTrip = tripTypeMap[serviceSlug] ?? 'one-way';

  const serviceFaqs = [
    {
      question: `What is ${service.name.toLowerCase()} in ${city.name}?`,
      answer: `${service.name} from UMA TRAVELS ${city.name} covers local commutes, intercity travel, outstation tours, airport transfers and more using our private AC fleet. You get a dedicated vehicle, a verified driver, transparent per-km pricing and zero advance payment.`,
    },
    {
      question: `How much does ${service.name.toLowerCase()} cost in ${city.name}?`,
      answer: `Sedan fares for ${service.shortName.toLowerCase()} in ${city.name} start at ₹${VEHICLES[0].displayRatePerKm ?? VEHICLES[0].basePerKm}/km with a minimum fare of ₹${VEHICLES[0].minimumFare}. Rates for Ertiga, Innova, Luxury and Tempo Traveller differ by vehicle — the exact fare is confirmed before booking.`,
    },
    {
      question: `Which vehicles are available for ${service.shortName.toLowerCase()} in ${city.name}?`,
      answer: `We offer ${VEHICLES.map((v) => `${v.name} (${v.seatingCapacity}-seater)`).join(', ')} for ${service.shortName.toLowerCase()} within ${city.name} and on interstate routes.`,
    },
    {
      question: `Which areas of ${city.name} does the ${service.shortName.toLowerCase()} service cover?`,
      answer: `Our cabs pick up and drop across ${details && details.localities.length > 0 ? details.localities.join(', ') : 'all major areas of ' + city.name}, including railway stations, bus stands, hospitals and landmarks.`,
    },
    {
      question: `How do I book ${service.name.toLowerCase()} in ${city.name}?`,
      answer: `Use the booking form on this page or call / WhatsApp UMA TRAVELS. We confirm your vehicle, fare and pickup time in ${city.name}, then share your verified driver's details before the trip — no advance required.`,
    },
    {
      question: `Is ${service.shortName.toLowerCase()} available round the clock in ${city.name}?`,
      answer: `Yes, UMA TRAVELS ${service.shortName.toLowerCase()} runs 24 hours a day, 7 days a week across ${city.name}, ${city.state} — including early-morning and late-night pickups.`,
    },
  ];
  const serviceFaqsSchema = getFAQSchema(serviceFaqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceFaqsSchema) }} />

      <Breadcrumb
        items={[
          { label: city.state, href: `/${city.stateSlug}/` },
          { label: city.name, href: `/cities/${city.slug}/` },
          { label: service.name },
        ]}
      />

      {/* Hero */}
      <PageHero>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="w-full order-2 lg:order-1 glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80">
              <span className="section-label">{service.shortName}</span>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                {service.name} in{' '}
                <span className="text-gradient-gold">{city.name}</span>
              </h1>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                {service.longDescription}
              </p>

              <div className="mb-6">
                <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                  What&apos;s Included
                </p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <CheckCircle size={14} style={{ color: 'var(--color-gold-400)' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/cities/${city.slug}/`}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold-400)] transition-colors inline-flex items-center gap-1"
              >
                ← All services in {city.name}
              </Link>
            </div>

            {/* Enhanced Booking Form */}
            <div className="w-full order-1 lg:order-2 glass-booking rounded-2xl p-6 shadow-xl" id="booking">
              <h2 className="text-base font-bold mb-1">
                Book {service.name} — {city.name}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Instant fare estimates and live GPS pickup support.
              </p>
              <EnhancedBookingForm
                prefillFrom={city.name}
                prefillTrip={prefillTrip}
              />
            </div>
          </div>
      </PageHero>

      {/* Rich SEO content — complete guide to this service in this hub city */}
      <HubDetailContentSection
        city={city}
        service={service}
        routes={routes}
        outgoingRouteCount={outgoingRouteCount}
        faqs={serviceFaqs}
      />

      {/* Vehicle options */}
      <section className="section-padding bg-[var(--color-bg-secondary)]">
        <div className="container-site">
          <h2 className="text-2xl font-black mb-6">
            Available Vehicles for {service.name} in {city.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VEHICLES.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                citySlug={city.slug}
                isHub={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Routes (for intercity services) */}
      {service.applicableOnRoutePages && routes.length > 0 && (
        <section className="section-padding">
          <div className="container-site">
            <h2 className="text-2xl font-black mb-6">
              Popular Routes from {city.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fare Calculator */}
      <FareCalculatorSection
        subtitle={`Get an indicative fare for your journey from ${city.name}. Final fares are confirmed at booking.`}
      />
    </>
  );
}
