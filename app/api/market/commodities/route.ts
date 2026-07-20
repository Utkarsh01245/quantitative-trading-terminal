import { NextResponse } from 'next/server';
import { getCommoditiesData } from '@/lib/api/marketData';

export async function GET() {
  try {
    const commodities = await getCommoditiesData();
    return NextResponse.json(commodities);
  } catch (error) {
    console.error('[v0] Commodities API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commodities', data: [] },
      { status: 200 }
    );
  }
}
