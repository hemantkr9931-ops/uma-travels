import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Navigation, Car, Info, ArrowRight } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { buildMetadata } from '@/lib/seo';
import { STATES, HUB_CITIES, ALL_LOCATIONS } from '@/data/locations';
import { ALL_ROUTES } from '@/data/routes';
import { SERVICES } from '@/data/services';
import { VEHICLES } from '@/data/vehicles';

export const metadata: Metadata = buildMetadata({
  title: 'HTML Sitemap — Complete Directory of Pages, Cities & Routes',
  description:
    'Browse the full directory of UMA TRAVELS services, car rental fleet, destination cities across Jharkhand, Bihar, Bengal, Odisha, and popular outstation routes.',
  canonicalPath: '/sitemap/',
});

export default function HtmlSitemapPage() {
  const publishedCities = ALL_LOCATIONS.filter((c) => c.status === 'published');
  const publishedRoutes = ALL_ROUTES.filter((r) => r.status === 'published');
  // Keep the page lean; the full route directory lives at /routes/ and in sitemap.xml.
  const visibleRoutes = publishedRoutes.slice(0, 120);

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pb-10">
      <Breadcrumb items={[{ label: 'Sitemap' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <h1
            className="text-3xl md:text-5xl font-black text-[var(--color-text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Website Sitemap & Directory
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base">
            Comprehensive index of all services, outstation routes, city taxi hubs, vehicle categories, and legal pages for UMA TRAVELS.
          </p>
        </div>
      </PageHero>

      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Pages */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Info size={20} className="text-[var(--color-gold-400)]" />
              Main Pages & Info
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li><Link href="/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Home <ArrowRight size={14} /></Link></li>
              <li><Link href="/about-us/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">About UMA TRAVELS <ArrowRight size={14} /></Link></li>
              <li><Link href="/contact-us/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Contact Us & Dispatch Helpline <ArrowRight size={14} /></Link></li>
              <li><Link href="/fleet/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Our Fleet & Vehicle Categories <ArrowRight size={14} /></Link></li>
              <li><Link href="/routes/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">All Intercity Routes <ArrowRight size={14} /></Link></li>
              <li><Link href="/faq/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Frequently Asked Questions <ArrowRight size={14} /></Link></li>
              <li><Link href="/booking-policy/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Booking Policy <ArrowRight size={14} /></Link></li>
              <li><Link href="/cancellation-policy/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Cancellation & Refund Policy <ArrowRight size={14} /></Link></li>
              <li><Link href="/privacy-policy/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Privacy Policy <ArrowRight size={14} /></Link></li>
              <li><Link href="/terms-and-conditions/" className="hover:text-[var(--color-gold-400)] flex items-center justify-between">Terms & Conditions <ArrowRight size={14} /></Link></li>
            </ul>
          </div>

          {/* Service States */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[var(--color-gold-400)]" />
              Service States
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              {STATES.map((state) => (
                <li key={state.slug}>
                  <Link href={`/${state.slug}/`} className="hover:text-[var(--color-gold-400)] flex items-center justify-between">
                    Taxi Service in {state.name}
                    <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-base font-bold text-[var(--color-text-primary)] mt-6 mb-3">
              Key Hub Cities
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              {HUB_CITIES.map((hub) => (
                <li key={hub.slug}>
                  <Link href={`/cities/${hub.slug}/`} className="hover:text-[var(--color-gold-400)] flex items-center justify-between">
                    {hub.name} Cab Service
                    <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fleet Categories */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Car size={20} className="text-[var(--color-gold-400)]" />
              Vehicle Categories
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              {VEHICLES.map((v) => (
                <li key={v.id}>
                  <Link href={`/fleet/#${v.id}`} className="hover:text-[var(--color-gold-400)] flex items-center justify-between">
                    <span>{v.name} <span className="text-xs text-[var(--color-text-muted)]">({v.models.join(', ')})</span></span>
                    <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-base font-bold text-[var(--color-text-primary)] mt-6 mb-3">
              Services Offered
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/cities/dhanbad/${s.slug}/`} className="hover:text-[var(--color-gold-400)] flex items-center justify-between">
                    {s.name}
                    <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popular Intercity Routes */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Navigation size={20} className="text-[var(--color-gold-400)]" />
            Popular Intercity Routes ({publishedRoutes.length} Available)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            {visibleRoutes.map((route) => (
              <Link
                key={route.id}
                href={`/routes/${route.originSlug}-to-${route.destinationSlug}/`}
                className="p-2.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold-500)] hover:text-[var(--color-gold-400)] transition-colors text-xs flex items-center justify-between"
              >
                <span>{route.originName} to {route.destinationName}</span>
                <span className="text-[var(--color-gold-400)] font-semibold whitespace-nowrap">~{route.approxDistanceKm} km</span>
              </Link>
            ))}
          </div>
          {publishedRoutes.length > visibleRoutes.length && (
            <Link
              href="/routes/"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[var(--color-gold-400)] hover:underline"
            >
              Browse all {publishedRoutes.length} routes
              <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {/* All Published Cities Directory */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-[var(--color-gold-400)]" />
            All Destination Cities & Districts ({publishedCities.length} Total)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            {publishedCities.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}/`}
                className="p-2 rounded border border-[var(--color-border)] hover:border-[var(--color-gold-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-gold-400)] transition-colors truncate"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
