import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles, Navigation } from 'lucide-react';
import type { Location } from '@/data/locations';

interface CityCardProps {
  city: Location;
}

export default function CityCard({ city }: CityCardProps) {
  const href = `/cities/${city.slug}/`;

  return (
    <Link
      href={href}
      className="card-dark group relative flex flex-col justify-between p-5 sm:p-6 h-full rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-400/80 overflow-hidden"
      aria-label={`Cab service in ${city.name}, ${city.state}`}
    >
      {/* Top glowing accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ambient background light */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-300"
      />

      {/* Top Header */}
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                city.isHub
                  ? 'bg-amber-50 border border-amber-200/90 text-amber-700 shadow-2xs group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-md'
                  : 'bg-slate-100 border border-slate-200/80 text-slate-600 group-hover:bg-slate-800 group-hover:text-white'
              }`}
              aria-hidden="true"
            >
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                {city.name}
              </h3>
              <p className="text-xs font-medium text-slate-500">
                {city.district} · {city.state}
              </p>
            </div>
          </div>

          {city.isHub ? (
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
              <Sparkles size={10} />
              MAJOR HUB
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/80">
              Direct Cabs
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {city.excerpt}
        </p>

        {/* Micro perks */}
        <div className="flex items-center gap-2 text-[0.72rem] font-medium text-slate-500 mb-2">
          <Navigation size={12} className="text-amber-600 shrink-0" />
          <span>Local Taxi • Outstation • Airport Transfer</span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-slate-100 pt-3.5 mt-auto flex items-center justify-between">
        <span className="text-[0.72rem] font-bold text-slate-500">
          Instant Booking
        </span>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-amber-500/25 shrink-0">
          <span>Explore Cabs</span>
          <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
