import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { getDiffDays } from "@/shared/lib/helpers/date.helper";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Clock } from "lucide-react";
import type { Locale } from "react-day-picker";

interface ChooseADateProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  displayMonth: Date | undefined;
  onMonthChange: (month: Date) => void;
  onConfirm: () => void;
  onPresetClick: (daysToAdd: number) => void;
  locale?: Locale;
}

export default function ChooseADate({
  selectedDate,
  onSelectDate,
  displayMonth,
  onMonthChange,
  onConfirm,
  onPresetClick,
  locale,
}: Readonly<ChooseADateProps>) {
  const { t } = useTranslation();
  const diffDays = getDiffDays(selectedDate);

  const hours = selectedDate ? selectedDate.getHours() : 0;
  const minutes = selectedDate ? selectedDate.getMinutes() : 0;

  const applyTime = (h: number, m: number) => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setHours(h, m);
    onSelectDate(newDate);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = Math.min(23, Math.max(0, Number(e.target.value) || 0));
    applyTime(h, minutes);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const m = Math.min(59, Math.max(0, Number(e.target.value) || 0));
    applyTime(hours, m);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      onSelectDate(newDate);
    } else {
      onSelectDate(undefined);
    }
  };

  return (
    <div className="space-y-3 border-x border-b border-border bg-surface p-4 rounded-bl-md rounded-br-md">
      <div className="flex min-h-0 flex-1 flex-col items-center gap-3 w-full">
        <Calendar
          mode="single"
          weekStartsOn={1}
          selected={selectedDate}
          captionLayout="dropdown"
          startMonth={new Date(2010, 0)}
          endMonth={new Date(2040, 11)}
          onSelect={handleDateSelect}
          month={displayMonth}
          onMonthChange={onMonthChange}
          fixedWeeks={false}
          locale={locale}
          className="p-0 w-full max-w-sm rounded-md"
          classNames={{
            month: "flex w-full flex-col gap-4 p-2",
            nav: "absolute top-4 px-4 flex w-full items-center justify-between",
            week: "flex w-full justify-between",
            day_button:
              "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-white h-9 w-9 rounded-lg font-medium transition-all hover:bg-surface-secondary",
            day: "h-9 w-9 flex items-center justify-center p-0",
            today: "font-bold text-primary",
            dropdown_root:
              "relative flex items-center justify-center rounded-lg border border-border/70 bg-surface-secondary/50 px-2.5 py-2 hover:bg-surface-secondary transition-colors cursor-pointer",
          }}
        />

        <div className="flex items-center justify-between gap-2 w-full pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-secondary-text tracking-wider">
            <Clock size={16} className="text-secondary-text" />
            <span>{t("time")}</span>
          </div>
          <div className="flex items-center gap-1 border border-border rounded-lg px-2.5 py-1 bg-surface-secondary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-colors">
            <input
              id="time-hour"
              type="number"
              min={0}
              max={23}
              value={String(hours).padStart(2, "0")}
              onChange={handleHourChange}
              className="w-7 text-center bg-transparent outline-none font-semibold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="font-bold text-sm text-secondary-text">:</span>
            <input
              id="time-minute"
              type="number"
              min={0}
              max={59}
              value={String(minutes).padStart(2, "0")}
              onChange={handleMinuteChange}
              className="w-7 text-center bg-transparent outline-none font-semibold text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 w-full border-t border-border pt-3">
          {[
            { label: t("today"), value: 0 },
            { label: t("tomorrow"), value: 1 },
            { label: t("in3Days"), value: 3 },
            { label: t("in1Week"), value: 7 },
            { label: t("in2Weeks"), value: 14 },
          ].map((preset) => (
            <Button
              key={preset.value}
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "text-xs py-2.5 h-auto rounded-lg font-medium transition-all flex-1 min-w-17.5",
                diffDays === preset.value
                  ? "bg-primary-light border-primary hover:bg-primary-light hover:text-primary-hover"
                  : "border-border hover:bg-surface-secondary",
              )}
              onClick={() => onPresetClick(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <Button
        type="button"
        variant="default"
        className="w-full py-5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
        onClick={onConfirm}
      >
        {t("confirm")}
      </Button>
    </div>
  );
}
