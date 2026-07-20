'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function CommoditiesTab() {
  const commodities = [
    {
      id: 1,
      name: 'Crude Oil (Brent)',
      symbol: 'BRENT',
      price: 78.45,
      change: 2.15,
      changePercent: 2.81,
      high52w: 92.50,
      low52w: 65.30,
      impact: 'RELIANCE, ONGC',
    },
    {
      id: 2,
      name: 'Gold',
      symbol: 'GOLD',
      price: 2145.80,
      change: -8.30,
      changePercent: -0.39,
      high52w: 2175.50,
      low52w: 1810.00,
      impact: 'GOLDBEES, Multibagger Funds',
    },
    {
      id: 3,
      name: 'Natural Gas',
      symbol: 'NATGAS',
      price: 2.85,
      change: 0.12,
      changePercent: 4.38,
      high52w: 3.20,
      low52w: 2.10,
      impact: 'GAIL, NTPC',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {commodities.map((commodity) => (
          <Card key={commodity.id} className="border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{commodity.name}</h3>
                <p className="text-xs text-muted-foreground">{commodity.symbol}</p>
              </div>
              {commodity.changePercent > 0 ? (
                <TrendingUp className="h-5 w-5 text-[#10b981]" />
              ) : (
                <TrendingDown className="h-5 w-5 text-[#ef4444]" />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-mono text-2xl font-bold text-foreground">
                  ${commodity.price.toFixed(2)}
                </p>
                <p className={`text-sm font-semibold ${
                  commodity.changePercent > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                }`}>
                  {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)} (
                  {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">52W High</p>
                  <p className="font-mono font-semibold text-foreground">
                    ${commodity.high52w.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">52W Low</p>
                  <p className="font-mono font-semibold text-foreground">
                    ${commodity.low52w.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Impacts</p>
                <p className="text-sm text-foreground">{commodity.impact}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
