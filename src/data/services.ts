// =====================================================================
// UMA TRAVELS — Services Data
// Defines the 7 core service categories with metadata.
// =====================================================================

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  icon: string; // lucide icon name
  description: string;
  longDescription: string;
  features: string[];
  applicableOnRoutePages: boolean; // false for Local Cab
  applicableOnCityPages: boolean;
  cta: string;
}

export const SERVICES: Service[] = [
  {
    id: 'local-cab',
    name: 'Local Cab Service',
    slug: 'local-cab',
    shortName: 'Local Cab',
    icon: 'MapPin',
    description:
      'Comfortable and reliable cab service within the city for daily commutes, errands, appointments, and short trips.',
    longDescription:
      'UMA TRAVELS provides dependable local cab service within Dhanbad and other cities. Whether you need a ride to the railway station, a visit to the hospital, or help with errands around town, our trained drivers offer a safe and comfortable experience. Hourly, half-day, and full-day packages are available to suit your schedule.',
    features: [
      'City-wide coverage',
      '4hr/40km and 8hr/80km hourly packages',
      'Experienced local drivers',
      'Air-conditioned vehicles',
      'Flexible pickup times',
    ],
    applicableOnRoutePages: false,
    applicableOnCityPages: true,
    cta: 'Book Local Cab',
  },
  {
    id: 'one-way-cab',
    name: 'One-Way Cab',
    slug: 'one-way-cab',
    shortName: 'One-Way',
    icon: 'Navigation',
    description:
      'Affordable one-way intercity cab service — pay only for the distance you travel, without return-fare obligations.',
    longDescription:
      'Our one-way cab service is designed for travellers who need to reach a destination without planning a return trip. We offer transparent per-kilometre pricing with no hidden costs. Whether you are travelling from Dhanbad to Ranchi or across state borders, UMA TRAVELS will get you there safely and on time.',
    features: [
      'Pay only for one-way distance',
      'No hidden return charges',
      'Transparent per-km pricing',
      'Available for all intercity routes',
      'Multiple vehicle categories',
    ],
    applicableOnRoutePages: true,
    applicableOnCityPages: true,
    cta: 'Book One-Way Cab',
  },
  {
    id: 'outstation-taxi',
    name: 'Outstation Taxi',
    slug: 'outstation-cab',
    shortName: 'Outstation',
    icon: 'Car',
    description:
      'Reliable outstation taxi for multi-day trips, pilgrimages, family travel, and extended intercity journeys.',
    longDescription:
      'Planning a trip to Deoghar, Puri, Varanasi, or any major destination? UMA TRAVELS outstation taxi service ensures you travel in comfort with an experienced driver who knows the route. Our fleet includes sedans, SUVs, and larger vehicles for groups. Driver allowance and multi-day tour packages are available on request.',
    features: [
      'Experienced outstation drivers',
      'Multiple vehicle options',
      'Driver allowance included for overnight trips',
      'Flexible pickup and drop-off',
      'Transparent outstation pricing',
    ],
    applicableOnRoutePages: true,
    applicableOnCityPages: true,
    cta: 'Book Outstation Taxi',
  },
  {
    id: 'round-trip-cab',
    name: 'Round-Trip Cab',
    slug: 'round-trip-cab',
    shortName: 'Round-Trip',
    icon: 'RotateCcw',
    description:
      'Convenient round-trip cab bookings with the same driver and vehicle for a worry-free return journey.',
    longDescription:
      'With UMA TRAVELS round-trip cab service, you get the same vehicle and driver for your return journey, ensuring consistency and peace of mind. Ideal for same-day or multi-day trips where you need guaranteed return transport. Fare calculation accounts for actual return distance and waiting time where applicable.',
    features: [
      'Same vehicle and driver for return',
      'Guaranteed return transport',
      'Waiting time options available',
      'Suitable for same-day and multi-day trips',
      'Transparent round-trip pricing',
    ],
    applicableOnRoutePages: true,
    applicableOnCityPages: true,
    cta: 'Book Round-Trip',
  },
  {
    id: 'wedding-car-rental',
    name: 'Wedding Car Rental',
    slug: 'wedding-car-rental',
    shortName: 'Wedding',
    icon: 'Heart',
    description:
      'Premium decorated car rental for weddings, baraat processions, and special occasions. Make your special day memorable.',
    longDescription:
      'Your wedding day deserves the finest travel arrangements. UMA TRAVELS offers premium cars for baraat processions, bride and groom transfers, and guest transportation. Our vehicles can be arranged with decoration coordination and experienced, professionally-presented drivers. Contact us for customised wedding travel packages.',
    features: [
      'Premium vehicles for weddings',
      'Decoration coordination available',
      'Professionally presented drivers',
      'Guest transportation arrangements',
      'Customised wedding packages on request',
    ],
    applicableOnRoutePages: false,
    applicableOnCityPages: true,
    cta: 'Enquire for Wedding',
  },
  {
    id: 'corporate-travel',
    name: 'Corporate Travel',
    slug: 'corporate-travel',
    shortName: 'Corporate',
    icon: 'Briefcase',
    description:
      'Managed corporate cab services for businesses, scheduled employee transport, and executive travel across the region.',
    longDescription:
      'UMA TRAVELS provides reliable corporate travel solutions for businesses in Dhanbad and the wider Jharkhand region. Our corporate services include scheduled employee transportation, executive cab arrangements, airport and station pickups for visiting clients, and multi-city travel coordination. Contact us to discuss a customised corporate travel arrangement.',
    features: [
      'Scheduled corporate transportation',
      'Executive cab service',
      'Airport and station pickups for clients',
      'Multi-city route support',
      'Corporate billing arrangements on request',
    ],
    applicableOnRoutePages: true,
    applicableOnCityPages: true,
    cta: 'Enquire Corporate Travel',
  },
  {
    id: 'airport-transfer',
    name: 'Airport Transfer',
    slug: 'airport-transfer',
    shortName: 'Airport Transfer',
    icon: 'Plane',
    description:
      'Timely and reliable airport pickup and drop service from Dhanbad, Ranchi, Bokaro, and Jamshedpur.',
    longDescription:
      'Never miss a flight with UMA TRAVELS reliable airport transfer service. We provide timely pickups from your home, hotel, or office and drop you to the nearest airport: Birsa Munda Airport (Ranchi) for most Jharkhand travellers, or Netaji Subhas Chandra Bose International Airport (Kolkata) for international flights. We also provide airport arrival pickup services. Track your flight and arrange advance bookings for peace of mind.',
    features: [
      'Timely airport pickup and drop',
      'Service to Ranchi and Kolkata airports',
      'Meet-and-greet on arrival',
      'Flight-aware scheduling on request',
      'All vehicle categories available',
    ],
    applicableOnRoutePages: true,
    applicableOnCityPages: true,
    cta: 'Book Airport Transfer',
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
