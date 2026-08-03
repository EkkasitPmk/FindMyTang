"use client";
import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "@/shared/components/animate-ui/components/animate/tabs";
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
    <div className="flex h-full flex-col bg-background">
      <Tabs
        value={activeTab}
        onValueChange={(val) =>
          setActiveTab(val as "category" | "trends" | "assets")
        }
        className="flex-1 flex flex-col min-h-0 gap-1"
      >
        <div className="px-4 shrink-0 pt-1 pb-1 bg-background z-10">
          <TabsList className="w-full">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
                {t.icon}
                <span>{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContents className="h-full flex-1 min-h-0">
          <TabsContent
            value="category"
            className="h-full flex flex-col min-h-0"
          >
            <CategoryBreakdownContainer />
          </TabsContent>
          <TabsContent value="trends" className="h-full flex flex-col min-h-0">
            <MonthlyTrendsContainer />
          </TabsContent>
          <TabsContent value="assets" className="h-full flex flex-col min-h-0">
            <AssetDistributionContainer
              onAddAsset={() => setIsCreateAssetOpen(true)}
            />
          </TabsContent>
        </TabsContents>
      </Tabs>

      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
      )}
    </div>
  );
}
