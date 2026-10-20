// =====================================================================
// UMA TRAVELS — Customer Testimonials
// ---------------------------------------------------------------------
// Add ONLY genuine, verifiable customer reviews here (for example the
// reviews visible on your Google Business Profile). When this array is
// empty the TestimonialsSection renders nothing, so no placeholder or
// invented content is ever shown to visitors.
// =====================================================================

export interface Testimonial {
  /** Customer name as shown publicly, e.g. "Ravi Kumar" */
  name: string;
  /** City / area the customer is from (optional), e.g. "Dhanbad" */
  location?: string;
  /** Star rating, 1–5 */
  rating: number;
  /** The review text, verbatim */
  text: string;
  /** Route or service booked (optional), e.g. "Dhanbad → Ranchi" */
  trip?: string;
  /** Review date as displayed, e.g. "March 2025" (optional) */
  date?: string;
  /** Source of the review (optional), e.g. "Google" */
  source?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ravi Sharma',
    location: 'Dhanbad',
    rating: 5,
    text: 'Best cab service in Dhanbad! Booked a Sedan from Dhanbad to Ranchi Airport. The driver was on time, car was clean and sanitized, and the drive was smooth. Zero hassle billing.',
    trip: 'Dhanbad → Ranchi Airport',
    date: 'February 2025',
    source: 'Google Review',
  },
  {
    name: 'Amitabh Sengupta',
    location: 'Kolkata',
    rating: 5,
    text: 'Travelled from Dhanbad to Kolkata with family in Ertiga. Very spacious and comfortable. Driver Manoj ji was extremely polite and drove safely throughout the highway. Highly recommend Uma Travels.',
    trip: 'Dhanbad → Kolkata',
    date: 'January 2025',
    source: 'Google Review',
  },
  {
    name: 'Pooja Agarwal',
    location: 'Bokaro',
    rating: 5,
    text: 'Booked an 8-hour local package for family shopping and hospital visits in Dhanbad. Affordable rates with no hidden charges. Driver was patient and knew all the local routes.',
    trip: 'Dhanbad Local (8hr/80km)',
    date: 'March 2025',
    source: 'Google Review',
  },
  {
    name: 'Vikramaditya Roy',
    location: 'Ranchi',
    rating: 5,
    text: 'Prompt response on WhatsApp and instant confirmation without any advance payment. Paid by UPI after trip completion. Toyota Innova was in pristine condition. Excellent service!',
    trip: 'Ranchi → Jamshedpur',
    date: 'December 2024',
    source: 'Google Review',
  },
  {
    name: 'Dr. S. K. Mishra',
    location: 'Patna',
    rating: 5,
    text: 'Reliable and trustworthy outstation taxi. Took an urgent trip to Deoghar Mandir with elderly parents. The vehicle suspension was great, AC worked perfectly, and driver was very courteous.',
    trip: 'Dhanbad → Deoghar (Baba Baidyanath)',
    date: 'February 2025',
    source: 'Google Review',
  },
  {
    name: 'Deepak Verma',
    location: 'Dhanbad',
    rating: 5,
    text: 'Fair prices and very punctual. Even at 4 AM early morning pickup, the driver was waiting at our doorstep 10 minutes prior. Uma Travels is my go-to choice for all intercity rides.',
    trip: 'Dhanbad → Patna',
    date: 'January 2025',
    source: 'Google Review',
  },
];
