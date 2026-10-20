// =====================================================================
// FareCalculatorSection — shared "Fare Estimator" band used across
// home, route, city, state, hub-service and contact pages so the
// background, spacing and heading treatment stay identical site-wide.
// =====================================================================
import FreeTaxiBookingForm from '@/components/booking/FreeTaxiBookingForm';

interface FareCalculatorSectionProps {
  title?: string;
  subtitle?: string;
}

export default function FareCalculatorSection({
  title = 'Instant Cab Fare Calculator',
  subtitle = 'Calculate exact highway road distance and transparent cab fares instantly with zero hidden charges.',
}: FareCalculatorSectionProps) {
  return (
    <section
      className="section-padding relative overflow-hidden bg-gradient-to-b from-slate-50 via-amber-50/25 to-slate-50"
      aria-labelledby="calculator-heading"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container-site relative">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/15 text-amber-800 border border-amber-400/30 mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Live Highway Fare Estimator
            </span>

            <h2 id="calculator-heading" className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>

            <p className="text-slate-600 mt-2 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>

            {/* Micro Trust Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 text-[11px] font-bold text-slate-600">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 shadow-2xs">
                🚗 Real Road OSRM Distance
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 shadow-2xs">
                💯 100% AC &amp; Sanitized Cabs
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 shadow-2xs">
                ✨ Zero Advance Needed
              </span>
            </div>
          </div>

          {/* Calculator Card Container */}
          <div className="glass-booking rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl relative border border-slate-200/90">
            <FreeTaxiBookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
