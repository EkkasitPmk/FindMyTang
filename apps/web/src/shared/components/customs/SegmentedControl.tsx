import { cn } from "@/shared/lib/utils/core.util";
import React from "react";
import { Button } from "@/shared/components/customs/Button";

export interface SegmentedControlOption<T extends string> {
  label: React.ReactNode;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: Readonly<SegmentedControlProps<T>>) {
  return (
    <section
      className={cn(
        "bg-primary-light flex rounded-lg text-xs font-medium p-1",
        className,
      )}
    >
      {options.map((option) => (
        <Button
          variant="unstyled"
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "w-full grow py-2 rounded-md transition-all",
            value === option.value && "bg-primary text-white font-bold",
          )}
        >
          {option.label}
        </Button>
      ))}
    </section>
  );
}
