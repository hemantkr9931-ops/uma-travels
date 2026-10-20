// FAQ Page
import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import { buildMetadata, getFAQSchema } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ — Cab Booking, Fares & Outstation Taxi | UMA TRAVELS Dhanbad',
  description:
    'Frequently asked questions about UMA TRAVELS cab service in Dhanbad, Jharkhand. How to book a cab, taxi fares, outstation travel, Innova cab, car rental, airport transfer, corporate travel, cancellation policy and more.',
  canonicalPath: '/faq/',
});

const FAQ_SECTIONS = [
  {
    section: 'Booking & General',
    faqs: [
      {
        q: 'How do I book a cab with UMA TRAVELS?',
        a: 'You can book a cab by filling the enquiry form on our website, calling us directly, or sending a WhatsApp message. We will confirm availability and provide a final fare before your trip begins.',
      },
      {
        q: 'Is the website booking a confirmed reservation?',
        a: 'No. The booking form on our website is a booking enquiry. We review each enquiry, confirm vehicle availability, and contact you to finalise the booking. A trip is confirmed only after you receive confirmation from UMA TRAVELS.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 24 hours in advance for outstation trips, and 2–4 hours for local city rides. For airport transfers, pilgrimage trips, and wedding car bookings, advance booking of several days is advisable.',
      },
      {
        q: 'Can I change or cancel a booking?',
        a: 'Yes. Please contact us as soon as possible to modify or cancel your booking. Refer to our Cancellation Policy for information about any applicable charges.',
      },
      {
        q: 'Are UMA TRAVELS, Uma Taxi, and Uma Cab Service the same business?',
        a: 'Yes, UMA TRAVELS is also widely searched and known as Uma Taxi, Uma Taxi Service, Uma Cab Service, and Uma Car Rental in Dhanbad and across Jharkhand. All bookings made under these names are handled directly by our official team with verified drivers and 24/7 customer support.',
      },
    ],
  },
  {
    section: 'Fares & Pricing',
    faqs: [
      {
        q: 'How is the fare calculated?',
        a: 'Fares are calculated based on the road distance (in km), vehicle category, and applicable charges such as driver allowance for overnight trips. Use our Fare Estimator for an indicative quote. Final fares are confirmed at the time of booking.',
      },
      {
        q: 'Are tolls included in the fare?',
        a: 'No. Toll charges are not included in the base fare estimate. Applicable tolls are payable by the passenger and depend on the specific route taken.',
      },
      {
        q: 'Are there any hidden charges?',
        a: 'No. We aim to communicate all applicable charges — including driver allowance for overnight trips, waiting time, and toll expectations — before confirming your booking. There are no hidden charges.',
      },
      {
        q: 'What is the minimum fare?',
        a: `A minimum fare applies for all bookings regardless of distance. This is confirmed at the time of booking and varies by vehicle category.`,
      },
    ],
  },
  {
    section: 'Vehicles & Fleet',
    faqs: [
      {
        q: 'What vehicles does UMA TRAVELS offer?',
        a: 'We offer Sedan (up to 4 passengers), Maruti Suzuki Ertiga (6 seats), Toyota Innova (7 seats), Luxury Cars, and Tempo Traveller (12–17 seats). All are air-conditioned.',
      },
      {
        q: 'Can I request a specific vehicle model?',
        a: 'You can express a preference, but we cannot guarantee a specific model. Availability is confirmed at booking. We will inform you of the assigned vehicle before your trip.',
      },
      {
        q: 'Is luggage space available?',
        a: 'Yes. All our vehicles have luggage space suitable for typical travel bags. The Tempo Traveller and Innova have the most generous capacity. Please inform us in advance if you have unusually bulky luggage.',
      },
    ],
  },
  {
    section: 'Outstation & Long-Distance',
    faqs: [
      {
        q: 'What cities does UMA TRAVELS connect to?',
        a: 'UMA TRAVELS provides intercity cab service across Jharkhand (25+ cities), West Bengal (17+ cities), Bihar, Odisha, Chhattisgarh, and Uttar Pradesh. View our Routes page for a complete list.',
      },
      {
        q: 'Is a driver allowance charged for overnight trips?',
        a: 'Yes. A driver allowance applies for trips requiring the driver to stay overnight. This is disclosed at the time of booking.',
      },
      {
        q: 'Can I book a multi-day outstation trip?',
        a: 'Yes. We accommodate multi-day outstation trips with the same vehicle and driver for your duration. Contact us with your itinerary for a custom quote.',
      },
    ],
  },
  {
    section: 'Airport & Corporate',
    faqs: [
      {
        q: 'Which airports does UMA TRAVELS serve?',
        a: 'We primarily serve Birsa Munda Airport (Ranchi) for Jharkhand travellers, and Netaji Subhas Chandra Bose International Airport (Kolkata) for those travelling via West Bengal. Other airports are available upon request.',
      },
      {
        q: 'Does UMA TRAVELS provide corporate travel solutions?',
        a: 'Yes. We offer managed cab services for businesses including executive transport, employee scheduling, client pickups, and multi-city routing. Contact us to discuss your requirements.',
      },
    ],
  },
];

export default function FAQPage() {
  const allFaqs = FAQ_SECTIONS.flatMap((s) => s.faqs.map((f) => ({ question: f.q, answer: f.a })));
  const faqSchema = getFAQSchema(allFaqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <PageHero showMobileBooking>
        <div className="max-w-3xl mx-auto glass rounded-3xl p-7 md:p-9 shadow-2xl border border-white/80">
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Everything you need to know about booking a cab with UMA TRAVELS from Dhanbad, Jharkhand.
          </p>
        </div>
      </PageHero>

      <section className="section-padding" style={{ paddingTop: '3rem' }}>
        <div className="container-site max-w-3xl mx-auto">
          <div className="space-y-10">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.section}>
                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-[var(--color-border)]">
                  {section.section}
                </h2>
                <div className="space-y-3">
                  {section.faqs.map((faq, idx) => (
                    <details key={idx} className="card-dark group">
                      <summary className="list-none cursor-pointer p-5 flex justify-between items-start gap-4">
                        <span className="font-semibold text-sm">{faq.q}</span>
                        <ChevronDown size={16} className="shrink-0 mt-0.5 text-[var(--color-text-muted)] group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-5 pb-5">
                        <hr className="border-[var(--color-border)] mb-4" />
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-[var(--color-text-muted)] text-sm mb-4">
              Still have questions? We are happy to help.
            </p>
            <Link href="/contact-us/" className="btn-primary text-sm px-6 py-2.5">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
