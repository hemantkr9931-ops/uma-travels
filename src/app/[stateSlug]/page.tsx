// =====================================================================
// /[stateSlug]/page.tsx — Dynamic State Landing Page
// =====================================================================
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowLeftRight, ShieldCheck, PhoneCall } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import CityCard from '@/components/cards/CityCard';
import RouteCard from '@/components/cards/RouteCard';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import FareCalculatorSection from '@/components/common/FareCalculatorSection';
import { STATES, getLocationsByState } from '@/data/locations';
import { getRoutesForState } from '@/data/routes';
import { buildMetadata, getBreadcrumbSchema, getFAQSchema, getWebPageSchema, getArticleSchema } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/config';

interface PageProps {
  params: Promise<{ stateSlug: string }>;
}

const STATE_INTROS: Record<string, string> = {
  jharkhand: `Jharkhand is UMA TRAVELS' primary service state. With headquarters in Dhanbad, we provide comprehensive cab service across the entire state — from the coal belts of the north to the tribal highlands of the south, and from the steel city of Jamshedpur to the pilgrimage destination of Deoghar.`,
  'west-bengal': `West Bengal shares borders with Jharkhand and is one of our key cross-state corridors. UMA TRAVELS connects Dhanbad, Bokaro, and Jamshedpur to major West Bengal cities including Kolkata, Asansol, Durgapur, and beyond with seamless bidirectional taxi service.`,
  odisha: `Odisha borders southern Jharkhand and offers important pilgrimage, industrial, and administrative routes. UMA TRAVELS covers the Jharkhand–Odisha corridor including connections to Bhubaneswar, Puri, and Cuttack.`,
  bihar: `Bihar is directly north of Jharkhand and one of the most travelled corridors from Dhanbad. We connect the region to Patna, Gaya (Bodh Gaya), Bhagalpur, Muzaffarpur, and other major Bihar cities with prompt outstation cabs.`,
  'uttar-pradesh': `Uttar Pradesh is a major long-distance destination from Jharkhand, especially for pilgrimage and business travel. UMA TRAVELS covers routes to Varanasi, Ayodhya, Prayagraj, Lucknow, and other UP destinations.`,
};


export async function generateStaticParams() {
  return STATES.map((s) => ({ stateSlug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stateSlug } = await params;
  const state = STATES.find((s) => s.slug === stateSlug);
  if (!state) return { title: 'State Not Found' };

  return buildMetadata({
    title: `Cab Service in ${state.name} | Taxi, Outstation Cab & Car Rental`,
    description: `Book reliable cab service in ${state.name} with UMA TRAVELS. Outstation taxi, one-way cab, Innova cab, 7 seater taxi, airport transfers, and corporate travel. Connecting ${state.name} cities to Dhanbad, Ranchi, Bokaro, Jamshedpur, and eastern India with transparent pricing.`,
    canonicalPath: `/${stateSlug}/`,
    // No keyword array — meta keywords are ignored by Google and flagged as spam.
  });
}

export default async function StatePage({ params }: PageProps) {
  const { stateSlug } = await params;
  const state = STATES.find((s) => s.slug === stateSlug);
  if (!state) notFound();

  const cities = getLocationsByState(stateSlug).filter((c) => c.status !== 'noindex');
  const hubCities = cities.filter((c) => c.isHub);
  const nonHubCities = cities.filter((c) => !c.isHub);
  const stateRoutes = getRoutesForState(stateSlug);
  const displayRoutes = stateRoutes.slice(0, 12);

  const stateFaqs = [
    {
      question: `How do I book an outstation cab in ${state.name} with UMA TRAVELS?`,
      answer: `You can easily book online by filling out the travel form on this page or by contacting our 24/7 support line at ${SITE_CONFIG.phone}. Select your pickup city in ${state.name}, your destination, departure date, and vehicle preference for instant confirmation.`,
    },
    {
      question: `Which vehicles are available for travel in ${state.name}?`,
      answer: `UMA TRAVELS provides a modern fleet including compact sedans (Dzire, Etios), comfortable 6-seater MPVs (Maruti Ertiga), premium 7-seater SUVs (Toyota Innova Crysta), and group Tempo Travellers (12–17 seats). All vehicles are air-conditioned and commercially licensed.`,
    },
    {
      question: `Are bidirectional outstation cabs available to and from hub cities?`,
      answer: `Yes, UMA TRAVELS offers verified bidirectional cab service between ${state.name} destinations and regional hubs including Dhanbad, Ranchi, Bokaro, and Jamshedpur. One-way drop-off and round-trip packages are available with doorstep pickup.`,
    },
    {
      question: `Are toll taxes and driver allowances included in the quote?`,
      answer: `We follow strict transparent billing. Base fares and estimated toll taxes are clarified up front, with no hidden surcharges. Complete GST tax invoices are provided for business and personal travel.`,
    },
    {
      question: `Does UMA TRAVELS offer one-way cab service in ${state.name}?`,
      answer: `Yes. UMA TRAVELS offers one-way cab service across ${state.name}. You pay only for the one-way distance with no return charges. We cover ${cities.length}+ destinations in ${state.name} for one-way outstation cab bookings.`,
    },
    {
      question: `Is car rental available in ${state.name}?`,
      answer: `Yes. UMA TRAVELS provides car rental with driver across ${state.name}. Our fleet includes sedan, Ertiga, Toyota Innova (7-seater), and Tempo Traveller. All vehicles are commercially licensed with interstate tourist permits.`,
    },
    {
      question: `Is Innova cab available in ${state.name}?`,
      answer: `Yes. Toyota Innova Crysta (7-seater) is available for cab booking across ${state.name} with UMA TRAVELS. Ideal for families, corporate groups, and long-distance outstation trips within and from ${state.name}.`,
    },
    {
      question: `How do I find a cab near me in ${state.name}?`,
      answer: `UMA TRAVELS operates in ${cities.length}+ cities across ${state.name}. To find a cab near you, use the booking form on this page, or call/WhatsApp us directly. Share your location or landmark and we\'ll arrange pickup from anywhere in ${state.name}.`,
    },
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: `Cab Service in ${state.name}`, url: `/${stateSlug}/` },
  ]);

  const faqSchema = getFAQSchema(stateFaqs);

  const webPageSchema = getWebPageSchema({
    title: `Cab Service in ${state.name} | Taxi, Outstation Cab & Car Rental`,
    description: `UMA TRAVELS provides cab service, outstation taxi, one-way cab, car rental, Innova cab, airport transfer, and corporate travel across ${state.name}. ${cities.length}+ destinations, ${stateRoutes.length} verified routes.`,
    url: `/${stateSlug}/`,
  });

  const articleSchema = getArticleSchema({
    headline: `Cab Service in ${state.name} | Taxi, Outstation Cab & Car Rental`,
    description: `UMA TRAVELS provides cab service, outstation taxi, one-way cab, Innova cab, 7-seater cab, car rental, airport transfer, and corporate travel in ${state.name}. Connecting ${state.name} cities with Dhanbad, Ranchi, Bokaro, Jamshedpur, and eastern India. ${cities.length}+ verified destinations.`,
    url: `/${stateSlug}/`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Breadcrumb items={[{ label: `Cab Service in ${state.name}` }]} />

      {/* Hero Section */}
      <PageHero>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="w-full order-2 lg:order-1 glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80">
              <span className="section-label">State Coverage</span>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                Cab Service in{' '}
                <span className="text-gradient-gold">{state.name}</span>
              </h1>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                {STATE_INTROS[stateSlug] ?? `UMA TRAVELS provides intercity cab service from Jharkhand to major cities in ${state.name}.`}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)] mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                  <MapPin size={14} style={{ color: 'var(--color-gold-400)' }} />
                  {cities.length} verified destinations
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                  <ArrowLeftRight size={14} style={{ color: 'var(--color-gold-400)' }} />
                  {stateRoutes.length} active routes
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                  <ShieldCheck size={14} style={{ color: 'var(--color-gold-400)' }} />
                  Verified commercial fleet
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="btn-primary w-full sm:w-auto"
                >
                  <PhoneCall size={16} />
                  Call Now: {SITE_CONFIG.phone}
                </a>
                <a
                  href="#booking"
                  className="btn-secondary w-full sm:w-auto"
                >
                  Book Online
                </a>
              </div>
            </div>

            <div className="w-full order-1 lg:order-2 glass rounded-2xl p-6" id="booking">
              <h2 className="text-base font-bold mb-1">Book a Cab to or from {state.name}</h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                Enter your pickup and drop details for an instant confirmed quote.
              </p>
              <EnhancedBookingForm prefillFrom="Dhanbad" />
            </div>
          </div>
      </PageHero>

      {/* Trust & Coverage Highlights */}
      <section className="border-y border-[var(--color-border)] py-6 bg-[var(--color-bg-card)]">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-gradient-gold">{cities.length}+</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Verified Cities in {state.name}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-gradient-gold">{stateRoutes.length}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Bidirectional Hub Routes</div>
            </div>
            <div>
              <div className="text-2xl font-black text-gradient-gold">100%</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Doorstep Pickup Guarantee</div>
            </div>
            <div>
              <div className="text-2xl font-black text-gradient-gold">24/7</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">Dedicated Booking Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hub cities (if in this state) */}
      {hubCities.length > 0 && (
        <section className="section-padding bg-[var(--color-bg-secondary)]">
          <div className="container-site">
            <h2 className="text-xl font-bold mb-2">Hub Cities — Full Service Coverage</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Primary operational bases with dedicated city pages, round-the-clock vehicle dispatch, and complete route networks:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hubCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Routes for this state */}
      {stateRoutes.length > 0 && (
        <section className="section-padding">
          <div className="container-site">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeftRight size={18} style={{ color: 'var(--color-gold-400)' }} />
                  <h2 className="text-2xl font-black">
                    Popular Cab Routes in & to {state.name}
                  </h2>
                </div>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-2xl">
                  Verified bidirectional routes connecting {state.name} with key hubs including Dhanbad, Ranchi, Bokaro, and Jamshedpur:
                </p>
              </div>
              <Link
                href="/routes/"
                className="text-xs font-semibold text-[var(--color-gold-400)] hover:underline inline-flex items-center gap-1 shrink-0"
              >
                View All Intercity Routes →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All covered cities in this state */}
      <section className="section-padding bg-[var(--color-bg-secondary)]">
        <div className="container-site">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              All Covered Destinations in {state.name}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Click any city to view local cab services, available vehicles, and bidirectional routes to major hubs:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nonHubCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* State FAQs */}
      <section className="section-padding">
        <div className="container-site max-w-4xl mx-auto">
          <h2 className="text-2xl font-black mb-2 text-center">
            Frequently Asked Questions — Cab Service in {state.name}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-8 text-center">
            Helpful answers to common queries about travelling in and around {state.name} with UMA TRAVELS.
          </p>
          <div className="space-y-4">
            {stateFaqs.map((faq, idx) => (
              <div key={idx} className="glass rounded-xl p-5 border border-[var(--color-border)]">
                <h3 className="font-bold text-base mb-2 text-[var(--color-text-primary)]">
                  {faq.question}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fare Calculator */}
      <FareCalculatorSection
        subtitle={`Get an indicative fare for your journey in ${state.name}. Final fares are confirmed at booking.`}
      />

      {/* Breadcrumb back */}
      <div className="border-t border-[var(--color-border)] py-4">
        <div className="container-site">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold-400)] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
