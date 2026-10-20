import type { CityDetails } from './types';

// ─── ODISHA ───────────────────────────────────────────────────────────────────
export const odishaCityDetails: CityDetails[] = [
  {
    slug: 'bhubaneswar',
    region: 'Khordha District (Coastal Odisha)',
    localities: ['Saheed Nagar', 'Jaydev Vihar', 'Nayapalli', 'Patia', 'Chandrasekharpur', 'Old Town', 'Kharavela Nagar', 'Master Canteen', 'Rasulgarh', 'Unit-8', 'Infocity'],
    landmarks: ['Biju Patnaik International Airport', 'Bhubaneswar Railway Station', 'Lingaraj Temple', 'Khandagiri & Udayagiri Caves', 'Nandankanan Zoo', 'Dhauli Peace Pagoda', 'Ekamra Kanan'],
    highways: ['NH-16 (Chennai–Kolkata coast road)', 'NH-57 (Bhubaneswar–Sambalpur)', 'Bhubaneswar–Cuttack Road', 'NH-203 (to Puri)'],
    connectivity: {
      road: 'On NH-16 on the eastern coast, linked to Cuttack (~28 km), Puri (~60 km) and Kolkata (~440 km).',
      rail: 'Bhubaneswar is a major station on the Howrah–Chennai line with direct trains to Kolkata, Chennai and Delhi.',
      air: 'Biju Patnaik International Airport (BBI) offers domestic flights to Delhi, Mumbai, Kolkata, Bengaluru and more.',
    },
    attractions: [
      { name: 'Lingaraj Temple', distance: 'City area', note: 'Majestic 11th-century Kalinga temple' },
      { name: 'Khandagiri & Udayagiri Caves', distance: '8 km', note: 'Ancient rock-cut Jain caves' },
      { name: 'Dhauli Peace Pagoda', distance: '8 km', note: 'Ashoka edict site and stupa' },
      { name: 'Nandankanan Zoological Park', distance: '20 km', note: 'Zoo and botanical garden' },
      { name: 'Puri & Konark', distance: '60–65 km', note: 'Jagannath temple and Sun Temple day-trip' },
    ],
    bestTime: 'October to March (Rath Yatra in June–July draws huge crowds)',
    localNote: 'Bhubaneswar, the "Temple City of India", is the capital of Odisha and a major government, IT, airport-transfer and temple-tourism market. It is a key destination from Ranchi.',
    tips: ['The airport is ~5 km from the city centre — quick transfers.', 'Old Town (Lingaraj) and the Khandagiri caves are the heritage core.', 'Combine Bhubaneswar with Puri and Konark as a full-day temple-and-beach circuit.'],
  },
  {
    slug: 'cuttack',
    region: 'Cuttack District (Coastal Odisha)',
    localities: ['Badambadi', 'Buxi Bazaar', 'Chandi Chhak', 'College Square', 'Mangalabag', 'Bidanasi', 'Khannagar', 'Bajrakabati', 'Sutahat'],
    landmarks: ['Barabati Fort', 'Cuttack Railway Station', 'Barabati Stadium', 'Odisha High Court', 'Netaji Birthplace Museum', 'Silver Filigree craft hub'],
    highways: ['NH-16 (Chennai–Kolkata coast road)', 'Cuttack–Bhubaneswar Road', 'Cuttack–Paradip Road'],
    connectivity: {
      road: 'On NH-16, just ~28 km from Bhubaneswar and linked to Paradip (~90 km) and Kolkata (~460 km).',
      rail: 'Cuttack is a major station on the Howrah–Chennai line with direct trains to Kolkata and southern India.',
      air: 'Nearest airport is Biju Patnaik International Airport, Bhubaneswar (~30 km).',
    },
    attractions: [
      { name: 'Barabati Fort', distance: 'City area', note: 'Ancient Gajapati-era fort' },
      { name: 'Katak Chandi Temple', distance: 'City area', note: 'Major Shakti temple' },
      { name: 'Netaji Birthplace Museum', distance: 'City area', note: 'Birthplace of Netaji Subhas Chandra Bose' },
      { name: 'Dhabaleswar Temple', distance: '35 km', note: 'Island Shiva temple on the Mahanadi' },
    ],
    bestTime: 'October to March',
    localNote: 'Cuttack, the former capital of Odisha and the "Silver City", is a major commercial and judicial hub on the Mahanadi, famous for its silver filigree (tarakasi) craft.',
    tips: ['Badambadi is the main bus and commercial hub.', 'Cuttack hosts the famous Bali Jatra fair — expect crowds then.', 'Bhubaneswar airport is only about 30 minutes away.'],
  },
  {
    slug: 'puri',
    region: 'Puri District (Coastal Odisha)',
    localities: ['Grand Road', 'Chakratirtha Road', 'Sea Beach area', 'Swargadwar', 'Vip Road', 'Market area', 'Baliapanda', 'Station Bazaar'],
    landmarks: ['Shree Jagannath Temple', 'Puri Railway Station', 'Puri Sea Beach', 'Swargadwar', 'Gundicha Temple', 'Chilika Lake (nearby)'],
    highways: ['NH-203 (Puri–Bhubaneswar)', 'NH-316 (Puri–Konark Marine Drive)', 'Puri–Konark Marine Drive'],
    connectivity: {
      road: 'About 60 km from Bhubaneswar via NH-203; the Marine Drive coastal road links to Konark.',
      rail: 'Puri is a terminal station on the East Coast Railway with direct trains from Kolkata, Delhi and Bhubaneswar.',
      air: 'Nearest airport is Biju Patnaik International Airport, Bhubaneswar (~60 km).',
    },
    attractions: [
      { name: 'Shree Jagannath Temple', distance: 'City area', note: 'One of the four sacred Char Dham' },
      { name: 'Puri Sea Beach', distance: 'City area', note: 'Golden beach and sunset point' },
      { name: 'Konark Sun Temple', distance: '35 km', note: 'UNESCO World Heritage Sun Temple' },
      { name: 'Chilika Lake', distance: '50 km', note: "Asia's largest brackish-water lagoon" },
      { name: 'Raghurajpur Artist Village', distance: '12 km', note: 'Pattachitra craft village' },
    ],
    bestTime: 'October to March (Rath Yatra in June–July is the busiest pilgrimage period)',
    localNote: 'Puri is one of the four sacred Char Dham and home to the Jagannath Temple, whose Rath Yatra draws millions of devotees each year. It is a major pilgrimage and beach-tourism destination.',
    tips: ['Rath Yatra (June–July) sees huge crowds — plan cabs and stays far in advance.', 'Grand Road and the beach are the central pickup areas.', 'Konark Sun Temple and Chilika Lake pair well as day-trips from here.'],
  },
];
