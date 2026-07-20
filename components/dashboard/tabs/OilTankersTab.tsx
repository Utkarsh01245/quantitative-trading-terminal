'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Ship, TrendingUp, TrendingDown } from 'lucide-react';

export default function OilTankersTab() {
  const tankerData = {
    dailyImport: 4250000,
    refineryCapacity: 250000,
    brentPrice: 78.45,
    trendPercent: 2.81,
    routes: [
      { name: 'Middle East → India', status: 'Active', tankers: 12, eta: '5-7 days' },
      { name: 'Russia → India', status: 'Active', tankers: 3, eta: '15-20 days' },
      { name: 'Africa → India', status: 'Limited', tankers: 2, eta: '20-25 days' },
    ],
  };

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Daily Imports
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">
                {(tankerData.dailyImport / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground mt-1">barrels/day</p>
            </div>
            <Ship className="h-6 w-6 text-[#06b6d4]" />
          </div>
        </Card>

        <Card className="border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Refinery Capacity
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">
                {(tankerData.refineryCapacity / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground mt-1">barrels/day</p>
            </div>
            <TrendingUp className="h-6 w-6 text-[#10b981]" />
          </div>
        </Card>

        <Card className="border border-border bg-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Brent Crude
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-foreground">
                ${tankerData.brentPrice.toFixed(2)}
              </p>
              <p className={`text-xs font-semibold mt-1 ${
                tankerData.trendPercent > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}>
                {tankerData.trendPercent > 0 ? '+' : ''}{tankerData.trendPercent.toFixed(2)}%
              </p>
            </div>
            {tankerData.trendPercent > 0 ? (
              <TrendingUp className="h-6 w-6 text-[#10b981]" />
            ) : (
              <TrendingDown className="h-6 w-6 text-[#ef4444]" />
            )}
          </div>
        </Card>
      </div>

      {/* Active Routes */}
      <Card className="border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Active Shipping Routes</h3>
        <div className="space-y-3">
          {tankerData.routes.map((route, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded border border-border/50 bg-muted/20">
              <div>
                <p className="font-medium text-foreground">{route.name}</p>
                <p className="text-sm text-muted-foreground">ETA: {route.eta}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{route.tankers}</p>
                  <p className="text-xs text-muted-foreground">Tankers</p>
                </div>
                <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                  route.status === 'Active'
                    ? 'bg-[#10b981]/20 text-[#10b981]'
                    : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                }`}>
                  {route.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Market Impact */}
      <Card className="border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Market Impact Analysis</h3>
        <div className="space-y-2 text-sm text-foreground/90">
          <p>
            • Rising oil imports indicate strong domestic demand → Positive for refineries (RELIANCE, IOC)
          </p>
          <p>
            • Current utilization rate is healthy → Margins under pressure from global oversupply
          </p>
          <p>
            • Geopolitical tensions elevating freight costs → Negative for import-dependent sectors
          </p>
          <p>
            • Correlation with crude prices remains strong (r = 0.92)
          </p>
        </div>
      </Card>
    </div>
  );
}
