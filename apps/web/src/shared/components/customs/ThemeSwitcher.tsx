import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";

export default function ThemeSwitcher() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <div className="flex items-center p-1 bg-surface-secondary rounded-lg border border-border h-8.5 w-24.5 shrink-0" />
    );
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div className="flex items-center p-1 bg-surface-secondary rounded-lg border border-border w-full shrink-0">
      {options.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <button
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
          </button>
        );
      })}
    </div>
  );
}
