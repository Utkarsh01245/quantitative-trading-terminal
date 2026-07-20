/**
 * Pairs Trading Engine
 * Core logic for identifying and scoring trading pairs
 */

import {
  correlation,
  linearRegression,
  johannesCointegration,
  zScore,
  mean,
  stdDev,
} from './math';

export interface StockData {
  symbol: string;
  prices: number[];
  dates: string[];
  currentPrice: number;
}

export interface TradingPair {
  stock1: string;
  stock2: string;
  correlation: number;
  cointegration: number;
  spread: number[];
  currentSpread: number;
  zScore: number;
  meanRevertingBasis: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  lastUpdated: string;
}

export interface SignalFactors {
  cointegration: number; // 40% weight
  spreadZScore: number; // 40% weight
  sentiment: number; // 20% weight
  ivRank?: number; // 10% weight (advanced)
  oiBuildup?: number; // 10% weight (advanced)
  fiiFlow?: number; // 5% weight (advanced)
}

export interface SignalResult {
  pair: string;
  type: 'BUY' | 'SELL';
  confidence: number; // 0-100
  factors: SignalFactors;
  reason: string;
  counterArgument: string;
  historicalWinRate: number;
  riskScore: number; // 0-100
  suggestedSL: number;
  suggestedTP: number;
}

/**
 * Calculate basis points for pair
 */
export function calculateBasis(price1: number, price2: number, beta: number = 1): number {
  return price1 - beta * price2;
}

/**
 * Identify trading pairs from universe
 */
export function identifyPairs(stocks: StockData[], minCorrelation: number = 0.7): TradingPair[] {
  const pairs: TradingPair[] = [];
  
  for (let i = 0; i < stocks.length; i++) {
    for (let j = i + 1; j < stocks.length; j++) {
      const s1 = stocks[i];
      const s2 = stocks[j];
      
      // Calculate correlation
      const corr = correlation(s1.prices, s2.prices);
      if (Math.abs(corr) < minCorrelation) continue;
      
      // Calculate cointegration
      const { score: coint, meanRevertingSpread } = johannesCointegration(s1.prices, s2.prices);
      if (coint < 0.5) continue; // Minimum cointegration threshold
      
      // Calculate current spread and Z-score
      const spread = s1.currentPrice - s2.currentPrice;
      const zsc = zScore(spread, meanRevertingSpread);
      
      // Determine signal
      let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      if (zsc > 2.0) signal = 'SELL'; // Spread too high, expect reversion down
      else if (zsc < -2.0) signal = 'BUY'; // Spread too low, expect reversion up
      
      // Calculate confidence (0-100)
      const confidence = Math.min(100, (Math.abs(zsc) * 10 + coint * 50));
      
      pairs.push({
        stock1: s1.symbol,
        stock2: s2.symbol,
        correlation: corr,
        cointegration: coint,
        spread: meanRevertingSpread,
        currentSpread: spread,
        zScore: zsc,
        meanRevertingBasis: mean(meanRevertingSpread),
        signal,
        confidence,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  return pairs.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate multi-factor signal
 */
export function generateSignal(pair: TradingPair, factors: SignalFactors, historicalTrades: any[] = []): SignalResult {
  // Baseline scoring (40% cointegration + 40% spread Z-score + 20% sentiment)
  const baselineScore =
    factors.cointegration * 0.4 +
    Math.min(100, Math.abs(pair.zScore) * 20) * 0.4 +
    (factors.sentiment || 50) * 0.2;
  
  // Advanced scoring (if provided and passes baseline)
  let totalScore = baselineScore;
  if (factors.ivRank !== undefined && factors.oiBuildup !== undefined) {
    const advancedScore = baselineScore * 0.8 +
      (factors.ivRank || 50) * 0.05 +
      (factors.oiBuildup || 50) * 0.05 +
      (factors.fiiFlow || 50) * 0.025;
    totalScore = advancedScore;
  }
  
  // Determine trade type based on Z-score
  let type: 'BUY' | 'SELL' = 'BUY';
  let reason = '';
  let counterArgument = '';
  
  if (pair.zScore > 2.0) {
    type = 'SELL';
    reason = `${pair.stock1} overvalued vs ${pair.stock2} (Z-score: ${pair.zScore.toFixed(2)}). Strong cointegration (${(factors.cointegration * 100).toFixed(0)}%) suggests reversion.`;
    counterArgument = 'Risk: Correlation breakdown, market regime change, or continued divergence despite cointegration.';
  } else if (pair.zScore < -2.0) {
    type = 'BUY';
    reason = `${pair.stock1} undervalued vs ${pair.stock2} (Z-score: ${pair.zScore.toFixed(2)}). Strong cointegration confirms mean reversion opportunity.`;
    counterArgument = 'Risk: Spread could widen further, earnings surprise, or sector rotation against thesis.';
  }
  
  // Calculate historical win rate
  const similarTrades = historicalTrades.filter(
    t => Math.abs(t.zScore - pair.zScore) < 1.0 && Math.abs(t.cointegration - factors.cointegration) < 0.15
  );
  const winRate = similarTrades.length > 0
    ? similarTrades.filter(t => t.profitable).length / similarTrades.length
    : 0.5; // Default 50% if no history
  
  // Calculate risk score
  const riskScore = Math.min(
    100,
    (1 - factors.cointegration) * 50 + // Lower cointegration = higher risk
    (1 - Math.min(1, Math.abs(pair.correlation))) * 25 + // Correlation breakdown risk
    Math.abs(pair.zScore) * 5 // Extreme Z-scores have execution risk
  );
  
  // Calculate suggested stop loss and take profit
  const spreadStdDev = stdDev(pair.spread);
  const suggestedSL = pair.meanRevertingBasis + (spreadStdDev * 1.5);
  const suggestedTP = pair.meanRevertingBasis - (spreadStdDev * 0.5);
  
  return {
    pair: `${pair.stock1}/${pair.stock2}`,
    type,
    confidence: Math.min(100, totalScore),
    factors,
    reason,
    counterArgument,
    historicalWinRate: winRate,
    riskScore,
    suggestedSL,
    suggestedTP,
  };
}

/**
 * Score signal confidence levels
 */
export function scoreConfidence(signal: SignalResult): { level: string; color: string } {
  if (signal.confidence > 80) {
    return { level: 'VERY HIGH', color: '#10b981' };
  } else if (signal.confidence > 60) {
    return { level: 'HIGH', color: '#06b6d4' };
  } else if (signal.confidence > 40) {
    return { level: 'MEDIUM', color: '#f59e0b' };
  } else {
    return { level: 'LOW', color: '#ef4444' };
  }
}

/**
 * Validate signal robustness
 */
export function validateSignal(signal: SignalResult, historicalAccuracy: number): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check if confidence is above minimum threshold
  if (signal.confidence < 40) {
    issues.push('Confidence too low (< 40)');
  }
  
  // Check risk/reward ratio (assuming 2:1 ratio required)
  const potentialReward = Math.abs(signal.suggestedTP - signal.suggestedSL * 2);
  if (potentialReward <= 0) {
    issues.push('Unfavorable risk/reward ratio');
  }
  
  // Check historical accuracy
  if (signal.historicalWinRate < 0.45) {
    issues.push('Historical win rate too low (< 45%)');
  }
  
  // Check if sentiment conflicts significantly
  if (signal.factors.sentiment && signal.factors.sentiment < 30 && signal.type === 'BUY') {
    issues.push('Negative sentiment conflicts with buy signal');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Calculate backtesting metrics
 */
export function backTestResults(trades: { profitable: boolean; pnl: number }[]) {
  if (trades.length === 0) return null;
  
  const profitable = trades.filter(t => t.profitable).length;
  const winRate = profitable / trades.length;
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const avgPnL = totalPnL / trades.length;
  const maxWin = Math.max(...trades.map(t => t.pnl));
  const maxLoss = Math.min(...trades.map(t => t.pnl));
  
  return {
    totalTrades: trades.length,
    profitableTrades: profitable,
    winRate,
    totalPnL,
    avgPnL,
    maxWin,
    maxLoss,
    profitFactor: maxWin === 0 ? 0 : Math.abs(maxWin / maxLoss),
  };
}
