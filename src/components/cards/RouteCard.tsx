import Link from 'next/link';
import { ArrowRight, ArrowDown, Clock, MapPin, Navigation, Sparkles, Car } from 'lucide-react';
import { getRouteStartingFare, type Route } from '@/data/routes';

interface RouteCardProps {
  route: Route;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function RouteCard({ route }: RouteCardProps) {
  const href = `/routes/${route.originSlug}-to-${route.destinationSlug}/`;
  const estStartingFare = getRouteStartingFare(route);

  return (
    <Link
      href={href}
      className="card-dark group relative flex flex-col justify-between p-5 sm:p-6 h-full rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-400/80 overflow-hidden"
      aria-label={`${route.originName} to ${route.destinationName} taxi — approximately ${route.approxDistanceKm} km`}
    >
      {/* Top glowing accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Subtle ambient corner light */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-300"
      />

      {/* Top Section */}
      <div className="relative">
        {/* Route Header Badge */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Daily Outstation Taxi</span>
          </div>

          {/* Toll or Expressway Badge */}
          <div className="shrink-0">
            {route.tollApplicable ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs">
                <Sparkles size={10} className="text-amber-600" />
                Expressway
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
                Direct Route
              </span>
            )}
          </div>
        </div>

        {/* Clear & Bold Pickup ➔ Drop Visual Box */}
        <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 mb-3.5 group-hover:bg-amber-50/40 group-hover:border-amber-300/80 transition-all">
          {/* Pickup City (Large & Crystal Clear) */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300/80 flex items-center justify-center shrink-0 text-amber-800 shadow-2xs mt-0.5">
              <MapPin size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[0.68rem] uppercase font-extrabold text-amber-700 tracking-wider block">
                Pickup Location
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-800 transition-colors leading-tight">
                {route.originName}
              </h3>
            </div>
          </div>

          {/* Connecting Graphic Route Line */}
          <div className="flex items-center gap-2 pl-4 py-1.5 my-0.5">
            <div className="w-0.5 h-3.5 bg-gradient-to-b from-amber-400 via-amber-500 to-blue-500 rounded-full" />
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <span>to</span>
              <ArrowDown size={11} className="text-blue-500" />
            </span>
          </div>

          {/* Drop City (Large & Crystal Clear) */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-300/80 flex items-center justify-center shrink-0 text-blue-800 shadow-2xs mt-0.5">
              <Navigation size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[0.68rem] uppercase font-extrabold text-blue-700 tracking-wider block">
                Drop Location
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-800 transition-colors leading-tight">
                {route.destinationName}
              </h3>
            </div>
          </div>

          {/* Via points if any */}
          {route.viaPoints && route.viaPoints.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-bold text-slate-600 shrink-0">Via:</span>
              <span className="truncate font-medium">{route.viaPoints.join(' • ')}</span>
            </div>
          )}
        </div>

        {/* Distance & Duration Chips */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate">~{route.approxDistanceKm} km road</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <Clock size={13} className="text-amber-600 shrink-0" aria-hidden="true" />
            <span className="truncate">~{formatDuration(route.approxDurationMin)} non-stop</span>
          </div>
        </div>

        {/* Vehicle Options availability note */}
        <div className="flex items-center gap-1.5 text-[0.7rem] font-medium text-slate-500 mb-4 px-1">
          <Car size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">Sedan • Innova Crysta • Ertiga • Tempo</span>
        </div>
      </div>

      {/* Bottom Pricing & CTA */}
      <div className="border-t border-slate-100 pt-3.5 mt-auto flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[0.65rem] uppercase tracking-wider text-slate-500 font-bold block">
            Starting From
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-amber-700 tracking-tight">
              ₹{estStartingFare.toLocaleString('en-IN')}
            </span>
            <span className="text-[0.65rem] text-slate-400 font-medium">
              one-way
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-amber-500/25 shrink-0">
          <span>Book Cab</span>
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
