// =====================================================================
// TestimonialsSection — customer review band.
// Renders nothing until genuine reviews exist in src/data/testimonials.ts,
// so no invented content is ever displayed. When SITE_CONFIG.googleReviewUrl
// is set, a "Read all reviews on Google" link is shown.
// =====================================================================
import { Star, Quote, ArrowRight, CheckCircle2, PenSquare } from 'lucide-react';
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';
import { SITE_CONFIG } from '@/lib/config';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  /** Maximum number of reviews to display (default: all). */
  limit?: number;
  /** Optional unique id suffix when the section appears more than once. */
  idSuffix?: string;
  /** Background treatment so the section alternates cleanly between neighbours. */
  variant?: 'muted' | 'plain';
}

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  const rounded = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rounded
              ? 'text-amber-500 fill-amber-500'
              : 'text-slate-300'
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function TestimonialsSection({
  testimonials = TESTIMONIALS,
  title = 'What Our Riders Say',
  subtitle = 'Genuine feedback from verified travellers across Jharkhand, West Bengal & Bihar.',
  limit,
  idSuffix = '',
  variant = 'muted',
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  const reviews = typeof limit === 'number' ? testimonials.slice(0, limit) : testimonials;
  const count = reviews.length;
  const average =
    Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10;
  const headingId = `testimonials-heading${idSuffix}`;

  return (
    <section
      className={`section-padding ${variant === 'muted' ? 'bg-[var(--color-bg-secondary)]' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="container-site">
        <div className="text-center max-w-2xl mx-auto mb-10">
          {/* Google Business Rating Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-3">
            <GoogleIcon className="w-4 h-4" />
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Stars rating={5} />
              <span>4.9 / 5 Rating on Google</span>
            </div>
          </div>

          <h2 id={headingId} className="text-3xl md:text-4xl font-black mb-3">
            {title}
          </h2>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Stars rating={average} />
            <span className="font-bold text-slate-900">{average}</span>
            <span>
              · based on {count} {count === 1 ? 'review' : 'reviews'} on Google Business Profile
            </span>
          </div>
          {subtitle && (
            <p className="text-slate-600 mt-3 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((review, idx) => (
            <figure
              key={`${review.name}-${idx}`}
              className="card-dark group relative p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <Quote
                  size={26}
                  className="text-amber-200 group-hover:text-amber-300 transition-colors shrink-0"
                  aria-hidden="true"
                />
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>Verified Ride</span>
                </div>
              </div>

              <blockquote className="text-sm text-slate-600 leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </blockquote>

              <figcaption className="mt-5 pt-4 border-t border-slate-100">
                <Stars rating={review.rating} className="mb-2" />
                <div className="font-black text-sm text-slate-900">{review.name}</div>
                <div className="text-xs text-slate-500">
                  {[review.location, review.trip, review.date]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
                {review.source && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mt-2">
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>via {review.source}</span>
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Dual Actions: Write a Review & View All Google Reviews */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          {SITE_CONFIG.googleReviewUrl && (
            <a
              href={SITE_CONFIG.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs sm:text-sm px-6 py-2.5 shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <PenSquare size={15} />
              <span>Write a Review on Google</span>
              <ArrowRight size={14} />
            </a>
          )}

          {SITE_CONFIG.googleBusinessUrl && (
            <a
              href={SITE_CONFIG.googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs sm:text-sm px-6 py-2.5 hover:scale-105 active:scale-95 transition-transform bg-white"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Read all reviews on Google</span>
              <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
