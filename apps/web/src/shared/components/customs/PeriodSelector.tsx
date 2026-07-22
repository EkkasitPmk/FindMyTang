import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface PeriodSelectorProps {
  mode: "month" | "year";
  month?: number; // 1-12
  year: number;
  onPrev: () => void;
  onNext: () => void;
  disableNext?: boolean;
}

export const PeriodSelector = ({
  mode,
  month = 1,
  year,
  onPrev,
  onNext,
  disableNext = false,
}: PeriodSelectorProps) => {
  const { t, currentLanguage } = useTranslation();
  const dateLocale = currentLanguage === "th" ? th : enUS;
  const date = new Date(year, month - 1);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-surface rounded-xl shadow-sm border">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        className="h-8 w-8 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="font-semibold text-[15px]">
        {mode === "month"
          ? format(date, "MMMM yyyy", { locale: dateLocale })
          : `${t("yearLabel")} ${year}`}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className="h-8 w-8 rounded-full"
        disabled={disableNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
