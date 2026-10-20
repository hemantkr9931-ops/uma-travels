// XML Sitemap — /sitemap.xml
import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';
import { ALL_LOCATIONS, STATES, HUB_CITIES } from '@/data/locations';
import { ALL_ROUTES } from '@/data/routes';
import { SERVICES } from '@/data/services';
import { VEHICLES } from '@/data/vehicles';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.siteUrl;
  const publishedCities = ALL_LOCATIONS.filter((c) => c.status === 'published');
  // Latest real data verification date across cities and routes. Falls back to
  // today only when the registry has no recorded dates — never a future date.
  const lastVerifiedDates = [...publishedCities, ...ALL_ROUTES]
    .map((item) => item.lastVerified)
    .filter((date): date is string => typeof date === 'string' && date.length > 0);
  const siteUpdated = lastVerifiedDates.length > 0
    ? lastVerifiedDates.sort()[lastVerifiedDates.length - 1]
    : new Date().toISOString().slice(0, 10);
  const siteUpdatedDate = new Date(siteUpdated);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: siteUpdatedDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      images: [
        `${base}/uma-travels-bg1.webp`,
        `${base}/uma-travels-bg2.webp`,
        `${base}/uma-travels-bg3.webp`,
      ],
    },
    { url: `${base}/about-us/`, lastModified: siteUpdatedDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact-us/`, lastModified: siteUpdatedDate, changeFrequency: 'monthly', priority: 0.8 },
    {
      url: `${base}/fleet/`,
      lastModified: siteUpdatedDate,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: VEHICLES.map((v) => `${base}${v.image}`),
    },
    { url: `${base}/routes/`, lastModified: siteUpdatedDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/faq/`, lastModified: siteUpdatedDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/booking-policy/`, lastModified: siteUpdatedDate, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/cancellation-policy/`, lastModified: siteUpdatedDate, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/privacy-policy/`, lastModified: siteUpdatedDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms-and-conditions/`, lastModified: siteUpdatedDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/sitemap/`, lastModified: siteUpdatedDate, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // State pages — last modified when the newest city in the state was verified
  const statePages: MetadataRoute.Sitemap = STATES.map((state) => {
    const citiesInState = publishedCities.filter((c) => c.stateSlug === state.slug);
    const latest = citiesInState.reduce(
      (max, c) => (c.lastVerified > max ? c.lastVerified : max),
      siteUpdated
    );
    return {
      url: `${base}/${state.slug}/`,
      lastModified: new Date(latest),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  // City pages (all published)
  const cityPages: MetadataRoute.Sitemap = publishedCities.map((city) => ({
    url: `${base}/cities/${city.slug}/`,
    lastModified: new Date(city.lastVerified),
    changeFrequency: 'monthly',
    priority: city.isHub ? 0.9 : 0.7,
  }));

  // Hub city service pages
  const hubServicePages: MetadataRoute.Sitemap = HUB_CITIES.flatMap((city) =>
    SERVICES.map((service) => ({
      url: `${base}/cities/${city.slug}/${service.slug}/`,
      lastModified: new Date(city.lastVerified),
      changeFrequency: 'monthly',
      priority: 0.85,
    }))
  );

  // Hub city vehicle pages
  const hubVehiclePages: MetadataRoute.Sitemap = HUB_CITIES.flatMap((city) =>
    VEHICLES.map((vehicle) => ({
      url: `${base}/cities/${city.slug}/${vehicle.slug}/`,
      lastModified: new Date(city.lastVerified),
      changeFrequency: 'monthly',
      priority: 0.85,
      images: [`${base}${vehicle.image}`],
    }))
  );

  // Route pages (all published)
  const routePages: MetadataRoute.Sitemap = ALL_ROUTES
    .filter((r) => r.status === 'published')
    .map((route) => ({
      url: `${base}/routes/${route.originSlug}-to-${route.destinationSlug}/`,
      lastModified: new Date(route.lastVerified),
      changeFrequency: 'monthly',
      priority: 0.85,
    }));

  return [
    ...staticPages,
    ...statePages,
    ...cityPages,
    ...hubServicePages,
    ...hubVehiclePages,
    ...routePages,
  ];
}
