import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG, getPhoneUrl, getWhatsAppUrl } from '@/lib/config';

export const metadata: Metadata = buildMetadata({
  title: 'Booking Policy — Terms, Confirmation & Fare Rules',
  description:
    'Read the official Booking Policy of UMA TRAVELS. Learn about advance reservations, fare inclusions, night charges, toll rules, and transparent billing.',
  canonicalPath: '/booking-policy/',
});

export default function BookingPolicyPage() {
  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pb-10">
      <Breadcrumb items={[{ label: 'Booking Policy' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Booking Policy
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Last Updated: October 2026 | Effective for all bookings with UMA TRAVELS (Dhanbad, Jharkhand)
          </p>
        </div>
      </PageHero>

      <div className="container-site max-w-4xl">
        <div className="card p-8 md:p-12 mt-6">
          <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                1. Booking Confirmation & Allotment
              </h2>
              <p>
                All cab bookings made through website enquiry, WhatsApp, or phone call are confirmed subject to vehicle and driver availability. Once your request is received, our dispatch team verifies the schedule, assigns a verified chauffeur, and sends vehicle and driver details via SMS or WhatsApp at least 2 hours before the scheduled pickup time (or immediately for on-demand rides).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                2. Advance Deposit
              </h2>
              <p>
                For standard local and outstation one-way trips, no large upfront deposit is mandatory; full fare or balance is payable upon boarding or completion. For multi-day outstation packages, luxury vehicles, or peak wedding car rentals, an advance token of 20% to 50% may be requested to hold the reservation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                3. Fare Inclusions and Exclusions
              </h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong className="text-[var(--color-text-primary)]">Included:</strong> Vehicle rental, fuel charges, and dedicated chauffeur service.</li>
                <li><strong className="text-[var(--color-text-primary)]">Variable Additions:</strong> Toll taxes, state border entry permits (e.g. crossing Jharkhand into Bihar, West Bengal, or Odisha), and airport parking fees are borne as per actual receipts.</li>
                <li><strong className="text-[var(--color-text-primary)]">Night Allowance:</strong> A standard driver night allowance (₹250–₹350) applies for driving between 10:00 PM and 6:00 AM.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                4. Luggage Guidelines
              </h2>
              <p>
                Sedans accommodate up to 2 large bags and 2 small hand bags. SUVs (Ertiga / Innova) accommodate 3 to 5 bags depending on passenger occupancy. Commercial goods or hazardous materials are strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                5. Contact & Support
              </h2>
              <p>
                For any questions or modifications regarding your reservation, reach our round-the-clock control room:
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <a href={getPhoneUrl()} className="btn btn-primary text-sm">
                  Call {SITE_CONFIG.phone}
                </a>
                <a href={getWhatsAppUrl('Hi UMA TRAVELS, I have a query about booking policy.')} className="btn btn-secondary text-sm" target="_blank" rel="noopener noreferrer">
                  WhatsApp Support
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
