import { NextResponse } from 'next/server';
import { getPairsData } from '@/lib/api/marketData';

export async function GET() {
  try {
    const pairsData = await getPairsData();
    return NextResponse.json(pairsData);
  } catch (error) {
    console.error('[v0] Pairs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pairs data', mock: true },
      { status: 200 } // Return 200 with mock data for demo
    );
  }
}
