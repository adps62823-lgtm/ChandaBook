import { NextResponse } from 'next/server';
import { getStoredCollections, insertStoredCollection, isMongoConfigured } from '@/lib/mongodb';
import { CollectionStats } from '@/lib/types';

export async function GET() {
  try {
    const collections = await getStoredCollections();

    const todayStr = new Date().toISOString().split('T')[0];
    let totalAmount = 0;
    let cashAmount = 0;
    let upiAmount = 0;
    let todayAmount = 0;
    const collectorMap = new Map<string, { collectorName: string; count: number; totalAmount: number }>();

    collections.forEach((item) => {
      const amt = Number(item.amount) || 0;
      totalAmount += amt;

      if (item.paymentMode === 'Cash') {
        cashAmount += amt;
      } else {
        upiAmount += amt;
      }

      if (item.createdAt && item.createdAt.startsWith(todayStr)) {
        todayAmount += amt;
      }

      const cId = item.collectedBy?.id || 'unknown';
      const cName = item.collectedBy?.name || 'Volunteer';
      const existing = collectorMap.get(cId) || { collectorName: cName, count: 0, totalAmount: 0 };
      existing.count += 1;
      existing.totalAmount += amt;
      collectorMap.set(cId, existing);
    });

    const collectorBreakdown = Array.from(collectorMap.entries()).map(([collectorId, data]) => ({
      collectorId,
      collectorName: data.collectorName,
      count: data.count,
      totalAmount: data.totalAmount,
    }));

    // Sort leaderboard by total collected desc
    collectorBreakdown.sort((a, b) => b.totalAmount - a.totalAmount);

    const stats: CollectionStats = {
      totalAmount,
      totalDonors: collections.length,
      cashAmount,
      upiAmount,
      todayAmount,
      collectorBreakdown,
    };

    return NextResponse.json({
      success: true,
      data: collections,
      stats,
      isLiveMongo: isMongoConfigured(),
    });
  } catch (error: unknown) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donorName, amount, paymentMode, transactionId, address, landmark, location, collectedBy, notes, phone } = body;

    if (!donorName || !amount || !paymentMode || !collectedBy?.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required collection fields' },
        { status: 400 }
      );
    }

    const saved = await insertStoredCollection({
      donorName: donorName.trim(),
      phone: phone ? phone.trim() : '',
      amount: Number(amount),
      paymentMode,
      transactionId: transactionId ? transactionId.trim() : '',
      address: address.trim(),
      landmark: landmark || '',
      location: location || { lat: 24.9536, lng: 84.0278 },
      collectedBy,
      notes: notes ? notes.trim() : '',
    });

    return NextResponse.json({
      success: true,
      data: saved,
      message: 'Chanda collection successfully recorded',
    });
  } catch (error: unknown) {
    console.error('Error recording collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record collection' },
      { status: 500 }
    );
  }
}
