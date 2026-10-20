// =====================================================================
// AssuranceStrip — reusable booking-assurance band.
// Surfaces the guarantees already stated in the Booking & Cancellation
// policies (zero advance, pay after ride, free cancellation up to 3 hrs,
// no surge) so they are visible on every key page.
// =====================================================================
import { ShieldCheck, Wallet, Clock, Ban, Headphones } from 'lucide-react';

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Verified Drivers',
    desc: 'Licensed, police-verified chauffeurs',
  },
  {
    icon: Wallet,
    title: 'Pay After Ride',
    desc: 'Cash · UPI · Card accepted',
  },
  {
    icon: Clock,
    title: 'Free Cancellation',
    desc: 'Up to 3 hours before pickup',
  },
  {
    icon: Ban,
    title: 'No Surge Pricing',
    desc: 'Fixed fare decided before booking',
  },
  {
    icon: Headphones,
    title: '24/7 Dispatch',
    desc: 'Early-morning & late-night rides',
  },
];

interface AssuranceStripProps {
  /** Optional background treatment; defaults to a muted band. */
  variant?: 'muted' | 'plain' | 'dark';
  className?: string;
}

export default function AssuranceStrip({ variant = 'muted', className = '' }: AssuranceStripProps) {
  const surface =
    variant === 'dark'
      ? 'bg-slate-950 border-white/10'
      : variant === 'plain'
        ? 'bg-white border-slate-200/90'
        : 'bg-[var(--color-bg-secondary)] border-slate-200/90';
  const titleColor = variant === 'dark' ? 'text-white' : 'text-slate-900';
  const descColor = variant === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const iconWrap =
    variant === 'dark'
      ? 'bg-amber-500/15 border-amber-500/25 text-amber-400'
      : 'bg-amber-50 border-amber-200/80 text-amber-700';

  return (
    <section className={`section-padding ${surface} border-y ${className}`} aria-label="Booking assurances">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3">
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${iconWrap}`}
                  aria-hidden="true"
                >
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-black leading-tight ${titleColor}`}>{item.title}</p>
                  <p className={`text-xs mt-0.5 leading-snug ${descColor}`}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
