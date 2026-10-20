import Link from 'next/link';
import {
  MapPin, Navigation, RotateCcw, Car, Heart, Briefcase, Plane,
  ArrowRight, Check, ShieldCheck
} from 'lucide-react';
import type { Service } from '@/data/services';

const ICON_MAP: Record<string, React.ReactNode> = {
  MapPin: <MapPin className="w-6 h-6" />,
  Navigation: <Navigation className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  RotateCcw: <RotateCcw className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Plane: <Plane className="w-6 h-6" />,
};

interface ServiceCardProps {
  service: Service;
  citySlug?: string;
  href?: string;
}

export default function ServiceCard({ service, citySlug, href }: ServiceCardProps) {
  const resolvedHref = href
    ? href
    : citySlug
    ? `/cities/${citySlug}/${service.slug}/`
    : `/#booking`;

  return (
    <Link
      href={resolvedHref}
      className="card-dark group relative flex flex-col justify-between p-5 sm:p-6 h-full rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-400/80 overflow-hidden"
      aria-label={`${service.name} — ${service.description}`}
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
        {/* Icon & Badge Row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 bg-amber-50 border border-amber-200/80 text-amber-700 shadow-2xs group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:shadow-amber-500/20 group-hover:scale-105"
            aria-hidden="true"
          >
            {ICON_MAP[service.icon] ?? <Car className="w-6 h-6" />}
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.68rem] font-bold bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs">
            <ShieldCheck size={12} className="text-emerald-600" />
            24x7 Available
          </span>
        </div>

        {/* Service Title */}
        <h3 className="text-lg font-black mb-2 text-slate-900 group-hover:text-amber-800 transition-colors leading-snug tracking-tight">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Feature Highlights */}
        {service.features && service.features.length > 0 && (
          <div className="space-y-2 mb-5 pt-1">
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-emerald-700" />
                </span>
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="border-t border-slate-100 pt-3.5 mt-auto flex items-center justify-between">
        <span className="text-[0.72rem] font-bold text-slate-500">
          Doorstep Pickup
        </span>
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-amber-500/25 shrink-0">
          <span>{service.cta || 'Book Now'}</span>
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
