"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/animate-ui/primitives/radix/collapsible";
import ChooseADate from "@/features/transactions/components/ChooseADate";
import {
  formatDisplayDate,
  updatePresetDate,
} from "@/shared/lib/helpers/date.helper";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Calendar, ChevronDown } from "lucide-react";
import type { Locale } from "date-fns";

interface RecurringDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
  dueTodayLabel?: string;
  locale?: string;
  calendarLocale?: Locale;
}

export function RecurringDatePicker({
  value,
  onChange,
  label,
  dueTodayLabel,
  locale = "en-US",
  calendarLocale,
}: Readonly<RecurringDatePickerProps>) {
  const { t } = useTranslation();
  const [tempDate, setTempDate] = useState<Date | undefined>(value);
  const [displayMonth, setDisplayMonth] = useState<Date | undefined>(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCalendarOpen) {
      const timer = setTimeout(() => {
        calendarRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCalendarOpen]);

  const displayDate = formatDisplayDate(value, false, locale, t);

  const handleOpenCalendar = () => {
    setTempDate(value);
    setDisplayMonth(value);
    setIsCalendarOpen(true);
  };

  const handleConfirmDate = () => {
    if (tempDate) {
      onChange(tempDate);
    }
    setIsCalendarOpen(false);
  };

  const handlePresetClick = (daysToAdd: number) => {
    const newDate = updatePresetDate(daysToAdd, tempDate);
    setTempDate(newDate);
    setDisplayMonth(newDate);
  };

  const handleSetToday = () => {
    const today = new Date();
    onChange(today);
    setTempDate(today);
    setDisplayMonth(today);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      <div className="flex items-center justify-between">
        <label
          htmlFor="recurring-datepicker-trigger"
          className="text-sm font-semibold text-secondary-text"
        >
          {label} *
        </label>
        {dueTodayLabel && (
          <button
            type="button"
            onClick={handleSetToday}
            className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            {dueTodayLabel}
          </button>
        )}
      </div>

      <Collapsible
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            id="recurring-datepicker-trigger"
            variant="unstyled"
            type="button"
            tapScale={1}
            hoverScale={1}
            onClick={() => {
              if (!isCalendarOpen) handleOpenCalendar();
            }}
            className={cn(
              "relative w-full flex items-center gap-2.5 bg-background rounded-lg border border-border/50 px-3.5 h-12 text-left cursor-pointer transition-all hover:bg-surface-secondary/40 focus:ring-2 focus:ring-primary/20",
              isCalendarOpen && "rounded-bl-none rounded-br-none border-b-0",
            )}
          >
            <Calendar size={18} className="text-secondary-text shrink-0" />
            <span className="text-sm font-medium text-primary-text flex-1">
              {displayDate}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "text-muted-foreground transition-transform duration-200 shrink-0",
                isCalendarOpen && "rotate-180",
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent keepRendered>
          <div ref={calendarRef}>
            <ChooseADate
              selectedDate={tempDate}
              onSelectDate={setTempDate}
              displayMonth={displayMonth}
              onMonthChange={setDisplayMonth}
              onConfirm={handleConfirmDate}
              onPresetClick={handlePresetClick}
              locale={calendarLocale}
              showTime={false}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
