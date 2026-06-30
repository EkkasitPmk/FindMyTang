import { Button } from "./Button";
import { cn } from "@/shared/lib/utils/core.util";
import { forwardRef } from "react";

interface DropdownSelectProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  themeColor?: string | null;
}

export const DropdownSelect = forwardRef<HTMLDivElement, DropdownSelectProps>(
  (
    { options, selected, onSelect, isOpen, onToggle, className, themeColor },
    ref,
  ) => {
    const customStyle = themeColor
      ? ({ "--dropdown-theme": themeColor } as React.CSSProperties)
      : undefined;

    return (
      <div
        ref={ref}
        className={cn("flex flex-col w-34 text-sm relative", className)}
        style={customStyle}
      >
        <Button
          variant="unstyled"
          type="button"
          onClick={onToggle}
          className="w-full text-left p-2 border-b text-gray-800 border-border hover:bg-gray-50 focus:outline-none"
        >
          <span>{selected}</span>
          <svg
            className={`w-5 h-5 inline float-right transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 26 26"
            stroke="#6B7280"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>

        {isOpen && (
          <ul className="absolute top-full w-full bg-white border border-border rounded py-1 z-20">
            {options.map((option) => {
              const isSelected = option === selected;
              let bgClass = "";

              if (isSelected) {
                bgClass = themeColor
                  ? "bg-[var(--dropdown-theme)]"
                  : "bg-primary";
              } else {
                bgClass = themeColor
                  ? "hover:bg-[var(--dropdown-theme)] focus:bg-[var(--dropdown-theme)]"
                  : "hover:bg-primary focus:bg-primary";
              }

              return (
                <li key={option}>
                  <Button
                    variant="unstyled"
                    type="button"
                    className={cn(
                      "w-full text-left p-2 cursor-pointer focus:outline-none transition-colors",
                      isSelected
                        ? "text-white font-medium"
                        : "text-gray-800 hover:text-white focus:text-white",
                      bgClass,
                    )}
                    onClick={() => {
                      onSelect(option);
                    }}
                  >
                    {option}
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);

DropdownSelect.displayName = "DropdownSelect";
