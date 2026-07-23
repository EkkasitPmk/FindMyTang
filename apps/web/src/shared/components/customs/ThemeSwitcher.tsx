import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { Button } from "@/shared/components/customs/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/animate/dropdown-menu";

interface ThemeSwitcherProps {
  isCollapsed?: boolean;
}

export default function ThemeSwitcher({
  isCollapsed = false,
}: Readonly<ThemeSwitcherProps>) {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  if (!mounted) {
    if (isCollapsed) {
      return (
        <div className="flex items-center justify-center p-2 rounded-lg shrink-0">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-surface border border-border/50 shadow-2xs">
            <Sun size={14} className="text-secondary-text" />
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center p-1 bg-surface-secondary rounded-lg border border-border h-8.5 w-24.5 shrink-0" />
    );
  }

  const currentOption =
    options.find((opt) => opt.value === theme) || options[1];
  const CurrentIcon = currentOption.icon;

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="unstyled"
            className="flex items-center justify-center p-2 rounded-lg shrink-0 cursor-pointer hover:bg-surface-secondary/80 transition-all text-sm group focus:outline-none"
            aria-label="Select theme"
          >
            <div className="flex items-center justify-center w-6 h-6 rounded bg-surface border border-border/50 shadow-2xs">
              <CurrentIcon
                size={14}
                className="text-secondary-text group-hover:text-primary-text transition-colors"
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="center"
          sideOffset={8}
          className="w-36"
        >
          {options.map(({ value, icon: Icon, label }) => {
            const isActive = theme === value;
            return (
              <DropdownMenuItem
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex items-center justify-between cursor-pointer py-2 px-3 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary-light text-primary font-semibold"
                    : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary/80",
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.75} />
                  <span>{label}</span>
                </div>
                {isActive && (
                  <Check size={14} className="text-primary shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center p-1 bg-surface-secondary rounded-lg border border-border w-full shrink-0">
      {options.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <Button
            variant="unstyled"
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "p-1.5 w-full rounded-md flex items-center justify-center transition-all cursor-pointer",
              isActive
                ? "bg-surface text-primary-text shadow-sm"
                : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary/80",
            )}
            title={label}
            aria-label={`Switch to ${label} theme`}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
          </Button>
        );
      })}
    </div>
  );
}
