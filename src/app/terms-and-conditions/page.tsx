import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions — Cab Booking & Passenger Agreement',
  description:
    'Read the terms of service governing cab bookings, chauffeur duties, passenger conduct, and liability with UMA TRAVELS.',
  canonicalPath: '/terms-and-conditions/',
});

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pb-10">
      <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Terms & Conditions
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Last Updated: October 2026 | Governing Contract for Travel Services with UMA TRAVELS
          </p>
        </div>
      </PageHero>

      <div className="container-site max-w-4xl">
        <div className="card p-8 md:p-12 mt-6">
          <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By requesting, reserving, or travelling in any vehicle operated or dispatched by UMA TRAVELS, you agree to comply with and be bound by the terms outlined herein, in conjunction with our Booking Policy and Cancellation Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                2. Service Agreement & Vehicles
              </h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Vehicles are maintained in clean, roadworthy, and commercially permitted condition with valid road fitness and commercial insurance.</li>
                <li>In exceptional situations involving mechanical failure or road hazards, UMA TRAVELS reserves the right to arrange an equivalent or upgraded category vehicle at no additional charge to ensure passenger journey continuity.</li>
                <li>The speed and route taken by the driver shall strictly comply with Indian Motor Vehicles Act rules and safety standards. Drivers may refuse unpaved or dangerous bypass routes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                3. Passenger Responsibilities
              </h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Smoking, alcohol consumption, and carrying banned contraband or hazardous substances inside our vehicles are strictly illegal and prohibited.</li>
                <li>Passengers must safeguard personal belongings. UMA TRAVELS is not liable for items left behind, though our lost & found helpline assists in recovery whenever possible.</li>
                <li>Any intentional damage or soiling caused to the vehicle interior requires compensation for detailing or repairs.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                4. Jurisdiction
              </h2>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these terms or services provided by UMA TRAVELS shall be subject to the exclusive jurisdiction of the competent civil courts at Dhanbad, Jharkhand, India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
