// =====================================================================
// UMA TRAVELS — City Details (Local SEO content layer)
// Rich, city-specific information used by city pages for local SEO,
// geo targeting and LLM-friendly answers.
// =====================================================================

export interface CityAttraction {
  /** Attraction / place name */
  name: string;
  /** Approximate road distance from the city, e.g. "48 km" */
  distance: string;
  /** Short one-line note */
  note?: string;
}

export interface CityConnectivity {
  /** How the city is connected by road (highways, key cities + distances) */
  road: string;
  /** Rail connectivity — main station(s) and lines */
  rail: string;
  /** Nearest airport(s) and approximate distance */
  air: string;
}

export interface CityDetails {
  /** Must match the Location.slug */
  slug: string;
  /** Administrative division / region within the state */
  region: string;
  /** Neighbourhoods, localities and areas the cab service covers */
  localities: string[];
  /** Popular landmarks and pickup/drop points */
  landmarks: string[];
  /** Key highways / major roads serving the city */
  highways: string[];
  /** Road / rail / air connectivity */
  connectivity: CityConnectivity;
  /** Nearby attractions and day-trip destinations */
  attractions: CityAttraction[];
  /** Best time / season to visit */
  bestTime: string;
  /** Unique, city-specific local insight (economy, culture, identity) */
  localNote: string;
  /** Practical local travel tips */
  tips: string[];
}

export function makeCityDetails<T extends CityDetails>(details: T): T {
  return details;
}
