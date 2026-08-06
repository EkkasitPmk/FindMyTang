"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function DashboardAssetTitle() {
  const { t } = useTranslation();

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
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
  );
}
