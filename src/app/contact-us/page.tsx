// Contact Us Page
import type { Metadata } from 'next';
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PageHero from '@/components/common/PageHero';
import EnhancedBookingForm from '@/components/booking/EnhancedBookingForm';
import FareCalculatorSection from '@/components/common/FareCalculatorSection';
import { SITE_CONFIG, getPhoneUrl, getWhatsAppUrl } from '@/lib/config';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact UMA TRAVELS \u2014 Cab Booking, Dhanbad | Phone, WhatsApp & Email',
  description:
    'Contact UMA TRAVELS for cab bookings, corporate travel arrangements, and enquiries. Call or WhatsApp: +91 8789774460. Email: umatravelsbooking@gmail.com. Headquarters: Damkara, Barwadda, Dhanbad, Jharkhand 826004.',
  canonicalPath: '/contact-us/',
});

export default function ContactPage() {
  const waUrl = getWhatsAppUrl('Hello, I would like to book a cab with UMA TRAVELS.');

  return (
    <>
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      <PageHero>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact info */}
            <div className="w-full order-2 lg:order-1 glass rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80">
              <span className="section-label">Get In Touch</span>
              <h1 className="text-3xl md:text-4xl font-black mb-4">
                Contact UMA TRAVELS
              </h1>
              <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                For cab bookings, fare enquiries, corporate travel arrangements, or any other questions — reach us through the channels below. We aim to respond promptly to all enquiries during business hours.
              </p>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4 p-5 card-dark">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-gold-glow)', border: '1px solid var(--color-border-gold)' }}>
                    <MapPin size={18} style={{ color: 'var(--color-gold-400)' }} />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Office Address</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{SITE_CONFIG.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 card-dark">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-gold-glow)', border: '1px solid var(--color-border-gold)' }}>
                    <Mail size={18} style={{ color: 'var(--color-gold-400)' }} />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Email</p>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-400)] transition-colors">
                      {SITE_CONFIG.email}
                    </a>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      For corporate enquiries and formal communications
                    </p>
                  </div>
                </div>

                {SITE_CONFIG.phone && (
                  <div className="flex items-start gap-4 p-5 card-dark">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-blue-glow)', border: '1px solid var(--color-border-blue)' }}>
                      <Phone size={18} style={{ color: 'var(--color-blue-400)' }} />
                    </div>
                    <div>
                      <p className="font-bold mb-1">Phone</p>
                      <a href={getPhoneUrl()} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-blue-400)] transition-colors">
                        {SITE_CONFIG.phone}
                      </a>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">For immediate bookings and urgent enquiries</p>
                    </div>
                  </div>
                )}

                {SITE_CONFIG.whatsapp && (
                  <div className="flex items-start gap-4 p-5 card-dark">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
                      <MessageCircle size={18} style={{ color: '#25d366' }} />
                    </div>
                    <div>
                      <p className="font-bold mb-1">WhatsApp</p>
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-green-400 transition-colors">
                        {SITE_CONFIG.whatsapp}
                      </a>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">Send your booking details directly</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="flex flex-col gap-3">
                {SITE_CONFIG.whatsapp && (
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp justify-center">
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                  </a>
                )}
                {SITE_CONFIG.phone && (
                  <a href={getPhoneUrl()} className="btn-call justify-center">
                    <Phone size={16} />
                    Call Now
                  </a>
                )}
              </div>
            </div>

            {/* Booking form */}
            <div className="w-full order-1 lg:order-2">
              <div className="glass rounded-2xl p-6" id="booking">
                <h2 className="text-base font-bold mb-1">Send a Booking Enquiry</h2>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">
                  Fill in your trip details and we will respond with availability and a fare quote.
                </p>
                <EnhancedBookingForm />
              </div>
            </div>
        </div>
      </PageHero>

      {/* Fare Calculator */}
      <FareCalculatorSection />
    </>
  );
}
