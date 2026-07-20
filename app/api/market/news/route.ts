import { NextResponse } from 'next/server';
import { getMarketNews } from '@/lib/api/marketData';

export async function GET() {
  try {
    const news = await getMarketNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error('[v0] News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news', data: [] },
      { status: 200 }
    );
  }
}
