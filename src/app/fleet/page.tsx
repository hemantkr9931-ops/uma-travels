// Fleet page — /fleet/
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Luggage, CheckCircle, Droplets, Sparkles } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { VEHICLES } from '@/data/vehicles';
import { buildMetadata, getBreadcrumbSchema, getItemListSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cab Fleet — Sedan, Innova, Ertiga Car Hire & Taxi Rental Dhanbad',
  description:
    `UMA TRAVELS cab fleet in Dhanbad: ${VEHICLES.map((v) => `${v.name} (${v.seatingCapacity} seats, \u20b9${v.displayRatePerKm ?? v.basePerKm}/km)`).join(', ')}. Book sedan, Innova, 7-seater cab, car rental & taxi hire across Jharkhand, West Bengal, Bihar, Odisha & UP.`,
  canonicalPath: '/fleet/',
});

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Our Fleet', url: '/fleet/' },
]);

const vehicleListSchema = getItemListSchema(
  VEHICLES.map((v) => ({
    name: `${v.name} Cab (${v.seatingCapacity} Seater)`,
    url: `/cities/dhanbad/${v.slug}/`,
  })),
  { name: 'UMA TRAVELS Vehicle Fleet — Cab Hire Dhanbad' }
);

export default function FleetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleListSchema) }} />
      <Breadcrumb items={[{ label: 'Our Fleet' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <span className="section-label">Fleet</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Cab Fleet — Sedan, Innova, Ertiga & Tempo Traveller
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            We offer a range of well-maintained, air-conditioned vehicles to suit every group size and travel requirement — from solo business travellers to large groups on pilgrimages or corporate tours. All fares are per kilometre with transparent pricing.
          </p>
        </div>
      </PageHero>

      <section className="section-padding" style={{ paddingTop: '3rem' }}>
        <div className="container-site">
          <div className="space-y-8">
            {VEHICLES.map((vehicle) => (
              <div
                key={vehicle.id}
                className="card-dark group p-6 sm:p-8 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-[1fr,240px] gap-8 items-start relative overflow-hidden"
              >
                {/* Top glowing line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-b from-slate-50 to-slate-100/80 border border-slate-200/80 overflow-hidden group-hover:border-amber-200/80 transition-colors"
                      aria-hidden="true"
                    >
                      <Image
                        src={vehicle.image}
                        alt={`${vehicle.name} cab rental`}
                        fill
                        sizes="144px"
                        className="object-contain p-2 filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                          {vehicle.name}
                        </h2>
                        {vehicle.hasAC && (
                          <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            AC
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500">
                        {vehicle.models.join(' • ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-5 leading-relaxed text-sm sm:text-base">
                    {vehicle.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700">
                      <Users size={16} className="text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[0.65rem] text-slate-400 block font-medium">Capacity</span>
                        <span className="font-bold">{vehicle.seatingCapacity} Passengers</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700">
                      <Luggage size={16} className="text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[0.65rem] text-slate-400 block font-medium">Luggage</span>
                        <span className="font-bold">{vehicle.luggageCapacity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs font-semibold text-blue-900">
                      <Droplets size={16} className="text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[0.65rem] text-blue-500 block font-medium">Complimentary</span>
                        <span className="font-bold">Water Bottle</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-xs font-semibold text-emerald-900">
                      <Sparkles size={16} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[0.65rem] text-emerald-500 block font-medium">Hygiene</span>
                        <span className="font-bold">Tissue Paper</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Included Amenities
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vehicle.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                          <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best for */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ideal For</p>
                    <div className="flex flex-wrap gap-1.5">
                      {vehicle.bestFor.map((b) => (
                        <span key={b} className="px-3 py-1 rounded-full text-xs font-medium border border-slate-200 bg-slate-50/80 text-slate-600">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing CTA Card */}
                <div className="rounded-2xl p-6 text-center bg-gradient-to-b from-slate-50 to-amber-50/20 border border-amber-200/80 shadow-xs flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Starting Fare
                    </span>
                    <div className="text-3xl font-black text-amber-700 tracking-tight mb-0.5">
                      ₹{vehicle.displayRatePerKm ?? vehicle.basePerKm}
                      <span className="text-sm font-semibold text-slate-500">/km</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-400 mb-5">
                      Min. Fare: ₹{vehicle.minimumFare}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/cities/dhanbad/${vehicle.slug}/`}
                      className="btn-primary text-xs font-bold px-4 py-2.5 w-full justify-center shadow-sm hover:shadow-md"
                    >
                      Book {vehicle.name.split(' ')[0]}
                    </Link>
                    <p className="text-[0.65rem] text-slate-400 mt-2.5 font-medium">
                      Zero advance • Doorstep pickup
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-xl text-sm text-[var(--color-text-muted)]"
            style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <p className="font-semibold text-[var(--color-text-secondary)] mb-1">Availability Notice</p>
            <p>Vehicle availability is subject to confirmation at the time of booking. Specific models may vary. UMA TRAVELS will confirm the assigned vehicle before your trip. All listed vehicles are air-conditioned unless otherwise noted.</p>
          </div>
        </div>
      </section>
    </>
  );
}
