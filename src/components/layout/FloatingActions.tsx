'use client';

import { useState, useEffect } from 'react';
import { Phone, ArrowUp } from 'lucide-react';
import { SITE_CONFIG, getPhoneUrl, getWhatsAppUrl } from '@/lib/config';

// Authentic Official WhatsApp Icon
function WhatsAppIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
    </svg>
  );
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phoneUrl = getPhoneUrl();
  const waUrl = getWhatsAppUrl();
  const hasPhone = !!SITE_CONFIG.phone;
  const hasWhatsApp = !!SITE_CONFIG.whatsapp;

  return (
    <>
      {/* ── Back to top (Bottom Left) ─────────────────────────────────── */}
      <div
        className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 transition-all duration-300 ease-out ${
          showTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="fab fab-top group"
          aria-label="Back to top"
          id="back-to-top"
          type="button"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
          <span className="fab-tooltip fab-tooltip-left hidden sm:inline-block">
            Back to top
          </span>
        </button>
      </div>

      {/* ── Quick Contact Buttons (Bottom Right Stack) ────────────────── */}
      <div
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3.5"
        aria-label="Quick contact buttons"
      >
        {/* WhatsApp Button */}
        {hasWhatsApp && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fab fab-whatsapp group"
            aria-label="Chat with UMA TRAVELS on WhatsApp"
            id="floating-whatsapp"
          >
            {/* Live active dot indicator */}
            <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-300 border-2 border-white rounded-full shadow-xs" />
            <WhatsAppIcon className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
            <span className="fab-tooltip hidden sm:inline-block">
              Chat on WhatsApp
            </span>
          </a>
        )}

        {/* Call Button */}
        {hasPhone && (
          <a
            href={phoneUrl}
            className="fab fab-call group"
            aria-label={`Call UMA TRAVELS at ${SITE_CONFIG.phone}`}
            id="floating-call"
          >
            <Phone className="w-6 h-6 text-white fab-icon-call transition-transform duration-300 group-hover:scale-110" />
            <span className="fab-tooltip hidden sm:inline-block">
              Call Now
            </span>
          </a>
        )}
      </div>

      {/* Dev hint */}
      {process.env.NODE_ENV === 'development' && !hasPhone && (
        <div
          className="fixed bottom-4 right-4 px-3 py-2 text-xs rounded-lg z-50"
          style={{
            background: 'rgba(212,165,32,0.1)',
            border: '1px solid rgba(212,165,32,0.3)',
            color: '#d4a520',
          }}
        >
          Set NEXT_PUBLIC_PHONE_NUMBER in .env.local
        </div>
      )}
    </>
  );
}
