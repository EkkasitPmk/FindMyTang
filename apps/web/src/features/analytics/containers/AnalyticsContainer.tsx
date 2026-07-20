"use client";
import { useState } from "react";
import { SegmentedControl } from "@/shared/components/customs/SegmentedControl";
import { CategoryBreakdownContainer } from "./CategoryBreakdownContainer";
import { MonthlyTrendsContainer } from "./MonthlyTrendsContainer";
import { AssetDistributionContainer } from "./AssetDistributionContainer";
import { PieChart, TrendingUp, Wallet } from "lucide-react";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function AnalyticsContainer() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"category" | "trends" | "assets">(
    "category",
  );
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);

  const tabs = [
    {
      value: "category",
      label: t("reportTab"),
      icon: <PieChart className="w-4 h-4" />,
    },
    {
      value: "trends",
      label: t("trendsTab"),
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      value: "assets",
      label: t("assetsTab"),
      icon: <Wallet className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background space-y-3">
      <div className="px-4">
        <SegmentedControl
          options={tabs.map((t) => ({
            value: t.value,
            label: (
              <div className="flex items-center justify-center gap-1.5">
                {t.icon}
                <span>{t.label}</span>
              </div>
            ),
          }))}
          value={activeTab}
          onChange={(val) =>
            setActiveTab(val as "category" | "trends" | "assets")
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {activeTab === "category" && <CategoryBreakdownContainer />}
        {activeTab === "trends" && <MonthlyTrendsContainer />}
        {activeTab === "assets" && (
          <AssetDistributionContainer
            onAddAsset={() => setIsCreateAssetOpen(true)}
          />
        )}
      </div>

      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
      )}
    </div>
  );
}
