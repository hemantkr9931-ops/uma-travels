// =====================================================================
// UMA TRAVELS — City Details combined index
// Merges all per-state city detail records and exposes a slug lookup.
// =====================================================================
import type { CityDetails } from './types';
import { jharkhandCityDetails } from './jharkhand';
import { westBengalCityDetails } from './west-bengal';
import { odishaCityDetails } from './odisha';
import { biharCityDetails } from './bihar';
import { uttarPradeshCityDetails } from './uttar-pradesh';

export type { CityAttraction, CityConnectivity, CityDetails } from './types';

export const ALL_CITY_DETAILS: CityDetails[] = [
  ...jharkhandCityDetails,
  ...westBengalCityDetails,
  ...odishaCityDetails,
  ...biharCityDetails,
  ...uttarPradeshCityDetails,
];

const CITY_DETAILS_BY_SLUG: Record<string, CityDetails> = ALL_CITY_DETAILS.reduce(
  (acc, details) => {
    acc[details.slug] = details;
    return acc;
  },
  {} as Record<string, CityDetails>,
);

export function getCityDetails(slug: string): CityDetails | undefined {
  return CITY_DETAILS_BY_SLUG[slug];
}

export function hasCityDetails(slug: string): boolean {
  return slug in CITY_DETAILS_BY_SLUG;
}
