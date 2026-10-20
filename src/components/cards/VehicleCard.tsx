import Link from 'next/link';
import Image from 'next/image';
import { Users, Luggage, ArrowRight, Zap, ShieldCheck, Check, Sparkles, Droplets } from 'lucide-react';
import type { Vehicle } from '@/data/vehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
  citySlug?: string;
  isHub?: boolean;
  routeFrom?: string;
  routeTo?: string;
  href?: string;
  estimatedFare?: number;
}

export default function VehicleCard({
  vehicle,
  citySlug,
  isHub = false,
  routeFrom,
  routeTo,
  href,
  estimatedFare,
}: VehicleCardProps) {
  let resolvedHref = href ?? '/#booking';
  if (!href && routeFrom && routeTo) {
    resolvedHref = `/#booking?from=${encodeURIComponent(routeFrom)}&to=${encodeURIComponent(routeTo)}&vehicle=${encodeURIComponent(vehicle.id)}`;
  } else if (!href && isHub && citySlug) {
    resolvedHref = `/cities/${citySlug}/${vehicle.slug}/`;
  }

  const isPopular = vehicle.id === 'innova' || vehicle.id === 'sedan';

  return (
    <Link
      href={resolvedHref}
      className="card-dark group relative flex flex-col justify-between p-5 sm:p-6 h-full rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-400/80 overflow-hidden"
      aria-label={`${vehicle.name} — ${vehicle.excerpt}`}
    >
      {/* Top glowing accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ambient background light */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-300"
      />

      {/* Top Content */}
      <div className="relative">
        {/* Header with Name, Sub-models and Badges */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-800 transition-colors leading-snug tracking-tight truncate">
              {vehicle.name}
            </h3>
            {vehicle.models.length > 0 && (
              <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                {vehicle.models.slice(0, 2).join(' • ')}
                {vehicle.models.length > 2 ? ` +${vehicle.models.length - 2} more` : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isPopular && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold bg-amber-500 text-white shadow-2xs">
                <Sparkles size={10} />
                Popular
              </span>
            )}
            {vehicle.hasAC && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.68rem] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Zap size={10} className="text-emerald-600 fill-emerald-600" />
                AC
              </span>
            )}
          </div>
        </div>

        {/* Vehicle Image Showcase with Radial Spotlight */}
        <div className="relative rounded-2xl h-40 sm:h-44 flex items-center justify-center mb-4 overflow-hidden bg-gradient-to-b from-slate-50 via-amber-50/20 to-slate-100/60 border border-slate-100 group-hover:border-amber-200/60 transition-colors">
          {/* Subtle spotlight circle */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity"
          />

          <Image
            src={vehicle.image}
            alt={`${vehicle.name} cab — UMA TRAVELS`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
            className="object-contain p-3.5 filter drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1"
          />

          {/* Micro trust badge on image */}
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[0.68rem] font-bold text-slate-700 border border-slate-200/70 shadow-xs">
            <ShieldCheck size={12} className="text-emerald-600" />
            Verified & Sanitized
          </span>
        </div>

        {/* Specs Chips: Seating, Luggage, Water Bottle & Tissue Paper */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700 shadow-2xs">
            <Users size={13} className="text-amber-600 shrink-0" aria-hidden="true" />
            <span className="truncate">{vehicle.seatingCapacity} Passenger Seats</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700 shadow-2xs">
            <Luggage size={13} className="text-amber-600 shrink-0" aria-hidden="true" />
            <span className="truncate">{vehicle.luggageCapacity}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs font-semibold text-blue-800 shadow-2xs">
            <Droplets size={13} className="text-blue-600 shrink-0" aria-hidden="true" />
            <span className="truncate">Water Bottle</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs font-semibold text-emerald-800 shadow-2xs">
            <Sparkles size={13} className="text-emerald-600 shrink-0" aria-hidden="true" />
            <span className="truncate">Tissue Paper</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xs text-slate-600 mb-3.5 leading-relaxed line-clamp-2">
          {vehicle.excerpt}
        </p>

        {/* Feature Highlights */}
        {vehicle.features.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 text-[0.72rem] text-slate-500">
            {vehicle.features.slice(0, 2).map((feat, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 font-medium">
                <Check size={12} className="text-emerald-600 shrink-0" />
                <span className="truncate max-w-[140px]">{feat}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Pricing & CTA */}
      <div className="border-t border-slate-100 pt-3.5 mt-auto flex flex-wrap items-center justify-between gap-2">
        {estimatedFare ? (
          <div>
            <span className="text-[0.65rem] uppercase tracking-wider text-slate-500 font-bold block">
              Estimated One-Way Fare
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-700 tracking-tight">
                ₹{estimatedFare.toLocaleString('en-IN')}
              </span>
              <span className="text-[0.68rem] text-slate-400 font-medium">
                (excl. toll)
              </span>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-[0.65rem] uppercase tracking-wider text-slate-500 font-bold block">
              Per Km Rate
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-amber-700 tracking-tight">
                ₹{vehicle.displayRatePerKm ?? vehicle.basePerKm}
              </span>
              <span className="text-xs font-bold text-slate-500">
                /km
              </span>
            </div>
          </div>
        )}

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-amber-500/25 shrink-0">
          <span>Select Car</span>
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
