import { NextResponse } from 'next/server';
import { getEarningsCalendar } from '@/lib/api/marketData';

export async function GET() {
  try {
    const earnings = await getEarningsCalendar();
    return NextResponse.json(earnings);
  } catch (error) {
    console.error('[v0] Earnings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings', data: [] },
      { status: 200 }
    );
  }
}
