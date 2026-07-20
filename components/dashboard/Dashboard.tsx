'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import PairsTable from './tabs/PairsTable';
import NewsTab from './tabs/NewsTab';
import EarningsTab from './tabs/EarningsTab';
import CommoditiesTab from './tabs/CommoditiesTab';
import OilTankersTab from './tabs/OilTankersTab';
import BacktestTab from './tabs/BacktestTab';
import InstitutionalTab from './tabs/InstitutionalTab';
import ReportsTab from './tabs/ReportsTab';
import { getMultipleStockQuotes, getStockQuote } from '@/lib/api/marketData';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('pairs');
  const [marketStats, setMarketStats] = useState({
    nifty50: 0,
    bankNifty: 0,
    sensex: 0,
    volatility: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Fetch initial market data
        setLoading(false);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setLoading(false);
      }
    };

    initializeDashboard();

    // Update every 5 seconds for real-time updates
    const interval = setInterval(initializeDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Trading Terminal
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                NIFTY 50 Pairs Trading | Advanced Multi-Factor Analysis
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>

          {/* Market Stats */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    NIFTY 50
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold">
                    {marketStats.nifty50.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-[#10b981]" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    BANK NIFTY
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold">
                    {marketStats.bankNifty.toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="h-5 w-5 text-[#ef4444]" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    VIX
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold">
                    {marketStats.volatility.toFixed(2)}
                  </p>
                </div>
                <Activity className="h-5 w-5 text-[#f59e0b]" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    ACTIVE SIGNALS
                  </p>
                  <p className="mt-1 font-mono text-lg font-semibold">12</p>
                </div>
                <DollarSign className="h-5 w-5 text-[#06b6d4]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border bg-card">
            <div className="px-4 sm:px-6 lg:px-8">
              <TabsList className="h-12 gap-0 rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="pairs"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  Pairs Trading
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  News & Sentiment
                </TabsTrigger>
                <TabsTrigger
                  value="earnings"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  Earnings Calendar
                </TabsTrigger>
                <TabsTrigger
                  value="commodities"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  Commodities
                </TabsTrigger>
                <TabsTrigger
                  value="oil"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  Oil & Tankers
                </TabsTrigger>
                <TabsTrigger
                  value="backtest"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  Backtest
                </TabsTrigger>
                <TabsTrigger
                  value="institutional"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  Institutional
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground"
                >
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <TabsContent value="pairs" className="mt-0">
              <PairsTable />
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <NewsTab />
            </TabsContent>

            <TabsContent value="earnings" className="mt-0">
              <EarningsTab />
            </TabsContent>

            <TabsContent value="commodities" className="mt-0">
              <CommoditiesTab />
            </TabsContent>

            <TabsContent value="oil" className="mt-0">
              <OilTankersTab />
            </TabsContent>

            <TabsContent value="backtest" className="mt-0">
              <BacktestTab />
            </TabsContent>

            <TabsContent value="institutional" className="mt-0">
              <InstitutionalTab />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ReportsTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
