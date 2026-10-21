// /routes/page.tsx — All Routes Listing Page (supports ?q= search for SearchAction)
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeftRight,
  ArrowRight,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
} from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import RouteCard from '@/components/cards/RouteCard';
import { ALL_ROUTES, type Route } from '@/data/routes';
import { getLocationBySlug } from '@/data/locations';
import { buildMetadata } from '@/lib/seo';

// Cap the number of full route cards shown per origin to keep the listing page
// light for users and search engines. Every route remains reachable via the
// linked city page, the state pages, and sitemap.xml.
const MAX_PER_ORIGIN = 12;

const STOPWORDS = new Set([
  'to',
  'from',
  'and',
  'for',
  'the',
  'a',
  'an',
  'of',
  'cab',
  'cabs',
  'taxi',
  'taxis',
  'taxies',
  'route',
  'routes',
  'ka',
  'ki',
  'ke',
  'se',
  'me',
]);

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function routeMatches(route: Route, term: string): boolean {
  const tokens = normalize(term)
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
  if (tokens.length === 0) return false;

  const originLocation = getLocationBySlug(route.originSlug);
  const destinationLocation = getLocationBySlug(route.destinationSlug);
  const haystack = normalize(
    [
      route.originName,
      route.destinationName,
      originLocation?.state ?? '',
      destinationLocation?.state ?? '',
    ].join(' ')
  );

  if (haystack.includes(normalize(term) || tokens.join(' '))) return true;
  return tokens.every((token) => haystack.includes(token));
}

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const queryStr = q?.trim() ? ` — Search: "${q.trim()}"` : '';

  return buildMetadata({
    title: `Intercity Cab Routes${queryStr} — Outstation Taxi, One-Way Cab & Car Rental from Dhanbad`,
    description:
      'Browse 900+ verified intercity cab routes with UMA TRAVELS. One-way cab, outstation taxi, round-trip, Innova cab & car rental from Dhanbad, Ranchi, Bokaro, Jamshedpur across Jharkhand, West Bengal, Bihar, Odisha & UP. Transparent fares, verified drivers.',
    canonicalPath: '/routes/',
  });
}

export default async function RoutesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawQ = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const q = rawQ?.trim() ?? '';

  const publishedRoutes = ALL_ROUTES.filter((r) => r.status === 'published');
  const shownRoutes = q ? publishedRoutes.filter((r) => routeMatches(r, q)) : publishedRoutes;

  // Group by origin
  const originGroups = new Map<string, typeof publishedRoutes>();
  shownRoutes.forEach((route) => {
    if (!originGroups.has(route.originName)) {
      originGroups.set(route.originName, []);
    }
    originGroups.get(route.originName)!.push(route);
  });

  const topHubs = ['Dhanbad', 'Ranchi', 'Bokaro', 'Jamshedpur', 'Kolkata', 'Patna', 'Bhubaneswar', 'Varanasi'];
  const hasQuery = q.length > 0;

  return (
    <>
      <Breadcrumb items={[{ label: 'Intercity Routes' }]} />

      <PageHero showMobileBooking>
        <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80">
          <span className="section-label">Verified Route Directory</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Intercity Cab Routes across{' '}
            <span className="text-gradient-gold">Eastern & Central India</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-3xl mb-4 leading-relaxed">
            UMA TRAVELS operates comprehensive bidirectional outstation cab service connecting Jharkhand&apos;s hubs (Dhanbad, Ranchi, Bokaro, Jamshedpur) to cities across Jharkhand, West Bengal, Bihar, Odisha, and Uttar Pradesh. Click any route for transparent fare estimates, vehicle options, and instant booking.
          </p>

          {/* Route search — backs the WebSite SearchAction (?q=) */}
          <form action="/routes/" method="get" role="search" className="mb-6">
            <label htmlFor="route-search" className="sr-only">
              Search routes by city or state
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 focus-within:border-[var(--color-gold-400)] transition-colors">
              <Search size={16} className="shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                id="route-search"
                name="q"
                defaultValue={q}
                type="search"
                placeholder="Search routes — e.g. Dhanbad to Ranchi, Kolkata, Bihar"
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
              />
              <button type="submit" className="btn-primary text-xs px-4 py-1.5 whitespace-nowrap">
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)] mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <Navigation size={13} style={{ color: 'var(--color-gold-400)' }} />
              {publishedRoutes.length} Verified Routes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <MapPin size={13} style={{ color: 'var(--color-gold-400)' }} />
              72 Cities Connected
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <ArrowLeftRight size={13} style={{ color: 'var(--color-gold-400)' }} />
              100% Bidirectional Coverage
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <ShieldCheck size={13} style={{ color: 'var(--color-gold-400)' }} />
              Doorstep Pickup & Return Cabs
            </span>
          </div>

          {/* Hub Quick Navigation (only when not searching) */}
          {!hasQuery && (
            <div className="rounded-xl p-4 border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
                Quick Jump by Primary Origin:
              </span>
              <div className="flex flex-wrap gap-2">
                {topHubs.map((hub) => (
                  <a
                    key={hub}
                    href={`#origin-${hub.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-xs px-3 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-400)] transition-colors"
                  >
                    Routes from {hub}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageHero>

      <section className="section-padding" style={{ paddingTop: '3rem' }}>
        <div className="container-site">
          {hasQuery && (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-black">
                {shownRoutes.length > 0 ? (
                  <>
                    Routes matching{' '}
                    <span className="text-gradient-gold">&ldquo;{q}&rdquo;</span>{' '}
                    <span className="text-sm font-normal text-[var(--color-text-muted)]">
                      ({shownRoutes.length} {shownRoutes.length === 1 ? 'route' : 'routes'})
                    </span>
                  </>
                ) : (
                  <>No routes found for &ldquo;{q}&rdquo;</>
                )}
              </h2>
              {shownRoutes.length === 0 && (
                <div className="mt-4 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-secondary)]">
                  Try searching for a different city name or state — or browse the full{' '}
                  <Link href="/routes/" className="font-semibold text-[var(--color-gold-400)] hover:underline">
                    route directory
                  </Link>
                  .
                </div>
              )}
            </div>
          )}

          <div className="space-y-12">
            {Array.from(originGroups.entries()).map(([originName, routes]) => {
              const anchorId = `origin-${originName.toLowerCase().replace(/\s+/g, '-')}`;
              const visible = routes.slice(0, MAX_PER_ORIGIN);
              const originSlug = routes[0]?.originSlug;
              return (
                <div key={originName} id={anchorId} className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--color-border)]">
                    <ArrowLeftRight size={18} style={{ color: 'var(--color-gold-400)' }} />
                    <h2 className="text-xl font-bold">
                      Routes from {originName}{' '}
                      <span className="text-xs font-normal text-[var(--color-text-muted)]">
                        ({routes.length} {routes.length === 1 ? 'route' : 'routes'})
                      </span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visible.map((route) => (
                      <RouteCard key={route.id} route={route} />
                    ))}
                  </div>
                  {routes.length > visible.length && originSlug && (
                    <Link
                      href={`/cities/${originSlug}/`}
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[var(--color-gold-400)] hover:underline"
                    >
                      View all {routes.length} routes from {originName}
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}