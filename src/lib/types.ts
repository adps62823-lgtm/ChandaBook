export interface CollectorUser {
  id: string;
  name: string;
  pin: string;
  avatarColor: string;
  phone?: string;
  role?: string;
}

export interface ChandaEntry {
  _id: string;
  receiptNo: string;
  donorName: string;
  phone?: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI';
  transactionId?: string;
  address: string;
  landmark?: string;
  location: {
    lat: number;
    lng: number;
  };
  collectedBy: {
    id: string;
    name: string;
    role?: string;
  };
  notes?: string;
  createdAt: string;
}

export interface CollectionStats {
  totalAmount: number;
  totalDonors: number;
  cashAmount: number;
  upiAmount: number;
  todayAmount: number;
  collectorBreakdown: {
    collectorId: string;
    collectorName: string;
    count: number;
    totalAmount: number;
  }[];
}
