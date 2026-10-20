// =====================================================================
// HubDetailContentSection — Rich SEO Content for Hub Service & Vehicle
// Detail Pages (/cities/[citySlug]/[serviceSlug]/)
// Generates unique, quality, LLM-friendly content per (city × service)
// and (city × vehicle), using the CityDetails local-SEO data layer.
// =====================================================================
import Link from 'next/link';
import type { Location } from '@/data/locations';
import type { Route } from '@/data/routes';
import { getRouteFare } from '@/data/routes';
import type { Service } from '@/data/services';
import { VEHICLES, type Vehicle } from '@/data/vehicles';
import { getCityDetails } from '@/data/cityDetails';

interface FAQ {
  question: string;
  answer: string;
}

interface HubDetailContentSectionProps {
  city: Location;
  vehicle?: Vehicle;
  service?: Service;
  routes: Route[];
  outgoingRouteCount: number;
  faqs: FAQ[];
}

interface ContextBlock {
  hook: string;
  uses: { title: string; desc: string }[];
}

// `{city}` and `{state}` are replaced per-city by the component.
const SERVICE_CONTEXT: Record<string, ContextBlock> = {
  'local-cab': {
    hook:
      'UMA TRAVELS runs a dedicated local cab service within {city} for everyday errands — hospital and clinic visits, railway-station and bus-stand transfers, market and shopping runs, school and college drops, and full-day local sightseeing. Hourly, half-day and full-day packages make it easy to move around the city without owning a car or depending on crowded public transport.',
    uses: [
      { title: 'Hospital & clinic visits', desc: 'Clinic rounds, OPD visits, medicine pickups and patient transfers in {city}.' },
      { title: 'Station & bus-stand transfers', desc: 'Reliable pickup and drop at every railway station, bus stand and major depot in and around {city}.' },
      { title: 'Market & shopping runs', desc: 'Stress-free shopping trips to the main markets and retail areas with help loading purchases.' },
      { title: 'Hourly & point-to-point', desc: 'Flat hourly packages or quick point-to-point rides for business work, family functions and daily commutes.' },
    ],
  },
  'one-way-cab': {
    hook:
      'A one-way cab from {city} means you pay only for the distance you travel — there is no return charge or empty-return penalty. This makes it the smartest option when you are relocating, continuing an onward journey by train or flight, travelling for work, or going somewhere without needing a car to come back. UMA TRAVELS confirms the exact per-km fare by phone and in the booking form before your ride.',
    uses: [
      { title: 'Relocation & shifting', desc: 'Shift base or household trips between {city} and other cities at simple one-way rates.' },
      { title: 'Ticket connectors', desc: 'Reach an airport or railway station from {city} and leave the cab there.' },
      { title: 'Corporate transfers', desc: 'Move employees, consultants and visitors between {city} and plant or office locations.' },
      { title: 'Family visits', desc: 'Visit relatives in {city} or depart for a day trip without paying for a return journey.' },
    ],
  },
  'outstation-cab': {
    hook:
      'When your journey from {city} goes beyond a single day — a pilgrimage, a family holiday, a business tour, or a visit to another city — an outstation taxi from UMA TRAVELS is the convenient, private option. You get a dedicated vehicle and an experienced, route-tested driver for the whole trip, with interstate tourist permits valid across {state} and neighbour states.',
    uses: [
      { title: 'Pilgrimage & temple travel', desc: 'Book multi-day trips from {city} to Deoghar, Varanasi, Puri, Gaya and other pilgrimage destinations.' },
      { title: 'Multi-day holidays', desc: 'Keep a private cab for sightseeing in hill stations, heritage cities and coastal towns.' },
      { title: 'Business tours', desc: 'Cover multiple cities and sites in one outstation trip with driver allowance included.' },
      { title: 'Family reunions', desc: 'Travel together with big luggage and flexible schedules across {state} and beyond.' },
    ],
  },
  'round-trip-cab': {
    hook:
      'A round-trip cab from {city} assigns you the same vehicle and the same driver for both legs of your journey. Your return ride is guaranteed — no hunting for a cab on the way back, no surge pricing, no surprises. It is the ideal choice for same-day business visits and multi-day trips where you want peace of mind and a familiar driver.',
    uses: [
      { title: 'Same-day business visits', desc: 'Go {city} to your destination and return the same day with the driver waiting for you.' },
      { title: 'Hospital & treatment stays', desc: 'Regular travel to hospitals, diagnostics and therapy centres in nearby cities.' },
      { title: 'Multi-day site trips', desc: 'Keep the same cab for the entire visit and come back when you are ready.' },
      { title: 'Airport loops', desc: 'Fixed onward-and-return transfers without worrying about off-peak cab availability.' },
    ],
  },
  'wedding-car-rental': {
    hook:
      'Weddings in {city} and the surrounding region deserve flawless travel — and that is exactly what UMA TRAVELS wedding car rental delivers. From decorated baraat vehicles and bride-and-groom transfers to guest pickups across {state}, our premium sedan, Innova, luxury and Tempo Traveller fleet keeps your entire wedding moving on time.',
    uses: [
      { title: 'Baraat processions', desc: 'Attractively decorated vehicles for the groom and the baraat from {city}.' },
      { title: 'Bride & groom transfers', desc: 'Comfortable, premium cars for the couple across all wedding functions.' },
      { title: 'Guest transportation', desc: 'Scheduled shuttles from hotels, stations and the airport to the venue.' },
      { title: 'Multiple-day functions', desc: 'Book the fleet for the full wedding weekend with dependable drivers.' },
    ],
  },
  'corporate-travel': {
    hook:
      'UMA TRAVELS is a trusted corporate cab provider for businesses, factories and offices across {city} and the wider region. We run scheduled employee transport, executive cab arrangements, and client pickups from railway stations and airports — with the same reliable vehicles and presentable, verified drivers every single day.',
    uses: [
      { title: 'Employee point-to-point', desc: 'Daily office commutes and inter-factory movement for staff in {city}.' },
      { title: 'Factory & plant visits', desc: 'Scheduled transport for workers, vendors and visitors at industrial sites.' },
      { title: 'Client airport transfers', desc: 'Professional meet-and-greet pickups and drop-offs for visiting clients.' },
      { title: 'Multi-city coordination', desc: 'Monthly and project-based travel plans covering several cities at a time.' },
    ],
  },
  'airport-transfer': {
    hook:
      'Flying out of {city}? UMA TRAVELS airport transfer service gets you to the aircraft on time, every time — including early-morning departures. We serve Birsa Munda Airport (Ranchi), Netaji Subhas Chandra Bose International Airport (Kolkata), Deoghar Airport and other key terminals, with flight-aware scheduling and arrival pickup available on request.',
    uses: [
      { title: 'Departure drops', desc: 'Guaranteed on-time pickup from your home, hotel or office in {city} to the airport.' },
      { title: 'Arrival pickups', desc: 'Driver waiting at the terminal with a name board, ready for a smooth ride back.' },
      { title: 'Early-morning flights', desc: '24/7 service means 4 am pickups are never a problem.' },
      { title: 'Group & family travel', desc: 'Choose sedans or 7-seater Innovas to carry the whole family and luggage.' },
    ],
  },
};

const VEHICLE_CONTEXT: Record<string, ContextBlock> = {
  sedan: {
    hook:
      'The sedan is the most economical all-rounder in UMA TRAVELS\' fleet serving {city}. Comfortable for up to 4 passengers with room for 2 medium bags, it handles both intra-city rides and long highway journeys with equal ease. For budget-friendly, dependable travel from {city} — from the office to the airport to a Deoghar pilgrimage — the sedan is usually the right first choice.',
    uses: [
      { title: 'Point-to-point city rides', desc: 'Quick trips across {city} — medical, shopping, meetings and station transfers.' },
      { title: 'Affordable one-way & outstation', desc: 'Cost-effective intercity travel to Ranchi, Bokaro, Asansol and beyond.' },
      { title: 'Airport transfers for 1–4', desc: 'Solo and family airport runs at the lowest per-km rate in the fleet.' },
      { title: 'Business & solo travel', desc: 'Private, AC transfer for professionals moving around {city}.' },
    ],
  },
  ertiga: {
    hook:
      'The Maruti Suzuki Ertiga is the smart family choice for travel from {city}. This 6-seater MPV gives you the extra seat and headroom of a bigger car while staying easy on fuel and budget. It is ideal for families of 5–6, small groups heading out of {city}, and intercity trips where you want space without paying the premium of a 7-seater.',
    uses: [
      { title: 'Family outstation trips', desc: 'Comfortable long drives for 5–6 people starting in {city}.' },
      { title: 'Airport & station transfers', desc: 'More seats and luggage room for the whole family travelling together.' },
      { title: 'Wedding guest runs', desc: 'Moving guests between homes, hotels and the venue in {city}.' },
      { title: 'Medium-distance economy', desc: 'A value balance between sedan economy and full-size SUVs.' },
    ],
  },
  innova: {
    hook:
      'The Toyota Innova — India\'s most trusted 7-seater — is the flagship of UMA TRAVELS service from {city}. With generous legroom, 4-bag luggage capacity and a famously smooth highway ride, it is the first choice for long-distance outstation travel, corporate delegations and larger families. On routes from {city} to Ranchi, Kolkata, Patna or Varanasi, the Innova is comfort you can bank on.',
    uses: [
      { title: 'Long-distance outstation', desc: 'Premium comfort for multi-hour journeys from {city} to Kolkata, Patna and Varanasi.' },
      { title: 'Corporate & executive travel', desc: 'Executive pickups, client runs and management travel across {state}.' },
      { title: 'Large family & group trips', desc: 'Seven seats with real legroom — comfortable for larger groups on highway runs.' },
      { title: 'Airport transfers for groups', desc: 'Plenty of cabin and luggage space for family flight connections.' },
    ],
  },
  luxury: {
    hook:
      'For weddings, executive visits and special occasions, UMA TRAVELS luxury fleet from {city} adds the finishing touch. With premium SUVs and upscale interiors, these cars make arrivals, valedictions and VIP transfers feel as important as the moment itself. Availability is confirmed in advance, so specific models are booked to your event.',
    uses: [
      { title: 'Wedding & baraat cars', desc: 'Premium vehicles decorated for the celebrations around {city}.' },
      { title: 'Executive & VIP transfers', desc: 'High-comfort pickups for senior management and VIP guests.' },
      { title: 'Special occasions', desc: 'Anniversaries, graduations, proposals and milestone trips.' },
      { title: 'Premium airport runs', desc: 'Arrive at the airport in style from {city}.' },
    ],
  },
  'tempo-traveller': {
    hook:
      'When a group needs to travel together from {city}, the Tempo Traveller is the practical, economical answer. With 12–17 seats, AC comfort, generous luggage space and room for everyone\'s gear, it turns pilgrimages, corporate outings, school trips and wedding baraats into a single, sociable journey across {state} and neighbouring states.',
    uses: [
      { title: 'Pilgrimages & group tours', desc: 'Deoghar, Puri, Varanasi and temple circuits with family and community groups.' },
      { title: 'Corporate group transport', desc: 'Move teams, projects and offsites between {state} plants and offices.' },
      { title: 'Wedding baraats', desc: 'The classic baraat vehicle with space for the entire entourage.' },
      { title: 'School & college trips', desc: 'Safe, supervised group travel for educational excursions.' },
    ],
  },
};

const SERVICE_VEHICLE_BEST: Record<string, string> = {
  sedan: 'Solo, couples, small families',
  ertiga: 'Families of 5–6',
  innova: 'Long outstation & corporate',
  'tempo-traveller': 'Groups & pilgrimages',
  luxury: 'Weddings & executives',
};

const SERVICE_VEHICLE_TABLE = VEHICLES.map((v) => ({
  id: v.id,
  slug: v.slug,
  name: v.name,
  seats: v.seatingCapacity,
  rate: v.displayRatePerKm ?? v.basePerKm,
  best: SERVICE_VEHICLE_BEST[v.id],
}));

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function HubDetailContentSection({
  city,
  vehicle,
  service,
  routes,
  outgoingRouteCount,
  faqs,
}: HubDetailContentSectionProps) {
  const details = getCityDetails(city.slug);
  const isVehicle = Boolean(vehicle);
  const item = vehicle ?? service!;
  const context = vehicle
    ? VEHICLE_CONTEXT[vehicle.id]
    : service
    ? SERVICE_CONTEXT[service.id]
    : undefined;
  const hook = (context?.hook ?? '').replaceAll('{city}', city.name).replaceAll('{state}', city.state);
  const uses = (context?.uses ?? []).map((u) => ({
    title: u.title,
    desc: u.desc.replaceAll('{city}', city.name).replaceAll('{state}', city.state),
  }));
  const localService = Boolean(service && !service.applicableOnRoutePages);
  const showRoutes = isVehicle || !localService;
  const fareFor = (route: Route) =>
    getRouteFare(route, vehicle?.id ?? 'sedan');

  const steps = [
    { n: 1, t: 'Share your plans', d: `Tell us your pickup location in ${city.name}, destination, date and time — via the form above, phone, or WhatsApp.` },
    { n: 2, t: 'Pick your vehicle', d: `Choose the vehicle category and service that fits your group size and budget.` },
    { n: 3, t: 'Get the final fare', d: `Our team confirms the exact per-km fare and any toll or driver allowance before you commit.` },
    { n: 4, t: 'Driver & trip details', d: `You receive your verified driver's name and number before pickup.` },
    { n: 5, t: 'Pay after the trip', d: `Pay the driver directly after a comfortable ride — no advance is needed.` },
  ];

  return (
    <section
      className="section-padding bg-[var(--color-bg-primary)]"
      aria-label={`Complete guide to ${item.name} in ${city.name}`}
    >
      <div className="container-site">
        <div className="max-w-4xl mx-auto prose-city">

          {/* ── Intro ── */}
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-4">
              {item.name} in {city.name} — Complete {isVehicle ? 'Cab' : 'Service'} Guide
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">{hook}</p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              UMA TRAVELS provides {isVehicle ? 'this vehicle' : `the ${service?.shortName ?? ''} service`} from {city.name}
              {details?.region ? ` (${details.region})` : ''} around the clock, 7 days a week, with AC vehicles, verified
              commercial drivers, transparent per-km pricing and zero advance required. Whether it is a single ride, an
              outstation trip or a multi-day tour from {city.name}, we confirm your fare before the journey and assign a
              driver who knows the route.
            </p>
          </div>

          {/* ── Use cases ── */}
          {uses.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                When is {item.name} {isVehicle ? 'the right cab' : 'the right choice'} in {city.name}?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {uses.map((use) => (
                  <div key={use.title} className="card-dark p-4 rounded-xl border border-slate-200/90 bg-white">
                    <p className="font-bold text-sm mb-1 text-slate-900">{use.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{use.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Coverage ── */}
          {details && details.localities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Areas Covered — {item.name} Across {city.name}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                Pickup and drop is available across all major localities of {city.name}, including:
              </p>
              <div className="flex flex-wrap gap-2">
                {details.localities.map((locality) => (
                  <span
                    key={locality}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                  >
                    {locality}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Routes / fares ── */}
          {showRoutes && routes.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Popular Routes from {city.name} {isVehicle ? `for ${item.name}` : `(${service?.shortName ?? ''})`}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                {isVehicle
                  ? `Indicative one-way fares for the ${vehicle!.name} on the most-booked routes from ${city.name}.`
                  : `Indicative one-way sedan fares for the ${service!.name.toLowerCase()} on the most-booked intercity routes from ${city.name}.`}{' '}
                UMA TRAVELS covers {outgoingRouteCount} verified outstation routes from {city.name}.
              </p>
              <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                      <th className="text-left px-4 py-3 font-bold">Route</th>
                      <th className="text-left px-4 py-3 font-bold">Distance</th>
                      <th className="text-left px-4 py-3 font-bold">Drive Time</th>
                      <th className="text-left px-4 py-3 font-bold">Est. One-Way Fare*</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route, i) => (
                      <tr
                        key={route.id}
                        className={`border-b border-[var(--color-border)] ${i % 2 === 0 ? '' : 'bg-[var(--color-bg-secondary)]'}`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/routes/${route.originSlug}-to-${route.destinationSlug}/`}
                            className="font-medium text-slate-900 hover:text-amber-700"
                          >
                            {route.originName} → {route.destinationName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)]">~{route.approxDistanceKm} km</td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)]">~{formatDuration(route.approxDurationMin)}</td>
                        <td className="px-4 py-3 text-[var(--color-gold-400)] font-bold">₹{fareFor(route).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-3 leading-relaxed">
                *Fares are indicative estimates for {isVehicle ? vehicle!.name : 'a sedan'} one-way travel and are confirmed at
                booking. Tolls (where applicable) are extra and payable by the passenger. Driver allowance applies to
                overnight outstation trips.
              </p>
            </div>
          )}

          {/* ── Pricing notes (vehicle) / recommended vehicles (service) ── */}
          {isVehicle && vehicle && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                How Much Does {vehicle.name} Cost in {city.name}?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="card-dark p-5 rounded-xl border border-slate-200/90 bg-white">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Base Rate</p>
                  <p className="text-2xl font-black text-amber-700">₹{vehicle.displayRatePerKm ?? vehicle.basePerKm}/km</p>
                </div>
                <div className="card-dark p-5 rounded-xl border border-slate-200/90 bg-white">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Minimum Fare</p>
                  <p className="text-2xl font-black text-slate-900">₹{vehicle.minimumFare}</p>
                </div>
                <div className="card-dark p-5 rounded-xl border border-slate-200/90 bg-white">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Capacity</p>
                  <p className="text-2xl font-black text-slate-900">{vehicle.seatingCapacity} seats</p>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-3">
                For outstation trips, a fixed driver allowance is added for overnight stays and highway tolls are charged
                at actuals. Round-trip fares are calculated on the full return distance. There is no surge pricing — the
                rate you are quoted is the rate you pay.
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Book the {vehicle.name} from {city.name} for {vehicle.models.join(', ')}; the exact model is confirmed at
                booking based on availability.
              </p>
            </div>
          )}

          {!isVehicle && service && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Best Vehicles for {service.name} in {city.name}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                Depending on your group size and journey type, these are the UMA TRAVELS fleet options you can book for{' '}
                {service.shortName.toLowerCase()} in {city.name}:
              </p>
              <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                      <th className="text-left px-4 py-3 font-bold">Vehicle</th>
                      <th className="text-left px-4 py-3 font-bold">Seats</th>
                      <th className="text-left px-4 py-3 font-bold">Rate</th>
                      <th className="text-left px-4 py-3 font-bold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICE_VEHICLE_TABLE.map((row, i) => (
                      <tr
                        key={row.id}
                        className={`border-b border-[var(--color-border)] ${i % 2 === 0 ? '' : 'bg-[var(--color-bg-secondary)]'}`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/cities/${city.slug}/${row.slug}/`}
                            className="font-medium text-slate-900 hover:text-amber-700"
                          >
                            {row.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{row.seats}</td>
                        <td className="px-4 py-3 text-[var(--color-gold-400)] font-bold">₹{row.rate}/km</td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)]">{row.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Nearby attractions ── */}
          {details && details.attractions.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Extend Your Trip — Attractions &amp; Day Trips from {city.name}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                If you have time to spare, these nearby attractions make great add-on trips from {city.name} — book them
                as a one-day round-trip with the same cab and driver:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.attractions.slice(0, 6).map((a) => (
                  <div key={a.name} className="card-dark p-4 rounded-xl border border-slate-200/90 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-sm text-slate-900">{a.name}</p>
                      <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {a.distance}
                      </span>
                    </div>
                    {a.note && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{a.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tips + best time ── */}
          {details && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Best Time to Visit {city.name} &amp; Local Travel Tips
              </h2>
              {details.bestTime && (
                <div className="card-dark p-5 mb-4 rounded-xl border border-slate-200/90 bg-white">
                  <h3 className="font-bold mb-1.5">Best time to visit</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{details.bestTime}</p>
                </div>
              )}
              {details.tips.length > 0 && (
                <ul className="space-y-1.5">
                  {details.tips.map((tip) => (
                    <li key={tip} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                      <span className="text-[var(--color-gold-400)] mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ── How to book ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              How to Book {item.name} in {city.name} — Step by Step
            </h2>
            <ol className="space-y-3">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="card-dark group p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200 flex gap-4 items-center"
                >
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-bold text-sm mb-0.5 text-slate-900 group-hover:text-amber-800 transition-colors">{step.t}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Trust ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Why Book {item.name} with UMA TRAVELS in {city.name}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { t: 'Transparent per-km pricing', d: `Your ${item.name} fare is confirmed before the trip — no hidden charges, no surge pricing.` },
                { t: 'Zero advance payment', d: `Book your cab from ${city.name} and pay the driver after the journey is complete.` },
                { t: 'Verified drivers', d: `Every ${item.name} driver is police-verified, commercially licensed and route-tested across ${city.state}.` },
                { t: '24/7 availability', d: `Cabs are available from ${city.name} every hour of the day, every day of the year.` },
                { t: 'Interstate permits', d: `Vehicles carry valid tourist permits — ${city.state}, Bihar, West Bengal and Odisha trips are hassle-free.` },
                { t: 'Clean AC vehicles', d: `The fleet is serviced and sanitised between every trip from the ${city.name} hub.` },
              ].map((point) => (
                <div
                  key={point.t}
                  className="card-dark group p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200"
                >
                  <p className="font-bold text-sm mb-1 text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">✓</span>
                    {point.t}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{point.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQs ── */}
          {faqs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-black mb-4">
                {item.name} in {city.name} — Quick Answers
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="card-dark group p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200"
                  >
                    <p className="font-bold text-sm mb-2 text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100/90 text-amber-700 font-black text-xs flex items-center justify-center shrink-0">Q</span>
                      {faq.question}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}