import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";
import { getDiffDays } from "@/shared/lib/helpers/date.helper";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface ChooseADateProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  displayMonth: Date | undefined;
  onMonthChange: (month: Date) => void;
  onConfirm: () => void;
  onPresetClick: (daysToAdd: number) => void;
}

export default function ChooseADate({
  selectedDate,
  onSelectDate,
  displayMonth,
  onMonthChange,
  onConfirm,
  onPresetClick,
}: Readonly<ChooseADateProps>) {
  const { t } = useTranslation();
  const diffDays = getDiffDays(selectedDate);

  const time = selectedDate
    ? `${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`
    : "00:00";

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    if (selectedDate) {
      let h = 0,
        m = 0;
      if (newTime) {
        const parts = newTime.split(":");
        h = Number(parts[0]) || 0;
        m = Number(parts[1]) || 0;
      }
      const newDate = new Date(selectedDate);
      newDate.setHours(h, m);
      onSelectDate(newDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      let h = 0,
        m = 0;
      if (time) {
        const parts = time.split(":");
        h = Number(parts[0]) || 0;
        m = Number(parts[1]) || 0;
      }
      const newDate = new Date(date);
      newDate.setHours(h, m);
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
          className="p-0 [--cell-size:--spacing(9.5)]"
          classNames={{
            month: "flex w-full flex-col gap-2",
            week: "mt-1 flex w-full",
            day_button: "data-[selected-single=true]:bg-primary h-8",
            day: "h-8",
          }}
        />
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
          <label htmlFor="time-picker" className="text-sm font-medium">
            {t("time")}
          </label>
          <input
            id="time-picker"
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="border border-border rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-primary bg-surface transition-colors"
          />
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
