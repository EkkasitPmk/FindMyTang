"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export default function DashboardAssetTitleMotion({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
      {children}
    </motion.div>
  );
}
