'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export default function NewsTab() {
  const newsItems = [
    {
      id: 1,
      title: 'INFY Q3 Results Beat Estimates',
      sentiment: 'positive',
      source: 'Business Today',
      impact: 'high',
      time: '2 hours ago',
      relatedStocks: ['INFY', 'WIPRO'],
    },
    {
      id: 2,
      title: 'RBI Signals Pause in Rate Cuts',
      sentiment: 'negative',
      source: 'Reuters',
      impact: 'high',
      time: '4 hours ago',
      relatedStocks: ['ICICIBANK', 'SBIN'],
    },
    {
      id: 3,
      title: 'Oil Prices Surge on Geopolitical Tensions',
      sentiment: 'positive',
      source: 'Bloomberg',
      impact: 'medium',
      time: '6 hours ago',
      relatedStocks: ['RELIANCE', 'ONGC'],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {newsItems.map((news) => (
          <Card key={news.id} className="border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                {news.sentiment === 'positive' ? (
                  <TrendingUp className="h-6 w-6 text-[#10b981]" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-[#ef4444]" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{news.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {news.source} • {news.time}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {news.relatedStocks.map((stock) => (
                    <span
                      key={stock}
                      className="inline-block rounded-full bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-foreground"
                    >
                      {stock}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                  news.impact === 'high'
                    ? 'bg-[#ef4444]/20 text-[#ef4444]'
                    : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                }`}>
                  {news.impact.toUpperCase()} IMPACT
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
