"use client";
import React from "react";
import {
  Home,
  Car,
  Coffee,
  ShoppingBag,
  Calendar,
  PieChart,
} from "lucide-react";

export default function AnalyticsContainer() {
  const categorySpending = [
    {
      name: "Housing",
      amount: 6500,
      percentage: 65,
      color: "bg-purple-500",
      strokeColor: "rgb(168, 85, 247)",
      icon: Home,
    },
    {
      name: "Transport",
      amount: 1850,
      percentage: 18.5,
      color: "bg-primary-container",
      strokeColor: "rgb(0, 85, 255)",
      icon: Car,
    },
    {
      name: "Food & Drinks",
      amount: 1400,
      percentage: 14,
      color: "bg-amber-500",
      strokeColor: "rgb(245, 158, 11)",
      icon: Coffee,
    },
    {
      name: "Shopping",
      amount: 250,
      percentage: 2.5,
      color: "bg-pink-500",
      strokeColor: "rgb(244, 63, 94)",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="">
            Financial Analytics
          </h1>
          <p className="text-on-surface-variant mt-1">
            Visual breakdown of your expenses and savings patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-on-surface-variant/80" strokeWidth={1.5} />
          <select className="border border-outline-variant/65 rounded-md text-on-surface-variant py-2 px-3 focus:outline-none focus:border-primary-container">
            <option>June 2026</option>
            <option>May 2026</option>
            <option>All-time</option>
          </select>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* SVG Donut Chart for Expense Breakdown */}
        <div className="lg:col-span-2 border border-outline-variant/60 rounded-md p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="">Structure</h3>
            <PieChart className="w-4 h-4 text-on-surface-variant/80" strokeWidth={1.5} />
          </div>

          {/* SVG Donut */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform -rotate-90"
            >
              {/* Empty background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--color-surface-container-low)"
                strokeWidth="8"
              />

              {/* Housing segment: 65% (dasharray: 2 * pi * 40 * 0.65 = 163.3, offset 0) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="rgb(168, 85, 247)"
                strokeWidth="8"
                strokeDasharray="163.3 251.2"
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* Transport segment: 18.5% (dasharray: 2 * pi * 40 * 0.185 = 46.5, offset: -163.3) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="rgb(0, 85, 255)"
                strokeWidth="8"
                strokeDasharray="46.5 251.2"
                strokeDashoffset="-163.3"
                strokeLinecap="round"
              />

              {/* Food & Drinks segment: 14% (dasharray: 2 * pi * 40 * 0.14 = 35.1, offset: -209.8) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="rgb(245, 158, 11)"
                strokeWidth="8"
                strokeDasharray="35.1 251.2"
                strokeDashoffset="-209.8"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-on-surface-variant/80">
                Total
              </span>
              <span className="text-xl font-bold tnum">฿10,000</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full mt-6">
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-[10px] font-semibold text-on-surface-variant/80 mt-1">
                Housing
              </span>
              <span className="text-xs font-bold mt-0.5">65%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
              <span className="text-[10px] font-semibold text-on-surface-variant/80 mt-1">
                Transport
              </span>
              <span className="text-xs font-bold mt-0.5">18.5%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-semibold text-on-surface-variant/80 mt-1">
                Food
              </span>
              <span className="text-xs font-bold mt-0.5">14%</span>
            </div>
          </div>
        </div>

        {/* Categories Progress Breakdown */}
        <div className="lg:col-span-3 border border-outline-variant/60 rounded-md p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="">Top Categories</h3>
            <span className="text-xs text-on-surface-variant/80 font-semibold">
              Sorted by amount
            </span>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {categorySpending.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-on-surface-variant/80" strokeWidth={1.5} />
                      <span className="font-bold">
                        {cat.name}
                      </span>
                    </div>
                    <div className="font-semibold">
                      <span className="tnum">
                        ฿{cat.amount.toLocaleString()}
                      </span>
                      <span className="text-on-surface-variant/80 text-[10px] ml-1.5 tnum">
                        ({cat.percentage}%)
                      </span>
                    </div>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly comparison bars using CSS Grid */}
      <div className="border border-outline-variant/60 rounded-md p-6">
        <h3 className="mb-6">
          Income vs Expenses
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-end h-40 pt-4">
          {/* April */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5 items-end h-28 w-full justify-center">
              <div
                className="w-4.5 rounded-t-sm bg-emerald-500/20 h-16 transition-all hover:bg-emerald-500/35"
                title="Income: 12k"
              />
              <div
                className="w-4.5 rounded-t-sm bg-error/20 h-20 transition-all hover:bg-error/35"
                title="Expense: 15k"
              />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">
              April
            </span>
          </div>

          {/* May */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5 items-end h-28 w-full justify-center">
              <div
                className="w-4.5 rounded-t-sm bg-emerald-500/25 h-20 transition-all hover:bg-emerald-500/40"
                title="Income: 15k"
              />
              <div
                className="w-4.5 rounded-t-sm bg-error/25 h-16 transition-all hover:bg-error/40"
                title="Expense: 12k"
              />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">
              May
            </span>
          </div>

          {/* June */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5 items-end h-28 w-full justify-center">
              <div
                className="w-4.5 rounded-t-sm bg-emerald-600 h-24 shadow-sm"
                title="Income: 18.9k"
              />
              <div
                className="w-4.5 rounded-t-sm bg-error h-12 shadow-sm"
                title="Expense: 8.6k"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              June
            </span>
          </div>

          {/* July Forecast */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5 items-end h-28 w-full justify-center">
              <div
                className="w-4.5 rounded-t-sm bg-emerald-500/5 border border-emerald-500/20 border-dashed h-16"
                title="Income Forecast"
              />
              <div
                className="w-4.5 rounded-t-sm bg-error/5 border border-error/20 border-dashed h-8"
                title="Expense Forecast"
              />
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">
              July (est)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
