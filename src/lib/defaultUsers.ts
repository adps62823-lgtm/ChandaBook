import { CollectorUser } from './types';

export const DEFAULT_COLLECTORS: CollectorUser[] = [
  {
    id: 'user_1',
    name: 'User 1',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'user_2',
    name: 'User 2',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'user_3',
    name: 'User 3',
    avatarColor: 'bg-orange-600',
  },
  {
    id: 'user_4',
    name: 'User 4',
    avatarColor: 'bg-red-700',
  },
];

export const COMMITTEE_INFO = {
  name: 'माँ भगवती पूजन कला संघ',
  subtitle: 'कम्पनी सराय, रौजा रोड, सासाराम',
  district: 'रोहतास, बिहार',
  pincode: '821115',
  estd: '2001',
  welcomeText: 'आपका हार्दिक अभिनन्दन करता है',
  logoUrl: '/images/puja-logo.jpg',
  bannerUrl: '/images/puja-banner.jpg',
  qrCodeUrl: '/images/puja-qr.jpg',
  defaultUpiId: 'maabhagwatipujankalasangh@sbi',
};

// Company Sarai, Rouza Road, Sasaram coordinates
export const SASARAM_ROUZA_ROAD_COORDS = {
  lat: 24.9536,
  lng: 84.0278,
};

export const ROUZA_ROAD_LANDMARKS = [
  'कम्पनी सराय (Company Sarai) - मुख्य पंडाल स्थल',
  'रौज़ा शरीफ / गेट के पास (Near Rouza Sharif Gate)',
  'रौज़ा रोड चौक (Rouza Road Chowk)',
  'जी.टी. रोड मोड़ (G.T. Road Turn / Mor)',
  'एस.पी. जैन कॉलेज रोड क्रॉसिंग (SP Jain College Crossing)',
  'धर्मशाला रोड जंक्शन (Dharmshala Road Junction)',
  'मुख्य बाज़ार रौज़ा बाज़ार (Main Market Rouza Bazar)',
  'कचेहरी रोड लिंक (Kachari Road Link)',
  'फज़लगंज मोड़ (Fazalganj Turning)',
  'माँ भगवती मंडप परिसर (Mandap Parisar)',
];
