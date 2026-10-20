'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, Phone } from 'lucide-react';
import { getPhoneUrl, SITE_CONFIG } from '@/lib/config';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div className="container-site max-w-2xl mx-auto text-center">
        <span className="section-label inline-flex items-center gap-1.5">
          <AlertTriangle size={14} /> Something went wrong
        </span>

        <h1 className="text-3xl md:text-4xl font-black mt-3 mb-4">
          We hit an unexpected bump in the road
        </h1>

        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Sorry for the inconvenience. Please try again — if the problem persists, call us and we
          will book your cab directly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => retry()} className="btn-primary inline-flex items-center gap-2" type="button">
            <RotateCcw size={16} /> Try again
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            <Home size={16} /> Back to home
          </Link>
          <a
            href={getPhoneUrl()}
            className="btn-call inline-flex items-center gap-2"
            aria-label={`Call UMA TRAVELS at ${SITE_CONFIG.phone}`}
          >
            <Phone size={16} /> Call us
          </a>
        </div>
      </div>
    </section>
  );
}
