import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface MonthYearNavigatorProps {
  isMonthOpen: boolean;
  isYearOpen: boolean;
  monthRef?: React.RefObject<HTMLDivElement | null>;
  yearRef?: React.RefObject<HTMLDivElement | null>;
  monthLabel: string;
  yearLabel: string;
  selectedMonthIndex: number;
  selectedYear: number;
  months: readonly string[];
  years: number[];
  onMonthToggle: (open?: boolean) => void;
  onYearToggle: (open?: boolean) => void;
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
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-between px-4">
      {/* Month & Year Selector */}
      <div className="flex items-center gap-1">
        {/* Month Dropdown */}
        <div ref={monthRef}>
          <DropdownMenu open={isMonthOpen} onOpenChange={onMonthToggle}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="unstyled"
                hoverScale={1}
                tapScale={1}
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 rounded-lg text-base font-semibold tracking-wide transition-colors cursor-pointer outline-none",
                  isMonthOpen
                    ? "text-primary bg-primary-light"
                    : "text-primary-text hover:bg-surface-secondary",
                )}
              >
                {monthLabel}
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    isMonthOpen && "-rotate-180",
                  )}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={6}
              transition={{ duration: 0.12, ease: "easeOut" }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-h-64 overflow-y-auto p-1 rounded-xl shadow-lg border border-border bg-surface z-50"
            >
              <DropdownMenuGroup>
                {months.map((month, index) => {
                  const isSelected = index === selectedMonthIndex;
                  return (
                    <DropdownMenuItem
                      key={month}
                      onSelect={() => onMonthSelect(index)}
                      className={cn(
                        "w-full justify-between px-2.5 py-1.5 text-sm cursor-pointer rounded-lg my-0.5",
                        isSelected
                          ? "text-primary font-semibold bg-primary-light/60"
                          : "text-primary-text",
                      )}
                    >
                      {month}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Year Dropdown */}
        <div ref={yearRef}>
          <DropdownMenu open={isYearOpen} onOpenChange={onYearToggle}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="unstyled"
                hoverScale={1}
                tapScale={1}
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 rounded-lg text-base font-semibold tracking-wide transition-colors cursor-pointer outline-none",
                  isYearOpen
                    ? "text-primary bg-primary-light"
                    : "text-primary-text hover:bg-surface-secondary",
                )}
              >
                {yearLabel}
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    isYearOpen && "-rotate-180",
                  )}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={6}
              transition={{ duration: 0.12, ease: "easeOut" }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="min-w-22 max-h-64 overflow-y-auto p-1 rounded-xl shadow-lg border border-border bg-surface z-50"
            >
              <DropdownMenuGroup>
                {years.map((year) => {
                  const isSelected = year === selectedYear;
                  return (
                    <DropdownMenuItem
                      key={year}
                      onSelect={() => onYearSelect(year)}
                      className={cn(
                        "w-full justify-between px-2.5 py-1.5 text-sm cursor-pointer rounded-lg my-0.5",
                        isSelected
                          ? "text-primary font-semibold bg-primary-light/60"
                          : "text-primary-text",
                      )}
                    >
                      {year}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <div className="flex items-center gap-1">
        <Button
          variant="unstyled"
          onClick={onGoToToday}
          className="px-2 py-1 mr-1 rounded-lg text-xs font-semibold text-primary bg-primary-light/50 hover:bg-primary-light transition-colors cursor-pointer"
        >
          {t("today")}
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
