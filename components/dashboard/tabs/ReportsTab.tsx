'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReportsTab() {
  return (
    <div className="space-y-4">
      {/* Weekly Summary */}
      <Card className="border border-border bg-card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Weekly Performance Report</h3>
            <p className="text-sm text-muted-foreground mt-1">Week of Jan 15-19, 2024</p>
          </div>
          <BarChart3 className="h-6 w-6 text-[#06b6d4]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded border border-border/30 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">Signals Generated</p>
            <p className="text-2xl font-bold text-foreground mt-2">24</p>
          </div>
          <div className="rounded border border-border/30 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">Profitable Trades</p>
            <p className="text-2xl font-bold text-[#10b981] mt-2">16</p>
          </div>
          <div className="rounded border border-border/30 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold text-[#06b6d4] mt-2">66.7%</p>
          </div>
          <div className="rounded border border-border/30 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">Avg Return</p>
            <p className="text-2xl font-bold text-[#f59e0b] mt-2">2.4%</p>
          </div>
        </div>
      </Card>

      {/* Strategy Comparison: Simple vs Advanced */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Strategy Comparison: Simple Baseline vs Advanced</h3>
        <p className="text-sm text-muted-foreground mb-4">Institutional approach: simple models often outperform on out-of-sample tests</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="rounded border border-[#10b981]/30 bg-[#10b981]/5 p-4">
            <p className="text-xs font-semibold text-[#10b981] mb-2">WINNING STRATEGY</p>
            <p className="text-lg font-bold text-foreground">Baseline Model</p>
            <p className="text-2xl font-bold text-[#10b981] mt-2">0.89</p>
            <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
          </div>

          <div className="rounded border border-border/30 bg-muted/20 p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">ADVANCED MODEL</p>
            <p className="text-lg font-bold text-foreground">ML + IV + OI</p>
            <p className="text-2xl font-bold text-foreground mt-2">0.74</p>
            <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
          </div>

          <div className="rounded border border-border/30 bg-muted/20 p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">STATISTICAL SIGNIFICANCE</p>
            <p className="text-lg font-bold text-foreground">P-Value</p>
            <p className="text-2xl font-bold text-foreground mt-2">0.08</p>
            <p className="text-xs text-muted-foreground">Marginally Significant</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded border border-border/30 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Simple: Cointegration Only</span>
              <span className="text-sm font-semibold text-[#10b981]">DEPLOYED</span>
            </div>
            <div className="space-y-1 text-sm text-foreground/90">
              <p>Win Rate: 68% | Return: 2.85% | T-Stat: 2.14</p>
              <p>Parameter Stability: 94% (highly robust)</p>
              <p>Out-of-Sample Performance: 2.31% (confirms generalization)</p>
            </div>
          </div>

          <div className="p-3 rounded border border-border/30 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Advanced: + IV + OI + Sentiment</span>
              <span className="text-sm font-semibold text-[#f59e0b]">MONITORING</span>
            </div>
            <div className="space-y-1 text-sm text-foreground/90">
              <p>Win Rate: 65% | Return: 2.41% | T-Stat: 1.68</p>
              <p>Parameter Stability: 76% (less robust, may overfit)</p>
              <p>Out-of-Sample Performance: 1.92% (underperforms in-sample)</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded border border-[#06b6d4]/20 bg-[#06b6d4]/5">
          <p className="text-sm font-medium text-[#06b6d4] mb-1">Recommendation:</p>
          <p className="text-sm text-foreground">
            Keep simple baseline deployed. Advanced model shows worse out-of-sample performance and parameter instability. Monitor advanced model for 4-6 weeks; redeploy only if it beats baseline on walk-forward tests.
          </p>
        </div>
      </Card>

      {/* Validation Metrics */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Statistical Validation Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-border/30 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground mb-2">SHARPE RATIO</p>
            <p className="text-3xl font-bold text-[#06b6d4]">0.89</p>
            <p className="text-xs text-muted-foreground mt-1">Target: {'>'} 0.70</p>
          </div>

          <div className="p-4 rounded border border-border/30 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground mb-2">T-STATISTIC</p>
            <p className="text-3xl font-bold text-[#10b981]">2.14</p>
            <p className="text-xs text-muted-foreground mt-1">Significance: 95% confidence</p>
          </div>

          <div className="p-4 rounded border border-border/30 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground mb-2">P-VALUE</p>
            <p className="text-3xl font-bold text-[#10b981]">0.031</p>
            <p className="text-xs text-muted-foreground mt-1">Statistically significant</p>
          </div>

          <div className="p-4 rounded border border-border/30 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground mb-2">INFORMATION RATIO</p>
            <p className="text-3xl font-bold text-foreground">1.24</p>
            <p className="text-xs text-muted-foreground mt-1">Alpha generation: Positive</p>
          </div>

          <div className="p-4 rounded border border-border/30 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground mb-2">CALMAR RATIO</p>
            <p className="text-3xl font-bold text-foreground">0.84</p>
            <p className="text-xs text-muted-foreground mt-1">Return / Max Drawdown</p>
          </div>

          <div className="p-4 rounded border border-border/30 bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground mb-2">MAX DRAWDOWN</p>
            <p className="text-3xl font-bold text-[#ef4444]">-8.2%</p>
            <p className="text-xs text-muted-foreground mt-1">Recovery: 15 trading days</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded border border-[#10b981]/20 bg-[#10b981]/5">
          <p className="text-sm text-[#10b981] font-medium">✓ VALIDATION PASSED</p>
          <p className="text-sm text-foreground mt-1">
            Strategy is statistically significant (T-stat 2.14, p-value 0.031). Out-of-sample performance (2.31%) confirms real edge. Parameter stability at 94% indicates robustness against small market changes.
          </p>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights & Recommendations</h3>
        <div className="space-y-3">
          <div className="flex gap-3 p-3 rounded border border-[#10b981]/20 bg-[#10b981]/5">
            <CheckCircle className="h-5 w-5 text-[#10b981] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Strong Performance in IT Pairs</p>
              <p className="text-sm text-foreground/90">
                INFY/WIPRO showing 72% win rate. Cointegration strength (0.79) remains stable.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded border border-[#f59e0b]/20 bg-[#f59e0b]/5">
            <AlertCircle className="h-5 w-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Banking Pairs Showing Breakdown</p>
              <p className="text-sm text-foreground/90">
                HDFC/ICICIBANK correlation declined to 0.64 (from 0.71). Monitor for strategy adjustment.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded border border-[#ef4444]/20 bg-[#ef4444]/5">
            <AlertCircle className="h-5 w-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Sentiment vs Technical Divergence</p>
              <p className="text-sm text-foreground/90">
                Energy stocks showing negative sentiment but positive technical setup. Verify before trading.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Next Week Outlook */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Next Week Outlook</h3>
        <div className="space-y-2 text-sm text-foreground/90">
          <p>
            📊 <strong>Catalyst Watch:</strong> RBI Monetary Policy (Wednesday) - expect volatility spike in banking pairs.
          </p>
          <p>
            📈 <strong>Sector Focus:</strong> IT likely to outperform on global demand recovery signals.
          </p>
          <p>
            ⚠️ <strong>Risk Alert:</strong> Oil volatility may compress RELIANCE/ONGC spread - monitor daily.
          </p>
          <p>
            💡 <strong>Recommendation:</strong> Increase position sizing in confirmed high-confidence signals ({'>'}80%).
          </p>
        </div>
      </Card>

      {/* User vs AI Performance */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">User vs AI Decision Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-center p-4 rounded border border-border/30 bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2">AI Decisions</p>
              <p className="text-3xl font-bold text-[#06b6d4] mb-1">68%</p>
              <p className="text-sm text-muted-foreground">Win Rate (34/50 trades)</p>
            </div>
            <p className="text-sm text-foreground/90">
              AI followed signals: 50 trades
              Average P&L: +$2,345
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-center p-4 rounded border border-border/30 bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2">User Overrides</p>
              <p className="text-3xl font-bold text-[#10b981] mb-1">72%</p>
              <p className="text-sm text-muted-foreground">Win Rate (18/25 trades)</p>
            </div>
            <p className="text-sm text-foreground/90">
              User rejected/modified: 25 trades
              Average P&L: +$1,890
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded border border-[#06b6d4]/20 bg-[#06b6d4]/5">
          <p className="text-sm text-foreground">
            AI strategy outperforming slightly. User overrides show good market intuition on 3-4 rejections. Continue tracking for insights.
          </p>
        </div>
      </Card>

      {/* Historical Accuracy */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Historical Signal Accuracy</h3>
        <div className="space-y-3">
          {[
            { zscore: '> 2.5σ', accuracy: 0.82, samples: 34 },
            { zscore: '2.0-2.5σ', accuracy: 0.71, samples: 42 },
            { zscore: '1.5-2.0σ', accuracy: 0.58, samples: 56 },
            { zscore: '< 1.5σ', accuracy: 0.45, samples: 78 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="font-mono text-sm font-semibold text-muted-foreground">{item.zscore}</span>
              <div className="w-32 h-2 rounded-full bg-muted/40 overflow-hidden">
                <div
                  className="h-full bg-[#06b6d4]"
                  style={{ width: `${item.accuracy * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground text-right">
                {(item.accuracy * 100).toFixed(0)}% ({item.samples})
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
