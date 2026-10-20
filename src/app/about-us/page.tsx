// About Us Page
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { SITE_CONFIG, getPhoneUrl } from '@/lib/config';
import { buildMetadata } from '@/lib/seo';
import { STATES, HUB_CITIES } from '@/data/locations';

export const metadata: Metadata = buildMetadata({
  title: 'About UMA TRAVELS — Trusted Cab Service in Dhanbad, Jharkhand',
  description:
    'UMA TRAVELS is a trusted cab service, car rental, and corporate travel company headquartered in Dhanbad, Jharkhand. Serving 70+ cities across Jharkhand, West Bengal, Bihar, Odisha, Chhattisgarh, and Uttar Pradesh with verified drivers and transparent pricing since 2015.',
  canonicalPath: '/about-us/',
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'About Us' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <span className="section-label">About UMA TRAVELS</span>
          <h1 className="text-3xl md:text-4xl font-black">
            Reliable Cab Service from{' '}
            <span className="text-gradient-gold">Dhanbad, Jharkhand</span>
          </h1>
        </div>
      </PageHero>

      <section className="section-padding" style={{ paddingTop: '3rem' }}>
        <div className="container-site">
          <div className="max-w-3xl">
            <div className="space-y-5 text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                <strong className="text-[var(--color-text-primary)]">UMA TRAVELS</strong> (also popularly
                known as <strong>Uma Taxi</strong>, <strong>Uma Taxi Service</strong>,{' '}
                <strong>Uma Cab Service</strong>, and <strong>Uma Car Rental</strong>) is a premier cab
                service, car rental, and corporate travel company headquartered at Damkara, Barwadda,
                Dhanbad, Jharkhand. We provide local taxi service, outstation cab bookings, one-way
                and round-trip rides, airport and railway station transfers, wedding car rental, and
                managed corporate travel solutions.
              </p>

              <p>
                Our primary service area covers Jharkhand — with hub operations in Dhanbad, Ranchi,
                Bokaro, and Jamshedpur — and extends to West Bengal, Bihar, Odisha, Chhattisgarh,
                and Uttar Pradesh for intercity and long-distance travel. We aim to connect our
                customers to major industrial centres, pilgrimage destinations, capital cities,
                airports, and educational institutions across the region.
              </p>

              <p>
                At UMA TRAVELS, we prioritise punctuality, transparent pricing, and honest
                communication. We share fare estimates upfront and confirm all details before a trip
                begins. Our drivers hold valid commercial licences and the required authorisation for
                the routes they operate on.
              </p>

              <p>
                We offer a range of vehicles including Sedan, Maruti Suzuki Ertiga, Toyota Innova,
                Luxury Cars, and Tempo Traveller to accommodate individual travellers,
                families, and large groups. All vehicles are air-conditioned and maintained for
                comfort and safety.
              </p>

              <p>
                Whether you need a quick ride across Dhanbad, a long-distance outstation journey to
                Kolkata or Patna, a group pilgrimage to Deoghar or Puri, or regular corporate
                transport for your business — UMA TRAVELS is here to assist.
              </p>
            </div>
          </div>

          {/* Service area */}
          <div className="mt-12">
            <h2 className="text-2xl font-black mb-6">Our Service Area</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {STATES.map((state) => (
                <Link
                  key={state.slug}
                  href={`/${state.slug}/`}
                  className="card-dark p-4 text-center group hover:border-[var(--color-border-gold)]"
                >
                  <p className="font-bold text-sm mb-1">{state.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{state.cityCount} cities</p>
                  <span className="text-xs text-[var(--color-gold-400)] mt-2 inline-flex items-center gap-1">
                    Explore <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Hub cities */}
          <div className="mt-10">
            <h2 className="text-2xl font-black mb-4">Hub Cities</h2>
            <p className="text-[var(--color-text-secondary)] mb-5">
              These four cities have comprehensive service coverage, dedicated vehicle pages, and the
              full range of cab services:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {HUB_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}/`}
                  className="card-dark p-4 group hover:border-[var(--color-border-gold)]"
                >
                  <p className="font-bold">{city.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{city.district}</p>
                  <span className="text-xs text-[var(--color-gold-400)] mt-2 inline-flex items-center gap-1">
                    View Services <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 card-dark p-8">
            <h2 className="text-2xl font-black mb-5">Contact UMA TRAVELS</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} style={{ color: 'var(--color-gold-400)' }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-0.5">Registered Address</p>
                  <p className="text-[var(--color-text-secondary)] text-sm">{SITE_CONFIG.address.full}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} style={{ color: 'var(--color-gold-400)' }} className="shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-0.5">Email</p>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-gold-400)] transition-colors">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
              {SITE_CONFIG.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} style={{ color: 'var(--color-gold-400)' }} className="shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Phone</p>
                    <a href={getPhoneUrl()} className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-gold-400)] transition-colors">
                      {SITE_CONFIG.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/contact-us/" className="btn-primary text-sm px-4 py-2">
                Contact Us <ArrowRight size={14} />
              </Link>
              <Link href="/#booking" className="btn-secondary text-sm px-4 py-2">
                Book a Cab
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
