import { ALL_LOCATIONS } from '@/data/locations';

export interface PlaceCoords {
  lat: number;
  lng: number;
  name?: string;
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const MAJOR_REGIONAL_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  // West Bengal
  kolkata: { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
  calcutta: { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
  howrah: { lat: 22.5958, lng: 88.2636, name: 'Howrah' },
  asansol: { lat: 23.6889, lng: 86.9661, name: 'Asansol' },
  durgapur: { lat: 23.5204, lng: 87.3119, name: 'Durgapur' },
  bardhaman: { lat: 23.2324, lng: 87.8615, name: 'Bardhaman' },
  burdwan: { lat: 23.2324, lng: 87.8615, name: 'Bardhaman' },
  siliguri: { lat: 26.7271, lng: 88.3953, name: 'Siliguri' },
  purulia: { lat: 23.3322, lng: 86.3652, name: 'Purulia' },
  bankura: { lat: 23.2319, lng: 87.0784, name: 'Bankura' },
  malda: { lat: 25.0108, lng: 88.1411, name: 'Malda' },
  kharagpur: { lat: 22.3460, lng: 87.2320, name: 'Kharagpur' },
  midnapore: { lat: 22.4257, lng: 87.3199, name: 'Midnapore' },
  medinipur: { lat: 22.4257, lng: 87.3199, name: 'Midnapore' },
  haldia: { lat: 22.0667, lng: 88.0698, name: 'Haldia' },
  digha: { lat: 21.6266, lng: 87.5074, name: 'Digha' },
  darjeeling: { lat: 27.0410, lng: 88.2663, name: 'Darjeeling' },
  shantiniketan: { lat: 23.6774, lng: 87.6853, name: 'Shantiniketan' },
  bolpur: { lat: 23.6693, lng: 87.6853, name: 'Bolpur' },

  // Bihar
  patna: { lat: 25.5941, lng: 85.1376, name: 'Patna' },
  gaya: { lat: 24.7914, lng: 85.0002, name: 'Gaya' },
  bodhgaya: { lat: 24.6961, lng: 84.9869, name: 'Bodh Gaya' },
  muzaffarpur: { lat: 26.1209, lng: 85.3647, name: 'Muzaffarpur' },
  bhagalpur: { lat: 25.2425, lng: 86.9842, name: 'Bhagalpur' },
  darbhanga: { lat: 26.1542, lng: 85.8918, name: 'Darbhanga' },
  purnia: { lat: 25.7771, lng: 87.4753, name: 'Purnia' },
  'bihar sharif': { lat: 25.1982, lng: 85.5149, name: 'Bihar Sharif' },
  arrah: { lat: 25.5560, lng: 84.6603, name: 'Arrah' },
  begusarai: { lat: 25.4182, lng: 86.1272, name: 'Begusarai' },
  katihar: { lat: 25.5394, lng: 87.5714, name: 'Katihar' },
  munger: { lat: 25.3757, lng: 86.4744, name: 'Munger' },
  chhapra: { lat: 25.7796, lng: 84.7499, name: 'Chhapra' },
  buxar: { lat: 25.5647, lng: 83.9777, name: 'Buxar' },
  sasaram: { lat: 24.9522, lng: 84.0317, name: 'Sasaram' },
  dehri: { lat: 24.9089, lng: 84.1853, name: 'Dehri' },
  bettiah: { lat: 26.8024, lng: 84.5028, name: 'Bettiah' },
  motihari: { lat: 26.6469, lng: 84.9089, name: 'Motihari' },
  rajgir: { lat: 25.0306, lng: 85.4219, name: 'Rajgir' },
  nalanda: { lat: 25.1357, lng: 85.4436, name: 'Nalanda' },

  // Uttar Pradesh & NCR
  varanasi: { lat: 25.3176, lng: 82.9739, name: 'Varanasi' },
  kashi: { lat: 25.3176, lng: 82.9739, name: 'Varanasi' },
  banaras: { lat: 25.3176, lng: 82.9739, name: 'Varanasi' },
  prayagraj: { lat: 25.4358, lng: 81.8463, name: 'Prayagraj' },
  allahabad: { lat: 25.4358, lng: 81.8463, name: 'Prayagraj' },
  lucknow: { lat: 26.8467, lng: 80.9462, name: 'Lucknow' },
  kanpur: { lat: 26.4499, lng: 80.3319, name: 'Kanpur' },
  ayodhya: { lat: 26.7922, lng: 82.1998, name: 'Ayodhya' },
  gorakhpur: { lat: 26.7606, lng: 83.3732, name: 'Gorakhpur' },
  delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
  noida: { lat: 28.5355, lng: 77.3910, name: 'Noida' },
  gurgaon: { lat: 28.4595, lng: 77.0266, name: 'Gurgaon' },
  gurugram: { lat: 28.4595, lng: 77.0266, name: 'Gurgaon' },

  // Odisha
  bhubaneswar: { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar' },
  cuttack: { lat: 20.4625, lng: 85.8828, name: 'Cuttack' },
  puri: { lat: 19.8135, lng: 85.8312, name: 'Puri' },
  rourkela: { lat: 22.2604, lng: 84.8536, name: 'Rourkela' },
  sambalpur: { lat: 21.4669, lng: 83.9756, name: 'Sambalpur' },
  balasore: { lat: 21.4934, lng: 86.9135, name: 'Balasore' },
};

/**
 * Resolves coordinates for any city, landmark, or typed address string
 * with high tolerance for punctuation, casing, and word prefixes.
 */
export function resolvePlaceCoords(text: string): { lat: number; lng: number; name: string } | null {
  if (!text || text.trim().length < 2) return null;
  const clean = text.toLowerCase().trim();

  // 1. Direct or substring match in MAJOR_REGIONAL_COORDS
  for (const [key, item] of Object.entries(MAJOR_REGIONAL_COORDS)) {
    if (clean === key || clean.includes(key) || key.includes(clean)) {
      return { lat: item.lat, lng: item.lng, name: item.name };
    }
  }

  // 2. Direct or substring match in ALL_LOCATIONS
  const loc = ALL_LOCATIONS.find(
    (l) =>
      clean === l.name.toLowerCase() ||
      clean === l.slug.toLowerCase() ||
      clean.includes(l.name.toLowerCase()) ||
      l.name.toLowerCase().includes(clean)
  );
  if (loc) return { lat: loc.lat, lng: loc.lng, name: loc.name };

  // 3. Word-by-word token matching
  const words = clean.split(/[\s,.-]+/);
  for (const w of words) {
    if (w.length < 3) continue;
    if (MAJOR_REGIONAL_COORDS[w]) {
      const match = MAJOR_REGIONAL_COORDS[w];
      return { lat: match.lat, lng: match.lng, name: match.name };
    }
    const match = ALL_LOCATIONS.find(
      (l) => l.name.toLowerCase() === w || l.name.toLowerCase().includes(w)
    );
    if (match) return { lat: match.lat, lng: match.lng, name: match.name };
  }

  return null;
}

/**
 * Calculates a sensible road distance estimate in km between two places.
 * Returns null if either place is unspecified or too short.
 */
export function getDistanceEstimate(fromText: string, toText: string): number | null {
  if (!fromText || !toText || fromText.trim().length < 2 || toText.trim().length < 2) {
    return null;
  }
  const p1 = resolvePlaceCoords(fromText);
  const p2 = resolvePlaceCoords(toText);
  if (p1 && p2) {
    const straight = haversineKm(p1.lat, p1.lng, p2.lat, p2.lng);
    return Math.max(30, Math.round(straight * 1.25));
  }
  // If at least one name is non-empty and they differ, return a sensible default regional distance
  if (fromText.trim().toLowerCase() !== toText.trim().toLowerCase()) {
    return 120;
  }
  return null;
}
