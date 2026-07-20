/**
 * Market Data Fetching Services
 * Integrates with free APIs: Finnhub, NSE, Binance, NewsAPI
 */

import axios from 'axios';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY || 'demo';
const NEWSAPI_KEY = process.env.NEXT_PUBLIC_NEWSAPI_KEY || '';

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  timestamp: string;
}

interface CompanyNews {
  title: string;
  description: string;
  source: string;
  url: string;
  image?: string;
  datetime: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface EarningsResult {
  symbol: string;
  company: string;
  date: string;
  eps?: number;
  epsEstimate?: number;
  revenue?: number;
  revenueEstimate?: number;
  surprise?: number;
  surprisePercent?: number;
}

interface OilData {
  date: string;
  brentCrude: number;
  wtiCrude: number;
  indiaImport: number; // barrels
  refineryCapacity: number;
  priceTrend: 'up' | 'down' | 'stable';
}

interface OptionsData {
  symbol: string;
  strikePrice: number;
  expiryDate: string;
  callPrice: number;
  putPrice: number;
  openInterest: number;
  volume: number;
  iv?: number;
}

/**
 * Fetch stock quote from Finnhub
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: {
        symbol,
        token: FINNHUB_API_KEY,
      },
    });
    
    const data = response.data;
    return {
      symbol,
      price: data.c || 0,
      change: data.d || 0,
      changePercent: data.dp || 0,
      open: data.o,
      high: data.h,
      low: data.l,
      volume: data.v,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch multiple stock quotes
 */
export async function getMultipleStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  const quotes = await Promise.all(
    symbols.map(sym => getStockQuote(sym))
  );
  return quotes.filter((q): q is StockQuote => q !== null);
}

/**
 * Fetch historical prices from Finnhub
 */
export async function getHistoricalPrices(
  symbol: string,
  days: number = 60
): Promise<{ dates: string[]; prices: number[] } | null> {
  try {
    // Finnhub free tier limited data, use candle endpoint
    const response = await axios.get('https://finnhub.io/api/v1/stock/candle', {
      params: {
        symbol,
        resolution: 'D', // Daily
        from: Math.floor(Date.now() / 1000) - days * 24 * 60 * 60,
        to: Math.floor(Date.now() / 1000),
        token: FINNHUB_API_KEY,
      },
    });
    
    const data = response.data;
    if (!data.c || data.c.length === 0) return null;
    
    return {
      dates: data.t.map((ts: number) => new Date(ts * 1000).toISOString().split('T')[0]),
      prices: data.c, // Close prices
    };
  } catch (error) {
    console.error(`Error fetching historical prices for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch company news
 */
export async function getCompanyNews(
  symbol: string,
  limit: number = 10
): Promise<CompanyNews[]> {
  try {
    // Try Finnhub news first
    const response = await axios.get('https://finnhub.io/api/v1/company-news', {
      params: {
        symbol,
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        limit,
        token: FINNHUB_API_KEY,
      },
    });
    
    return response.data.map((item: any) => ({
      title: item.headline || '',
      description: item.summary || '',
      source: item.source || 'Unknown',
      url: item.url || '',
      image: item.image,
      datetime: new Date(item.datetime * 1000).toISOString(),
      sentiment: analyzeSentiment(item.headline || ''),
    }));
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch earnings calendar
 */
export async function getEarningsCalendar(): Promise<EarningsResult[]> {
  try {
    // Mock earnings data - in production, connect to actual earnings API
    const nifty50Companies = [
      'RELIANCE', 'ICICIBANK', 'HDFC', 'INFY', 'ITC',
      'SBIN', 'BHARTIARTL', 'MARUTI', 'ONGC', 'BAJAJFINSV',
    ];
    
    const earnings: EarningsResult[] = nifty50Companies.map(symbol => ({
      symbol,
      company: symbol,
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      surprise: Math.random() > 0.5 ? 5 + Math.random() * 15 : -10 + Math.random() * 10,
      surprisePercent: Math.random() > 0.5 ? 2 + Math.random() * 8 : -5 + Math.random() * 5,
    }));
    
    return earnings;
  } catch (error) {
    console.error('Error fetching earnings calendar:', error);
    return [];
  }
}

/**
 * Fetch oil tanker tracking data
 */
export async function getOilTankerData(): Promise<OilData> {
  try {
    // Mock data - integrate with real tanker tracking APIs in production
    const now = new Date();
    const price = 70 + Math.random() * 20;
    
    return {
      date: now.toISOString().split('T')[0],
      brentCrude: price,
      wtiCrude: price - 2 - Math.random() * 3,
      indiaImport: 4000000 + Math.random() * 500000, // barrels
      refineryCapacity: 250000, // barrels/day
      priceTrend: Math.random() > 0.5 ? 'up' : 'down',
    };
  } catch (error) {
    console.error('Error fetching oil data:', error);
    return {
      date: new Date().toISOString().split('T')[0],
      brentCrude: 0,
      wtiCrude: 0,
      indiaImport: 0,
      refineryCapacity: 0,
      priceTrend: 'stable',
    };
  }
}

/**
 * Fetch options data (IV, Greeks, Open Interest)
 */
export async function getOptionsData(symbol: string): Promise<OptionsData[]> {
  // Mock data - integrate with real options APIs
  const strikes = [
    { strike: 1800, callIV: 0.25, putIV: 0.26 },
    { strike: 1900, callIV: 0.24, putIV: 0.25 },
    { strike: 2000, callIV: 0.23, putIV: 0.24 },
    { strike: 2100, callIV: 0.24, putIV: 0.25 },
    { strike: 2200, callIV: 0.25, putIV: 0.26 },
  ];
  
  return strikes.map(s => ({
    symbol,
    strikePrice: s.strike,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    callPrice: 50 + Math.random() * 100,
    putPrice: 40 + Math.random() * 80,
    openInterest: 100000 + Math.random() * 500000,
    volume: 10000 + Math.random() * 100000,
    iv: s.callIV,
  }));
}

/**
 * Sentiment analysis (simple keyword-based)
 */
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['surge', 'rally', 'gain', 'rise', 'bullish', 'strong', 'beat', 'profit', 'growth'];
  const negativeWords = ['fall', 'crash', 'decline', 'loss', 'bearish', 'weak', 'miss', 'concern', 'risk'];
  
  const lower = text.toLowerCase();
  let positiveCount = positiveWords.filter(w => lower.includes(w)).length;
  let negativeCount = negativeWords.filter(w => lower.includes(w)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * Fetch FII/DII data
 */
export async function getFIIDIIData(): Promise<{ date: string; fiiBuying: number; diiSelling: number }> {
  // Mock data - integrate with real FII/DII APIs or scrape NSE
  return {
    date: new Date().toISOString().split('T')[0],
    fiiBuying: 5000 + Math.random() * 5000, // millions
    diiSelling: 2000 + Math.random() * 3000,
  };
}

/**
 * Fetch market volatility index (VIX-like)
 */
export async function getVIX(): Promise<{ value: number; trend: 'up' | 'down' | 'stable' }> {
  // Mock data - integrate with real volatility indices
  return {
    value: 15 + Math.random() * 10,
    trend: Math.random() > 0.5 ? 'up' : 'down',
  };
}

/**
 * Fetch corporate action updates
 */
export async function getCorporateActions(): Promise<Array<{
  symbol: string;
  action: string;
  date: string;
  details: string;
}>> {
  // Mock data
  return [];
}

/**
 * Fetch macro economic calendar
 */
export async function getMacroCalendar(): Promise<Array<{
  date: string;
  event: string;
  country: string;
  expected: number;
  previous: number;
  actual?: number;
  impact: 'high' | 'medium' | 'low';
}>> {
  // Mock data
  return [
    {
      date: new Date().toISOString().split('T')[0],
      event: 'RBI Interest Rate Decision',
      country: 'India',
      expected: 6.5,
      previous: 6.5,
      impact: 'high',
    },
  ];
}
