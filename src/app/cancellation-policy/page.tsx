import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG, getPhoneUrl } from '@/lib/config';

export const metadata: Metadata = buildMetadata({
  title: 'Cancellation & Refund Policy — Transparent Cab Services',
  description:
    'Review UMA TRAVELS Cancellation and Refund Policy. Free cancellations up to 3 hours prior to scheduled departure. Zero hidden deductions.',
  canonicalPath: '/cancellation-policy/',
});

export default function CancellationPolicyPage() {
  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pb-10">
      <Breadcrumb items={[{ label: 'Cancellation Policy' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cancellation & Refund Policy
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Last Updated: October 2026 | Fair & Transparent Travel Policies by UMA TRAVELS
          </p>
        </div>
      </PageHero>

      <div className="container-site max-w-4xl">
        <div className="card p-8 md:p-12 mt-6">
          <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                1. Free Cancellation Window
              </h2>
              <p>
                We understand that travel itineraries can change unexpectedly. You may cancel standard local city rides or outstation journeys free of cost up to <strong className="text-[var(--color-text-primary)]">3 hours before</strong> the scheduled pickup time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                2. Late Cancellations & Driver Dispatch
              </h2>
              <p>
                If a cancellation is requested less than 3 hours prior to departure, or after the vehicle has been dispatched from our Dhanbad / regional depot towards your pickup address:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>A nominal dry-run fee (₹300 for local city cabs, ₹500 for outstation sedans/SUVs) may be levied to compensate the driver for fuel and time.</li>
                <li>If the driver has already reached the pickup location and waits beyond 45 minutes with no contact, the trip may be deemed a &ldquo;No Show&rdquo;.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                3. Refund Processing
              </h2>
              <p>
                In cases where an advance token or payment was collected:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Eligible refunds are initiated within 24 to 48 hours via original payment method (UPI, Google Pay, PhonePe, or Bank NEFT).</li>
                <li>In the rare event that UMA TRAVELS cancels a ride due to severe weather, roadblock, or vehicle breakdown without an alternate cab replacement, a 100% full refund is issued instantly.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                4. How to Request Cancellation
              </h2>
              <p>
                To cancel or reschedule a trip, please call our dispatch helpline immediately with your booking reference or phone number:
              </p>
              <div className="mt-4">
                <a href={getPhoneUrl()} className="btn btn-primary text-sm">
                  Call Support: {SITE_CONFIG.phone}
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
