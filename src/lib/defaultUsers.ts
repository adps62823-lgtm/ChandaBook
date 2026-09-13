import { CollectorUser } from './types';

export const DEFAULT_COLLECTORS: CollectorUser[] = [
  {
    id: 'user_vikash',
    name: 'Vikash Kumar',
    phone: '9876543210',
    role: 'Collection Lead',
    pin: '1001',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'user_rahul',
    name: 'Rahul Sharma',
    phone: '9876543211',
    role: 'Field Collector',
    pin: '1002',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'user_amit',
    name: 'Amit Singh',
    phone: '9876543212',
    role: 'Field Collector',
    pin: '1003',
    avatarColor: 'bg-orange-600',
  },
  {
    id: 'user_abhishek',
    name: 'Abhishek Gupta',
    phone: '9876543213',
    role: 'Treasurer / Collector',
    pin: '1004',
    avatarColor: 'bg-red-700',
  },
];

// Sasaram Rouza Road Default Geographical Coordinates
export const SASARAM_ROUZA_ROAD_COORDS = {
  lat: 24.9536,
  lng: 84.0278,
};

export const ROUZA_ROAD_LANDMARKS = [
  'Near Rouza Sharif / Gate',
  'Rouza Road Chowk',
  'G.T. Road Turn / Mor',
  'SP Jain College Road Crossing',
  'Dharmshala Road Junction',
  'Main Market Rouza Bazar',
  'Kachari Road Link',
  'Fazalganj Turning',
  'Maa Durga Mandap Parisar (Pandal)',
];
