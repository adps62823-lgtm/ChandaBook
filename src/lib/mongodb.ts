import { MongoClient, Db } from 'mongodb';
import { ChandaEntry } from './types';
import { SASARAM_ROUZA_ROAD_COORDS } from './defaultUsers';

const uri = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _inMemoryChandaStore: ChandaEntry[] | undefined;
}

// Initial sample collection data centered in Rouza Road, Sasaram
const INITIAL_MOCK_ENTRIES: ChandaEntry[] = [
  {
    _id: 'mock_1',
    receiptNo: 'DP-RR-2024-001',
    donorName: 'Manoj Kumar Gupta',
    phone: '9431012345',
    amount: 1100,
    paymentMode: 'Cash',
    address: 'Near Rouza Sharif Gate, Rouza Road',
    landmark: 'Near Rouza Sharif / Gate',
    location: {
      lat: 24.9538,
      lng: 84.0279,
    },
    collectedBy: {
      id: 'user_vikash',
      name: 'Vikash Kumar',
      role: 'Collection Lead',
    },
    notes: 'Pandal decoration donation',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    _id: 'mock_2',
    receiptNo: 'DP-RR-2024-002',
    donorName: 'Suresh Chandra Verma',
    phone: '9835067890',
    amount: 2100,
    paymentMode: 'UPI',
    transactionId: 'UPI-RR-90823412',
    address: 'Shop #14, Main Market, Rouza Bazar',
    landmark: 'Main Market Rouza Bazar',
    location: {
      lat: 24.9542,
      lng: 84.0284,
    },
    collectedBy: {
      id: 'user_rahul',
      name: 'Rahul Sharma',
      role: 'Field Collector',
    },
    notes: 'Prasad & Bhog contribution',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'mock_3',
    receiptNo: 'DP-RR-2024-003',
    donorName: 'Rajeshwar Tiwari',
    phone: '9934112233',
    amount: 501,
    paymentMode: 'Cash',
    address: 'Opposite SP Jain College Link Road',
    landmark: 'SP Jain College Road Crossing',
    location: {
      lat: 24.9529,
      lng: 84.0268,
    },
    collectedBy: {
      id: 'user_amit',
      name: 'Amit Singh',
      role: 'Field Collector',
    },
    notes: 'Aarti pushpanjali sankalp',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    _id: 'mock_4',
    receiptNo: 'DP-RR-2024-004',
    donorName: 'Anil Kumar Agrawal',
    phone: '9430298765',
    amount: 5100,
    paymentMode: 'UPI',
    transactionId: 'PAYTM_SASARAM_441',
    address: 'G.T. Road Mor, Rouza Road',
    landmark: 'G.T. Road Turn / Mor',
    location: {
      lat: 24.9551,
      lng: 84.0295,
    },
    collectedBy: {
      id: 'user_abhishek',
      name: 'Abhishek Gupta',
      role: 'Treasurer / Collector',
    },
    notes: 'Maa Durga Shringaar donation',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

if (!global._inMemoryChandaStore) {
  global._inMemoryChandaStore = [...INITIAL_MOCK_ENTRIES];
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.trim().length > 0 && !uri.includes('YOUR_MONGODB_URI'));
}

export async function getDb(): Promise<Db | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  const connectedClient = await clientPromise;
  return connectedClient.db('durga_puja_chanda_sasaram');
}

// Fallback in-memory operations for instant testing without database downtime
export async function getStoredCollections(): Promise<ChandaEntry[]> {
  const db = await getDb();
  if (db) {
    try {
      const docs = await db
        .collection('collections')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return docs.map((doc) => ({
        _id: doc._id.toString(),
        receiptNo: doc.receiptNo,
        donorName: doc.donorName,
        phone: doc.phone || '',
        amount: Number(doc.amount),
        paymentMode: doc.paymentMode,
        transactionId: doc.transactionId || '',
        address: doc.address,
        landmark: doc.landmark || '',
        location: doc.location || SASARAM_ROUZA_ROAD_COORDS,
        collectedBy: doc.collectedBy,
        notes: doc.notes || '',
        createdAt: doc.createdAt,
      }));
    } catch (err) {
      console.warn('MongoDB query failed, falling back to local store:', err);
    }
  }

  return global._inMemoryChandaStore || [];
}

export async function insertStoredCollection(entry: Omit<ChandaEntry, '_id' | 'receiptNo' | 'createdAt'>): Promise<ChandaEntry> {
  const count = (await getStoredCollections()).length;
  const seqNumber = String(count + 1).padStart(4, '0');
  const receiptNo = `DP-RR-${new Date().getFullYear()}-${seqNumber}`;
  const createdAt = new Date().toISOString();

  const newEntry: ChandaEntry = {
    ...entry,
    _id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    receiptNo,
    createdAt,
  };

  const db = await getDb();
  if (db) {
    try {
      const result = await db.collection('collections').insertOne({
        receiptNo: newEntry.receiptNo,
        donorName: newEntry.donorName,
        phone: newEntry.phone,
        amount: newEntry.amount,
        paymentMode: newEntry.paymentMode,
        transactionId: newEntry.transactionId,
        address: newEntry.address,
        landmark: newEntry.landmark,
        location: newEntry.location,
        collectedBy: newEntry.collectedBy,
        notes: newEntry.notes,
        createdAt: newEntry.createdAt,
      });
      newEntry._id = result.insertedId.toString();
    } catch (err) {
      console.warn('MongoDB insert failed, storing in memory:', err);
    }
  }

  if (!global._inMemoryChandaStore) {
    global._inMemoryChandaStore = [];
  }
  global._inMemoryChandaStore.unshift(newEntry);

  return newEntry;
}
