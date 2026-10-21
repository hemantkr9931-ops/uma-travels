// =====================================================================
// UMA TRAVELS — SEO Metadata Utilities
// Generates page-level metadata for Next.js App Router.
// Covers: Technical SEO, On-Page SEO, AEO (AI Overviews), GEO
// =====================================================================

import type { Metadata } from 'next';
import { SITE_CONFIG } from './config';

const BRAND = SITE_CONFIG.name;
const BRAND_SUFFIX = /\s*[|—–-]?\s*UMA\s*TRAVELS\s*$/i;
const LOGO_URL = `${SITE_CONFIG.siteUrl}/logo.png`;
const ORG_ID = `${SITE_CONFIG.siteUrl}/#organization`;
const BUSINESS_ID = `${SITE_CONFIG.siteUrl}/#localbusiness`;
const WEBSITE_ID = `${SITE_CONFIG.siteUrl}/#website`;

interface SEOOptions {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  noIndex?: boolean;
}

function toAbsolute(url: string): string {
  return url.startsWith('http') ? url : `${SITE_CONFIG.siteUrl}${url}`;
}

export function buildMetadata(options: SEOOptions): Metadata {
  const { title, description, canonicalPath, ogImage, noIndex = false } = options;
  const canonicalUrl = toAbsolute(canonicalPath);

  // Strip any hard-coded brand already present so the root layout's
  // `%s | UMA TRAVELS` title template never produces a duplicated brand.
  const cleanTitle = title.replace(BRAND_SUFFIX, '').trim() || title;
  const socialTitle = `${cleanTitle} | ${BRAND}`;

  // Every page gets a branded social card featuring uma-travels-bg1.
  const PRIMARY_IMAGE_WEBP = `${SITE_CONFIG.siteUrl}/uma-travels-bg1.webp`;
  const PRIMARY_IMAGE_JPG = `${SITE_CONFIG.siteUrl}/uma-travels-bg1.jpg`;
  const resolvedOgImage = ogImage ? toAbsolute(ogImage) : PRIMARY_IMAGE_WEBP;
  const resolvedTwitterImage = ogImage ? toAbsolute(ogImage) : PRIMARY_IMAGE_WEBP;

  return {
    title: cleanTitle,
    description,
    // meta keywords intentionally omitted: Google ignores them; they are a spam signal
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title: socialTitle,
      description,
      url: canonicalUrl,
      siteName: BRAND,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: resolvedOgImage,
          width: 1983,
          height: 793,
          type: 'image/webp',
          alt: `${cleanTitle} — ${BRAND}`,
        },
        {
          url: PRIMARY_IMAGE_JPG,
          width: 1983,
          height: 793,
          type: 'image/jpeg',
          alt: `${cleanTitle} — ${BRAND}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [resolvedTwitterImage],
    },
  };
}

// ─── JSON-LD STRUCTURED DATA HELPERS ─────────────────────────────────────────

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.address.street,
    addressLocality: SITE_CONFIG.address.city,
    addressRegion: SITE_CONFIG.address.state,
    postalCode: SITE_CONFIG.address.pincode,
    addressCountry: 'IN',
  };
}

const AREA_SERVED = [
  'Jharkhand',
  'West Bengal',
  'Odisha',
  'Bihar',
  'Uttar Pradesh',
];

function sameAs() {
  return SITE_CONFIG.socialProfiles.length > 0
    ? { sameAs: [...SITE_CONFIG.socialProfiles] }
    : {};
}

function mapsSearchUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    SITE_CONFIG.address.full
  )}`;
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND,
    alternateName: SITE_CONFIG.alternateNames,
    url: SITE_CONFIG.siteUrl,
    foundingDate: '2015',
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512,
    },
    image: [
      `${SITE_CONFIG.siteUrl}/uma-travels-bg1.webp`,
      `${SITE_CONFIG.siteUrl}/uma-travels-bg1.jpg`,
      `${SITE_CONFIG.siteUrl}/uma-travels-og-banner.jpg`,
      LOGO_URL,
    ],
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    ...(SITE_CONFIG.phone ? { telephone: SITE_CONFIG.phone } : {}),
    address: postalAddress(),
    areaServed: AREA_SERVED,
    knowsLanguage: ['en', 'hi'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        ...(SITE_CONFIG.phone ? { telephone: SITE_CONFIG.phone } : {}),
        email: SITE_CONFIG.email,
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
        hoursAvailable: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ],
      },
    ],
    ...sameAs(),
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['TaxiService', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: BRAND,
    alternateName: SITE_CONFIG.alternateNames,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.siteUrl,
    image: [
      `${SITE_CONFIG.siteUrl}/uma-travels-bg1.webp`,
      `${SITE_CONFIG.siteUrl}/uma-travels-bg1.jpg`,
      `${SITE_CONFIG.siteUrl}/uma-travels-og-banner.jpg`,
      LOGO_URL,
    ],
    logo: LOGO_URL,
    email: SITE_CONFIG.email,
    priceRange: '\u20b9\u20b9',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    serviceType: 'Taxi & Cab Service',
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    hasMap: SITE_CONFIG.googleBusinessUrl || mapsSearchUrl(),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(SITE_CONFIG.rating),
      reviewCount: String(SITE_CONFIG.reviewCount || 150),
      bestRating: '5',
      worstRating: '1',
    },
    areaServed: AREA_SERVED.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    knowsLanguage: ['en', 'hi'],
    parentOrganization: { '@id': ORG_ID },
    ...(SITE_CONFIG.phone ? { telephone: SITE_CONFIG.phone } : {}),
    ...sameAs(),
    // AEO: speakable content — tells Google which sections are best for voice/AI answers
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.speakable'],
    },
    // AEO: hasOfferCatalog — structured service listing for AI understanding
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'UMA TRAVELS Cab & Taxi Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Local Cab Service in Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Outstation Taxi from Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'One-Way Cab from Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airport Transfer from Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Cab Service Jharkhand' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Car Rental Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Innova Cab in Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '7 Seater Cab in Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car Rental Dhanbad' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cab Near Me Dhanbad' } },
      ],
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: BRAND,
    alternateName: SITE_CONFIG.alternateNames,
    url: SITE_CONFIG.siteUrl,
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.siteUrl}/uma-travels-bg1.webp`,
    thumbnailUrl: `${SITE_CONFIG.siteUrl}/uma-travels-bg1.webp`,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.siteUrl}/routes/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    // AEO: speakable spec for WebSite-level AI extraction
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.speakable'],
    },
  };
}

/** Generate a WebPage schema for individual content pages */
export function getWebPageSchema(opts: {
  title: string;
  description: string;
  url: string;
  breadcrumbItems?: { name: string; url: string }[];
  speakableSelectors?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_CONFIG.siteUrl}${opts.url}`,
    name: opts.title,
    description: opts.description,
    url: `${SITE_CONFIG.siteUrl}${opts.url}`,
    image: `${SITE_CONFIG.siteUrl}/uma-travels-bg1.webp`,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.siteUrl}/uma-travels-bg1.webp`,
      width: 1983,
      height: 793,
      caption: 'UMA TRAVELS — Premium Cab Service and Fleet',
    },
    inLanguage: 'en-IN',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    // AEO: speakable — helps AI systems identify answer-worthy content
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: opts.speakableSelectors ?? ['h1', 'h2', '.speakable', 'p:first-of-type'],
    },
    ...(opts.breadcrumbItems ? {
      breadcrumb: getBreadcrumbSchema(opts.breadcrumbItems),
    } : {}),
  };
}

export function getBreadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: toAbsolute(crumb.url),
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType ?? service.name,
    url: toAbsolute(service.url),
    provider: { '@id': BUSINESS_ID },
    areaServed: service.areaServed
      ? { '@type': 'AdministrativeArea', name: service.areaServed }
      : AREA_SERVED.map((name) => ({ '@type': 'AdministrativeArea', name })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: toAbsolute(service.url),
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

export function getItemListSchema(items: { name: string; url: string }[], opt?: { name?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(opt?.name ? { name: opt.name } : {}),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: toAbsolute(item.url),
    })),
  };
}

/**
 * AEO/GEO: HowTo schema — helps appear in "how to book a cab" AI answers
 */
export function getHowToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * GEO: Article schema — helps content appear in AI-generated summaries
 * Use for rich content pages (city pages, route pages) for better GEO signals.
 */
export function getArticleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: toAbsolute(opts.url),
    image: `${SITE_CONFIG.siteUrl}/uma-travels-og-banner.jpg`,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
    datePublished: opts.datePublished ?? '2024-01-01',
    dateModified: opts.dateModified ?? '2026-10-19',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', 'p:first-of-type', '.speakable'],
    },
  };
}
