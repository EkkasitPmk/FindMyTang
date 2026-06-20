"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ArrowRightLeft,
  FileText,
  Eye,
} from "lucide-react";

export default function JournalContainer() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const daysData = [
    {
      date: "Today, June 16",
      summary: -140,
      transactions: [
        {
          id: "1",
          desc: "Starbucks Coffee",
          type: "EXPENSE",
          category: "Food & Drinks",
          amount: -140,
          asset: "Cash",
          hasAttachment: true,
        },
      ],
    },
    {
      date: "Yesterday, June 15",
      summary: 12500,
      transactions: [
        {
          id: "2",
          desc: "Freelance Design Payment",
          type: "INCOME",
          category: "Salary",
          amount: 12500,
          asset: "KBank Savings",
          hasAttachment: false,
        },
      ],
    },
    {
      date: "June 14, 2026",
      summary: -850,
      transactions: [
        {
          id: "3",
          desc: "Gas Station",
          type: "EXPENSE",
          category: "Transport",
          amount: -850,
          asset: "Credit Card",
          hasAttachment: true,
        },
      ],
    },
    {
      date: "June 12, 2026",
      summary: -6500,
      transactions: [
        {
          id: "4",
          desc: "Monthly Rent",
          type: "EXPENSE",
          category: "Housing",
          amount: -6500,
          asset: "KBank Savings",
          hasAttachment: false,
        },
      ],
    },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="">
            Transaction Journal
          </h1>
          <p className="text-on-surface-variant mt-1">
            History of your earnings, expenditures, and transfers
          </p>
        </div>
        <button className="flex items-center gap-2 py-2.5 px-4 rounded-full bg-primary-container hover:bg-primary transition-all text-xs font-semibold shadow-sm active-press">
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add Transaction
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border border-outline-variant/60 p-4 rounded-md">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant/80" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-outline-variant/60 focus:border-primary-container rounded-md text-xs sm:text-sm outline-none transition-all"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex w-full sm:w-auto items-center overflow-x-auto gap-1 sm:gap-2 pb-1 sm:pb-0 scrollbar-none">
          {["ALL", "INCOME", "EXPENSE"].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-1.5 px-3.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all shrink-0 active-press ${
                  isActive
                    ? ""
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                {filter}
              </button>
            );
          })}
          <button className="p-1.5 rounded-md border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container active-press">
            <Filter className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Daily grouped list */}
      <div className="space-y-6">
        {daysData.map((day, dIdx) => {
          // Filter transactions
          const filteredTxs = day.transactions.filter((tx) => {
            const matchesFilter =
              activeFilter === "ALL" || tx.type === activeFilter;
            const matchesSearch =
              tx.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tx.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
          });

          if (filteredTxs.length === 0) return null;

          return (
            <div key={dIdx} className="space-y-3">
              {/* Daily Header */}
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="tracking-normal font-semibold">{day.date}</span>
                </div>
                <span
                  className={`font-semibold ${day.summary > 0 ? "text-emerald-600" : "text-on-surface-variant"} tnum`}
                >
                  {day.summary > 0 ? "+" : ""}
                  {day.summary.toLocaleString()} ฿
                </span>
              </div>

              {/* Transactions in the Day */}
              <div className="space-y-2">
                {filteredTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-4 rounded-md border border-outline-variant/60 hover:bg-surface-container-low/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`p-2.5 rounded-md border ${
                          tx.type === "INCOME"
                            ? "bg-emerald-500/8 border-emerald-500/10 text-emerald-600"
                            : "text-error"
                        }`}
                      >
                        <ArrowRightLeft className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">
                            {tx.desc}
                          </p>
                          {tx.hasAttachment && (
                            <span className="px-1.5 py-0.5 rounded-sm text-[9px] text-on-surface-variant font-medium flex items-center gap-0.5 border border-outline-variant/40">
                              <FileText className="w-2.5 h-2.5" strokeWidth={1.5} />
                              Receipt
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-on-surface-variant/80 mt-0.5 uppercase tracking-wider font-semibold">
                          {tx.category} • {tx.asset}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${tx.type === "INCOME" ? "bg-emerald-500" : "bg-error"}`} />
                        <p
                          className={`text-sm font-bold ${tx.type === "INCOME" ? "text-emerald-600" : "text-error"} tnum`}
                        >
                          {tx.type === "INCOME" ? "+" : ""}
                          {tx.amount.toLocaleString()} ฿
                        </p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-opacity active-press">
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
