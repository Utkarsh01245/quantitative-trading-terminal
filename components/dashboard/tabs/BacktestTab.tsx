'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BacktestTab() {
  const [selectedPair, setSelectedPair] = useState('INFY/WIPRO');

  const backtestResults = {
    pair: 'INFY/WIPRO',
    periodStart: '2023-01-01',
    periodEnd: '2024-01-20',
    totalTrades: 34,
    profitableTrades: 23,
    winRate: 0.676,
    totalPnL: 4523.45,
    avgPnL: 133.04,
    maxWin: 892.30,
    maxLoss: -345.20,
    profitFactor: 2.85,
    sharpeRatio: 1.82,
    maxDrawdown: 0.12,
    expectancy: 131.2,
  };

  const walkForwardPeriods = [
    {
      period: 'Q1 2023 → Apr 2023',
      trades: 8,
      winRate: 0.75,
      pnl: 1245.30,
      sharpe: 1.95,
    },
    {
      period: 'Q2 2023 → Jul 2023',
      trades: 7,
      winRate: 0.71,
      pnl: 892.15,
      sharpe: 1.65,
    },
    {
      period: 'Q3 2023 → Oct 2023',
      trades: 9,
      winRate: 0.67,
      pnl: 1102.50,
      sharpe: 1.78,
    },
    {
      period: 'Q4 2023 → Jan 2024',
      trades: 10,
      winRate: 0.60,
      pnl: 283.50,
      sharpe: 1.42,
    },
  ];

  const parameterSensitivity = [
    { param: 'Z-Score > 1.5', winRate: 0.65, trades: 52 },
    { param: 'Z-Score > 2.0 (Baseline)', winRate: 0.68, trades: 34 },
    { param: 'Z-Score > 2.5', winRate: 0.72, trades: 18 },
    { param: 'Z-Score > 3.0', winRate: 0.78, trades: 8 },
  ];

  return (
    <div className="space-y-4">
      {/* Main Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            {backtestResults.pair} - Walk Forward Test
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded border border-border/30 bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {backtestResults.totalTrades}
                </p>
              </div>
              <div className="rounded border border-border/30 bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Profitable</p>
                <p className="text-2xl font-bold text-[#10b981] mt-1">
                  {backtestResults.profitableTrades}
                </p>
              </div>
            </div>

            <div className="rounded border border-border/30 bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground mb-2">Win Rate</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full bg-[#10b981]"
                    style={{ width: `${backtestResults.winRate * 100}%` }}
                  ></div>
                </div>
                <span className="font-mono font-bold text-[#10b981] ml-2">
                  {(backtestResults.winRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total PnL</p>
                <p className={`text-lg font-bold mt-1 ${
                  backtestResults.totalPnL > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                }`}>
                  ${backtestResults.totalPnL.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg PnL/Trade</p>
                <p className="text-lg font-bold text-foreground mt-1">
                  ${backtestResults.avgPnL.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Max Win</p>
                <p className="text-lg font-bold text-[#10b981] mt-1">
                  ${backtestResults.maxWin.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Max Loss</p>
                <p className="text-lg font-bold text-[#ef4444] mt-1">
                  ${backtestResults.maxLoss.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Profit Factor</p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {backtestResults.profitFactor.toFixed(2)}x
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                <p className="text-lg font-bold text-foreground mt-1">
                  {backtestResults.sharpeRatio.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Validation Summary */}
        <Card className="border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Strategy Validation
          </h3>

          <div className="space-y-3">
            <div className="flex gap-3 p-3 rounded border border-[#10b981]/20 bg-[#10b981]/5">
              <CheckCircle className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Win Rate {'>'} 65%</p>
                <p className="text-sm text-foreground/90">
                  Baseline threshold achieved: {(backtestResults.winRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded border border-[#10b981]/20 bg-[#10b981]/5">
              <CheckCircle className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Profit Factor {'>'} 1.5</p>
                <p className="text-sm text-foreground/90">
                  Current factor: {backtestResults.profitFactor.toFixed(2)}x (Good quality)
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded border border-[#10b981]/20 bg-[#10b981]/5">
              <CheckCircle className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Sharpe Ratio {'>'} 1.0</p>
                <p className="text-sm text-foreground/90">
                  Risk-adjusted returns: {backtestResults.sharpeRatio.toFixed(2)} (Excellent)
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded border border-[#f59e0b]/20 bg-[#f59e0b]/5">
              <AlertCircle className="h-5 w-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Max Drawdown: {(backtestResults.maxDrawdown * 100).toFixed(1)}%</p>
                <p className="text-sm text-foreground/90">
                  Within acceptable range ({'<'}20%)
                </p>
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded border border-border/30 mt-4">
              <p className="text-sm font-semibold text-foreground mb-1">Overall Assessment</p>
              <p className="text-sm text-foreground/90">
                Strategy shows consistent profitability with good risk-adjusted returns. Recommended for live trading with proper position sizing.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Walk Forward Periods */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Walk Forward Analysis</h3>
        <div className="space-y-2">
          {walkForwardPeriods.map((period, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded border border-border/30 hover:border-accent/50 transition-colors bg-muted/10">
              <div className="flex-1">
                <p className="font-medium text-foreground">{period.period}</p>
                <p className="text-xs text-muted-foreground">
                  {period.trades} trades
                </p>
              </div>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {(period.winRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${
                    period.pnl > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                  }`}>
                    ${period.pnl.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">PnL</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {period.sharpe.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Sharpe</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Parameter Sensitivity */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Parameter Sensitivity Analysis</h3>
        <div className="space-y-2">
          {parameterSensitivity.map((item, idx) => (
            <div key={idx} className={`p-3 rounded border ${
              item.param.includes('2.0') ? 'border-[#06b6d4]/50 bg-[#06b6d4]/5' : 'border-border/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{item.param}</p>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-muted/40 text-muted-foreground">
                  {item.trades} trades
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full bg-[#06b6d4]"
                    style={{ width: `${item.winRate * 100}%` }}
                  ></div>
                </div>
                <span className="font-mono font-semibold text-foreground ml-2">
                  {(item.winRate * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Results show strategy is stable across parameters. Z-Score threshold of 2.0 balances between sample size and win rate.
        </p>
      </Card>

      {/* Recommendations */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recommendations</h3>
        <ul className="space-y-2 text-sm text-foreground/90">
          <li>✓ Strategy validated for production trading</li>
          <li>✓ Use baseline (simple) model - no need for advanced factors</li>
          <li>✓ Position size: 2-3% risk per trade maximum</li>
          <li>✓ Monitor live performance vs backtest monthly</li>
          <li>⚠ Review if win rate drops below 60% in any month</li>
          <li>⚠ Consider re-calibration if correlation changes significantly</li>
        </ul>
      </Card>
    </div>
  );
}
