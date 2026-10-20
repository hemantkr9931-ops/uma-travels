import type { ReactNode } from 'react';
import HeroSlideshow from './HeroSlideshow';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';

interface PageHeroProps {
  children: ReactNode;
  minHeight?: string;
  className?: string;
  contentClassName?: string;
  showMobileBooking?: boolean;
}

/**
 * PageHero — shared inner-page banner.
 * Renders the same auto-sliding background images used on the home page hero,
 * with the page content layered above it inside a container.
 */
export default function PageHero({
  children,
  minHeight = '520px',
  className = '',
  contentClassName = '',
  showMobileBooking = false,
}: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden ${className}`} style={{ minHeight }}>
      <HeroSlideshow />
      <div className="relative z-20">
        <div className={`container-site py-6 sm:py-12 ${contentClassName}`}>
          {showMobileBooking && (
            <div className="block lg:hidden mb-6">
              <div className="glass-booking rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden" id="booking">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 min-w-0">
                    Book a Cab Online
                  </h2>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Cabs Available
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-3">
                  Verified commercial fleet • Zero advance needed • 24/7 service
                </p>
                <EnhancedBookingForm prefillFrom="Dhanbad" />
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
