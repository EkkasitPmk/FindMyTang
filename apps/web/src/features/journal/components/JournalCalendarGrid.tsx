import { cn } from "@/shared/lib/utils/core.util";
import { formatCompactAmount } from "../helpers/calendar.helper";
import type { CalendarDay } from "../helpers/calendar.helper";
import { Button } from "@/shared/components/customs/Button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface JournalCalendarGridProps {
  weeks: CalendarDay[][];
  onSelectDate: (date: Date) => void;
}

export default function JournalCalendarGrid({
  weeks,
  onSelectDate,
}: Readonly<JournalCalendarGridProps>) {
  const { t, locale } = useTranslation();
  const weekdayLabels = [
    t("mon"),
    t("tue"),
    t("wed"),
    t("thu"),
    t("fri"),
    t("sat"),
    t("sun"),
  ];

  return (
    <section className="w-full select-none">
      {/* Weekday header */}
      <div className="grid grid-cols-7 mb-1">
        {weekdayLabels.map((day) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs font-medium py-1",
              day === t("sat") || day === t("sun")
                ? "text-expense/70"
                : "text-secondary-text",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="border border-border overflow-hidden">
        {weeks.map((week, weekIdx) => (
          <div
            key={`week-${week[0].dateKey}`}
            className={cn(
              "grid grid-cols-7",
              weekIdx !== weeks.length - 1 && "border-b border-border",
            )}
          >
            {week.map((day) => {
              let dayTextColor = "text-disabled-text";
              if (day.isToday) {
                dayTextColor = "text-primary font-bold";
              } else if (day.isCurrentMonth) {
                dayTextColor = "text-primary-text";
              }

              return (
                <Button
                  variant={"unstyled"}
                  key={day.dateKey}
                  type="button"
                  onClick={() => day.isCurrentMonth && onSelectDate(day.date)}
                  className={cn(
                    "relative flex flex-col min-h-10 md:min-h-15 p-1 border-r border-border last:border-r-0 transition-colors duration-150",
                    // Base background
                    day.isCurrentMonth
                      ? "bg-surface"
                      : "bg-surface-secondary/70",
                    // Today highlight
                    day.isToday && "bg-primary-light",
                    // Contribution style background
                    day.contributionBgClass,
                    // Selected state
                    day.isSelected && "ring-2 ring-primary ring-inset",
                    // Hover and cursor for current month only
                    day.isCurrentMonth
                      ? "hover:bg-surface-secondary/50 cursor-pointer"
                      : "cursor-default",
                    // Outside month text color
                    !day.isCurrentMonth && "opacity-40",
                  )}
                >
                  {/* Date number — top left */}
                  <span
                    className={cn(
                      "text-xs font-medium leading-none text-left",
                      dayTextColor,
                    )}
                  >
                    {day.dayOfMonth}
                  </span>

                  {/* Amount summaries — bottom right, stacked */}
                  {day.summary && (
                    <div className="flex flex-col items-end mt-auto gap-px">
                      {day.summary.adjustment !== 0 && (
                        <span className="text-[9px] leading-2 text-info font-medium">
                          {formatCompactAmount(day.summary.adjustment, locale)}
                        </span>
                      )}
                      {day.summary.transfer !== 0 && (
                        <span className="text-[9px] leading-2 text-transfer font-medium">
                          {formatCompactAmount(day.summary.transfer, locale)}
                        </span>
                      )}
                      {day.summary.income !== 0 && (
                        <span className="text-[9px] leading-2 text-income font-medium">
                          {formatCompactAmount(day.summary.income, locale)}
                        </span>
                      )}
                      {day.summary.expense !== 0 && (
                        <span className="text-[9px] leading-2 text-expense font-medium">
                          {formatCompactAmount(day.summary.expense, locale)}
                        </span>
                      )}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
