"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export default function DashboardAssetMotion({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      {children}
    </motion.div>
  );
}
