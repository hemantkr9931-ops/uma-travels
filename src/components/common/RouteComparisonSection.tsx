// =====================================================================
// RouteComparisonSection — "Cab vs Train vs Bus" comparison table.
// Mirrors the comparison blocks used by East-India intercity cab
// operators, helping travellers weighing a private cab against public
// transport make a decision.
// =====================================================================
import { Check, X, Minus } from 'lucide-react';

interface RouteComparisonSectionProps {
  originName: string;
  destinationName: string;
  distanceKm: number;
}

type Verdict = 'yes' | 'no' | 'partial';

interface Row {
  feature: string;
  cab: { verdict: Verdict; text: string };
  train: { verdict: Verdict; text: string };
  bus: { verdict: Verdict; text: string };
}

function Cell({ verdict, text }: { verdict: Verdict; text: string }) {
  const Icon = verdict === 'yes' ? Check : verdict === 'partial' ? Minus : X;
  const color =
    verdict === 'yes'
      ? 'text-emerald-600'
      : verdict === 'partial'
        ? 'text-amber-500'
        : 'text-slate-400';
  return (
    <span className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
      <Icon size={15} className={`${color} shrink-0 mt-0.5`} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}

export default function RouteComparisonSection({
  originName,
  destinationName,
  distanceKm,
}: RouteComparisonSectionProps) {
  const rows: Row[] = [
    {
      feature: 'Door-to-door',
      cab: { verdict: 'yes', text: 'Pickup & drop at your exact address' },
      train: { verdict: 'no', text: 'Station to station only' },
      bus: { verdict: 'no', text: 'Fixed stop to fixed stop' },
    },
    {
      feature: 'Privacy & comfort',
      cab: { verdict: 'yes', text: 'Private AC cab — halt anywhere en route' },
      train: { verdict: 'no', text: 'Shared coach, fixed seating' },
      bus: { verdict: 'no', text: 'Shared seats, crowded at peak' },
    },
    {
      feature: 'Departure time',
      cab: { verdict: 'yes', text: 'Any time, 24/7 — you choose' },
      train: { verdict: 'no', text: 'Fixed timetable' },
      bus: { verdict: 'no', text: 'Fixed timetable' },
    },
    {
      feature: 'Luggage & stops',
      cab: { verdict: 'yes', text: 'Flexible — rest stops on request' },
      train: { verdict: 'partial', text: 'Limited baggage allowance' },
      bus: { verdict: 'partial', text: 'Limited baggage' },
    },
    {
      feature: 'Best suited for',
      cab: { verdict: 'yes', text: 'Families, groups, elderly, luggage' },
      train: { verdict: 'partial', text: 'Solo & budget travel' },
      bus: { verdict: 'partial', text: 'Short, low-cost trips' },
    },
    {
      feature: `Booking a ${distanceKm} km ride`,
      cab: { verdict: 'yes', text: 'Instant on WhatsApp / phone, no advance' },
      train: { verdict: 'no', text: 'Book tickets in advance' },
      bus: { verdict: 'no', text: 'Queue or seat availability risk' },
    },
  ];

  return (
    <section className="section-padding bg-[var(--color-bg-secondary)]" aria-labelledby="route-comparison-heading">
      <div className="container-site">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="section-label">Compare Before You Travel</span>
          <h2 id="route-comparison-heading" className="text-2xl md:text-3xl font-black mb-2">
            Cab vs Train vs Bus — {originName} to {destinationName}
          </h2>
          <p className="text-slate-600 text-sm">
            Weighing a private cab against public transport for this {distanceKm} km journey? Here is a quick
            side-by-side.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/90">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Aspect</th>
                <th className="p-4">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-black text-slate-950 shadow-xs">
                    UMA TRAVELS Cab
                  </span>
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Train</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Bus</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.feature}
                  className={idx % 2 === 1 ? 'bg-slate-50/60' : ''}
                >
                  <th
                    scope="row"
                    className="p-4 text-xs sm:text-sm font-bold text-slate-900 align-top border-b border-slate-100"
                  >
                    {row.feature}
                  </th>
                  <td className="p-4 bg-amber-50/40 align-top border-b border-slate-100">
                    <Cell verdict={row.cab.verdict} text={row.cab.text} />
                  </td>
                  <td className="p-4 align-top border-b border-slate-100">
                    <Cell verdict={row.train.verdict} text={row.train.text} />
                  </td>
                  <td className="p-4 align-top border-b border-slate-100">
                    <Cell verdict={row.bus.verdict} text={row.bus.text} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Train and bus details are indicative and may vary by route and service class.
        </p>
      </div>
    </section>
  );
}
