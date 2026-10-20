'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Phone, MapPin, Star } from 'lucide-react';
import { SITE_CONFIG, getPhoneUrl } from '@/lib/config';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Destinations',
    href: '#',
    children: [
      { label: 'Jharkhand', href: '/jharkhand/' },
      { label: 'West Bengal', href: '/west-bengal/' },
      { label: 'Bihar', href: '/bihar/' },
      { label: 'Odisha', href: '/odisha/' },
      { label: 'Uttar Pradesh', href: '/uttar-pradesh/' },
    ],
  },
  { label: 'Popular Routes', href: '/routes/' },
  { label: 'About', href: '/about-us/' },
  { label: 'Contact', href: '/contact-us/' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] btn-primary"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[var(--color-border)] ${
          scrolled ? 'shadow-md' : 'shadow-xs'
        }`}
        role="banner"
      >
        {/* Top bar — contact info */}
        <div
          className={`border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition-all duration-300 ${
            scrolled ? 'hidden' : 'block'
          }`}
        >
          <div className="container-site flex items-center justify-between gap-3 py-2 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin size={12} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{SITE_CONFIG.address.full}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {SITE_CONFIG.googleBusinessUrl && (
                <a
                  href={SITE_CONFIG.googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-800 text-[11px] font-bold transition-colors"
                  title="View Google Reviews & Rating"
                >
                  <Star size={11} className="text-amber-500 fill-amber-500" />
                  <span>4.9★ Google Reviews</span>
                </a>
              )}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="hidden sm:inline hover:text-[var(--color-gold-400)] transition-colors"
              >
                {SITE_CONFIG.email}
              </a>
              {SITE_CONFIG.phone && (
                <a
                  href={getPhoneUrl()}
                  className="flex items-center gap-1 whitespace-nowrap hover:text-[var(--color-gold-400)] transition-colors"
                >
                  <Phone size={12} aria-hidden="true" />
                  {SITE_CONFIG.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container-site">
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="flex items-center justify-between h-16 gap-4"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 leading-none group" aria-label="UMA TRAVELS Home">
              <Image
                src="/logo.png"
                alt="UMA TRAVELS — Cab Service Dhanbad"
                width={44}
                height={44}
                priority
                className="w-11 h-11 object-contain rounded-full shadow-xs"
              />
              <div className="flex flex-col">
                <span
                  className="text-xl font-black tracking-wider font-[var(--font-display)] text-gradient-gold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  UMA TRAVELS
                </span>
                <span className="text-[0.6rem] tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                  Cabs · Rental · Corporate
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="relative group">
                  {link.children ? (
                    <>
                      <button
                        className="nav-link flex items-center gap-1"
                        aria-expanded={activeDropdown === link.label}
                        aria-haspopup="true"
                        onClick={() => toggleDropdown(link.label)}
                        onMouseEnter={() => setActiveDropdown(link.label)}
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            activeDropdown === link.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {/* Dropdown */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 glass rounded-[var(--radius-lg)] shadow-xl overflow-hidden transition-all duration-200 ${
                          activeDropdown === link.label
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 -translate-y-2 pointer-events-none'
                        }`}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link href={link.href} className="nav-link">
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {SITE_CONFIG.phone && (
                <a href={getPhoneUrl()} className="btn-call text-sm px-4 py-2">
                  <Phone size={15} />
                  Call Now
                </a>
              )}
              <Link href="/#booking" className="btn-primary text-sm px-4 py-2">
                Book a Cab
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[calc(100dvh-4rem)]' : 'max-h-0'
          } bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]`}
          aria-hidden={!isOpen}
        >
          <div className="container-site py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      className="w-full text-left px-3 py-3 text-[var(--color-text-secondary)] font-medium flex items-center justify-between"
                      onClick={() => toggleDropdown(link.label)}
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {activeDropdown === link.label && (
                      <div className="ml-4 border-l border-[var(--color-border)] pl-4 mb-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold-400)] transition-colors"
                            onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-3 py-3 text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] transition-colors"
                    onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {SITE_CONFIG.phone && (
                <a href={getPhoneUrl()} className="btn-call w-full justify-center">
                  <Phone size={16} />
                  Call Now
                </a>
              )}
              <Link
                href="/#booking"
                className="btn-primary w-full justify-center"
                onClick={() => setIsOpen(false)}
              >
                Book a Cab
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
