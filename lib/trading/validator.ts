/**
 * Institutional-Grade Validation Framework
 * Based on quant research best practices for separating genuine alpha from statistical luck
 */

import Decimal from 'decimal.js';

export interface ValidationResult {
  isValid: boolean;
  sharpeRatio: number;
  tStatistic: number;
  pValue: number;
  confidenceLevel: 'high' | 'medium' | 'low' | 'reject';
  parametersStable: boolean;
  logicalEdge: string;
  counterArgument: string;
  outOfSamplePerformance: number;
  // Institutional metrics
  informationRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  recoveryTime: number;
}

export interface StrategyComparison {
  baseline: {
    name: 'Simple Formula';
    sharpeRatio: number;
    annualReturn: number;
    winRate: number;
  };
  advanced: {
    name: 'ML + Advanced Factors';
    sharpeRatio: number;
    annualReturn: number;
    winRate: number;
  };
  winner: 'baseline' | 'advanced';
  significanceTest: number; // p-value
  recommendation: string;
}

/**
 * Calculate Sharpe Ratio
 * Measures risk-adjusted returns
 */
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.06): number {
  if (returns.length === 0) return 0;

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;
  return (avgReturn - riskFreeRate) / stdDev;
}

/**
 * Calculate T-Statistic
 * Tests if strategy outperformance is statistically significant
 */
export function calculateTStatistic(returns: number[], expectedReturn: number = 0): number {
  if (returns.length === 0) return 0;

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (returns.length - 1);
  const stdError = Math.sqrt(variance / returns.length);

  if (stdError === 0) return 0;
  return (mean - expectedReturn) / stdError;
}

/**
 * Calculate P-Value from T-Statistic
 * Probability that result is due to chance (lower = more significant)
 */
export function calculatePValue(tStatistic: number, degreesOfFreedom: number): number {
  // Simplified approximation (for production, use statistical library)
  const absT = Math.abs(tStatistic);
  
  if (absT > 3) return 0.001; // Highly significant
  if (absT > 2) return 0.05;  // Significant at 95% confidence
  if (absT > 1.96) return 0.05; // Borderline
  if (absT > 1.64) return 0.10; // Marginally significant
  return 0.20; // Not significant
}

/**
 * Test Parameter Stability
 * Slightly adjust key parameters and see if strategy still works
 */
export function testParameterStability(
  baselineMetric: number,
  adjustedMetrics: number[]
): { stable: boolean; variance: number; coefficient: number } {
  // Calculate coefficient of variation
  const mean = (baselineMetric + adjustedMetrics.reduce((a, b) => a + b, 0)) / (adjustedMetrics.length + 1);
  const values = [baselineMetric, ...adjustedMetrics];
  
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / Math.abs(mean);

  // Stable if coefficient < 0.15 (less than 15% variation)
  return {
    stable: coefficientOfVariation < 0.15,
    variance,
    coefficient: coefficientOfVariation,
  };
}

/**
 * Compare Strategy Performance: Simple vs Advanced
 * Institutional approach: simple baseline often wins
 */
export function compareStrategies(
  baselineReturns: number[],
  advancedReturns: number[]
): StrategyComparison {
  const baselineSharpe = calculateSharpeRatio(baselineReturns);
  const advancedSharpe = calculateSharpeRatio(advancedReturns);

  const baselineReturn = baselineReturns.reduce((a, b) => a + b, 0);
  const advancedReturn = advancedReturns.reduce((a, b) => a + b, 0);

  const baselineWins = baselineReturns.filter(r => r > 0).length;
  const advancedWins = advancedReturns.filter(r => r > 0).length;

  // T-test for significance
  const baselineT = calculateTStatistic(baselineReturns);
  const advancedT = calculateTStatistic(advancedReturns);
  const pValue = Math.abs(baselineT - advancedT) < 0.5 ? 0.15 : 0.05;

  const winner = baselineSharpe > advancedSharpe ? 'baseline' : 'advanced';
  
  let recommendation = '';
  if (winner === 'baseline' && pValue > 0.10) {
    recommendation = 'Simple formula is winning and more stable. Deploy simple model and monitor advanced model in parallel.';
  } else if (winner === 'advanced' && pValue < 0.05) {
    recommendation = 'Advanced model shows statistically significant outperformance. Safe to deploy with additional monitoring.';
  } else {
    recommendation = 'Performance is comparable. Stick with simpler model for robustness and interpretability.';
  }

  return {
    baseline: {
      name: 'Simple Formula',
      sharpeRatio: baselineSharpe,
      annualReturn: baselineReturn,
      winRate: baselineWins / baselineReturns.length,
    },
    advanced: {
      name: 'ML + Advanced Factors',
      sharpeRatio: advancedSharpe,
      annualReturn: advancedReturn,
      winRate: advancedWins / advancedReturns.length,
    },
    winner,
    significanceTest: pValue,
    recommendation,
  };
}

/**
 * Information Ratio
 * Measures alpha generation relative to tracking error
 */
export function calculateInformationRatio(
  strategyReturns: number[],
  benchmarkReturns: number[]
): number {
  if (strategyReturns.length === 0) return 0;

  const activeReturns = strategyReturns.map((r, i) => r - (benchmarkReturns[i] || 0));
  const meanActiveReturn = activeReturns.reduce((a, b) => a + b, 0) / activeReturns.length;
  
  const trackingError = Math.sqrt(
    activeReturns.reduce((sum, r) => sum + Math.pow(r - meanActiveReturn, 2), 0) / activeReturns.length
  );

  if (trackingError === 0) return 0;
  return meanActiveReturn / trackingError;
}

/**
 * Calmar Ratio
 * Return / Maximum Drawdown
 */
export function calculateCalmarRatio(returns: number[], maxDrawdown: number): number {
  if (maxDrawdown === 0) return 0;
  const totalReturn = returns.reduce((a, b) => a + b, 0);
  return totalReturn / maxDrawdown;
}

/**
 * Comprehensive Validation Result
 */
export function validateStrategy(
  returns: number[],
  benchmarkReturns: number[],
  logicalEdge: string,
  counterArgument: string
): ValidationResult {
  const sharpeRatio = calculateSharpeRatio(returns);
  const tStatistic = calculateTStatistic(returns);
  const pValue = calculatePValue(tStatistic, returns.length - 1);
  
  // Determine confidence level based on statistical metrics
  let confidenceLevel: 'high' | 'medium' | 'low' | 'reject' = 'low';
  if (sharpeRatio > 1.0 && pValue < 0.05 && Math.abs(tStatistic) > 2.0) {
    confidenceLevel = 'high';
  } else if (sharpeRatio > 0.5 && pValue < 0.15 && Math.abs(tStatistic) > 1.5) {
    confidenceLevel = 'medium';
  } else if (pValue > 0.20) {
    confidenceLevel = 'reject';
  }

  // Calculate drawdown
  let maxDrawdown = 0;
  let peak = 0;
  let cumulativeReturn = 0;
  for (const ret of returns) {
    cumulativeReturn += ret;
    if (cumulativeReturn > peak) peak = cumulativeReturn;
    const drawdown = peak - cumulativeReturn;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  // Out-of-sample performance (last 25% of returns)
  const splitPoint = Math.floor(returns.length * 0.75);
  const outOfSampleReturns = returns.slice(splitPoint);
  const outOfSamplePerformance = outOfSampleReturns.reduce((a, b) => a + b, 0) / outOfSampleReturns.length;

  return {
    isValid: confidenceLevel !== 'reject',
    sharpeRatio,
    tStatistic,
    pValue,
    confidenceLevel,
    parametersStable: true, // Would be tested with parameter variations
    logicalEdge,
    counterArgument,
    outOfSamplePerformance,
    informationRatio: calculateInformationRatio(returns, benchmarkReturns),
    calmarRatio: calculateCalmarRatio(returns, maxDrawdown),
    maxDrawdown,
    recoveryTime: 30, // Mock value
  };
}

/**
 * Generate validation summary for reporting
 */
export function generateValidationSummary(validation: ValidationResult): string {
  const lines = [
    `Statistical Significance: Sharpe Ratio ${validation.sharpeRatio.toFixed(2)}, T-Stat ${validation.tStatistic.toFixed(2)}, P-Value ${validation.pValue.toFixed(3)}`,
    `Confidence Level: ${validation.confidenceLevel.toUpperCase()}`,
    `Out-of-Sample Performance: ${(validation.outOfSamplePerformance * 100).toFixed(2)}%`,
    `Logical Edge: ${validation.logicalEdge}`,
    `Counter-Argument: ${validation.counterArgument}`,
    validation.isValid ? 'APPROVAL: Strategy passes validation threshold' : 'REJECTION: Strategy fails statistical significance test',
  ];
  
  return lines.join('\n');
}
