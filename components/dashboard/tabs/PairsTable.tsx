'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePairsData } from '@/hooks/useMarketData';

interface PairSignal {
  id: string;
  stock1: string;
  stock2: string;
  correlation: number;
  cointegration: number;
  currentSpread: number;
  zScore: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reason: string;
  counterArgument: string;
  historicalWinRate: number;
  riskScore: number;
  expandedId?: string;
}

const mockPairs: PairSignal[] = [
  {
    id: '1',
    stock1: 'INFY',
    stock2: 'WIPRO',
    correlation: 0.82,
    cointegration: 0.78,
    currentSpread: 45.3,
    zScore: 2.14,
    signal: 'SELL',
    confidence: 82,
    reason: 'INFY overvalued vs WIPRO. Strong cointegration (78%) suggests reversion. Z-score 2.14 indicates extreme deviation.',
    counterArgument: 'Risk: Tech sector momentum could persist, earnings surprise from INFY, or correlation breakdown due to sector rotation.',
    historicalWinRate: 0.68,
    riskScore: 28,
  },
  {
    id: '2',
    stock1: 'RELIANCE',
    stock2: 'ONGC',
    correlation: 0.71,
    cointegration: 0.75,
    currentSpread: -12.5,
    zScore: -1.92,
    signal: 'BUY',
    confidence: 76,
    reason: 'RELIANCE undervalued vs ONGC. Strong cointegration indicates mean reversion. Negative Z-score signals entry opportunity.',
    counterArgument: 'Risk: Oil price decline could pressure both, geopolitical risks, or energy sector headwinds.',
    historicalWinRate: 0.64,
    riskScore: 35,
  },
  {
    id: '3',
    stock1: 'HDFC',
    stock2: 'ICICIBANK',
    correlation: 0.68,
    cointegration: 0.72,
    currentSpread: 22.1,
    zScore: 1.45,
    signal: 'HOLD',
    confidence: 52,
    reason: 'Moderate divergence between banking stocks. Cointegration still strong (72%) but Z-score not extreme enough for signal.',
    counterArgument: 'Market sentiment could shift either way based on RBI policy decisions.',
    historicalWinRate: 0.55,
    riskScore: 42,
  },
];

export default function PairsTable() {
  const { pairs: apiPairs, isLoading, error } = usePairsData();
  const [pairs, setPairs] = useState<PairSignal[]>(mockPairs);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Use API data if available, fallback to mock data
  useEffect(() => {
    if (apiPairs && apiPairs.length > 0) {
      setPairs(apiPairs);
    }
  }, [apiPairs]);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return 'text-[#10b981]';
      case 'SELL':
        return 'text-[#ef4444]';
      default:
        return 'text-[#f59e0b]';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 80) return 'bg-[#10b981]/20 text-[#10b981]';
    if (confidence > 60) return 'bg-[#06b6d4]/20 text-[#06b6d4]';
    if (confidence > 40) return 'bg-[#f59e0b]/20 text-[#f59e0b]';
    return 'bg-[#ef4444]/20 text-[#ef4444]';
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader className="h-5 w-5 animate-spin mr-2" />
          <span>Loading market data...</span>
        </div>
      )}

      {error && (
        <Card className="border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-4">
          <p className="text-sm text-[#f59e0b]">
            Using cached data. Real-time API unavailable.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {pairs.map((pair) => (
          <Card
            key={pair.id}
            className="overflow-hidden border border-border bg-card hover:border-accent/50 transition-colors"
          >
            {/* Pair Header */}
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30"
              onClick={() => toggleExpand(pair.id)}
            >
              <div className="flex items-center gap-6 flex-1">
                {/* Pair Names */}
                <div className="min-w-max">
                  <p className="font-mono text-lg font-semibold">{pair.stock1}</p>
                  <p className="text-xs text-muted-foreground">vs {pair.stock2}</p>
                </div>

                {/* Correlation & Cointegration */}
                <div className="min-w-max">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Corr: </span>
                    <span className="font-mono font-semibold text-foreground">
                      {(pair.correlation * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Coint: </span>
                    <span className="font-mono font-semibold text-foreground">
                      {(pair.cointegration * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Spread & Z-Score */}
                <div className="min-w-max">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Spread: </span>
                    <span
                      className={`font-mono font-semibold ${
                        pair.currentSpread > 0 ? 'text-[#ef4444]' : 'text-[#10b981]'
                      }`}
                    >
                      {pair.currentSpread.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Z-Score: </span>
                    <span className="font-mono font-semibold text-foreground">
                      {pair.zScore.toFixed(2)}σ
                    </span>
                  </div>
                </div>
              </div>

              {/* Signal & Confidence */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-bold text-lg ${getSignalColor(pair.signal)}`}>
                    {pair.signal}
                  </p>
                  <p className={`text-xs font-semibold rounded px-2 py-1 mt-1 ${getConfidenceColor(
                    pair.confidence
                  )}`}>
                    {pair.confidence}%
                  </p>
                </div>

                {pair.signal === 'BUY' && (
                  <TrendingUp className="h-6 w-6 text-[#10b981]" />
                )}
                {pair.signal === 'SELL' && (
                  <TrendingDown className="h-6 w-6 text-[#ef4444]" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === pair.id && (
              <div className="border-t border-border bg-muted/20 px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-accent mb-2">
                        {pair.signal === 'BUY' ? '✓ BUY THESIS' : '✕ SELL THESIS'}
                      </h4>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {pair.reason}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#ef4444] mb-2">
                        ⚠ COUNTER-ARGUMENT
                      </h4>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {pair.counterArgument}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded border border-border/30 bg-muted/40 px-3 py-2">
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="font-mono font-semibold text-lg">
                          {(pair.historicalWinRate * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pair.historicalWinRate > 0.5 ? '✓ Profitable' : '✕ Needs work'}
                        </p>
                      </div>

                      <div className="rounded border border-border/30 bg-muted/40 px-3 py-2">
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                        <p className={`font-mono font-semibold text-lg ${
                          pair.riskScore < 30
                            ? 'text-[#10b981]'
                            : pair.riskScore < 50
                            ? 'text-[#f59e0b]'
                            : 'text-[#ef4444]'
                        }`}>
                          {pair.riskScore}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pair.riskScore < 30 ? 'Low' : pair.riskScore < 50 ? 'Medium' : 'High'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 text-black font-medium"
                          onClick={() => alert(`Approved trade: ${pair.stock1}/${pair.stock2}`)}
                        >
                          ✓ Approve Trade
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => alert(`Declined trade: ${pair.stock1}/${pair.stock2}`)}
                        >
                          ✕ Decline
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                        <p>Manual decision logs outcome for AI learning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Signal Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#10b981]">
              {pairs.filter(p => p.signal === 'BUY').length}
            </p>
            <p className="text-sm text-muted-foreground">Buy Signals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#ef4444]">
              {pairs.filter(p => p.signal === 'SELL').length}
            </p>
            <p className="text-sm text-muted-foreground">Sell Signals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#06b6d4]">
              {(pairs.reduce((sum, p) => sum + p.confidence, 0) / pairs.length).toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#f59e0b]">
              {(pairs.reduce((sum, p) => sum + p.historicalWinRate, 0) / pairs.length * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
