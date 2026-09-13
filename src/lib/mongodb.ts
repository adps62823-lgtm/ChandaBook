import { MongoClient, Db, ObjectId } from 'mongodb';
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

// Start with completely clean production store - NO dummy records
if (!global._inMemoryChandaStore) {
  global._inMemoryChandaStore = [];
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

// Retrieve stored collections from MongoDB or fallback clean store
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

export async function deleteStoredCollection(id: string): Promise<boolean> {
  const db = await getDb();
  let deletedFromMongo = false;

  if (db) {
    try {
      let filter: Record<string, unknown> = { _id: id };
      try {
        if (ObjectId.isValid(id)) {
          filter = { _id: new ObjectId(id) };
        }
      } catch {
        // use string match
      }

      const result = await db.collection('collections').deleteOne(filter);
      deletedFromMongo = result.deletedCount > 0;
    } catch (err) {
      console.warn('MongoDB delete failed, attempting local store delete:', err);
    }
  }

  if (global._inMemoryChandaStore) {
    const initialLen = global._inMemoryChandaStore.length;
    global._inMemoryChandaStore = global._inMemoryChandaStore.filter((item) => item._id !== id);
    return deletedFromMongo || global._inMemoryChandaStore.length < initialLen;
  }

  return deletedFromMongo;
}
