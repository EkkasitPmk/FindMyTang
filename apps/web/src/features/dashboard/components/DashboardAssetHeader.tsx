"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, LayoutGrid, LayoutList } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  translations,
  type Language,
} from "@/shared/lib/configs/translations.config";
import type { Asset } from "@/shared/lib/types/asset.type";

export default function DashboardAssetHeader({
  language,
  initialAssets,
  isLoading: propIsLoading,
}: Readonly<{
  language: Language;
  initialAssets?: Asset[];
  isLoading?: boolean;
}>) {
  const router = useRouter();
  const { t } = useTranslation();
  const viewMode = useAssetUIStore((state) => state.dashboardAssetView);
  const setDashboardAssetView = useAssetUIStore(
    (state) => state.setDashboardAssetView,
  );
  const { data: currentAssets = initialAssets, isPending } = useAssets({
    initialData: initialAssets,
  });

  const isLoading = propIsLoading ?? (isPending && !currentAssets);

  const handleSeeAllClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      event.preventDefault();
      router.push("/settings?tab=assets");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-6 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-14 rounded-lg" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  const title =
    translations[language]?.assetsTitle ?? translations.en.assetsTitle;

  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-lg font-medium">{title}</span>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center p-0.5 bg-surface-secondary/80 rounded-lg border border-border/50">
          <Button
            variant="unstyled"
            hoverScale={1}
            tapScale={0.95}
            type="button"
            onClick={() => setDashboardAssetView("list")}
            className="relative p-1 rounded-md transition-colors cursor-pointer text-secondary-text hover:text-primary-text"
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            {viewMode === "list" && (
              <motion.div
                layoutId="dashboardAssetViewIndicator"
                className="absolute inset-0 bg-surface rounded-md shadow-xs border border-border/40"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center justify-center transition-colors ${
                viewMode === "list" ? "text-primary" : ""
              }`}
            >
              <LayoutList size={15} />
            </span>
          </Button>
          <Button
            variant="unstyled"
            hoverScale={1}
            tapScale={0.95}
            type="button"
            onClick={() => setDashboardAssetView("grid")}
            className="relative p-1 rounded-md transition-colors cursor-pointer text-secondary-text hover:text-primary-text"
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            {viewMode === "grid" && (
              <motion.div
                layoutId="dashboardAssetViewIndicator"
                className="absolute inset-0 bg-surface rounded-md shadow-xs border border-border/40"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center justify-center transition-colors ${
                viewMode === "grid" ? "text-primary" : ""
              }`}
            >
              <LayoutGrid size={15} />
            </span>
          </Button>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/assets"
            onClick={handleSeeAllClick}
            className="flex items-center text-sm text-primary"
          >
            {t("seeAll")}
            <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
