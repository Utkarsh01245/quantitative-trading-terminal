/**
 * Trade Approval & Logging System
 * Tracks all signals, approvals, and outcomes for continuous learning
 */

export interface TradeSignal {
  id: string;
  pair: string;
  timestamp: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  reason: string;
  cointegration: number;
  zScore: number;
  spreadValue: number;
}

export interface TradeApproval {
  signalId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  userNotes?: string;
  reason?: string;
}

export interface ExecutedTrade {
  id: string;
  signalId: string;
  approvalId: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  entryTime: string;
  exitPrice?: number;
  exitTime?: string;
  pnl?: number;
  pnlPercent?: number;
  status: 'open' | 'closed' | 'cancelled';
  userOverride: boolean;
  overrideReason?: string;
}

export interface UserFeedback {
  tradeId: string;
  action: 'profitable' | 'loss' | 'cancelled';
  pnl?: number;
  notes?: string;
  timestamp: string;
}

/**
 * Trade approval workflow manager
 */
export class TradeApprovalWorkflow {
  private signals: Map<string, TradeSignal> = new Map();
  private approvals: Map<string, TradeApproval> = new Map();
  private trades: Map<string, ExecutedTrade> = new Map();
  private feedback: UserFeedback[] = [];

  /**
   * Submit signal for approval
   */
  submitSignal(signal: TradeSignal): void {
    this.signals.set(signal.id, signal);
    
    // Auto-create pending approval
    this.approvals.set(signal.id, {
      signalId: signal.id,
      status: 'pending',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Approve signal and execute trade
   */
  approveTrade(
    signalId: string,
    entryPrice: number,
    userOverride: boolean = false,
    overrideReason?: string
  ): ExecutedTrade | null {
    const signal = this.signals.get(signalId);
    const approval = this.approvals.get(signalId);

    if (!signal || !approval) return null;

    // Update approval
    approval.status = 'approved';
    approval.timestamp = new Date().toISOString();

    // Create trade
    const trade: ExecutedTrade = {
      id: `TRADE_${Date.now()}`,
      signalId,
      approvalId: signalId,
      pair: signal.pair,
      type: signal.type,
      entryPrice,
      entryTime: new Date().toISOString(),
      status: 'open',
      userOverride,
      overrideReason,
    };

    this.trades.set(trade.id, trade);
    return trade;
  }

  /**
   * Reject signal
   */
  rejectTrade(signalId: string, reason: string): void {
    const approval = this.approvals.get(signalId);
    if (approval) {
      approval.status = 'rejected';
      approval.reason = reason;
      approval.timestamp = new Date().toISOString();
    }
  }

  /**
   * Close trade with outcome
   */
  closeTrade(
    tradeId: string,
    exitPrice: number,
    feedback: UserFeedback
  ): ExecutedTrade | null {
    const trade = this.trades.get(tradeId);
    if (!trade) return null;

    trade.exitPrice = exitPrice;
    trade.exitTime = new Date().toISOString();
    trade.status = 'closed';
    trade.pnl = exitPrice - trade.entryPrice;
    trade.pnlPercent = (trade.pnl / trade.entryPrice) * 100;

    // Record feedback
    this.feedback.push(feedback);

    return trade;
  }

  /**
   * Get pending approvals
   */
  getPendingApprovals(): TradeSignal[] {
    const pending: TradeSignal[] = [];

    for (const [signalId, approval] of this.approvals) {
      if (approval.status === 'pending') {
        const signal = this.signals.get(signalId);
        if (signal) pending.push(signal);
      }
    }

    return pending;
  }

  /**
   * Get approval history
   */
  getApprovalHistory(days: number = 7): {
    totalSignals: number;
    approved: number;
    rejected: number;
    approvalRate: number;
  } {
    const cutoffTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let total = 0;
    let approved = 0;

    for (const approval of this.approvals.values()) {
      const approvalTime = new Date(approval.timestamp);
      if (approvalTime > cutoffTime) {
        total++;
        if (approval.status === 'approved') approved++;
      }
    }

    return {
      totalSignals: total,
      approved,
      rejected: total - approved,
      approvalRate: total > 0 ? approved / total : 0,
    };
  }

  /**
   * Compare user decisions vs AI predictions
   */
  getUserVsAIComparison(): {
    userAccuracy: number;
    aiAccuracy: number;
    userBetterThan: number;
    aiBetterThan: number;
  } {
    let userCorrect = 0;
    let aiCorrect = 0;
    let userWins = 0;
    let aiWins = 0;

    for (const trade of this.trades.values()) {
      if (trade.status !== 'closed' || trade.pnl === undefined) continue;

      const userOverrode = trade.userOverride;
      const profitable = trade.pnl > 0;

      // Track accuracy
      if (userOverrode && profitable) userCorrect++;
      if (!userOverrode && profitable) aiCorrect++;

      // Track outperformance
      if (userOverrode) {
        if (profitable) userWins++;
      } else {
        if (profitable) aiWins++;
      }
    }

    const totalTrades = this.trades.size;

    return {
      userAccuracy: totalTrades > 0 ? userCorrect / (totalTrades / 2) : 0,
      aiAccuracy: totalTrades > 0 ? aiCorrect / (totalTrades / 2) : 0,
      userBetterThan: userWins,
      aiBetterThan: aiWins,
    };
  }

  /**
   * Generate trade journal report
   */
  generateTradeJournal(days: number = 30): string {
    const cutoffTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    let report = `TRADE JOURNAL - Last ${days} Days\n`;
    report += `=${'='.repeat(50)}\n\n`;

    const relevantTrades = Array.from(this.trades.values()).filter(
      t => new Date(t.entryTime) > cutoffTime
    );

    if (relevantTrades.length === 0) {
      return report + 'No trades in this period.\n';
    }

    let totalPnL = 0;
    let winCount = 0;
    let lossCount = 0;

    for (const trade of relevantTrades) {
      report += `${trade.pair} - ${trade.type} (${trade.id})\n`;
      report += `  Entry: ${trade.entryPrice.toFixed(2)} @ ${new Date(trade.entryTime).toLocaleDateString()}\n`;

      if (trade.status === 'closed' && trade.exitPrice && trade.pnl) {
        report += `  Exit: ${trade.exitPrice.toFixed(2)} @ ${new Date(trade.exitTime || '').toLocaleDateString()}\n`;
        report += `  P&L: ${trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)} (${trade.pnlPercent?.toFixed(2)}%)\n`;
        totalPnL += trade.pnl;
        if (trade.pnl > 0) winCount++;
        else lossCount++;
      } else {
        report += `  Status: ${trade.status}\n`;
      }

      if (trade.userOverride) {
        report += `  User Override: ${trade.overrideReason}\n`;
      }

      report += '\n';
    }

    report += `SUMMARY\n`;
    report += `${'='.repeat(50)}\n`;
    report += `Total P&L: ${totalPnL > 0 ? '+' : ''}${totalPnL.toFixed(2)}\n`;
    report += `Closed Trades: ${winCount + lossCount}\n`;
    report += `Wins: ${winCount}\n`;
    report += `Losses: ${lossCount}\n`;
    report += `Win Rate: ${((winCount / (winCount + lossCount)) * 100).toFixed(1)}%\n`;

    return report;
  }

  /**
   * Get performance metrics by decision type
   */
  getPerformanceByDecisionType(): {
    aiSignals: { totalTrades: number; winRate: number; avgPnL: number };
    userOverrides: { totalTrades: number; winRate: number; avgPnL: number };
  } {
    let aiTrades = 0,
      aiWins = 0,
      aiTotalPnL = 0;
    let userTrades = 0,
      userWins = 0,
      userTotalPnL = 0;

    for (const trade of this.trades.values()) {
      if (trade.status !== 'closed' || trade.pnl === undefined) continue;

      if (trade.userOverride) {
        userTrades++;
        userTotalPnL += trade.pnl;
        if (trade.pnl > 0) userWins++;
      } else {
        aiTrades++;
        aiTotalPnL += trade.pnl;
        if (trade.pnl > 0) aiWins++;
      }
    }

    return {
      aiSignals: {
        totalTrades: aiTrades,
        winRate: aiTrades > 0 ? aiWins / aiTrades : 0,
        avgPnL: aiTrades > 0 ? aiTotalPnL / aiTrades : 0,
      },
      userOverrides: {
        totalTrades: userTrades,
        winRate: userTrades > 0 ? userWins / userTrades : 0,
        avgPnL: userTrades > 0 ? userTotalPnL / userTrades : 0,
      },
    };
  }
}
