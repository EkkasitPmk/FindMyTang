export interface AnalyticsSummary {
  income: number;
  expense: number;
  transfer: number;
  adjust: number;
  net: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  categoryIcon: string | null;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

export interface CategoryBreakdownResponse {
  summary: AnalyticsSummary;
  breakdown: CategoryBreakdownItem[];
}

export interface MonthlyTrendItem {
  month: number;
  income: number;
  expense: number;
  transfer: number;
  adjust: number;
  net: number;
}

export interface MonthlyTrendsResponse {
  year: number;
  months: MonthlyTrendItem[];
}

export interface AssetDistributionItem {
  id: string;
  name: string;
  balance: number;
}

export interface AssetDistributionGroup {
  assetType: string;
  totalBalance: number;
  percentage: number;
  assets: AssetDistributionItem[];
}

export interface AssetDistributionResponse {
  totalAssets: number;
  distribution: AssetDistributionGroup[];
}

export interface DrilldownSummary {
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
  percentageOfTotal: number;
}

export interface DrilldownTransaction {
  id: string;
  type: string;
  amount: number;
  note: string | null;
  date: string;
  asset: {
    id: string;
    name: string;
    type: string;
  };
}

export interface DrilldownResponse {
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  };
  summary: DrilldownSummary;
  transactions: DrilldownTransaction[];
}
