import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";

interface AssetDateRangeDropdownsProps {
  selectedMonth: string;
  months: string[];
  handleSelectMonth: (month: string) => void;
  isMonthOpen: boolean;
  setIsMonthOpen: Dispatch<SetStateAction<boolean>>;
  selectedYear: string;
  years: string[];
  handleSelectYear: (year: string) => void;
  isYearOpen: boolean;
  setIsYearOpen: Dispatch<SetStateAction<boolean>>;
  translateDropdownItem: (item: string) => string;
}

export default function AssetDateRangeDropdowns({
  selectedMonth,
  months,
  handleSelectMonth,
  isMonthOpen,
  setIsMonthOpen,
  selectedYear,
  years,
  handleSelectYear,
  isYearOpen,
  setIsYearOpen,
  translateDropdownItem,
}: Readonly<AssetDateRangeDropdownsProps>) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Month Dropdown */}
      <DropdownMenu open={isMonthOpen} onOpenChange={setIsMonthOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="unstyled"
            hoverScale={1}
            tapScale={1}
            type="button"
            className={cn(
              "flex items-center justify-between gap-1.5 h-8 px-2.5 rounded-lg text-xs sm:text-sm font-medium border border-border/80 bg-surface transition-colors cursor-pointer outline-none min-w-29 sm:min-w-31 w-auto",
              isMonthOpen
                ? "border-primary text-primary"
                : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary",
            )}
          >
            <span className="whitespace-nowrap">
              {translateDropdownItem(selectedMonth)}
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "shrink-0 transition-transform duration-200 text-secondary-text",
                isMonthOpen && "-rotate-180 text-primary",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          transition={{ duration: 0.12, ease: "easeOut" }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-(--radix-dropdown-menu-trigger-width) min-w-29 sm:min-w-31 max-h-fit overflow-y-auto p-1 rounded-xl shadow-lg border border-border bg-surface z-50"
        >
          <DropdownMenuGroup>
            {months.map((month) => {
              const isSelected = month === selectedMonth;
              return (
                <DropdownMenuItem
                  key={month}
                  onSelect={() => handleSelectMonth(month)}
                  className={cn(
                    "w-full justify-start px-2.5 py-1.5 text-xs sm:text-sm cursor-pointer rounded-lg my-0.5",
                    isSelected
                      ? "text-primary font-semibold bg-primary-light/60"
                      : "text-primary-text",
                  )}
                >
                  <span className="whitespace-nowrap">
                    {translateDropdownItem(month)}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Year Dropdown */}
      <DropdownMenu open={isYearOpen} onOpenChange={setIsYearOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="unstyled"
            hoverScale={1}
            tapScale={1}
            type="button"
            className={cn(
              "flex items-center justify-between gap-1.5 h-8 px-2.5 rounded-lg text-xs sm:text-sm font-medium border border-border/80 bg-surface transition-colors cursor-pointer outline-none min-w-19 sm:min-w-21 w-auto",
              isYearOpen
                ? "border-primary text-primary"
                : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary",
            )}
          >
            <span className="whitespace-nowrap">
              {translateDropdownItem(selectedYear)}
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "shrink-0 transition-transform duration-200 text-secondary-text",
                isYearOpen && "-rotate-180 text-primary",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          transition={{ duration: 0.12, ease: "easeOut" }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-(--radix-dropdown-menu-trigger-width) min-w-19 sm:min-w-21 max-h-60 overflow-y-auto p-1 rounded-xl shadow-lg border border-border bg-surface z-50"
        >
          <DropdownMenuGroup>
            {years.map((year) => {
              const isSelected = year === selectedYear;
              return (
                <DropdownMenuItem
                  key={year}
                  onSelect={() => handleSelectYear(year)}
                  className={cn(
                    "w-full justify-start px-2.5 py-1.5 text-xs sm:text-sm cursor-pointer rounded-lg my-0.5",
                    isSelected
                      ? "text-primary font-semibold bg-primary-light/60"
                      : "text-primary-text",
                  )}
                >
                  <span className="whitespace-nowrap">
                    {translateDropdownItem(year)}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
