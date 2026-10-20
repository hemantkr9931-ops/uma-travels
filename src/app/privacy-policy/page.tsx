import type { Metadata } from 'next';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy — Data Protection & Passenger Safety',
  description:
    'Learn how UMA TRAVELS collects, protects, and handles personal data for taxi booking, passenger communications, and driver dispatch in accordance with Indian IT laws.',
  canonicalPath: '/privacy-policy/',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pb-10">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Last Updated: October 2026 | UMA TRAVELS (Dhanbad, Jharkhand, India)
          </p>
        </div>
      </PageHero>

      <div className="container-site max-w-4xl">
        <div className="card p-8 md:p-12 mt-6">
          <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                1. Information We Collect
              </h2>
              <p>
                When you enquire or book a cab through our website, mobile interface, or customer helpline, we collect only information essential to dispatching and completing your journey safely:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong className="text-[var(--color-text-primary)]">Contact Details:</strong> Name, phone number, and email address for ride confirmation and invoice delivery.</li>
                <li><strong className="text-[var(--color-text-primary)]">Itinerary Details:</strong> Pickup address, destination, date, preferred time, and passenger count.</li>
                <li><strong className="text-[var(--color-text-primary)]">Payment Information:</strong> Transaction status and reference IDs. We never store credit/debit card numbers or UPI PINs on our servers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                2. How We Use Your Data
              </h2>
              <p>
                We use your details strictly for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Assigning verified drivers and sending vehicle dispatch notifications via SMS/WhatsApp.</li>
                <li>Providing customer support and real-time transit coordination during your trip.</li>
                <li>Generating GST invoices and travel receipts upon request.</li>
              </ul>
              <p className="mt-2">
                <strong className="text-[var(--color-text-primary)]">We never sell, rent, or trade your personal information to third-party telemarketers or advertisers.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                3. Data Security
              </h2>
              <p>
                All communications on our platform are secured using standard HTTPS encryption. Driver partners receive passenger phone numbers strictly for trip execution and are bound by privacy guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                4. Contact Our Privacy Team
              </h2>
              <p>
                For questions regarding your data or to request record removal, email us at{' '}
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-[var(--color-gold-400)] underline">
                  {SITE_CONFIG.email}
                </a>{' '}
                or visit our Dhanbad office: {SITE_CONFIG.address.full}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
