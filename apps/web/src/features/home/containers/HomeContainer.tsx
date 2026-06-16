"use client";
import React from "react";
import {
  RefreshCw,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
} from "lucide-react";

export default function HomeContainer() {
  // Mock data for dashboard
  const recentTransactions = [
    {
      id: "1",
      desc: "Starbucks Coffee",
      type: "EXPENSE",
      category: "Food & Drinks",
      amount: -140,
      asset: "Cash",
      date: "Today, 14:30",
    },
    {
      id: "2",
      desc: "Freelance Design Payment",
      type: "INCOME",
      category: "Salary",
      amount: 12500,
      asset: "KBank Savings",
      date: "Yesterday, 09:15",
    },
    {
      id: "3",
      desc: "Gas Station",
      type: "EXPENSE",
      category: "Transport",
      amount: -850,
      asset: "Credit Card",
      date: "14 Jun, 18:45",
    },
    {
      id: "4",
      desc: "Monthly Rent",
      type: "EXPENSE",
      category: "Housing",
      amount: -6500,
      asset: "KBank Savings",
      date: "12 Jun, 10:00",
    },
  ];

  return (
    <div className="space-y-stack-gap-lg animate-in fade-in duration-300">
      {/* Welcome & Sync alert */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low border border-outline-variant/60 rounded-md p-6">
        <div>
          <h1 className="font-title-md text-on-surface">
            Welcome back, Guest!
          </h1>
          <p className="font-body-sm text-on-surface-variant mt-1">
            You are operating in Guest Mode. Your data is stored locally.
          </p>
        </div>
        <button className="flex items-center gap-2 py-2 px-4 rounded-md bg-primary-container/8 border border-primary-container/10 text-primary hover:bg-primary-container/15 transition-all text-xs font-semibold active-press">
          <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          Sync with Account
        </button>
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Net Worth */}
        <div className="relative overflow-hidden rounded-md bg-surface-container-lowest border border-outline-variant/60 p-6 group transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant">
              Net Worth
            </span>
            <div className="p-2 rounded-md bg-primary-container/8 text-primary">
              <Wallet className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display-lg text-on-surface tnum">฿35,240.00</h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <TrendingUp className="w-3 h-3 text-emerald-600" strokeWidth={2} />
              +12.4% this month
            </span>
          </div>
        </div>

        {/* Income Card */}
        <div className="relative overflow-hidden rounded-md bg-surface-container-lowest border border-outline-variant/60 p-6 group transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant">
              Income
            </span>
            <div className="p-2 rounded-md bg-emerald-500/8 text-emerald-600">
              <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display-lg text-on-surface tnum">฿18,900.00</h3>
            <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/70 mt-1">
              Updated just now
            </span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="relative overflow-hidden rounded-md bg-surface-container-lowest border border-outline-variant/60 p-6 group transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-on-surface-variant">
              Expenses
            </span>
            <div className="p-2 rounded-md bg-error-container/10 text-error">
              <TrendingDown className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display-lg text-on-surface tnum">฿8,660.00</h3>
            <span className="flex items-center gap-1.5 text-xs text-error font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-error inline-block" />
              <TrendingDown className="w-3 h-3 text-error" strokeWidth={2} />
              8% higher than last week
            </span>
          </div>
        </div>
      </div>

      {/* SVG Micro Trend Chart & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Trend Area */}
        <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant/60 rounded-md p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-title-md text-on-surface">
                Balance Trend
              </h3>
              <p className="font-body-sm text-on-surface-variant mt-0.5">
                Daily cashflow trajectory
              </p>
            </div>
            <select className="bg-surface-container-lowest border border-outline-variant/65 rounded-md font-body-sm text-on-surface-variant py-1.5 px-3 focus:outline-none focus:border-primary-container">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          {/* Custom SVG Line Chart for premium look */}
          <div className="w-full h-48 relative flex items-end">
            <svg
              viewBox="0 0 500 120"
              className="w-full h-full text-primary-container"
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(0, 85, 255)"
                    stopOpacity="0.08"
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(0, 85, 255)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line
                x1="0"
                y1="30"
                x2="500"
                y2="30"
                stroke="var(--color-outline-variant)"
                strokeOpacity="0.3"
                strokeDasharray="4 4"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="60"
                x2="500"
                y2="60"
                stroke="var(--color-outline-variant)"
                strokeOpacity="0.3"
                strokeDasharray="4 4"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="90"
                x2="500"
                y2="90"
                stroke="var(--color-outline-variant)"
                strokeOpacity="0.3"
                strokeDasharray="4 4"
                strokeWidth="0.5"
              />

              {/* Area path under line */}
              <path
                d="M 0 100 Q 80 50 160 80 T 320 30 T 480 10 L 500 10 L 500 120 L 0 120 Z"
                fill="url(#gradient)"
              />
              {/* Line path */}
              <path
                d="M 0 100 Q 80 50 160 80 T 320 30 T 480 10 L 500 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Indicator dots */}
              <circle
                cx="160"
                cy="80"
                r="3.5"
                fill="var(--color-primary-container)"
                stroke="var(--color-surface-container-lowest)"
                strokeWidth="1.5"
              />
              <circle
                cx="320"
                cy="30"
                r="3.5"
                fill="var(--color-primary-container)"
                stroke="var(--color-surface-container-lowest)"
                strokeWidth="1.5"
              />
              <circle
                cx="480"
                cy="10"
                r="3.5"
                fill="var(--color-emerald-500)"
                stroke="var(--color-surface-container-lowest)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="flex justify-between items-center text-[10px] text-on-surface-variant/80 font-bold uppercase tracking-wider mt-4">
            <span>10 Jun</span>
            <span>12 Jun</span>
            <span>14 Jun</span>
            <span>Today</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-md text-on-surface">
                Recent Activity
              </h3>
              <button className="text-xs font-semibold text-primary hover:text-primary-container active-press">
                View All
              </button>
            </div>

            {/* High-density List with thin 0.5px dividers */}
            <div className="divide-y divide-outline-variant/50">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 hover:bg-surface-container-low/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-md border ${
                        tx.type === "INCOME"
                          ? "bg-emerald-500/8 border-emerald-500/10 text-emerald-600"
                          : "bg-error-container/8 border-error-container/10 text-error"
                      }`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-body-sm font-semibold text-on-surface">
                        {tx.desc}
                      </p>
                      {/* Active / Categorical styling for chips */}
                      <p className="text-[10px] text-on-surface-variant/80 mt-0.5 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded-sm bg-surface-container-low font-medium text-on-surface-variant">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span>{tx.asset}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* Amount + Positive/Negative status indicators adjacent to numerical data */}
                    <div className="flex items-center gap-1.5 justify-end">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tx.type === "INCOME" ? "bg-emerald-500" : "bg-error"
                        }`}
                      />
                      <p
                        className={`font-numeric-data font-semibold text-sm ${tx.type === "INCOME" ? "text-emerald-600" : "text-error"} tnum`}
                      >
                        {tx.type === "INCOME" ? "+" : ""}
                        {tx.amount.toLocaleString()} ฿
                      </p>
                    </div>
                    <p className="text-[9px] text-on-surface-variant/80 mt-0.5">
                      {tx.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
