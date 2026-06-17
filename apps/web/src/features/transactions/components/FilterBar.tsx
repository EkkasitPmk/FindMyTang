import React from "react";

interface FilterBarProps {
  type: string;
  assetId: string;
  categoryId: string;
  dateRange: string;
  onTypeChange: (type: string) => void;
  onAssetChange: (id: string) => void;
  onCategoryChange: (id: string) => void;
  onDateRangeChange: (range: string) => void;
  assets: any[];
  categories: any[];
}

export default function FilterBar({
  type,
  assetId,
  categoryId,
  dateRange,
  onTypeChange,
  onAssetChange,
  onCategoryChange,
  onDateRangeChange,
  assets,
  categories,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 mb-6">
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="bg-surface-container-high text-on-surface text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Types</option>
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
      </select>

      <select
        value={assetId}
        onChange={(e) => onAssetChange(e.target.value)}
        className="bg-surface-container-high text-on-surface text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Assets</option>
        {assets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.name}
          </option>
        ))}
      </select>

      <select
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-surface-container-high text-on-surface text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="bg-surface-container-high text-on-surface text-sm rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">All Time</option>
        <option value="THIS_MONTH">This Month</option>
        <option value="LAST_MONTH">Last Month</option>
        <option value="THIS_YEAR">This Year</option>
      </select>
    </div>
  );
}
