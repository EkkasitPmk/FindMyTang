"use client";
import React from "react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  RecurringExpense,
  RecurringCycle,
  RecurringStatus,
} from "@/shared/lib/types/recurring.type";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";
import { getDueStatus } from "../helpers/recurring.helper";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import {
  MoreVertical,
  Pencil,
  Pause,
  Play,
  Trash2,
  Plus,
  Repeat,
  Wallet,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { format, parseISO } from "date-fns";
import { th, enUS } from "date-fns/locale";

interface RecurringItemCardProps {
  item: RecurringExpense;
  onEdit: (item: RecurringExpense) => void;
  onToggleStatus: (item: RecurringExpense) => void;
  onDelete: (item: RecurringExpense) => void;
  onLogExpense: (item: RecurringExpense) => void;
}

export default function RecurringItemCard({
  item,
  onEdit,
  onToggleStatus,
  onDelete,
  onLogExpense,
}: Readonly<RecurringItemCardProps>) {
  const { t, locale, currentLanguage } = useTranslation();
  const calendarLocale = currentLanguage === "th" ? th : enUS;
  const { data: categories = [] } = useCategories();
  const { data: assets = [] } = useAssets();

  const category =
    item.category || categories.find((c) => c.id === item.categoryId);
  const asset = item.asset || assets.find((a) => a.id === item.assetId);

  const dueStatus = getDueStatus(
    item.nextBillingDate,
    undefined,
    t,
    calendarLocale,
  );
  const isPaused = item.status === RecurringStatus.PAUSED;

  const cycleLabels: Record<RecurringCycle, string> = {
    [RecurringCycle.WEEKLY]: t("recurringCycleWeekly"),
    [RecurringCycle.MONTHLY]: t("recurringCycleMonthly"),
    [RecurringCycle.QUARTERLY]: t("recurringCycleQuarterly"),
    [RecurringCycle.YEARLY]: t("recurringCycleYearly"),
  };

  const cycleUnits: Record<RecurringCycle, string> = {
    [RecurringCycle.WEEKLY]: t("recurringPerWeek"),
    [RecurringCycle.MONTHLY]: t("recurringPerMonth"),
    [RecurringCycle.QUARTERLY]: t("recurringPerQuarter"),
    [RecurringCycle.YEARLY]: t("recurringPerYear"),
  };

  const formattedAmount = `฿${item.amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  let nextDateFormatted = "";
  try {
    nextDateFormatted = format(parseISO(item.nextBillingDate), "d MMM yyyy", {
      locale: calendarLocale,
    });
  } catch {
    nextDateFormatted = item.nextBillingDate;
  }

  let iconContent: React.ReactNode = <Repeat className="size-5 text-white" />;
  const iconBgColor = category?.color || "#64748B";

  if (category?.icon) {
    const icon = getCategoryIcon(category.icon);
    iconContent = React.createElement(icon, {
      className: "size-5 text-white",
    });
  }

  let dueBadgeColor = "bg-muted text-muted-foreground";
  if (dueStatus.isOverdue) {
    dueBadgeColor = "bg-rose-500/10 text-rose-600 dark:text-rose-400";
  } else if (dueStatus.daysRemaining <= 3) {
    dueBadgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }

  return (
    <div
      className={`rounded-2xl border p-4 transition-all shadow-xs ${
        isPaused
          ? "bg-muted/30 border-border/50 opacity-70"
          : "bg-card border-border/70 hover:border-border"
      }`}
    >
      {/* Top Header: Icon + Name & Cycle (Left) vs Price (Right) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="size-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 shadow-xs text-white"
            style={{ backgroundColor: iconBgColor }}
          >
            {iconContent}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {item.name}
              </h3>
              {category && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium shrink-0">
                  {category.name}
                </span>
              )}
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium shrink-0">
                {cycleLabels[item.billingCycle] || item.billingCycle}
              </span>
              {isPaused && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                  {t("recurringStatusPaused")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Amount & Billing Cycle (Flush to Top Right) */}
        <div className="text-right shrink-0">
          <div className="font-bold text-sm sm:text-base text-foreground">
            {formattedAmount}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {cycleUnits[item.billingCycle]}
          </div>
        </div>
      </div>

      {/* Subline: Due Status & Next Billing Date (Full-width Schedule Bar) */}
      <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 min-w-0 text-muted-foreground">
          <Calendar className="size-3.5 opacity-70 shrink-0" />
          <span className="whitespace-nowrap font-medium">
            {t("recurringNextBillingLabel")}:
          </span>
          <span className="text-foreground font-semibold whitespace-nowrap">
            {nextDateFormatted}
          </span>
        </div>

        {!isPaused && (
          <span
            className={`text-[11px] px-2 py-0.5 rounded-md font-semibold shrink-0 whitespace-nowrap ${dueBadgeColor}`}
          >
            {dueStatus.label}
          </span>
        )}
      </div>

      {/* Card Footer: (Left: Actions Menu + Asset) ↔ (Right: Quick Log Button) */}
      <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0">
              <MoreVertical className="size-4" />
              <span className="sr-only">Actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-auto min-w-48">
              <DropdownMenuItem
                onClick={() => onEdit(item)}
                className="cursor-pointer gap-2"
              >
                <Pencil className="size-4 text-muted-foreground shrink-0" />
                <span className="whitespace-nowrap">
                  {t("recurringEditTitle")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(item)}
                className="cursor-pointer gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="whitespace-nowrap">
                      {t("recurringResume")}
                    </span>
                  </>
                ) : (
                  <>
                    <Pause className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="whitespace-nowrap">
                      {t("recurringPause")}
                    </span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="cursor-pointer gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600"
              >
                <Trash2 className="size-4 shrink-0" />
                <span className="whitespace-nowrap">{t("delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {asset && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground min-w-0">
              <Wallet className="size-3 shrink-0 opacity-70" />
              <span className="truncate max-w-35 sm:max-w-50">
                {asset.name}
              </span>
            </div>
          )}
        </div>

        {!isPaused && (
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={() => onLogExpense(item)}
            className="rounded-lg shadow-xs shrink-0"
            leftIcon={<Plus className="size-3.5" />}
          >
            {t("recurringLogExpense")}
          </Button>
        )}
      </div>
    </div>
  );
}
