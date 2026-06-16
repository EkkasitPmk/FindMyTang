"use client";
import React from "react";
import {
  DollarSign,
  Building,
  TrendingUp,
  CreditCard,
  Plus,
} from "lucide-react";

export default function AssetsContainer() {
  const assets = [
    {
      id: "1",
      name: "Cash Wallet",
      type: "CASH",
      balance: 3540,
      icon: DollarSign,
      color: "bg-amber-500/8 text-amber-600 border-amber-500/10",
    },
    {
      id: "2",
      name: "KBank Savings",
      type: "BANK",
      balance: 25000,
      icon: Building,
      color: "bg-emerald-500/8 text-emerald-600 border-emerald-500/10",
    },
    {
      id: "3",
      name: "SCB Investment",
      type: "INVESTMENT",
      balance: 14700,
      icon: TrendingUp,
      color: "bg-purple-500/8 text-purple-600 border-purple-500/10",
    },
  ];

  const liabilities = [
    {
      id: "4",
      name: "Visa Credit Card",
      type: "CREDIT",
      balance: -8000,
      limit: 50000,
      icon: CreditCard,
      color: "bg-error-container/8 text-error border-error-container/10",
    },
  ];

  const totalAssets = assets.reduce((sum, item) => sum + item.balance, 0);
  const totalLiabilities = liabilities.reduce(
    (sum, item) => sum + Math.abs(item.balance),
    0,
  );
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="space-y-stack-gap-lg animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-on-surface">
            Assets & Accounts
          </h1>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Manage your wallets, banks, investments and credit cards
          </p>
        </div>
        <button className="flex items-center gap-2 py-2.5 px-4 rounded-full bg-primary-container text-on-primary hover:bg-primary transition-all text-xs font-semibold shadow-sm active-press">
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add Account
        </button>
      </div>

      {/* Asset Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Worth */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-md p-6 relative overflow-hidden group">
          <p className="font-label-caps text-on-surface-variant">
            Total Net Worth
          </p>
          <h2 className="font-display-lg text-on-surface mt-2 tnum">
            ฿{netWorth.toLocaleString()}
          </h2>
          <p className="text-[10px] text-on-surface-variant/80 mt-1">
            Available balance minus liabilities
          </p>
        </div>

        {/* Total Assets */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-md p-6 relative overflow-hidden group">
          <p className="font-label-caps text-on-surface-variant">
            Total Assets
          </p>
          <h2 className="font-display-lg text-emerald-600 mt-2 tnum">
            ฿{totalAssets.toLocaleString()}
          </h2>
          <p className="text-[10px] text-on-surface-variant/80 mt-1">
            3 active cash/investment holdings
          </p>
        </div>

        {/* Total Liabilities */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-md p-6 relative overflow-hidden group">
          <p className="font-label-caps text-on-surface-variant">
            Total Liabilities
          </p>
          <h2 className="font-display-lg text-error mt-2 tnum">
            ฿{totalLiabilities.toLocaleString()}
          </h2>
          <p className="text-[10px] text-on-surface-variant/80 mt-1">
            Outstanding credit card balances
          </p>
        </div>
      </div>

      {/* Detail list section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets Section */}
        <div className="space-y-4">
          <h3 className="font-label-caps text-on-surface-variant">
            Assets & Wallets
          </h3>
          <div className="space-y-3">
            {assets.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 rounded-md border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low/20 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-md border ${item.color}`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-body-sm font-bold text-on-surface">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/80 uppercase font-semibold mt-0.5">
                        {item.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-numeric-data text-sm font-bold text-on-surface tnum">
                      ฿{item.balance.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/80 mt-0.5">Active</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="space-y-4">
          <h3 className="font-label-caps text-on-surface-variant">
            Liabilities & Credit Cards
          </h3>
          <div className="space-y-3">
            {liabilities.map((item) => {
              const Icon = item.icon;
              const usedPercentage = Math.round(
                (Math.abs(item.balance) / item.limit) * 100,
              );
              return (
                <div
                  key={item.id}
                  className="flex flex-col p-4 rounded-md border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low/20 transition-colors gap-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-md border ${item.color}`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-body-sm font-bold text-on-surface">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/80 uppercase font-semibold mt-0.5">
                          {item.type} • Limit: ฿{item.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-numeric-data text-sm font-bold text-error tnum">
                        ฿{Math.abs(item.balance).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/80 mt-0.5 tnum">
                        {usedPercentage}% Used
                      </p>
                    </div>
                  </div>

                  {/* Progress bar for credit card usage */}
                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 rounded-full bg-surface-container-low overflow-hidden">
                      <div
                        className="h-full bg-error rounded-full transition-all duration-500"
                        style={{ width: `${usedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
