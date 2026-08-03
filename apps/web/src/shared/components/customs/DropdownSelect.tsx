import { ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";

interface DropdownSelectProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  isOpen: boolean;
  onToggle: (open?: boolean) => void;
  className?: string;
  themeColor?: string | null;
  optionLabels?: Record<string, string>;
  ref?: React.Ref<HTMLDivElement>;
}

export function DropdownSelect({
  options,
  selected,
  onSelect,
  isOpen,
  onToggle,
  className,
  themeColor,
  optionLabels,
  ref,
}: Readonly<DropdownSelectProps>) {
  const effectiveThemeColor =
    themeColor &&
    themeColor.toLowerCase() !== "#ffffff" &&
    themeColor.toLowerCase() !== "#fafafa" &&
    themeColor.toLowerCase() !== "#f5f5f5"
      ? themeColor
      : null;

  const getTriggerStyle = () => {
    if (isOpen && effectiveThemeColor) {
      return {
        backgroundColor: `${effectiveThemeColor}1A`,
        color: effectiveThemeColor,
        borderColor: `${effectiveThemeColor}40`,
      };
    }
    return undefined;
  };

  const getSelectedItemStyle = () => {
    if (effectiveThemeColor) {
      return {
        backgroundColor: `${effectiveThemeColor}20`,
        color: effectiveThemeColor,
      };
    }
    return undefined;
  };

  const getItemClassName = (isSelected: boolean) => {
    if (!isSelected) {
      return "text-primary-text";
    }
    if (effectiveThemeColor) {
      return "font-semibold relative z-10";
    }
    return "text-primary bg-primary-light/80 font-semibold relative z-10";
  };

  return (
    <div
      ref={ref}
      className={cn("relative flex flex-col w-34 text-sm", className)}
    >
      <DropdownMenu open={isOpen} onOpenChange={(open) => onToggle(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="unstyled"
            tapScale={1}
            hoverScale={1}
            type="button"
            style={getTriggerStyle()}
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-semibold tracking-wide border transition-all duration-200 cursor-pointer outline-none w-full select-none",
              isOpen
                ? !effectiveThemeColor && "text-primary"
                : "text-primary-text border-border/70 hover:bg-surface-secondary hover:border-border hover:shadow-xs",
            )}
          >
            <span className="truncate">
              {optionLabels?.[selected] ?? selected}
            </span>
            <ChevronDown
              size={16}
              style={
                isOpen && effectiveThemeColor
                  ? { color: effectiveThemeColor }
                  : undefined
              }
              className={cn(
                "shrink-0 transition-transform duration-200 text-secondary-text",
                isOpen && "-rotate-180",
                isOpen && !effectiveThemeColor && "text-primary",
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
          className="w-(--radix-dropdown-menu-trigger-width) max-h-64 overflow-y-auto p-1.5 rounded-xl shadow-lg border border-border bg-surface text-primary-text z-50"
        >
          <DropdownMenuGroup>
            {options.map((option) => {
              const isSelected = option === selected;
              return (
                <DropdownMenuItem
                  key={option}
                  onSelect={() => onSelect(option)}
                  style={isSelected ? getSelectedItemStyle() : undefined}
                  className={cn(
                    "w-full justify-between px-2.5 py-1.5 text-sm cursor-pointer rounded-lg my-0.5 transition-colors",
                    getItemClassName(isSelected),
                  )}
                >
                  <span className="truncate">
                    {optionLabels?.[option] ?? option}
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

export default DropdownSelect;
