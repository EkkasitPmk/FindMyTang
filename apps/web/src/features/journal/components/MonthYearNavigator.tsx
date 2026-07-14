import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";

interface MonthYearNavigatorProps {
  isMonthOpen: boolean;
  isYearOpen: boolean;
  monthRef: React.RefObject<HTMLDivElement | null>;
  yearRef: React.RefObject<HTMLDivElement | null>;
  monthLabel: string;
  yearLabel: string;
  selectedMonthIndex: number;
  selectedYear: number;
  months: readonly string[];
  years: number[];
  onMonthToggle: () => void;
  onYearToggle: () => void;
  onMonthSelect: (index: number) => void;
  onYearSelect: (year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
}

export default function MonthYearNavigator({
  isMonthOpen,
  isYearOpen,
  monthRef,
  yearRef,
  monthLabel,
  yearLabel,
  selectedMonthIndex,
  selectedYear,
  months,
  years,
  onMonthToggle,
  onYearToggle,
  onMonthSelect,
  onYearSelect,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
}: Readonly<MonthYearNavigatorProps>) {
  return (
    <section className="flex items-center justify-between px-4">
      {/* Month & Year Selector */}
      <div className="flex items-center gap-1">
        {/* Month Dropdown */}
        <div className="relative" ref={monthRef}>
          <Button
            variant="unstyled"
            onClick={onMonthToggle}
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 rounded-lg text-base font-semibold tracking-wide transition-colors cursor-pointer",
              isMonthOpen
                ? "text-primary bg-primary-light"
                : "text-primary-text hover:bg-surface-secondary",
            )}
          >
            {monthLabel}
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform",
                isMonthOpen && "rotate-x-180",
              )}
            />
          </Button>

          {isMonthOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-44 bg-surface rounded-xl py-1.5 shadow-lg border border-border z-50 animate-subtle-pop">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant="unstyled"
                  onClick={() => onMonthSelect(index)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer",
                    index === selectedMonthIndex
                      ? "text-primary font-semibold bg-primary-light"
                      : "text-primary-text hover:bg-surface-secondary",
                  )}
                >
                  {month}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Year Dropdown */}
        <div className="relative" ref={yearRef}>
          <Button
            variant="unstyled"
            onClick={onYearToggle}
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 rounded-lg text-base font-semibold tracking-wide transition-colors cursor-pointer",
              isYearOpen
                ? "text-primary bg-primary-light"
                : "text-primary-text hover:bg-surface-secondary",
            )}
          >
            {yearLabel}
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform",
                isYearOpen && "rotate-x-180",
              )}
            />
          </Button>

          {isYearOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-28 bg-surface rounded-xl py-1.5 shadow-lg border border-border z-50 animate-subtle-pop">
              {years.map((year) => (
                <Button
                  key={year}
                  variant="unstyled"
                  onClick={() => onYearSelect(year)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer",
                    year === selectedYear
                      ? "text-primary font-semibold bg-primary-light"
                      : "text-primary-text hover:bg-surface-secondary",
                  )}
                >
                  {year}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <div className="flex items-center gap-1">
        <Button
          variant="unstyled"
          onClick={onGoToToday}
          className="px-2 py-1 mr-1 rounded-lg text-xs font-semibold text-primary bg-primary-light/50 hover:bg-primary-light transition-colors cursor-pointer"
        >
          Today
        </Button>
        <Button
          variant="unstyled"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="p-1.5 rounded-lg text-secondary-text hover:bg-surface-secondary hover:text-primary-text transition-colors cursor-pointer"
        >
          <ChevronLeft size={22} />
        </Button>
        <Button
          variant="unstyled"
          onClick={onNextMonth}
          aria-label="Next month"
          className="p-1.5 rounded-lg text-secondary-text hover:bg-surface-secondary hover:text-primary-text transition-colors cursor-pointer"
        >
          <ChevronRight size={22} />
        </Button>
      </div>
    </section>
  );
}
