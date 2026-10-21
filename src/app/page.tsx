import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle, Star, Clock, Shield, Phone,
  MessageCircle, ArrowRight, MapPin, Train, Plane,
  ChevronDown, Zap, Sparkles, Compass
} from 'lucide-react';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import HeroSlideshow from '@/components/common/HeroSlideshow';
import { CityMapSection } from '@/components/common/MapSection';
import FareCalculatorSection from '@/components/common/FareCalculatorSection';
import TestimonialsSection from '@/components/common/TestimonialsSection';
import ServiceCard from '@/components/cards/ServiceCard';
import VehicleCard from '@/components/cards/VehicleCard';
import RouteCard from '@/components/cards/RouteCard';
import { SERVICES } from '@/data/services';
import { VEHICLES } from '@/data/vehicles';
import { getPopularRoutesFromDhanbad } from '@/data/routes';
import { STATES, getLocationsByState } from '@/data/locations';
import { getCityDetails } from '@/data/cityDetails';
import { buildMetadata, getFAQSchema, getHowToSchema, getArticleSchema } from '@/lib/seo';
import { SITE_CONFIG, getPhoneUrl, getWhatsAppUrl } from '@/lib/config';

export const metadata: Metadata = buildMetadata({
  title: 'Cab Service in Dhanbad — Local Taxi, Outstation, Car Rental & Innova Cab',
  description:
    'Book cab service in Dhanbad with UMA TRAVELS. Local taxi, outstation cab, one-way taxi, Innova cab, 7 seater cab, car rental, airport transfer & corporate travel. Cab near me in Dhanbad — zero advance payment, transparent fares, verified drivers, 24/7. Serving Jharkhand, West Bengal, Bihar, Odisha & UP.',
  canonicalPath: '/',
});

const HOMEPAGE_FAQS = [
  {
    question: 'How do I book a cab with UMA TRAVELS from Dhanbad?',
    answer:
      'Fill out the booking enquiry form on this page with your pickup location, destination, travel date, preferred vehicle, and contact details. You can also reach us by phone or WhatsApp. We will confirm availability and provide a final fare before your trip.',
  },
  {
    question: 'Does UMA TRAVELS operate from cities other than Dhanbad?',
    answer:
      'UMA TRAVELS is headquartered in Dhanbad but provides intercity cab services to and from Ranchi, Bokaro, Jamshedpur, and other destinations across Jharkhand, West Bengal, Bihar, Odisha, and Uttar Pradesh.',
  },
  {
    question: 'What vehicles are available for outstation trips?',
    answer:
      'We offer Sedan (up to 4 passengers), Maruti Suzuki Ertiga (6 seats), Toyota Innova (7 seats), Luxury Cars, and Tempo Traveller (12–17 seats) for group travel. Vehicle availability is subject to confirmation.',
  },
  {
    question: 'How is the cab fare calculated?',
    answer:
      'Fares are calculated based on the actual road distance, vehicle category, trip type, and applicable charges such as driver allowance for overnight trips. Use our Fare Estimator tool for an indicative quote. Final fares may vary based on actual route conditions, tolls, and waiting time.',
  },
  {
    question: 'Does UMA TRAVELS provide airport transfer services?',
    answer:
      'Yes, we provide airport transfer services from Dhanbad and other Jharkhand cities to Birsa Munda Airport in Ranchi and Netaji Subhas Chandra Bose International Airport in Kolkata. Advance booking is recommended.',
  },
  {
    question: 'Are toll charges included in the fare estimate?',
    answer:
      'Toll charges are not included in the base fare estimate. Applicable tolls are charged as per the toll plazas on your specific route and are payable by the passenger. We will inform you of likely toll routes in advance.',
  },
  {
    question: 'Is UMA TRAVELS also known as Uma Taxi or Uma Cab Service?',
    answer:
      'Yes. UMA TRAVELS is also popularly known as Uma Taxi, Uma Taxi Service, Uma Cab Service, and Uma Car Rental. Whether you are searching for Uma Taxi in Dhanbad, Uma Cab Service for one-way or outstation travel, or Uma Car Rental for corporate or wedding events, our verified drivers and well-maintained fleet are available 24/7.',
  },
];

const WHY_CHOOSE = [
  {
    icon: <Shield size={20} />,
    title: 'Verified Drivers',
    desc: 'All drivers are verified with valid commercial licences and appropriate authorisation.',
  },
  {
    icon: <Clock size={20} />,
    title: 'Punctual Service',
    desc: 'We prioritise timely pickups and aim to ensure you reach your destination as planned.',
  },
  {
    icon: <CheckCircle size={20} />,
    title: 'Transparent Pricing',
    desc: 'No hidden charges. Fare estimates are shared upfront and confirmed before your trip.',
  },
  {
    icon: <Star size={20} />,
    title: 'Multiple Vehicle Options',
    desc: 'Choose from sedans, SUVs, premium cars, and tempo travellers to match your group size.',
  },
  {
    icon: <MapPin size={20} />,
    title: 'Wide Coverage',
    desc: 'Serving Jharkhand, West Bengal, Bihar, Odisha, and Uttar Pradesh.',
  },
  {
    icon: <MessageCircle size={20} />,
    title: 'Easy Communication',
    desc: 'Reach us by phone, WhatsApp, or email. We are responsive to your enquiries.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Fill the Booking Form',
    desc: 'Enter your pickup, destination, date, vehicle preference, and contact details.',
  },
  {
    step: '02',
    title: 'Receive Confirmation',
    desc: 'We will contact you to confirm vehicle availability and provide the final fare.',
  },
  {
    step: '03',
    title: 'Driver Assigned',
    desc: 'A verified driver will be assigned to your trip with their contact details shared.',
  },
  {
    step: '04',
    title: 'Travel Comfortably',
    desc: 'Your driver arrives on time. Enjoy a safe, comfortable journey to your destination.',
  },
];

export default function HomePage() {
  const popularRoutes = getPopularRoutesFromDhanbad();
  const dhanbadDetails = getCityDetails('dhanbad');

  const faqSchema = getFAQSchema(HOMEPAGE_FAQS);

  // AEO: HowTo schema — shows in AI Overviews for 'how to book cab in Dhanbad' queries
  const howToSchema = getHowToSchema({
    name: 'How to Book a Cab in Dhanbad with UMA TRAVELS',
    description: 'Step-by-step guide to booking a cab from Dhanbad with UMA TRAVELS — local taxi, outstation cab, Innova cab, or car rental.',
    steps: [
      { name: 'Fill the Booking Form', text: 'Visit the UMA TRAVELS website and fill the cab booking form. Enter your pickup location in Dhanbad, your destination, travel date, time, and preferred vehicle (sedan, Innova, or Ertiga).' },
      { name: 'Receive Fare Confirmation', text: 'UMA TRAVELS will call or WhatsApp you within minutes. We confirm vehicle availability and provide the exact fare — no hidden charges, no surge pricing.' },
      { name: 'Get Driver Details', text: 'A verified, commercially licensed driver is assigned to your trip. You receive the driver\'s name and contact number before pickup.' },
      { name: 'Travel Comfortably', text: 'Your driver arrives on time at your Dhanbad pickup point. Pay the driver directly after your journey — zero advance payment required at booking.' },
    ],
  });

  // GEO: Article schema — helps site content appear in AI-generated summaries
  const articleSchema = getArticleSchema({
    headline: 'Cab Service in Dhanbad — Local Taxi, Outstation, Car Rental & Innova Cab',
    description: 'UMA TRAVELS provides cab service, local taxi, outstation cab, one-way cab, car rental, Innova cab, 7 seater cab, airport transfer, corporate cab, and wedding car rental in Dhanbad, Jharkhand. Available 24/7. Cab near me in Dhanbad.',
    url: '/',
    dateModified: '2025-06-01',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION — Auto-sliding background images
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] min-h-screen flex flex-col"
        style={{ minHeight: '100dvh' }}
        aria-labelledby="hero-heading"
      >
        {/* Auto-sliding background images (no buttons) */}
        <HeroSlideshow />

        {/* Hero content (above overlay, z-20) */}
        <div
          className="relative z-20 container-site flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 pt-24 sm:pt-28 lg:pt-32 pb-16 min-h-[100dvh] min-h-screen"
          style={{ minHeight: '100dvh' }}
        >
          {/* Left column on desktop, second on mobile — Glassmorphic floating card */}
          <div className="flex-1 max-w-xl order-2 lg:order-1 glass rounded-3xl p-6 sm:p-7 md:p-9 shadow-2xl border border-white/80">
            <div className="badge-gold mb-5">
              <MapPin size={12} />
              Dhanbad, Jharkhand — Serving 5 States
            </div>

            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl xl:text-6xl font-black leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Premium Cab Service
              <br />
              <span className="text-gradient-gold">from Dhanbad</span>
            </h1>

            <p className="text-lg text-[var(--color-text-secondary)] mb-3">
              <strong className="text-[var(--color-text-primary)]">UMA TRAVELS</strong> —{' '}
              <span className="text-[var(--color-text-muted)] text-sm uppercase tracking-widest">
                Cabs · Car Rental · Corporate Travels
              </span>
            </p>

            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8">
              Reliable local taxi, outstation cabs, airport transfers, and corporate travel across
              Jharkhand, West Bengal, Bihar, Odisha, and Uttar Pradesh.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['Verified Drivers', 'Transparent Fares', 'Multiple Vehicles', '5-State Coverage'].map(
                (badge) => (
                  <span key={badge} className="badge-gold text-xs">
                    <CheckCircle size={11} />
                    {badge}
                  </span>
                )
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2.5 sm:gap-3 pt-1">
              {/* Primary action — Book a Cab */}
              <a
                href="#booking"
                className="btn-primary w-full justify-center text-sm sm:text-base font-bold !py-3.5 !px-6 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 group"
              >
                <span>Book a Cab Now</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </a>

              {/* Instant Contact — WhatsApp & Direct Call */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {SITE_CONFIG.whatsapp && (
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center text-sm sm:text-base font-semibold !py-3 !px-4 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-200 group"
                  >
                    <MessageCircle size={17} className="shrink-0 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp Us</span>
                  </a>
                )}
                {SITE_CONFIG.phone && (
                  <a
                    href={getPhoneUrl()}
                    className="btn-call w-full justify-center text-sm sm:text-base font-semibold !py-3 !px-4 shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-200 group"
                  >
                    <Phone size={17} className="shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{SITE_CONFIG.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right column on desktop, first on mobile — Enhanced Booking Form */}
          <div
            className="w-full max-w-lg order-1 lg:order-2 scroll-mt-20 sm:scroll-mt-24"
            id="booking"
            style={{ minHeight: '480px' }}
          >
            <div className="glass-booking rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 md:p-8 relative overflow-hidden shadow-2xl">
              {/* Radiant glass glow ambient effects */}
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 w-52 h-52 bg-amber-400/25 rounded-full blur-3xl pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 min-w-0">
                    Book Your Cab
                  </h2>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 flex items-center gap-1.5 shadow-2xs shrink-0">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Cabs Available
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 mb-2 sm:mb-4 hidden xs:block">
                  Transparent per-km billing • Zero advance payment • Instant driver confirmation
                </p>
                <EnhancedBookingForm prefillFrom="Dhanbad" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-20 flex justify-center pb-8" aria-hidden="true">
          <ChevronDown
            size={24}
            className="text-[var(--color-text-muted)] animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CORE SERVICES
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding bg-[var(--color-bg-secondary)]"
        aria-labelledby="services-heading"
      >
        <div className="container-site">
          <div className="text-center mb-10">
            <span className="section-label">Our Services</span>
            <h2 id="services-heading" className="text-3xl md:text-4xl font-black mb-3">
              Every Travel Need, Covered
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              From daily local rides to multi-day outstation trips, wedding cars, and corporate
              transport — UMA TRAVELS provides a full range of cab services across the region.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                citySlug="dhanbad"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          POPULAR ROUTES FROM DHANBAD
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding"
        aria-labelledby="routes-heading"
      >
        <div className="container-site">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="section-label">Popular Routes</span>
              <h2 id="routes-heading" className="text-3xl md:text-4xl font-black">
                Top Routes from Dhanbad
              </h2>
            </div>
            <Link
              href="/routes/"
              className="btn-secondary text-sm px-4 py-2 shrink-0"
            >
              All Routes <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VEHICLE FLEET
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding bg-[var(--color-bg-secondary)]"
        aria-labelledby="fleet-heading"
      >
        <div className="container-site">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="section-label">Our Fleet</span>
              <h2 id="fleet-heading" className="text-3xl md:text-4xl font-black">
                Choose Your Vehicle
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-2 max-w-xl">
                From comfortable sedans to spacious tempo travellers — we have the right vehicle for
                every group size and journey type.
              </p>
            </div>
            <Link href="/fleet/" className="btn-secondary text-sm px-4 py-2 shrink-0">
              Full Fleet Details <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VEHICLES.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                citySlug="dhanbad"
                isHub={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY CHOOSE UMA TRAVELS
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding"
        aria-labelledby="why-heading"
      >
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="section-label">Why UMA TRAVELS</span>
            <h2 id="why-heading" className="text-3xl md:text-4xl font-black mb-3">
              Travel With Total Confidence
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              We provide a reliable, transparent, and comfortable cab experience for every
              customer — from local daily rides to long-distance outstation journeys across 6 states.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE.map((item) => (
              <div
                key={item.title}
                className="card-dark group p-6 sm:p-7 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex gap-4"
              >
                {/* Top glowing accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 border border-amber-200/80 text-amber-700 shadow-2xs group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-amber-500/20 group-hover:scale-105 transition-all duration-300"
                  aria-hidden="true"
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 transition-colors mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding bg-[var(--color-bg-secondary)]"
        aria-labelledby="how-heading"
      >
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="section-label">Booking Process</span>
            <h2 id="how-heading" className="text-3xl md:text-4xl font-black mb-3">
              How to Book Your Cab in 4 Easy Steps
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Hassle-free cab reservation with zero advance payment and transparent fare confirmation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="card-dark group p-6 sm:p-7 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden text-center flex flex-col justify-between"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-black bg-gradient-to-br from-amber-50 to-amber-100/90 border border-amber-200/90 text-amber-700 shadow-2xs group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md transition-all duration-300"
                    aria-hidden="true"
                  >
                    {item.step}
                  </div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                    Step {item.step}
                  </span>
                  <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          AIRPORT + STATION TRANSFERS
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding"
        aria-labelledby="transfer-heading"
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Airport Card */}
            <div className="card-dark group relative p-7 sm:p-9 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-300"
              />
              <div className="flex items-center justify-between gap-3 mb-5">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-200/80 text-blue-600 shadow-2xs group-hover:scale-105 transition-transform"
                  aria-hidden="true"
                >
                  <Plane size={24} />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Flight Tracking & 24/7 Drops
                </span>
              </div>
              <h2 id="transfer-heading" className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                Airport Transfer Service
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed text-sm sm:text-base">
                UMA TRAVELS provides punctual airport cabs from Dhanbad & Jharkhand to{' '}
                <strong className="text-slate-900">Birsa Munda Airport, Ranchi (IXR)</strong> and{' '}
                <strong className="text-slate-900">Netaji Subhas Chandra Bose Airport, Kolkata (CCU)</strong> for all domestic & international departures.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Birsa Munda Airport (IXR)', 'Kolkata Airport (CCU)', 'Kazi Nazrul Airport (RGH)', 'Deoghar Airport (DGH)'].map((ap) => (
                  <span key={ap} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200/80 text-slate-700">
                    ✈️ {ap}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Early morning and late-night flight pickups available with zero surge charges.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/cities/dhanbad/airport-transfer/" className="btn-primary text-sm px-5 py-2.5">
                  Book Airport Cab
                  <ArrowRight size={14} />
                </Link>
                <a href="#booking" className="btn-secondary text-sm px-5 py-2.5">
                  Check Fare
                </a>
              </div>
            </div>

            {/* Station Card */}
            <div className="card-dark group relative p-7 sm:p-9 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-300"
              />
              <div className="flex items-center justify-between gap-3 mb-5">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center bg-amber-50 border border-amber-200/80 text-amber-700 shadow-2xs group-hover:scale-105 transition-transform"
                  aria-hidden="true"
                >
                  <Train size={24} />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Platform Pickup Available
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-amber-800 transition-colors">
                Railway Station Transfers
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed text-sm sm:text-base">
                Never miss a train. Dedicated cab service to and from{' '}
                <strong className="text-slate-900">Dhanbad Junction (DHN)</strong>, Ranchi (RNC), Tatanagar (TATA), Bokaro Steel City (BKSC), Asansol (ASN), and Howrah (HWH) with verified drivers.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Dhanbad Jn (DHN)', 'Ranchi Jn (RNC)', 'Tatanagar (TATA)', 'Bokaro (BKSC)', 'Asansol (ASN)'].map((stn) => (
                  <span key={stn} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200/80 text-slate-700">
                    🚆 {stn}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Share your train number and arrival time for seamless doorstep pickup.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/#booking" className="btn-primary text-sm px-5 py-2.5">
                  Book Station Cab
                  <ArrowRight size={14} />
                </Link>
                <a href="#booking" className="btn-secondary text-sm px-5 py-2.5">
                  Estimate Fare
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CORPORATE TRAVEL
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding bg-[var(--color-bg-secondary)]"
        aria-labelledby="corporate-heading"
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">Corporate Travel</span>
              <h2 id="corporate-heading" className="text-3xl md:text-4xl font-black mb-4">
                Managed Business Travel Solutions
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed text-sm sm:text-base">
                UMA TRAVELS provides reliable cab services for businesses in Dhanbad, Bokaro,
                Jamshedpur, and Ranchi. Whether you need regular employee transportation, executive
                cab service, or logistical support for visiting clients — we can work with you to
                create a practical travel arrangement.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed text-sm sm:text-base">
                Our fleet includes sedans for executive travel, SUVs for small teams, and larger
                vehicles for group transportation. Contact us to discuss your specific requirements.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/cities/dhanbad/corporate-travel/" className="btn-primary text-sm px-5 py-2.5">
                  Enquire Corporate Travel
                  <ArrowRight size={14} />
                </Link>
                {SITE_CONFIG.email && (
                  <a href={`mailto:${SITE_CONFIG.email}`} className="btn-secondary text-sm px-5 py-2.5">
                    Email Us
                  </a>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Executive Transport', desc: 'Sedan and SUV options for professionals', icon: '👔' },
                { title: 'Employee Scheduling', desc: 'Managed transport for corporate teams', icon: '⏰' },
                { title: 'Client Pickups', desc: 'Airport and station pickups for guests', icon: '🤝' },
                { title: 'Multi-City Routing', desc: 'Coordinated intercity travel across 6 states', icon: '🗺️' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="card-dark group p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-2xl mb-2.5 block">{item.icon}</span>
                  <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-800 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATES & CITIES WE SERVE — Elevated State & City Directory Grid
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden"
        aria-labelledby="destinations-heading"
      >
        {/* Ambient subtle backdrops */}
        <div aria-hidden="true" className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-400/[0.04] blur-[120px] rounded-full pointer-events-none" />

        <div className="container-site relative">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
              <Compass size={14} className="text-amber-600" />
              <span>Operating Across 6 States • 70+ Cities</span>
            </div>
            <h2 id="destinations-heading" className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
              States &amp; Cities We Serve
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Headquartered in Dhanbad, UMA TRAVELS operates full commercial taxi permits connecting 70+ destinations across East and North India. Click any city to view local rates, popular outstation routes, and instant cab bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {STATES.map((state) => {
              const cities = getLocationsByState(state.slug).filter((c) => c.status !== 'noindex');
              const hubCities = cities.filter((c) => c.isHub);
              const otherCities = cities.filter((c) => !c.isHub);

              // Distinct metadata & badges per state
              const stateMeta: Record<string, { badge: string; desc: string; accentColor: string }> = {
                jharkhand: {
                  badge: 'Headquarters & Primary Hub',
                  desc: '24/7 stationed fleet for instant local & outstation dispatches across all 24 districts.',
                  accentColor: 'from-amber-400 to-amber-600',
                },
                'west-bengal': {
                  badge: 'Kolkata Airport & Transit Hub',
                  desc: 'Direct highway connectivity via NH-19 with airport transfers & corporate cabs.',
                  accentColor: 'from-blue-400 to-blue-600',
                },
                bihar: {
                  badge: 'Capital & Intercity Corridor',
                  desc: 'Smooth travel for family, religious & medical visits with experienced drivers.',
                  accentColor: 'from-emerald-400 to-emerald-600',
                },
                odisha: {
                  badge: 'Coastal & Industrial Route',
                  desc: 'Pilgrimages to Puri Dham & business travel to industrial corridors.',
                  accentColor: 'from-cyan-400 to-cyan-600',
                },
                'uttar-pradesh': {
                  badge: 'Heritage & Spiritual Tours',
                  desc: 'Dedicated round-trip tours to Kashi Vishwanath, Ayodhya & Prayagraj.',
                  accentColor: 'from-orange-400 to-orange-600',
                },
              };

              const currentMeta = stateMeta[state.slug] || {
                badge: 'Intercity Coverage',
                desc: 'Verified commercial AC cabs available for one-way and round trips.',
                accentColor: 'from-amber-400 to-amber-600',
              };

              return (
                <div
                  key={state.slug}
                  className="group rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(245,158,11,0.12)] hover:border-amber-400/80 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Ambient Accent Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentMeta.accentColor} opacity-90 group-hover:opacity-100 transition-opacity`}
                  />

                  <div>
                    {/* Role Tag & Cities Count Pill */}
                    <div className="flex items-center justify-between gap-2 mb-3.5 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 group-hover:bg-amber-50 group-hover:text-amber-800 group-hover:border-amber-200 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{currentMeta.badge}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/10 text-amber-800 border border-amber-300/60 shadow-2xs">
                        <span>{cities.length} {cities.length === 1 ? 'City' : 'Cities'}</span>
                      </span>
                    </div>

                    {/* State Header Row */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-500/10 border border-amber-500/25 text-amber-700 shadow-2xs group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 group-hover:scale-105"
                          aria-hidden="true"
                        >
                          <MapPin size={22} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-800 transition-colors tracking-tight leading-none">
                            {state.name}
                          </h3>
                          <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                            Commercial Yellow-Plate Cabs
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/${state.slug}/`}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-2xs group/btn"
                        aria-label={`View cab services in ${state.name}`}
                      >
                        <span>View State</span>
                        <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* State Context Description */}
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                      {currentMeta.desc}
                    </p>

                    <div className="h-px bg-slate-100 mb-4" />

                    {/* Primary Hub Cities (if available) */}
                    {hubCities.length > 0 && (
                      <div className="mb-3.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span>Primary Hub Cities</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {hubCities.map((city) => (
                            <Link
                              key={city.slug}
                              href={`/cities/${city.slug}/`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xs hover:shadow-amber-500/30 hover:scale-[1.03] transition-all"
                            >
                              <span>📍 {city.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Connected Cities */}
                    <div>
                      {hubCities.length > 0 && (
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Connected Districts &amp; Towns ({otherCities.length})
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {(hubCities.length > 0 ? otherCities : cities).map((city) => (
                          <Link
                            key={city.slug}
                            href={`/cities/${city.slug}/`}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-amber-50/80 border border-slate-200/90 hover:border-amber-400/80 text-slate-700 hover:text-amber-900 transition-all hover:scale-[1.02] shadow-2xs"
                          >
                            {city.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom / Trust Assurance & Action */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                      <span>Sanitized AC Cabs</span>
                    </span>

                    <Link
                      href={`/${state.slug}/`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline group/arrow"
                    >
                      <span>Explore {state.name} Routes</span>
                      <ArrowRight size={12} className="group-hover/arrow:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DHANBAD LOCAL COVERAGE — service areas, landmarks & day trips
      ═══════════════════════════════════════════════════════════════ */}
      {dhanbadDetails && (
        <section className="section-padding" aria-labelledby="dhanbad-areas-heading">
          <div className="container-site">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="section-label">Local Coverage</span>
              <h2 id="dhanbad-areas-heading" className="text-3xl md:text-4xl font-black mb-3">
                Cab Service Across Every Dhanbad Neighbourhood
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                From Bank More and Hirapur to Jharia, Sindri and Govindpur, our drivers know the
                coalfield belt street by street — with quick doorstep pickups from Dhanbad Junction,
                IIT (ISM) and every major locality.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Service areas + landmarks */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-amber-600" />
                  Areas &amp; Pickup Points We Cover
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {dhanbadDetails.localities.map((locality) => (
                    <Link
                      key={locality}
                      href="/cities/dhanbad/"
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-amber-50/80 border border-slate-200/90 hover:border-amber-400/80 text-slate-700 hover:text-amber-900 transition-all hover:scale-[1.02] shadow-2xs"
                    >
                      {locality}
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-slate-100 mb-6" />

                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                  Popular Landmarks &amp; Boarding Points
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {dhanbadDetails.landmarks.map((landmark) => (
                    <li
                      key={landmark}
                      className="flex items-start gap-2 text-xs sm:text-sm text-slate-600"
                    >
                      <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{landmark}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nearby day trips */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Compass size={18} className="text-amber-600" />
                  Popular Day Trips &amp; Nearby Destinations
                </h3>
                <div className="space-y-3">
                  {dhanbadDetails.attractions.map((attraction) => (
                    <Link
                      key={attraction.name}
                      href="/cities/dhanbad/"
                      className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                          {attraction.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {attraction.distance}
                          {attraction.note ? ` · ${attraction.note}` : ''}
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 group-hover:text-amber-600 shrink-0 group-hover:translate-x-0.5 transition-all"
                      />
                    </Link>
                  ))}
                </div>
                <Link
                  href="#booking"
                  className="btn-primary w-full justify-center text-sm font-bold mt-6"
                >
                  Book a Dhanbad Cab
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section-padding bg-[var(--color-bg-secondary)]"
        aria-labelledby="faq-heading"
      >
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="section-label">FAQ</span>
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-black">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3.5">
              {HOMEPAGE_FAQS.map((faq, idx) => (
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
            <div className="text-center mt-8">
              <Link href="/faq/" className="btn-secondary text-sm px-6 py-2.5">
                View All FAQs <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DHANBAD MAP SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <CityMapSection lat={23.7957} lng={86.4304} cityName="Dhanbad" />

      {/* ══════════════════════════════════════════════════════════════
          FARE CALCULATOR
      ═══════════════════════════════════════════════════════════════ */}
      <FareCalculatorSection />

      {/* ══════════════════════════════════════════════════════════════
          CUSTOMER TESTIMONIALS (renders when real reviews exist)
      ═══════════════════════════════════════════════════════════════ */}
      <TestimonialsSection variant="plain" limit={6} />

      {/* ══════════════════════════════════════════════════════════════
          CTA BANNER (LUXURY HIGH-CONVERSION SHOWCASE)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-16 md:py-24 text-white bg-slate-950 border-t border-b border-amber-500/20"
        aria-labelledby="cta-heading"
      >
        {/* Ambient Gradient Glows */}
        <div
          aria-hidden="true"
          className="absolute -top-36 -left-36 w-96 h-96 bg-amber-500/20 rounded-full blur-[110px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-36 -right-36 w-96 h-96 bg-blue-600/20 rounded-full blur-[110px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-400/10 rounded-full blur-[130px] pointer-events-none"
        />

        {/* Micro-dot grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        />

        {/* Subtle top & bottom glow accent lines */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none"
        />

        <div className="relative container-site text-center">
          {/* Top Live Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-amber-400/30 backdrop-blur-md text-amber-300 text-xs md:text-sm font-semibold mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              24x7 Instant Dispatch · Guaranteed Clean AC Cabs
            </span>
          </div>

          {/* Heading & Subtitles */}
          <h2
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white"
          >
            Ready to Book Your Cab?
          </h2>
          <p className="text-amber-400 text-base sm:text-lg md:text-xl font-semibold mb-3">
            Premium Rides, Honest Pricing & Hassle-Free Travel Across 70+ Cities
          </p>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-10 leading-relaxed font-normal">
            Whether it&apos;s an airport transfer, outstation journey, or local daily cab — UMA TRAVELS
            guarantees verified chauffeurs, sanitized vehicles, and zero hidden surcharges from Dhanbad
            and across the region.
          </p>

          {/* 4 Trust Feature Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-10 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Instant Booking</div>
                <div className="text-[11px] sm:text-xs text-slate-400">Fast pickup dispatch</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Verified Drivers</div>
                <div className="text-[11px] sm:text-xs text-slate-400">Polite & experienced</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Fixed Pricing</div>
                <div className="text-[11px] sm:text-xs text-slate-400">No surprise surges</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-sm hover:border-amber-400/40 transition-all duration-300">
              <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 shrink-0">
                <Star size={20} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">{SITE_CONFIG.rating}★ Top Rated</div>
                <div className="text-[11px] sm:text-xs text-slate-400">{SITE_CONFIG.ridersServed} happy riders</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Book Your Cab Now
              <ArrowRight size={18} />
            </a>

            {SITE_CONFIG.whatsapp && (
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <MessageCircle size={18} />
                WhatsApp Booking
              </a>
            )}

            {SITE_CONFIG.phone && (
              <a
                href={getPhoneUrl()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <Phone size={17} className="text-amber-400" />
                Call: {SITE_CONFIG.phone}
              </a>
            )}

            <Link
              href="/contact-us/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-medium text-sm sm:text-base transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>

          {/* Micro assurance disclaimer */}
          <p className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-slate-300">
              <CheckCircle size={13} className="text-emerald-400" /> AC Sanitized Cabs
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <CheckCircle size={13} className="text-emerald-400" /> Doorstep Pickup &amp; Drop
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <CheckCircle size={13} className="text-emerald-400" /> Pay After Ride · Cash / UPI / Card
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-slate-300">
              <CheckCircle size={13} className="text-emerald-400" /> Free Cancellation up to 3 hrs
            </span>
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {SITE_CONFIG.googleBusinessUrl && (
              <a
                href={SITE_CONFIG.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-300 transition-colors"
              >
                <Star size={14} className="text-amber-400 fill-amber-400" />
                Read our Google reviews ({SITE_CONFIG.rating}★)
                <ArrowRight size={13} />
              </a>
            )}
            {SITE_CONFIG.googleReviewUrl && (
              <>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <a
                  href={SITE_CONFIG.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Rate us on Google
                  <ArrowRight size={13} />
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
