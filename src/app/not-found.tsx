import Link from 'next/link';
import { Compass, Home, Car, MapPin, Phone, ArrowRight } from 'lucide-react';
import { getPhoneUrl, SITE_CONFIG } from '@/lib/config';

const QUICK_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/fleet/', label: 'Our Fleet', icon: Car },
  { href: '/routes/', label: 'All Routes', icon: MapPin },
  { href: '/cities/dhanbad/', label: 'Dhanbad Cabs', icon: MapPin },
  { href: '/cities/ranchi/', label: 'Ranchi Cabs', icon: MapPin },
  { href: '/contact-us/', label: 'Contact Us', icon: Phone },
];

export default function NotFound() {
  return (
    <section className="section-padding" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
      <div className="container-site text-center max-w-3xl mx-auto">
        <span className="section-label inline-flex items-center gap-1.5">
          <Compass size={14} /> Error 404
        </span>

        <h1 className="text-3xl md:text-5xl font-black mt-3 mb-4">
          This road doesn&apos;t lead anywhere
        </h1>

        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          The page you are looking for may have been moved or no longer exists. Let us help you find
          the right cab service page — or call us directly and we&apos;ll sort out your travel.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="card-dark flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-semibold hover:border-[var(--color-border-gold)] transition-colors"
              >
                <Icon size={15} className="text-[var(--color-gold-400)]" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={getPhoneUrl()}
            className="btn-primary inline-flex items-center gap-2"
            aria-label={`Call UMA TRAVELS at ${SITE_CONFIG.phone}`}
          >
            <Phone size={16} /> Call {SITE_CONFIG.phone}
          </a>
          <Link href="/sitemap/" className="btn-secondary inline-flex items-center gap-2">
            Browse full sitemap <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
