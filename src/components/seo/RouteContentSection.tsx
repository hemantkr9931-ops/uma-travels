// =====================================================================
// RouteContentSection — Rich SEO Content for Route Pages
// Generates 2000+ word quality content targeting all route keyword variants
// Optimised for Google ranking AND LLM (AI Overview) extraction
// =====================================================================
import type { Route } from '@/data/routes';
import type { Location } from '@/data/locations';
import type { Vehicle } from '@/data/vehicles';

interface RouteContentSectionProps {
  route: Route;
  vehicles: Vehicle[];
  fareMap: Record<string, number>; // vehicleId -> estimatedTotal
  originCity?: Location;
  destCity?: Location;
}

export default function RouteContentSection({
  route,
  vehicles,
  fareMap,
  originCity,
  destCity,
}: RouteContentSectionProps) {
  const durationHours = Math.floor(route.approxDurationMin / 60);
  const durationMins = route.approxDurationMin % 60;
  const durationStr = durationMins > 0 ? `${durationHours}h ${durationMins}m` : `${durationHours}h`;

  const sedan = vehicles.find((v) => v.id === 'sedan');
  const innova = vehicles.find((v) => v.id === 'innova');
  const tempo = null; // Tempo Traveller removed from fleet

  const sedanFare = sedan ? fareMap[sedan.id] : 0;
  const innovaFare = innova ? fareMap[innova.id] : 0;

  const sameState =
    originCity && destCity ? originCity.stateSlug === destCity.stateSlug : false;
  const isLongRoute = route.approxDistanceKm >= 150;
  const isVeryLongRoute = route.approxDistanceKm >= 300;
  const recommendedVehicle = isVeryLongRoute
    ? 'Toyota Innova Crysta'
    : isLongRoute
      ? 'Toyota Innova or Maruti Ertiga'
      : 'Sedan (Swift Dzire or Honda Amaze)';
  const viaText =
    route.viaPoints && route.viaPoints.length > 0
      ? route.viaPoints.join(', ')
      : 'the main national-highway corridor';

  return (
    <section className="section-padding bg-[var(--color-bg-primary)]" aria-label={`Complete guide for ${route.originName} to ${route.destinationName} cab booking`}>
      <div className="container-site">
        <div className="max-w-4xl mx-auto">

          {/* ── Primary Content Introduction ── */}
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-4">
              {route.originName} to {route.destinationName} Cab — Complete Booking Guide
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              UMA TRAVELS offers verified <strong>cab from {route.originName} to {route.destinationName}</strong> with transparent pricing, 
              experienced drivers, and zero advance payment required. Whether you need a 
              <strong> {route.originName} to {route.destinationName} taxi</strong> for a single trip or a round-trip booking, 
              we have the right vehicle and the right fare for your journey.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              The approximate road distance from <strong>{route.originName} to {route.destinationName}</strong> is {route.approxDistanceKm} km, 
              and the estimated drive time is approximately <strong>{durationStr}</strong> depending on traffic and route conditions. 
              {route.viaPoints && route.viaPoints.length > 0 && (
                ` The route passes through ${route.viaPoints.join(', ')}.`
              )}
              {route.tollApplicable
                ? ' Toll charges may apply on this route and are payable by the passenger.'
                : ' No significant tolls are expected on this route based on current information.'}
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Searching for <em>taxi from {route.originName} to {route.destinationName}</em> or 
              <em> {route.originName} to {route.destinationName} cab</em>? UMA TRAVELS is the most reliable cab service 
              operating on this route with multiple vehicle options starting from ₹{sedanFare?.toLocaleString('en-IN') ?? 'N/A'} 
              for a sedan one-way.
            </p>
          </div>

          {/* ── All Service Types for this Route ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Cab &amp; Taxi Options for {route.originName} to {route.destinationName}
            </h2>
            <div className="space-y-5">

              {/* One-Way */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  One-Way Cab from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Book a <strong>one-way taxi from {route.originName} to {route.destinationName}</strong> with UMA TRAVELS 
                  and pay only for the distance you travel. There are no hidden return charges or deadhead fees. 
                  Our <strong>one-way cab from {route.originName} to {route.destinationName}</strong> service is available 
                  24/7 and can be booked same-day or in advance. Sedan one-way fares start from 
                  approximately ₹{sedanFare?.toLocaleString('en-IN') ?? 'N/A'}.
                </p>
              </div>

              {/* Outstation */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Outstation Cab from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Our <strong>outstation taxi from {route.originName} to {route.destinationName}</strong> is ideal for 
                  multi-day trips, family visits, pilgrimages, and extended outstation travel. All vehicles carry valid 
                  interstate tourist permits. For overnight outstation trips, a driver allowance of ₹300/night applies and 
                  is clearly communicated at booking. Experience safe and comfortable 
                  <strong> outstation cab from {route.originName}</strong> to {route.destinationName} with UMA TRAVELS.
                </p>
              </div>

              {/* Round Trip */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Round-Trip Taxi from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Need a <strong>round-trip cab from {route.originName} to {route.destinationName}</strong>? 
                  With UMA TRAVELS round-trip service, the same driver and vehicle await your return — 
                  giving you guaranteed transport back to {route.originName}. Perfect for same-day visits, 
                  medical trips, court appearances, or business meetings in {route.destinationName}. 
                  Round-trip fares cover the full {route.approxDistanceKm * 2} km (both directions).
                </p>
              </div>

              {/* Innova Cab */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Innova Cab from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Book a <strong>Toyota Innova cab from {route.originName} to {route.destinationName}</strong> for 
                  premium 7-seater comfort. The Innova Crysta is India&apos;s most trusted vehicle for long-distance 
                  group travel. It is ideal for large families, corporate groups, and anyone who values extra 
                  legroom and luggage space on this {route.approxDistanceKm} km journey. 
                  Innova fare from {route.originName} to {route.destinationName}: 
                  approximately ₹{innovaFare?.toLocaleString('en-IN') ?? 'N/A'} one-way.
                </p>
              </div>

              {/* 7 Seater */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  7 Seater Cab from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Looking for a <strong>7 seater taxi from {route.originName} to {route.destinationName}</strong>? 
                  UMA TRAVELS offers Toyota Innova (7 seats) on this route. 
                  Both vehicles are air-conditioned, well-maintained, and driven by experienced chauffeurs 
                  familiar with the {route.originName}–{route.destinationName} corridor.
                </p>
              </div>

              {/* Airport Cab */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Airport Cab from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Travelling to {route.destinationName} for a flight? Book our <strong>airport transfer taxi 
                  from {route.originName} to {route.destinationName}</strong>. We ensure on-time pickup from 
                  your location in {route.originName} and punctual drop to the airport or your destination 
                  in {route.destinationName}. Arrival pickups from {route.destinationName} to {route.originName} 
                  are also available.
                </p>
              </div>

              {/* Corporate */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Corporate Cab from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  UMA TRAVELS provides <strong>corporate cab service from {route.originName} to {route.destinationName}</strong> 
                  for businesses and organisations. Executive travel, employee transport, and client airport pickups 
                  are all covered. Our corporate cabs on this route feature professional, punctual drivers 
                  and clean, well-presented vehicles. Contact us for monthly or project-based corporate 
                  travel arrangements between {route.originName} and {route.destinationName}.
                </p>
              </div>

              {/* Car Rental */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Car Rental from {route.originName} to {route.destinationName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Looking for <strong>car rental from {route.originName} to {route.destinationName}</strong>?
                  UMA TRAVELS provides outstation car rental with driver on this route.
                  All our <strong>rental cars from {route.originName}</strong> come with verified drivers, valid 
                  commercial and tourist permits, and insurance. Whether you need a{' '}
                  <strong>sedan car rental from {route.originName}</strong> for a solo trip or an{' '}
                  <strong>Innova car rental from {route.originName} to {route.destinationName}</strong> for a 
                  family, we have the right vehicle. Transparent per-km billing — no hidden charges.
                </p>
              </div>

            </div>
          </div>

          {/* ── Vehicle Fare Table ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              {route.originName} to {route.destinationName} Cab Fare — All Vehicles
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Estimated one-way cab fares from <strong>{route.originName} to {route.destinationName}</strong> 
              ({route.approxDistanceKm} km) for different vehicle categories:
            </p>

            <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                    <th className="text-left px-4 py-3 font-bold">Vehicle</th>
                    <th className="text-left px-4 py-3 font-bold">Seats</th>
                    <th className="text-left px-4 py-3 font-bold">Rate/km</th>
                    <th className="text-left px-4 py-3 font-bold">Est. Fare (One-Way)</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v, i) => (
                    <tr
                      key={v.id}
                      className={`border-b border-[var(--color-border)] ${i % 2 === 0 ? '' : 'bg-[var(--color-bg-secondary)]'}`}
                    >
                      <td className="px-4 py-3 font-medium">{v.name}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">{v.seatingCapacity}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">₹{v.basePerKm}/km</td>
                      <td className="px-4 py-3 text-[var(--color-gold-400)] font-bold">
                        ~₹{fareMap[v.id]?.toLocaleString('en-IN') ?? 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mt-3 leading-relaxed">
              * Fares are estimates based on one-way distance of {route.approxDistanceKm} km. 
              Minimum fare applies. {route.tollApplicable ? 'Toll charges are additional and payable by passenger.' : 'No significant tolls expected on this route.'} 
              Final fare confirmed at booking.
            </p>
          </div>

          {/* ── Route Detail & LLM Content ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Route Details: {route.originName} to {route.destinationName} by Road
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="card-dark group p-5 text-center rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Road Distance</p>
                <p className="text-2xl font-black text-amber-700">{route.approxDistanceKm} km</p>
                <p className="text-xs text-slate-500 mt-1">approx. one-way road</p>
              </div>
              <div className="card-dark group p-5 text-center rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Drive Time</p>
                <p className="text-2xl font-black text-amber-700">{durationStr}</p>
                <p className="text-xs text-slate-500 mt-1">approx. by road</p>
              </div>
              <div className="card-dark group p-5 text-center rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tolls</p>
                <p className="text-2xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                  {route.tollApplicable ? 'Applicable' : 'Direct Highway'}
                </p>
                <p className="text-xs text-slate-500 mt-1">clear transparent billing</p>
              </div>
            </div>

            <div className="card-dark p-5 mb-4">
              <p className="font-bold text-sm mb-2">Route Passes Through (Via Points):</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {route.viaPoints && route.viaPoints.length > 0
                  ? `${route.originName} → ${route.viaPoints.join(' → ')} → ${route.destinationName}`
                  : `${route.originName} → ${route.destinationName} via the main national-highway corridor`}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                The approximate road distance from {route.originName} to {route.destinationName} via {viaText} is {route.approxDistanceKm} km.
              </p>
            </div>

            {route.travelPurposes.length > 0 && (
              <div className="mb-4">
                <p className="font-bold text-sm mb-2 text-slate-900">Why People Travel from {route.originName} to {route.destinationName}:</p>
                <ul className="space-y-1">
                  {route.travelPurposes.map((tp) => (
                    <li key={tp} className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      {tp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Origin & Destination City Context (real city data) ── */}
          {(originCity || destCity) && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Travel Guide: {route.originName} to {route.destinationName}
              </h2>
              {originCity && (
                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-2">About {route.originName} (Pickup City)</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                    {originCity.excerpt}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {route.originName} is located in {originCity.district} district, {originCity.state}.
                    {' '}Your UMA TRAVELS cab is arranged for doorstep pickup anywhere in {route.originName} —
                    whether you are starting from a home, hotel, office, railway station, or bus stand.
                  </p>
                </div>
              )}
              {destCity && (
                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-2">About {route.destinationName} (Drop City)</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">
                    {destCity.excerpt}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {route.destinationName} is located in {destCity.district} district, {destCity.state}.
                    {' '}We drop you at your exact destination in {route.destinationName} — hotel, residence,
                    hospital, office, or any landmark you specify.
                  </p>
                </div>
              )}
              {originCity && destCity && (
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {sameState
                    ? `Because ${route.originName} and ${route.destinationName} are both in ${originCity.state}, this is an intra-state journey — no inter-state permit is required.`
                    : `This is an inter-state journey between ${originCity.state} and ${destCity.state}. UMA TRAVELS vehicles carry valid inter-state tourist permits, so you can cross state borders without any legal hassle.`}
                </p>
              )}
            </div>
          )}

          {/* ── Pickup & Drop Points ── */}
          {((originCity?.nearbyTerminals?.length ?? 0) > 0 || (destCity?.nearbyTerminals?.length ?? 0) > 0) && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Pickup &amp; Drop Points on the {route.originName}–{route.destinationName} Route
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {originCity?.nearbyTerminals && originCity.nearbyTerminals.length > 0 && (
                  <div className="card-dark p-5">
                    <p className="font-bold text-sm mb-2">Pickup in {route.originName}:</p>
                    <ul className="space-y-1">
                      {originCity.nearbyTerminals.map((t) => (
                        <li key={t} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                          <span className="text-[var(--color-gold-400)]">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--color-text-muted)] mt-3">
                      Doorstep pickup is also available anywhere within {route.originName} city limits.
                    </p>
                  </div>
                )}
                {destCity?.nearbyTerminals && destCity.nearbyTerminals.length > 0 && (
                  <div className="card-dark p-5">
                    <p className="font-bold text-sm mb-2">Drop in {route.destinationName}:</p>
                    <ul className="space-y-1">
                      {destCity.nearbyTerminals.map((t) => (
                        <li key={t} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                          <span className="text-[var(--color-blue-400)]">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--color-text-muted)] mt-3">
                      Drop-off is available at any address, hotel, or landmark in {route.destinationName}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Best Vehicle for this Route ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Which Cab Is Best for the {route.originName} to {route.destinationName} Route?
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
              At approximately {route.approxDistanceKm} km ({durationStr} of driving), the {route.originName} to {route.destinationName} journey
              {isLongRoute
                ? ' is a long-distance trip where cabin comfort and luggage space matter most.'
                : ' is a short intercity trip where an economical sedan is usually the smartest choice.'}
              {' '}Based on the distance and typical group sizes on this corridor, we recommend the{' '}
              <strong>{recommendedVehicle}</strong>.
            </p>
            <ul className="space-y-2 mb-3">
              {!isLongRoute && (
                <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                  <span className="text-[var(--color-gold-400)]">•</span>
                  <span><strong>Sedan</strong> — the most economical option for 1–4 passengers on this {route.approxDistanceKm} km route.</span>
                </li>
              )}
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span><strong>Maruti Ertiga (6 seats)</strong> — a balanced choice for families of 5–6 travelling with luggage.</span>
              </li>
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span><strong>Toyota Innova (7 seats)</strong> — best for long-distance comfort, larger families, and corporate groups.</span>
              </li>
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span><strong>Tempo Traveller (up to 12 seats)</strong> — ideal for group tours, pilgrimages, and wedding parties travelling together.</span>
              </li>
            </ul>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              One-way fares start at approximately ₹{sedanFare?.toLocaleString('en-IN') ?? 'N/A'} for a sedan on this route,
              and an Innova (7-seater) is approximately ₹{innovaFare?.toLocaleString('en-IN') ?? 'N/A'} one-way.
              For groups above 7, the Tempo Traveller offers the best per-seat value.
            </p>
          </div>

          {/* ── Travel Tips for this Corridor ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Tips for Travelling from {route.originName} to {route.destinationName} by Cab
            </h2>
            <ul className="space-y-2">
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span>Book in advance for early-morning departures — many passengers leave {route.originName} before 7 AM to avoid city traffic and reach {route.destinationName} comfortably.</span>
              </li>
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span>The {route.originName}–{route.destinationName} route {route.tollApplicable ? 'has toll plazas; tolls are payable by the passenger and are additional to the cab fare.' : 'has no significant tolls based on current information.'}</span>
              </li>
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span>{sameState ? 'No inter-state permit is needed for this intra-state journey.' : 'Our vehicles carry valid inter-state tourist permits when the journey crosses state borders.'}</span>
              </li>
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span>For overnight or multi-day trips, a driver allowance of ₹300 per night applies and is confirmed clearly at booking.</span>
              </li>
              <li className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                <span className="text-[var(--color-gold-400)]">•</span>
                <span>Carry a valid photo ID, and keep your driver&apos;s contact details handy — you receive them before pickup.</span>
              </li>
            </ul>
          </div>

          {/* ── Why UMA TRAVELS on this Route ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Why Book {route.originName} to {route.destinationName} Cab with UMA TRAVELS?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  title: 'Route-Verified Drivers',
                  desc: `Our ${route.originName} to ${route.destinationName} drivers are experienced on this specific route and know the best roads and rest stops.`,
                },
                {
                  title: 'Transparent Fare',
                  desc: `Get an exact fare estimate before booking. No hidden charges, no surge pricing on the ${route.originName}–${route.destinationName} route.`,
                },
                {
                  title: 'Interstate Permits',
                  desc: 'All our vehicles carry valid interstate tourist permits — necessary for travel across state borders.',
                },
                {
                  title: 'Flexible Scheduling',
                  desc: `Book same-day or in advance for any date. Early morning and late-night departures from ${route.originName} are also available.`,
                },
                {
                  title: 'All Vehicle Types',
                  desc: `Choose sedan, Ertiga, Innova, luxury SUV, or Tempo Traveller for the ${route.originName}–${route.destinationName} journey.`,
                },
                {
                  title: 'No Advance Payment',
                  desc: 'Pay the driver directly after completing your trip. Zero advance or online payment required at the time of booking.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="card-dark group p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex gap-3.5"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-sm mb-1 text-slate-900 group-hover:text-amber-800 transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── LLM Q&A Section ── */}
          <div className="mb-6">
            <h2 className="text-2xl font-black mb-4">
              {route.originName} to {route.destinationName} Cab — Questions &amp; Answers
            </h2>
            <div className="space-y-3.5">
              {[
                {
                  q: `What is the distance from ${route.originName} to ${route.destinationName} by road?`,
                  a: `The approximate road distance from ${route.originName} to ${route.destinationName} is ${route.approxDistanceKm} km. The drive takes approximately ${durationStr}${route.viaPoints && route.viaPoints.length > 0 ? ` via ${route.viaPoints.join(', ')}` : ''}.`,
                },
                {
                  q: `What is the cab fare from ${route.originName} to ${route.destinationName}?`,
                  a: `Cab fare from ${route.originName} to ${route.destinationName} starts from approximately ₹${sedanFare?.toLocaleString('en-IN') ?? 'N/A'} for a sedan (4-seater). Toyota Innova (7-seater) fare is approximately ₹${innovaFare?.toLocaleString('en-IN') ?? 'N/A'} one-way. Fares are per-km based and confirmed at booking.`,
                },
                {
                  q: `How long does it take to travel from ${route.originName} to ${route.destinationName} by cab?`,
                  a: `It takes approximately ${durationStr} to travel from ${route.originName} to ${route.destinationName} by cab. Actual travel time depends on traffic, road conditions, and stops taken during the journey.`,
                },
                {
                  q: `Is there a one-way cab available from ${route.originName} to ${route.destinationName}?`,
                  a: `Yes. UMA TRAVELS offers one-way cab service from ${route.originName} to ${route.destinationName} where you pay only for the one-way distance. No return fare is charged for one-way bookings.`,
                },
                {
                  q: `Which is the best cab for ${route.approxDistanceKm} km travel from ${route.originName} to ${route.destinationName}?`,
                  a: `For solo or couple travel, a sedan (Swift Dzire or Honda Amaze) is most economical. For families of 5–7, the Toyota Innova offers the best comfort. For groups above 8, the Tempo Traveller is the right choice for the ${route.originName} to ${route.destinationName} journey.`,
                },
                {
                  q: `Are there tolls on the ${route.originName} to ${route.destinationName} route?`,
                  a: route.tollApplicable
                    ? `Yes, toll charges are likely applicable on the ${route.originName} to ${route.destinationName} route. Tolls are payable by the passenger and are additional to the cab fare.`
                    : `No significant toll charges are expected on the ${route.originName} to ${route.destinationName} route based on current information.`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="card-dark group p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200"
                >
                  <p className="font-bold text-sm mb-2 text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100/90 text-amber-700 font-black text-xs flex items-center justify-center shrink-0">
                      Q
                    </span>
                    {item.q}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed pl-7">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

