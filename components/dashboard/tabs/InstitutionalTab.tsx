'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export default function InstitutionalTab() {
  const fiiDiiData = {
    date: '2024-01-20',
    fiiNetBuy: 2543.5,
    diiNetBuy: -1205.3,
    fiiYearToDate: 15234.8,
  };

  const topFIIBuyers = [
    { symbol: 'INFY', amount: 523.4, trend: 'up' },
    { symbol: 'HDFC', amount: 412.7, trend: 'up' },
    { symbol: 'RELIANCE', amount: 367.2, trend: 'down' },
    { symbol: 'ITC', amount: 298.5, trend: 'up' },
    { symbol: 'MARUTI', amount: 256.8, trend: 'down' },
  ];

  return (
    <div className="space-y-4">
      {/* FII/DII Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                FII Net Today
              </p>
              <p className={`mt-2 font-mono text-2xl font-bold ${
                fiiDiiData.fiiNetBuy > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}>
                ${(fiiDiiData.fiiNetBuy / 1000).toFixed(1)}B
              </p>
            </div>
            {fiiDiiData.fiiNetBuy > 0 ? (
              <TrendingUp className="h-6 w-6 text-[#10b981]" />
            ) : (
              <TrendingDown className="h-6 w-6 text-[#ef4444]" />
            )}
          </div>
        </Card>

        <Card className="border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                DII Net Today
              </p>
              <p className={`mt-2 font-mono text-2xl font-bold ${
                fiiDiiData.diiNetBuy > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}>
                ${(fiiDiiData.diiNetBuy / 1000).toFixed(1)}B
              </p>
            </div>
            {fiiDiiData.diiNetBuy > 0 ? (
              <TrendingUp className="h-6 w-6 text-[#10b981]" />
            ) : (
              <TrendingDown className="h-6 w-6 text-[#ef4444]" />
            )}
          </div>
        </Card>

        <Card className="border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                FII YTD
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-[#10b981]">
                ${(fiiDiiData.fiiYearToDate / 1000).toFixed(1)}B
              </p>
            </div>
            <BarChart3 className="h-6 w-6 text-[#06b6d4]" />
          </div>
        </Card>
      </div>

      {/* Top FII Buying */}
      <Card className="border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Top FII Buying (Today)</h3>
        <div className="space-y-2">
          {topFIIBuyers.map((stock, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded border border-border/30 hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="font-mono font-semibold w-12 text-center">{stock.symbol}</div>
                <div className="flex-1">
                  <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#06b6d4] h-full"
                      style={{ width: `${(stock.amount / 600) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="font-mono font-semibold text-foreground">
                  ${stock.amount.toFixed(1)}M
                </p>
                <p className={`text-xs font-semibold ${
                  stock.trend === 'up' ? 'text-[#10b981]' : 'text-[#ef4444]'
                }`}>
                  {stock.trend === 'up' ? '↑' : '↓'} vs yesterday
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sector-wise FII Flow */}
      <Card className="border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Sector-wise FII Positioning</h3>
        <div className="space-y-3">
          {[
            { sector: 'IT', flow: 234.5, trend: 'up' },
            { sector: 'Financial Services', flow: -125.3, trend: 'down' },
            { sector: 'Energy', flow: 87.2, trend: 'up' },
            { sector: 'Consumer', flow: -42.1, trend: 'down' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <p className="font-medium text-foreground">{item.sector}</p>
              <p className={`font-mono font-semibold ${
                item.trend === 'up' ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}>
                {item.trend === 'up' ? '+' : ''}{item.flow.toFixed(1)}M
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
