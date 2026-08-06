"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import FinancialSnapshotContainer from "./FinancialSnapshotContainer";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { TodaySummaryResponse } from "../schemas/dashboard.response.schema";

const ListAssetsContainer = dynamic(
  () => import("../../assets/containers/ListAssetsContainer"),
  { ssr: false },
);

export default function DashboardContainer({
  initialAssets,
  initialSummary,
  serverAssetList,
  serverRecentJournal,
}: Readonly<{
  initialAssets?: Asset[];
  initialSummary?: TodaySummaryResponse;
  serverAssetList?: React.ReactNode;
  serverRecentJournal?: React.ReactNode;
}>) {
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-4">
        <div className="px-4">
          <FinancialSnapshotContainer
            initialAssets={initialAssets}
            initialSummary={initialSummary}
          />
        </div>

        <div className="px-4">
          {serverAssetList ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link
                    href="/assets"
                    className="text-lg font-medium hover:text-primary transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    {t("assetsTitle")}
                    <ChevronRight
                      size={18}
                      className="text-disabled-text group-hover:text-primary transition-colors"
                    />
                  </Link>
                </motion.div>
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={() => setIsCreateAssetOpen(true)}
                  className="flex items-center justify-center bg-surface-secondary hover:bg-border transition-colors p-1 rounded-full cursor-pointer"
                  aria-label={t("addAsset")}
                >
                  <Plus size={18} className="text-secondary-text" />
                </Button>
              </div>
              {serverAssetList}
            </section>
          ) : (
            <ListAssetsContainer
              initialAssets={initialAssets}
              onAddAsset={() => setIsCreateAssetOpen(true)}
            />
          )}
        </div>

        {serverRecentJournal}
      </div>

      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
      )}
    </>
  );
}
