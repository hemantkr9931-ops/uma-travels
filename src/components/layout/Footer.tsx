import Link from 'next/link';
import Image from 'next/image';
import {
  Mail, MapPin, Phone, MessageCircle, ArrowRight,
  ShieldCheck, Clock, Car, CheckCircle2,
  Navigation, ChevronRight, Award, Headphones,
  MapPinned, Compass, PenSquare, ExternalLink
} from 'lucide-react';
import { SITE_CONFIG, getPhoneUrl, getWhatsAppUrl } from '@/lib/config';
import { STATES, HUB_CITIES } from '@/data/locations';
import CurrentYear from '@/components/common/CurrentYear';

const SERVICES_LINKS = [
  { label: 'One-Way Outstation Cab', href: '/cities/dhanbad/one-way-cab/' },
  { label: 'Round-Trip Intercity Taxi', href: '/cities/dhanbad/round-trip-cab/' },
  { label: 'Local City Cab (Hourly Packages)', href: '/cities/dhanbad/local-cab/' },
  { label: 'Outstation Cab Service', href: '/cities/dhanbad/outstation-cab/' },
  { label: 'Airport Transfer (Ranchi, Kolkata, Patna)', href: '/cities/dhanbad/airport-transfer/' },
  { label: 'Corporate Fleet & Travel Solutions', href: '/cities/dhanbad/corporate-travel/' },
  { label: 'Wedding Luxury Car Rental', href: '/cities/dhanbad/wedding-car-rental/' },
];

const POPULAR_ROUTES = [
  { label: 'Dhanbad to Ranchi Cab', href: '/routes/dhanbad-to-ranchi/' },
  { label: 'Dhanbad to Kolkata Taxi', href: '/routes/dhanbad-to-kolkata/' },
  { label: 'Dhanbad to Patna Cab', href: '/routes/dhanbad-to-patna/' },
  { label: 'Ranchi to Bhubaneswar Cab', href: '/routes/ranchi-to-bhubaneswar/' },
  { label: 'Dhanbad to Deoghar Taxi', href: '/routes/dhanbad-to-deoghar/' },
  { label: 'Dhanbad to Varanasi Cab', href: '/routes/dhanbad-to-varanasi/' },
  { label: 'Jamshedpur to Kolkata Taxi', href: '/routes/jamshedpur-to-kolkata/' },
  { label: 'Bokaro to Ranchi Cab', href: '/routes/bokaro-to-ranchi/' },
];

const COMPANY_LINKS = [
  { label: 'About UMA TRAVELS', href: '/about-us/' },
  { label: 'Our Vehicle Fleet', href: '/fleet/' },
  { label: 'Intercity Route Directory', href: '/routes/' },
  { label: 'Frequently Asked Questions', href: '/faq/' },
  { label: 'Booking & Fare Policy', href: '/booking-policy/' },
  { label: 'Cancellation & Refund', href: '/cancellation-policy/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions/' },
  { label: 'Contact Us', href: '/contact-us/' },
  { label: 'HTML Sitemap', href: '/sitemap/' },
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Zero Hidden Costs',
    desc: 'Transparent per-km rate, confirmed before dispatch',
    badge: '100% Transparent',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Car,
    title: 'Sanitized AC Fleet',
    desc: 'Sedan, Ertiga, Innova Crysta with verified yellow plates',
    badge: 'Commercial Fleet',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Award,
    title: 'Verified Chauffeurs',
    desc: 'Police-verified drivers trained for long highway journeys',
    badge: 'Verified Drivers',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Headphones,
    title: '24/7 Roadside Support',
    desc: 'Instant dispatch & round-the-clock emergency assistance',
    badge: '24/7 Available',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10',
  },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 border-t border-amber-500/25 overflow-hidden"
      role="contentinfo"
    >
      {/* Ambient background glow orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.07] rounded-full blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-[-100px] w-[450px] h-[450px] bg-blue-600/[0.06] rounded-full blur-[160px] pointer-events-none"
      />

      {/* Subtle micro-dot matrix pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none"
      />

      {/* ══════════════════════════════════════════════════════════════
          1. TOP 4-PILLAR TRUST & RELIABILITY STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
        <div className="container-site py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TRUST_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.06] transition-all duration-300 group shadow-sm"
                >
                  <div
                    className={`p-2.5 rounded-xl ${pillar.bg} ${pillar.border} border ${pillar.color} shrink-0 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. 24/7 HELPLINE & DISPATCH CALLOUT BAR
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-amber-500/[0.08] via-transparent to-blue-500/[0.06]">
        <div className="container-site py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-300">
                <strong className="text-white font-bold">24/7 Instant Cab Booking:</strong> Drivers stationed across Dhanbad, Ranchi, Bokaro, Jamshedpur, Kolkata &amp; Patna.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {SITE_CONFIG.phone && (
                <a
                  href={getPhoneUrl()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-amber-500/25 transition-all duration-200"
                >
                  <Phone size={14} className="fill-slate-950" />
                  <span>Call {SITE_CONFIG.phone}</span>
                </a>
              )}

              {SITE_CONFIG.whatsapp && (
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-emerald-500/25 transition-all duration-200"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
              )}

              <Link
                href="/#booking"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all duration-200"
              >
                <span>Book Online</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. MAIN 4-COLUMN MEGA DIRECTORY
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative container-site pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">

          {/* Column 1: Brand & Office (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-14 h-14 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="UMA TRAVELS Official Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-xl bg-slate-900 p-1"
                />
              </div>
              <div>
                <span className="text-2xl font-black tracking-wider text-white font-[var(--font-display)] block leading-none">
                  UMA TRAVELS
                </span>
                <span className="text-[0.65rem] tracking-[0.24em] text-amber-400 uppercase font-black mt-1 block">
                  Cabs • Car Rental • Outstation
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              East India&apos;s leading intercity taxi network headquartered in Dhanbad, Jharkhand (popularly known as <strong>Uma Taxi</strong>, <strong>Uma Taxi Service</strong>, <strong>Uma Cab Service</strong> &amp; <strong>Uma Car Rental</strong>). Connecting travellers seamlessly across 70+ cities and 900+ routes with verified drivers, sanitized AC cars, and zero advance booking.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 transition-colors">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-snug">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Registered Head Office</div>
                  <div className="font-medium text-slate-200 mt-0.5">{SITE_CONFIG.address.full}</div>
                </div>
              </div>

              {SITE_CONFIG.phone && (
                <a
                  href={getPhoneUrl()}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white transition-colors group"
                >
                  <Phone size={16} className="text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="text-xs leading-snug">
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">24/7 Booking Helpline</div>
                    <div className="font-bold text-white mt-0.5">{SITE_CONFIG.phone} (Instant Response)</div>
                  </div>
                </a>
              )}

              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white transition-colors group"
              >
                <Mail size={16} className="text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-xs leading-snug">
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Corporate &amp; Customer Support</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{SITE_CONFIG.email}</div>
                </div>
              </a>
            </div>

            {/* Google Business Profile Trust Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-black text-white">Google Verified Business</div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                    <span>★ 4.9 / 5.0</span>
                    <span className="text-slate-400 font-normal">· Google Reviews</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {SITE_CONFIG.googleReviewUrl && (
                  <a
                    href={SITE_CONFIG.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition-colors text-center shadow-xs"
                  >
                    <PenSquare size={12} />
                    <span>Review Dein</span>
                  </a>
                )}
                {SITE_CONFIG.googleBusinessUrl && (
                  <a
                    href={SITE_CONFIG.googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] border border-white/10 transition-colors text-center"
                  >
                    <span>Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <Clock size={13} />
              <span>Available 24 Hours • 7 Days a Week • 365 Days</span>
            </div>
          </div>

          {/* Column 2: Cab Services (3 cols) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-white/10">
              <div className="p-1 rounded-lg bg-amber-500/15 text-amber-400">
                <Car size={15} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Cab Services
              </h3>
            </div>
            <ul className="space-y-2">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-2 group py-1"
                  >
                    <ChevronRight size={13} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                    <span className="leading-snug">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Routes (3 cols) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-white/10">
              <div className="p-1 rounded-lg bg-blue-500/15 text-blue-400">
                <Navigation size={15} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Popular Routes
              </h3>
            </div>
            <ul className="space-y-2">
              {POPULAR_ROUTES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-2 group py-1"
                  >
                    <ChevronRight size={13} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                    <span className="leading-snug">{link.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/routes/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline group"
                >
                  <span>Explore All 900+ Routes Directory</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal (2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-white/10">
              <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
                <ShieldCheck size={15} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Company &amp; Legal
              </h3>
            </div>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-2 group py-1"
                  >
                    <ChevronRight size={13} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                    <span className="leading-snug">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            4. COVERAGE NETWORK: STATES & MAJOR HUB CITIES
        ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-8 pb-8 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service States */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass size={14} className="text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  States We Serve
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">(Intercity Taxi Permits)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATES.map((state) => (
                  <Link
                    key={state.slug}
                    href={`/${state.slug}/`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-amber-500/20 hover:border-amber-400/50 hover:text-white transition-all shadow-xs hover:-translate-y-0.5"
                  >
                    {state.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Major Hub Cities */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPinned size={14} className="text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Major Hub Cities
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">(Stationed 24/7 Fleet)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {HUB_CITIES.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}/`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all shadow-xs hover:-translate-y-0.5"
                  >
                    📍 {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            5. PAYMENT MODES & BOOKING ASSURANCE STRIP
        ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-6 pb-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 m-0">
              PAYMENTS ACCEPTED
            </p>
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* UPI Card */}
              <div
                className="h-10 sm:h-11 px-3 sm:px-4 bg-white rounded-xl shadow-xs flex items-center justify-center transition-transform hover:scale-105"
                title="UPI (Google Pay, PhonePe, Paytm, BHIM)"
              >
                <svg viewBox="0 0 100 42" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
                  <g transform="skewX(-16) translate(10, 0)">
                    <path d="M6 7v13c0 3.2 2.2 5 5.5 5s5.5-1.8 5.5-5V7h-3.4v12.5c0 1.3-.9 2-2.1 2s-2.1-.7-2.1-2V7H6z" fill="#4B4F54"/>
                    <path d="M19 7v18h3.4v-5.5h4.2c3.8 0 6.4-2.4 6.4-6.3 0-3.9-2.6-6.2-6.4-6.2H19zm3.4 3.3h4c2 0 3 1.1 3 3s-1 3-3 3h-4v-6z" fill="#4B4F54"/>
                    <path d="M35 7v18h3.4V7H35z" fill="#4B4F54"/>
                    <polygon points="43,6 51,16 43,26 48,26 56,16 48,6" fill="#097939"/>
                    <polygon points="51,6 59,16 51,26 56,26 64,16 56,6" fill="#ED6328"/>
                  </g>
                  <text x="50" y="36" textAnchor="middle" fill="#505459" fontSize="5.4" fontWeight="800" letterSpacing="0.4" fontFamily="system-ui, -apple-system, sans-serif">
                    UNIFIED PAYMENTS INTERFACE
                  </text>
                </svg>
              </div>

              {/* Mastercard Card */}
              <div
                className="h-10 sm:h-11 px-3 sm:px-4 bg-white rounded-xl shadow-xs flex items-center justify-center transition-transform hover:scale-105"
                title="Mastercard"
              >
                <svg viewBox="0 0 64 40" className="h-6 sm:h-7 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
                  <g transform="translate(6, 2)">
                    <circle cx="17" cy="14" r="13" fill="#EB001B"/>
                    <circle cx="35" cy="14" r="13" fill="#F79E1B"/>
                    <path d="M26 4.7A12.98 12.98 0 0 1 31 14c0 3.7-1.5 7-3.9 9.3A12.98 12.98 0 0 1 22 14c0-3.7 1.5-7 4-9.3z" fill="#FF5F00"/>
                  </g>
                  <text x="32" y="36" textAnchor="middle" fill="#141414" fontSize="7" fontWeight="700" letterSpacing="-0.2" fontFamily="system-ui, -apple-system, sans-serif">
                    mastercard
                  </text>
                </svg>
              </div>

              {/* VISA Card */}
              <div
                className="h-10 sm:h-11 px-3.5 sm:px-4.5 bg-white rounded-xl shadow-xs flex items-center justify-center transition-transform hover:scale-105"
                title="Visa"
              >
                <svg viewBox="0 0 68 24" className="h-4 sm:h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
                  <path d="M28.3 1.8L19.4 20H14.2L8.5 4.5C8.2 3.3 7.8 2.8 6.9 2.2C5.3 1.4 2.5 0.6 0 0.1L0.2 0H12.1C13.6 0 15 1.1 15.3 2.7L18 16.8L23.2 1.8H28.3ZM53.2 13.9C53.2 8.5 45.8 8.2 45.9 5.8C45.9 5.1 46.7 4.3 48.2 4.1C49 4 51.1 3.9 53.4 5L54.4 0.9C53 0.4 51.3 0 49.1 0C43.1 0 38.9 3.2 38.8 7.7C38.7 11 41.8 12.9 44.1 14.1C46.4 15.2 47.3 16 47.2 17C47.2 18.5 45.4 19.2 43.7 19.2C40.5 19.2 38.7 18.3 37.2 17.6L36.2 21.9C37.8 22.6 40.5 23.3 43.3 23.3C49.6 23.3 53.3 20.1 53.2 13.9ZM68.9 20H73.4L69.5 1.8H65.8C64.8 1.8 64 2.4 63.6 3.2L54.3 20H59.7L60.8 17H67.4L68.9 20ZM62.2 13.2L64.9 5.8L66.5 13.2H62.2ZM38 1.8L33.8 20H28.7L32.9 1.8H38Z" fill="#1434CB"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={14} />
              <span>Zero Advance • Pay Cash/UPI on Trip Completion</span>
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            6. COPYRIGHT & DEVELOPER CREDITS
        ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="text-center md:text-left space-y-1">
            <p className="font-medium text-slate-300">
              © <CurrentYear /> <strong className="text-white font-bold">UMA TRAVELS</strong>. All rights reserved. Commercial Outstation Cab &amp; Taxi Rental Service.
            </p>
          </div>

          <div className="flex items-center gap-3 text-center md:text-right">
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
              <span className="text-slate-400">Designed &amp; Developed by </span>
              <a
                href="https://basant.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-black hover:underline transition-colors"
              >
                Basant Kumar
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
