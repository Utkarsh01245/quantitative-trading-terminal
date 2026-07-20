/**
 * Advanced Mathematical Models for Trading
 */

import Matrix from 'ml-matrix';
import jstat from 'jstat';
import Decimal from 'decimal.js';

/**
 * Calculate mean of array
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Calculate standard deviation
 */
export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculate Z-score for mean reversion
 * Z = (Current - Mean) / StdDev
 */
export function zScore(current: number, values: number[]): number {
  const avg = mean(values);
  const sd = stdDev(values);
  if (sd === 0) return 0;
  return (current - avg) / sd;
}

/**
 * Calculate Pearson correlation coefficient
 */
export function correlation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);
  
  let numerator = 0;
  let sumXSq = 0;
  let sumYSq = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumXSq += dx * dx;
    sumYSq += dy * dy;
  }
  
  const denominator = Math.sqrt(sumXSq * sumYSq);
  if (denominator === 0) return 0;
  
  return numerator / denominator;
}

/**
 * Linear regression
 * Returns {slope, intercept, rSquared}
 */
export function linearRegression(x: number[], y: number[]): { slope: number; intercept: number; rSquared: number } {
  if (x.length !== y.length || x.length < 2) return { slope: 0, intercept: 0, rSquared: 0 };
  
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);
  
  let numerator = 0;
  let denominator = 0;
  let ssTotal = 0;
  let ssRes = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denominator += dx * dx;
    ssTotal += dy * dy;
  }
  
  if (denominator === 0) return { slope: 0, intercept: 0, rSquared: 0 };
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  
  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    const residual = y[i] - predicted;
    ssRes += residual * residual;
  }
  
  const rSquared = ssTotal === 0 ? 0 : 1 - (ssRes / ssTotal);
  
  return { slope, intercept, rSquared };
}

/**
 * Johansen Cointegration Test
 * Simplified version - tests if two series are cointegrated
 * Returns cointegration score (0-1, higher = stronger cointegration)
 */
export function johannesCointegration(series1: number[], series2: number[]): { score: number; meanRevertingSpread: number[] } {
  if (series1.length !== series2.length || series1.length < 10) {
    return { score: 0, meanRevertingSpread: [] };
  }
  
  // Calculate spread
  const spread = series1.map((s1, i) => s1 - series2[i]);
  
  // Test if spread is stationary (mean-reverting)
  // Use Augmented Dickey-Fuller approximation
  const adf = augmentedDickeyFuller(spread);
  
  // Get regression fit quality
  const regression = linearRegression(
    Array.from({ length: series1.length }, (_, i) => i),
    spread
  );
  
  // Cointegration score combines ADF statistic and R-squared
  const score = Math.max(0, Math.min(1, (adf.score * 0.6 + regression.rSquared * 0.4)));
  
  return { score, meanRevertingSpread: spread };
}

/**
 * Simplified Augmented Dickey-Fuller test for stationarity
 * Returns score 0-1 (higher = more stationary = cointegrated)
 */
export function augmentedDickeyFuller(series: number[]): { score: number; pValue: number } {
  if (series.length < 3) return { score: 0, pValue: 1 };
  
  // First differences
  const diffs = [];
  for (let i = 1; i < series.length; i++) {
    diffs.push(series[i] - series[i - 1]);
  }
  
  // T-statistic approximation
  const meanDiff = mean(diffs);
  const sdDiff = stdDev(diffs);
  
  if (sdDiff === 0) return { score: 0, pValue: 1 };
  
  // Simple t-statistic for mean difference from 0
  const tStat = Math.abs(meanDiff / (sdDiff / Math.sqrt(diffs.length)));
  
  // P-value approximation (higher t = lower p-value = more stationary)
  const pValue = Math.max(0, 1 - (tStat / 10));
  const score = 1 - pValue;
  
  return { score: Math.max(0, Math.min(1, score)), pValue };
}

/**
 * Calculate Sharpe Ratio
 */
export function sharpeRatio(returns: number[], riskFreeRate: number = 0.04): number {
  if (returns.length < 2) return 0;
  
  const avgReturn = mean(returns);
  const sd = stdDev(returns);
  
  if (sd === 0) return 0;
  
  // Annualize: assuming daily returns, multiply by sqrt(252)
  return ((avgReturn - riskFreeRate / 252) / sd) * Math.sqrt(252);
}

/**
 * Calculate max drawdown
 */
export function maxDrawdown(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  let maxPrice = prices[0];
  let maxDD = 0;
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i];
    }
    const dd = (maxPrice - prices[i]) / maxPrice;
    if (dd > maxDD) {
      maxDD = dd;
    }
  }
  
  return maxDD;
}

/**
 * Calculate IV (Implied Volatility) Percentile
 */
export function ivPercentile(currentIV: number, ivHistoryLow: number, ivHistoryHigh: number): number {
  if (ivHistoryHigh === ivHistoryLow) return 0.5;
  const percentile = (currentIV - ivHistoryLow) / (ivHistoryHigh - ivHistoryLow);
  return Math.max(0, Math.min(1, percentile));
}

/**
 * Calculate Black-Scholes option value
 */
export function blackScholes(
  S: number, // Current stock price
  K: number, // Strike price
  T: number, // Time to expiration (years)
  r: number, // Risk-free rate
  sigma: number, // Volatility
  optionType: 'call' | 'put' = 'call'
): number {
  if (T <= 0 || sigma <= 0) return 0;
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  const N_d1 = normalCDF(d1);
  const N_d2 = normalCDF(d2);
  const N_neg_d1 = normalCDF(-d1);
  const N_neg_d2 = normalCDF(-d2);
  
  if (optionType === 'call') {
    return S * N_d1 - K * Math.exp(-r * T) * N_d2;
  } else {
    return K * Math.exp(-r * T) * N_neg_d2 - S * N_neg_d1;
  }
}

/**
 * Normal CDF approximation (error function)
 */
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * x);
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;
  const t5 = t4 * t;
  
  const result = 0.5 + sign * (a1 * t + a2 * t2 + a3 * t3 + a4 * t4 + a5 * t5) * Math.exp(-x * x);
  return Math.max(0, Math.min(1, result));
}

/**
 * Calculate Greeks for options
 */
export function greeks(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: 'call' | 'put' = 'call'
) {
  if (T <= 0 || sigma <= 0) {
    return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  }
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  const N_d1 = normalCDF(d1);
  const N_neg_d1 = normalCDF(-d1);
  const phi_d1 = Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
  
  let delta = optionType === 'call' ? N_d1 : N_d1 - 1;
  const gamma = phi_d1 / (S * sigma * Math.sqrt(T));
  const vega = S * phi_d1 * Math.sqrt(T) / 100; // Per 1% change
  const theta = (-S * phi_d1 * sigma) / (2 * Math.sqrt(T)) / 365; // Per day
  const rho = K * T * Math.exp(-r * T) * (optionType === 'call' ? normalCDF(d2) : -normalCDF(-d2)) / 100;
  
  return { delta, gamma, theta, vega, rho };
}

/**
 * Calculate win rate from trade results
 */
export function winRate(trades: { profitable: boolean }[]): number {
  if (trades.length === 0) return 0;
  const profitable = trades.filter(t => t.profitable).length;
  return profitable / trades.length;
}

/**
 * Statistical significance (t-test)
 */
export function tTest(sample1: number[], sample2: number[]): { tStat: number; pValue: number; significant: boolean } {
  if (sample1.length < 2 || sample2.length < 2) {
    return { tStat: 0, pValue: 1, significant: false };
  }
  
  const mean1 = mean(sample1);
  const mean2 = mean(sample2);
  const sd1 = stdDev(sample1);
  const sd2 = stdDev(sample2);
  
  const n1 = sample1.length;
  const n2 = sample2.length;
  
  const pooledSD = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2));
  
  if (pooledSD === 0) return { tStat: 0, pValue: 1, significant: false };
  
  const tStat = (mean1 - mean2) / (pooledSD * Math.sqrt(1 / n1 + 1 / n2));
  const df = n1 + n2 - 2;
  
  // P-value approximation (simplified)
  const pValue = Math.max(0, 1 - Math.abs(tStat) / 10);
  const significant = Math.abs(tStat) > 1.96; // 95% confidence
  
  return { tStat, pValue, significant };
}
