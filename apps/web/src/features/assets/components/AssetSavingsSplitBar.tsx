import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface AssetSavingsSplitBarProps {
  balance: number;
  savingsAmount: number;
  onEditSavings?: () => void;
}

export default function AssetSavingsSplitBar({
  balance,
  savingsAmount,
  onEditSavings,
}: Readonly<AssetSavingsSplitBarProps>) {
  const { t, locale } = useTranslation();

  const clampedSavings = Math.min(savingsAmount, Math.max(0, balance));
  const spendable = Math.max(0, balance - clampedSavings);
  const hasShortfall = balance < savingsAmount && balance > 0;

  return (
    <div className="px-4.5 sm:px-5 flex flex-wrap items-center gap-1.5 pt-0.5 pb-1">
      {/* Spendable Pill */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-secondary/80 border border-border/70 text-xs">
        <span className="text-secondary-text text-[11px] font-medium">
          {t("spendableBalance")}
        </span>
        <span className="font-semibold tabular-nums text-primary-text">
          ฿{" "}
          {spendable.toLocaleString(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Savings Pill (Clickable to edit savings) */}
      {onEditSavings ? (
        <Button
          variant="unstyled"
          hoverScale={1}
          tapScale={1}
          type="button"
          onClick={onEditSavings}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/15 border border-primary/20 text-xs text-primary transition-colors cursor-pointer group"
          title={t("quickEditSavings")}
          aria-label={t("quickEditSavings")}
        >
          <span className="text-primary/80 text-[11px] font-medium">
            {t("allocatedSavings")}
          </span>
          <span className="font-semibold tabular-nums">
            ฿{" "}
            {clampedSavings.toLocaleString(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <Pencil
            size={11}
            className="text-primary/70 group-hover:text-primary shrink-0 ml-0.5"
          />
          <span className="sr-only">{t("quickEditSavings")}</span>
        </Button>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
          <span className="text-primary/80 text-[11px] font-medium">
            {t("allocatedSavings")}
          </span>
          <span className="font-semibold tabular-nums">
            ฿{" "}
            {clampedSavings.toLocaleString(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      )}

      {/* Shortfall warning */}
      {hasShortfall && (
        <p className="w-full text-[11px] text-amber-500 font-medium pt-0.5">
          ⚠️ {t("savingsExceedsBalanceWarning")}
        </p>
      )}
    </div>
  );
}
