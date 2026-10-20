import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { SITE_CONFIG } from '@/lib/config';
import { getLocalBusinessSchema, getOrganizationSchema, getWebSiteSchema } from '@/lib/seo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/layout/FloatingActions';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: 'UMA TRAVELS — Cab Service, Car Rental, Taxi & Corporate Travel | Dhanbad, Jharkhand',
    template: '%s | UMA TRAVELS',
  },
  description: SITE_CONFIG.description,
  // No meta keywords — they are ignored by Google and treated as a spam signal
  // by SEO auditors. Keyword targeting is done via on-page content instead.
  authors: [{ name: 'UMA TRAVELS', url: SITE_CONFIG.siteUrl }],
  creator: 'UMA TRAVELS',
  publisher: 'UMA TRAVELS',
  category: 'Travel & Transportation',
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/logo-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: SITE_CONFIG.siteUrl,
    languages: {
      'en-IN': SITE_CONFIG.siteUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'UMA TRAVELS',
    url: SITE_CONFIG.siteUrl,
    title: 'UMA TRAVELS — Cab Service, Car Rental & Corporate Travel | Dhanbad, Jharkhand',
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/uma-travels-og-banner.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'UMA TRAVELS — Premium Cab Service from Dhanbad, Jharkhand',
      },
      {
        url: `${SITE_CONFIG.siteUrl}/uma-travels-bg2.webp`,
        width: 1672,
        height: 941,
        type: 'image/webp',
        alt: 'UMA TRAVELS — Premium Cab Fleet Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UMA TRAVELS — Cab Service, Car Rental & Corporate Travel | Dhanbad, Jharkhand',
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.siteUrl}/uma-travels-og-banner.jpg`],
  },
  robots: {
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
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
  },
  other: {
    'geo.region': 'IN-JH',
    'geo.placename': 'Dhanbad, Jharkhand, India',
    'geo.position': `${SITE_CONFIG.geo.latitude};${SITE_CONFIG.geo.longitude}`,
    'ICBM': `${SITE_CONFIG.geo.latitude}, ${SITE_CONFIG.geo.longitude}`,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }],
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = getLocalBusinessSchema();
  const organizationSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html lang="en-IN" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo-180.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        {/* Google Analytics 4 — preconnect for faster first request */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingActions />
        {/* ── Google Analytics 4 (G-RWZ496JJPM) ──────────────────────────── */}
        {/* afterInteractive = fires after page becomes interactive (not blocking) */}
        {SITE_CONFIG.ga4MeasurementId && (
          <>
            <Script
              id="gtag-loader"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.ga4MeasurementId}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${SITE_CONFIG.ga4MeasurementId}', {
    page_path: window.location.pathname,
    send_page_view: true
  });
`,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
