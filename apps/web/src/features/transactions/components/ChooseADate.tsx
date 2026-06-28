import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Calendar } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";

interface ChooseADateProps {
  date?: Date;
  currentMonth?: Date;
}

export default function ChooseADate({
  date,
  currentMonth,
}: Readonly<ChooseADateProps>) {
  return (
    <Card
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-fit max-w-74 data-[size=sm]:py-1 data-[size=sm]:gap-2 shadow-2xl z-50"
      size="sm"
    >
      <CardContent>
        <Calendar
          mode="single"
          weekStartsOn={1}
          selected={date}
          captionLayout="dropdown"
          // onSelect={onDateChange}
          month={currentMonth}
          // onMonthChange={onMonthChange}
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
          { label: "วันนี้", value: 0 },
          { label: "พรุ่งนี้", value: 1 },
          { label: "ในอีก 3 วัน", value: 3 },
          { label: "อีกหนึ่งสัปดาห์", value: 7 },
          { label: "อีกสองสัปดาห์", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="flex-1"
            // onClick={() => onPresetClick(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
      <Button className="mb-2 mx-2 bg-blue-500">ยืนยัน</Button>
    </Card>
  );
}
