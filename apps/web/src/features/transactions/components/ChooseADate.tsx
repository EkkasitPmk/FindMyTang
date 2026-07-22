import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/customs/Button";
import { getDiffDays } from "@/shared/lib/helpers/date.helper";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
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
    <Card
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-fit max-w-74 data-[size=sm]:py-1 data-[size=sm]:gap-2 shadow-2xl z-50"
      size="sm"
    >
      <CardContent>
        <Calendar
          mode="single"
          weekStartsOn={1}
          selected={selectedDate}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
          month={displayMonth}
          onMonthChange={onMonthChange}
          fixedWeeks={false}
          locale={locale}
          className="p-0 [--cell-size:--spacing(9.5)]"
          classNames={{
            month: "flex w-full flex-col gap-2",
            week: "mt-1 flex w-full",
            day_button: "data-[selected-single=true]:bg-primary h-8",
            day: "h-8",
            today: "",
          }}
        />
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
          <label className="text-sm font-medium">{t("time")}</label>
          <div className="flex items-center gap-1 border border-border rounded-md px-2 py-1 bg-surface focus-within:ring-2 focus-within:ring-primary transition-colors">
            <input
              id="time-hour"
              type="number"
              min={0}
              max={23}
              value={String(hours).padStart(2, "0")}
              onChange={handleHourChange}
              className="w-8 text-center bg-transparent outline-none"
            />
            <span className="font-medium">:</span>
            <input
              id="time-minute"
              type="number"
              min={0}
              max={59}
              value={String(minutes).padStart(2, "0")}
              onChange={handleMinuteChange}
              className="w-8 text-center bg-transparent outline-none"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t rounded-b-none group-data-[size=sm]/card:py-2">
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
              "flex-1 transition-colors",
              diffDays === preset.value
                ? "bg-primary-light text-primary border-primary hover:bg-primary-light hover:text-blue-600"
                : "",
            )}
            onClick={() => onPresetClick(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
      <Button
        type="button"
        className="mb-2 mx-2 py-5 bg-primary text-white"
        onClick={onConfirm}
      >
        {t("confirm")}
      </Button>
    </Card>
  );
}
