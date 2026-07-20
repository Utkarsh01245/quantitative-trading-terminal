'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';

export default function EarningsTab() {
  const earnings = [
    {
      id: 1,
      symbol: 'INFY',
      company: 'Infosys',
      date: '2024-01-22',
      status: 'upcoming',
      eps: 1.45,
      epsEstimate: 1.42,
      surprise: 2.1,
      market: 'NSE',
    },
    {
      id: 2,
      symbol: 'RELIANCE',
      company: 'Reliance Industries',
      date: '2024-01-20',
      status: 'reported',
      eps: 8.23,
      epsEstimate: 8.10,
      surprise: 1.6,
      market: 'NSE',
    },
    {
      id: 3,
      symbol: 'WIPRO',
      company: 'Wipro',
      date: '2024-01-18',
      status: 'reported',
      eps: 0.75,
      epsEstimate: 0.82,
      surprise: -8.5,
      market: 'NSE',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {earnings.map((earning) => (
          <Card key={earning.id} className="border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <Calendar className="h-6 w-6 text-[#06b6d4] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">{earning.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    {earning.symbol} • {new Date(earning.date).toLocaleDateString()}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Reported EPS</p>
                      <p className="font-mono font-semibold text-foreground">
                        {earning.eps?.toFixed(2) || 'TBD'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estimate</p>
                      <p className="font-mono font-semibold text-foreground">
                        {earning.epsEstimate?.toFixed(2) || 'TBD'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Surprise</p>
                      <p className={`font-mono font-semibold ${
                        earning.surprise > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
                      }`}>
                        {earning.surprise > 0 ? '+' : ''}{earning.surprise?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                  earning.status === 'upcoming'
                    ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                    : earning.surprise > 0
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#ef4444]/20 text-[#ef4444]'
                }`}>
                  {earning.status.toUpperCase()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
