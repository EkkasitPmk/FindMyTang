import React from "react";

export default function EmptyTransactions() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-subtle-pop">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <span className="text-4xl">📝</span>
      </div>
      <h3 className="mb-2">
        No transactions yet
      </h3>
      <p className="text-on-surface-variant max-w-xs mx-auto">
        Create your first transaction to start tracking your money.
      </p>
    </div>
  );
}
