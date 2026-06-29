import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";
import { getDiffDays } from "../helpers/date.helper";
import { cn } from "@/shared/lib/utils";

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
  const diffDays = getDiffDays(selectedDate);

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
          onSelect={onSelectDate}
          month={displayMonth}
          onMonthChange={onMonthChange}
          fixedWeeks={false}
          className="p-0 [--cell-size:--spacing(9.5)]"
          classNames={{
            month: "flex w-full flex-col gap-2",
            week: "mt-1 flex w-full",
            day_button: "data-[selected-single=true]:bg-blue-500 h-8",
            day: "h-8",
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t rounded-b-none group-data-[size=sm]/card:py-2">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In 1 week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 transition-colors",
              diffDays === preset.value
                ? "bg-blue-50 text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600"
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
        className="mb-2 mx-2 py-4 bg-blue-500 text-white"
        onClick={onConfirm}
      >
        Confirm
      </Button>
    </Card>
  );
}
