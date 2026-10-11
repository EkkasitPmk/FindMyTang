"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
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
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  const title =
    translations[language]?.assetsTitle ?? translations.en.assetsTitle;

  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-lg font-medium">{title}</span>
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
  );
}
