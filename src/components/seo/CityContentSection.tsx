// =====================================================================
// CityContentSection — Rich SEO Content for City Pages
// Generates 2000+ word quality content targeting all city keyword variants
// Optimised for Google ranking AND LLM (AI Overview) extraction.
// Now enriched with the CityDetails local-SEO data layer (localities,
// landmarks, connectivity, attractions, best time, local tips).
// =====================================================================
import Link from 'next/link';
import type { Location } from '@/data/locations';
import type { Route } from '@/data/routes';
import { getRouteFare } from '@/data/routes';
import { type Vehicle } from '@/data/vehicles';
import { getCityDetails, type CityDetails } from '@/data/cityDetails';

interface CityContentSectionProps {
  city: Location;
  vehicles: Vehicle[];
  outgoingRouteCount: number;
  incomingRouteCount: number;
  popularRoutes?: Route[];
  details?: CityDetails;
}

export default function CityContentSection({
  city,
  vehicles,
  outgoingRouteCount,
  incomingRouteCount,
  popularRoutes = [],
  details: detailsProp,
}: CityContentSectionProps) {
  const details = detailsProp ?? getCityDetails(city.slug);
  const totalRoutes = outgoingRouteCount + incomingRouteCount;
  const sedan = vehicles.find((v) => v.id === 'sedan');
  const innova = vehicles.find((v) => v.id === 'innova');
  const tempo = null; // Tempo Traveller removed from fleet

  const routeFare = (route: Route) => getRouteFare(route, 'sedan');

  return (
    <section className="section-padding bg-[var(--color-bg-primary)]" aria-label={`Complete cab guide for ${city.name}`}>
      <div className="container-site">
        <div className="max-w-4xl mx-auto prose-city">

          {/* ── Primary Introduction ── */}
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-4">
              Cab Service in {city.name} — Complete Guide by UMA TRAVELS
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              UMA TRAVELS is a trusted cab and taxi service provider operating in {city.name}, {city.district} District, {city.state}. 
              Whether you are looking for a <strong>cab in {city.name}</strong>, a <strong>taxi in {city.name}</strong>, 
              or need to book a <strong>car rental in {city.name}</strong>, our service is available 24 hours a day, 7 days a week. 
              We offer transparent per-kilometre pricing, no advance payment requirement, and verified, experienced drivers who know 
              {city.name} and the surrounding region inside out.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Our {city.name} cab service covers every type of travel need — from quick <strong>local cab in {city.name}</strong> rides 
              to school, hospital, or market, to long-distance <strong>outstation taxi from {city.name}</strong> to other major cities. 
              With a fleet of well-maintained vehicles ranging from sedans to Toyota Innova and Tempo Traveller, UMA TRAVELS is the 
              most reliable <strong>taxi service in {city.name}</strong> for individuals, families, and corporate clients alike.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Looking for a <strong>cab near me in {city.name}</strong>? You can book instantly using the form above, or call/WhatsApp 
              us directly. We serve all areas within {city.name} and all major routes connecting {city.name} to cities across 
              {city.state}, West Bengal, Bihar, Odisha, and beyond. We cover {totalRoutes} verified routes to and from {city.name}.
            </p>
          </div>

          {/* ── Local Area Coverage ── */}
          {details && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Areas &amp; Localities We Cover in {city.name}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                Our <strong>local cab service in {city.name}</strong> reaches every major neighbourhood, colony, and commercial
                area across {city.district} district. Popular pickup and drop localities in {city.name}
                {details.region ? ` (${details.region})` : ''} include:
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

          {/* ── Landmarks & Pickup Points ── */}
          {details && details.landmarks.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Key Landmarks &amp; Pickup Points in {city.name}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                Not sure how to describe your pickup point? Use these well-known landmarks and transport terminals —
                our {city.name} drivers know them all:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {details.landmarks.map((landmark) => (
                  <li
                    key={landmark}
                    className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]"
                  >
                    <span className="text-[var(--color-gold-400)] mt-0.5">•</span>
                    <span>{landmark}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── How to Reach ── */}
          {details && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                How to Reach {city.name} — Road, Rail &amp; Air Connectivity
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                {city.name} is well connected to the rest of {city.state} and neighbouring states. Here is how travellers
                typically arrive, and how UMA TRAVELS can pick you up:
              </p>

              <div className="space-y-4">
                <div className="card-dark p-5">
                  <h3 className="font-bold mb-1.5 flex items-center gap-2">
                    By Road
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {details.connectivity.road}
                  </p>
                </div>
                <div className="card-dark p-5">
                  <h3 className="font-bold mb-1.5">By Rail</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {details.connectivity.rail}
                  </p>
                </div>
                <div className="card-dark p-5">
                  <h3 className="font-bold mb-1.5">By Air</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {details.connectivity.air}
                  </p>
                </div>
              </div>

              {details.highways.length > 0 && (
                <div className="mt-5">
                  <p className="font-bold text-sm mb-2">Key highways / major roads serving {city.name}:</p>
                  <div className="flex flex-wrap gap-2">
                    {details.highways.map((highway) => (
                      <span
                        key={highway}
                        className="px-3 py-1 rounded-full text-xs border border-[var(--color-border)] text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)]"
                      >
                        {highway}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Popular Routes from City (real route + fare data) ── */}
          {popularRoutes.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Popular Cab Routes from {city.name}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                These are among the most frequently booked outstation and one-way cab routes from {city.name}.
                Each route page shows vehicle-wise fares, road distance, drive time, and instant booking.
                Indicative sedan one-way fares are shown below.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {popularRoutes.map((route) => (
                  <Link
                    key={route.id}
                    href={`/routes/${route.originSlug}-to-${route.destinationSlug}/`}
                    className="card-dark group p-4 rounded-xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                        {city.name} → {route.destinationName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ~{route.approxDistanceKm} km · from ₹{routeFare(route).toLocaleString('en-IN')} (sedan)
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                      Book →
                    </span>
                  </Link>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-3 leading-relaxed">
                Fares are indicative one-way sedan estimates and are confirmed at booking. UMA TRAVELS covers
                {' '}{totalRoutes} routes to and from {city.name} across {city.state} and neighbouring states.
              </p>
            </div>
          )}

          {/* ── Services in City ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              All Cab &amp; Taxi Services Available in {city.name}
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              UMA TRAVELS offers a comprehensive range of cab and taxi services in {city.name} to match every travel requirement:
            </p>

            <div className="space-y-5">
              {/* Local Cab */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Local Cab Service in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Our <strong>local cab service in {city.name}</strong> is designed for city rides — hospital visits, school drops, 
                  market runs, railway station transfers, and general errands within the city limits. We offer hourly packages and 
                  point-to-point bookings. Whether you need a <strong>{city.name} cab</strong> for a one-hour errand or a full-day 
                  local hire, our drivers are punctual, courteous, and familiar with every locality in {city.name}. 
                  Search for <em>local taxi in {city.name}</em> or <em>city cab {city.name}</em> — UMA TRAVELS shows up.
                </p>
              </div>

              {/* Outstation Cab */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Outstation Cab from {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Planning a trip outside {city.name}? Our <strong>outstation taxi from {city.name}</strong> covers hundreds of 
                  intercity and interstate routes. Whether you need an <strong>outstation cab in {city.name}</strong> for a same-day 
                  trip or a multi-day outstation journey, we have the right vehicle and an experienced driver for the route. 
                  All our outstation vehicles are commercially licensed with valid interstate tourist permits. 
                  Pricing is transparent with no hidden return charges for one-way bookings.
                </p>
              </div>

              {/* One-Way Cab */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  One-Way Cab from {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Looking for a <strong>one-way taxi from {city.name}</strong>? UMA TRAVELS offers affordable one-way cab bookings 
                  where you pay only for the distance travelled — no return charge. 
                  Our <strong>one-way cab in {city.name}</strong> is perfect for travellers relocating, visiting family, or making 
                  single-direction intercity trips. We cover {outgoingRouteCount} verified outstation routes departing from {city.name}. 
                  Book a <em>one-way cab from {city.name}</em> today and save on travel costs.
                </p>
              </div>

              {/* Airport Transfer */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Airport Cab from {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Need an <strong>airport cab from {city.name}</strong>? UMA TRAVELS provides reliable airport transfer service 
                  from {city.name} to Birsa Munda Airport (Ranchi), Netaji Subhas Chandra Bose International Airport (Kolkata), 
                  and Deoghar Airport. Our <strong>airport taxi in {city.name}</strong> ensures you reach the airport on time 
                  with no last-minute stress. We also offer arrival pickup — book in advance and our driver will be waiting for you.
                </p>
              </div>

              {/* Corporate Cab */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Corporate Cab Service in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  UMA TRAVELS is a preferred <strong>corporate cab provider in {city.name}</strong> for businesses, factories, 
                  and government offices across {city.state}. We offer scheduled employee transport, executive cab arrangements, 
                  and multi-city travel coordination. Our <strong>corporate taxi in {city.name}</strong> fleet is professionally 
                  maintained, and drivers are punctual and presentable. Contact us for monthly or project-based corporate packages.
                </p>
              </div>

              {/* Wedding Car */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Wedding Cab &amp; Car Rental in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Planning a wedding in {city.name}? Our <strong>wedding cab service in {city.name}</strong> provides premium 
                  decorated cars for baraat processions, bride and groom transfers, and guest transportation. 
                  Choose from our sedan, Toyota Innova, or luxury SUV fleet for your special day. 
                  We also offer <strong>wedding car rental in {city.name}</strong> with driver — a trusted choice for 
                  memorable weddings across {city.district} district.
                </p>
              </div>

              {/* Car Rental */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Car Rental in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Need <strong>car rental in {city.name}</strong>? UMA TRAVELS provides self-drive-style 
                  outstation car rental with verified driver across {city.name} and {city.district} district.
                  Our <strong>{city.name} car rental service</strong> is available for local use, outstation trips, 
                  corporate travel, airport transfers, and wedding bookings.
                  Choose from sedan, Ertiga, Toyota Innova, or Tempo Traveller — all commercially licensed with 
                  interstate tourist permits. <em>Car rental near me in {city.name}</em> — book in minutes.
                </p>
              </div>

              {/* Cab Near Me */}
              <div className="card-dark p-5">
                <h3 className="text-lg font-bold mb-2">
                  Cab Near Me in {city.name} — Instant Booking
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Searching for a <strong>cab near me in {city.name}</strong> or a <strong>taxi near me in {city.name}</strong>?
                  UMA TRAVELS has drivers positioned across {city.name} and is available 24/7 for instant cab bookings.
                  Whether you need a cab for local pickup, a station transfer, or an outstation trip — 
                  use the booking form above or WhatsApp/call us directly. We serve all localities in {city.name}, 
                  all major landmarks, and all transport terminals. UMA TRAVELS is your trusted{' '}
                  <strong>cab service near me in {city.name}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* ── Vehicle-Specific Keyword Content ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Cab &amp; Taxi Vehicle Options in {city.name}
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
              UMA TRAVELS operates a diverse fleet in {city.name} to suit every group size and budget. Here is what is available:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sedan */}
              <div className="card-dark p-5">
                <h3 className="font-bold mb-2">
                  Sedan Cab in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Our <strong>sedan cab in {city.name}</strong> (Swift Dzire, Honda Amaze, Hyundai Xcent) seats up to 4 passengers 
                  and is ideal for individuals, couples, and small families. Starting from ₹{sedan?.displayRatePerKm ?? 14}/km, 
                  it is the most economical option for both local and intercity travel from {city.name}.
                </p>
              </div>

              {/* Innova */}
              <div className="card-dark p-5">
                <h3 className="font-bold mb-2">
                  Innova Cab in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  The <strong>Innova cab in {city.name}</strong> (Toyota Innova Crysta / HyCross) is India&apos;s most trusted 
                  7-seater for premium travel. Perfect for families, corporate groups, and long-distance outstation trips. 
                  Book an <strong>Innova taxi in {city.name}</strong> at ₹{innova?.displayRatePerKm ?? 20}/km with UMA TRAVELS.
                </p>
              </div>

              {/* 7 Seater */}
              <div className="card-dark p-5">
                <h3 className="font-bold mb-2">
                  7 Seater Cab in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Looking for a <strong>7 seater cab in {city.name}</strong>? We offer the Toyota Innova Crysta 
                  (7 seats) as our standard 7-seater option. Perfect for larger family trips, group outings, 
                  and corporate travel from {city.name}. Book a <strong>7 seater taxi in {city.name}</strong> today.
                </p>
              </div>

              {/* Tempo Traveller */}
              <div className="card-dark p-5">
                <h3 className="font-bold mb-2">
                  Tempo Traveller in {city.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  For groups of 12 to 17 people, our <strong>Tempo Traveller in {city.name}</strong> is the perfect solution. 
                  Available for pilgrimages, group tours, corporate outings, and wedding baraat processions from {city.name}. 
                  Starting from ₹22/km for the Force Traveller.
                </p>
              </div>
            </div>
          </div>

          {/* ── Nearby Attractions & Day Trips ── */}
          {details && details.attractions.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Nearby Attractions &amp; Day Trips from {city.name}
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-5">
                Planning a leisure trip? UMA TRAVELS arranges round-trip and full-day cab packages from {city.name}
                to these popular attractions and getaways:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.attractions.map((attraction) => (
                  <div
                    key={attraction.name}
                    className="card-dark p-4 rounded-xl border border-slate-200/90 bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-sm text-slate-900">{attraction.name}</p>
                      <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {attraction.distance}
                      </span>
                    </div>
                    {attraction.note && (
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{attraction.note}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-3 leading-relaxed">
                Distances are approximate road distances from {city.name}. Ask us for a personalised day-trip or
                multi-day itinerary with a dedicated cab and driver.
              </p>
            </div>
          )}

          {/* ── Best Time & Local Tips ── */}
          {details && (
            <div className="mb-10">
              <h2 className="text-2xl font-black mb-4">
                Best Time to Visit {city.name} &amp; Local Travel Tips
              </h2>

              <div className="card-dark p-5 mb-4">
                <h3 className="font-bold mb-1.5">Best Time to Visit {city.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {details.bestTime}
                </p>
              </div>

              {details.tips.length > 0 && (
                <div className="mb-4">
                  <p className="font-bold text-sm mb-2">Travel tips for {city.name}:</p>
                  <ul className="space-y-1.5">
                    {details.tips.map((tip) => (
                      <li key={tip} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                        <span className="text-[var(--color-gold-400)] mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {details.localNote && (
                <div className="card-dark p-5">
                  <h3 className="font-bold mb-1.5">Local Insight</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {details.localNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Why UMA TRAVELS in City ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Why Choose UMA TRAVELS for Cab Booking in {city.name}?
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              When searching for a <strong>cab near me in {city.name}</strong> or a reliable <strong>taxi company in {city.name}</strong>, 
              here is why thousands of passengers across {city.state} choose UMA TRAVELS:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {[
                { title: 'Transparent Pricing', desc: `No hidden charges. All ${city.name} cab fares are calculated on a per-km basis and confirmed before your journey begins.` },
                { title: 'Zero Advance Required', desc: `Book a cab from ${city.name} without paying any advance. Pay the driver directly after your trip is complete.` },
                { title: 'Verified Drivers', desc: `All our ${city.name} taxi drivers have valid commercial licenses, police verification, and route experience across ${city.state}.` },
                { title: '24/7 Availability', desc: `Need a cab in ${city.name} at midnight or early morning? UMA TRAVELS operates round the clock, every day of the year.` },
                { title: 'Clean, AC Vehicles', desc: `Every vehicle in our ${city.name} fleet is air-conditioned, regularly serviced, and thoroughly cleaned before each trip.` },
                { title: 'Wide Route Network', desc: `With ${totalRoutes} verified routes connecting ${city.name} to destinations across ${city.state} and beyond, we cover wherever you need to go.` },
                { title: 'Interstate Permits', desc: `Our cabs from ${city.name} carry valid interstate tourist permits — so you can travel to West Bengal, Bihar, Odisha, and other states without any legal hassle.` },
                { title: 'Corporate & Wedding', desc: `We offer specialised packages for corporate clients and wedding bookings in ${city.name} with flexible arrangements and professional service.` },
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

          {/* ── How to Book ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              How to Book a Cab in {city.name} — Step by Step
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Booking a <strong>taxi in {city.name}</strong> with UMA TRAVELS is simple and takes less than 2 minutes:
            </p>
            <ol className="space-y-3">
              {[
                { step: 1, title: 'Fill the Booking Form', desc: `Use the booking form on this page or call/WhatsApp us. Enter your pickup location in ${city.name}, destination, date, and time.` },
                { step: 2, title: 'Choose Your Vehicle', desc: `Select the vehicle category that fits your group size and budget — from sedan to Innova or Tempo Traveller.` },
                { step: 3, title: 'Get Fare Confirmation', desc: `Our team will confirm the exact fare for your ${city.name} cab booking before any commitment. No surprises.` },
                { step: 4, title: 'Driver Assignment', desc: `Once confirmed, we assign a verified driver from ${city.name}. You receive driver contact details before the trip.` },
                { step: 5, title: 'Travel Comfortably', desc: `Your driver arrives on time at your ${city.name} pickup point. Pay only after completing your journey — no advance needed.` },
              ].map((item) => (
                <li
                  key={item.step}
                  className="card-dark group p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-md transition-all duration-200 flex gap-4 items-center"
                >
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-bold text-sm mb-0.5 text-slate-900 group-hover:text-amber-800 transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ── City Context & LLM Content ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              About {city.name} &amp; Travel Connectivity
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              {city.excerpt}
            </p>
            {details?.localNote && (
              <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {details.localNote}
              </p>
            )}
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              {city.name} is located in {city.district} District, {city.state}. It is well-connected by road to major cities 
              in {city.state} and neighbouring states. UMA TRAVELS has been serving passengers from {city.name} with reliable 
              taxi and cab services, building a reputation for punctuality, safety, and honest pricing.
            </p>
            {city.nearbyTerminals && city.nearbyTerminals.length > 0 && (
              <div className="mb-4">
                <p className="font-bold text-sm mb-2">Key Transport Terminals in or near {city.name}:</p>
                <ul className="space-y-1">
                  {city.nearbyTerminals.map((terminal) => (
                    <li key={terminal} className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                      <span className="text-[var(--color-gold-400)]">•</span>
                      {terminal} — UMA TRAVELS provides pickup and drop service from this terminal
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {city.travelPurposes && city.travelPurposes.length > 0 && (
              <div className="mb-4">
                <p className="font-bold text-sm mb-2">Common Reasons People Travel To &amp; From {city.name}:</p>
                <ul className="space-y-1">
                  {city.travelPurposes.map((purpose) => (
                    <li key={purpose} className="text-sm text-[var(--color-text-secondary)] flex items-center gap-2">
                      <span className="text-[var(--color-gold-400)]">•</span>
                      {purpose}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Fare Information ── */}
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-4">
              Cab Fare in {city.name} — What to Expect
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              UMA TRAVELS uses a straightforward <strong>per-kilometre pricing model</strong> for all {city.name} cab bookings. 
              Here is a quick overview of approximate rates:
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
                  {vehicles.map((v, i) => (
                    <tr
                      key={v.id}
                      className={`border-b border-[var(--color-border)] ${i % 2 === 0 ? '' : 'bg-[var(--color-bg-secondary)]'}`}
                    >
                      <td className="px-4 py-3 font-medium">{v.name}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">{v.seatingCapacity}</td>
                      <td className="px-4 py-3 text-[var(--color-gold-400)] font-bold">₹{v.displayRatePerKm ?? v.basePerKm}/km</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">{v.bestFor[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mt-3 leading-relaxed">
              * Rates shown are base per-km rates effective for {city.name} bookings. Minimum fare applies. 
              Toll charges (where applicable) are extra and payable by passenger. Driver allowance applies for overnight trips. 
              Final fare is confirmed at booking.
            </p>
          </div>

          {/* ── LLM-Optimized Q&A Content ── */}
          <div className="mb-6">
            <h2 className="text-2xl font-black mb-4">
              {city.name} Cab Service — Quick Answers
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `What is the best cab service in ${city.name}?`,
                  a: `UMA TRAVELS is a highly rated cab service in ${city.name}, ${city.state}. We offer local, outstation, one-way, round-trip, airport transfer, corporate, and wedding cab services with transparent pricing and verified drivers.`,
                },
                {
                  q: `Is there a taxi service available near me in ${city.name}?`,
                  a: `Yes. UMA TRAVELS operates throughout ${city.name} and the surrounding ${city.district} district. You can book a cab near you in ${city.name} by using the booking form above or calling/WhatsApp-ing our team directly.`,
                },
                {
                  q: `Which areas of ${city.name} do you cover?`,
                  a: `UMA TRAVELS provides cab pickup and drop across ${city.name}${details ? ` including ${details.localities.slice(0, 6).join(', ')}, and more` : ''}. Share any landmark or locality and our driver will reach you.`,
                },
                {
                  q: `How much does a cab cost in ${city.name}?`,
                  a: `Cab fares in ${city.name} with UMA TRAVELS start from ₹${sedan?.displayRatePerKm ?? 14}/km for a sedan. Toyota Innova and 7-seater options start from ₹${innova?.displayRatePerKm ?? 20}/km. Local city rides start from a minimum of ₹500.`,
                },
                {
                  q: `Can I book an Innova cab in ${city.name}?`,
                  a: `Yes. UMA TRAVELS offers Toyota Innova Crysta and HyCross cab bookings in ${city.name} for local trips, outstation travel, airport transfers, and wedding car hire. The Innova seats 7 passengers comfortably.`,
                },
                {
                  q: `What is the best time to visit ${city.name}?`,
                  a: `${details ? details.bestTime : `The best time to travel to and around ${city.name} is generally October to March.`} UMA TRAVELS runs cabs in ${city.name} all year round, 24/7.`,
                },
                {
                  q: `Does UMA TRAVELS provide cab service from ${city.name} to other cities?`,
                  a: `Yes. UMA TRAVELS covers ${outgoingRouteCount} outgoing routes from ${city.name} to major cities across ${city.state}, West Bengal, Bihar, Odisha, Chhattisgarh, and Uttar Pradesh.`,
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

