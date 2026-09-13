import { CollectorUser } from './types';

export const DEFAULT_COLLECTORS: CollectorUser[] = [
  {
    id: 'user_1',
    name: 'User 1',
    pin: '1001',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'user_2',
    name: 'User 2',
    pin: '1002',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'user_3',
    name: 'User 3',
    pin: '1003',
    avatarColor: 'bg-orange-600',
  },
  {
    id: 'user_4',
    name: 'User 4',
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
