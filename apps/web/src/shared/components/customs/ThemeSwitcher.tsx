import { useTheme } from "next-themes";
import { useId } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";
import {
  ThemeToggler,
  type Resolved,
  type ThemeSelection,
} from "@/shared/components/animate-ui/primitives/effects/theme-toggler";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";

interface ThemeSwitcherProps {
  mobileMenu?: boolean;
}

export default function ThemeSwitcher({
  mobileMenu = false,
}: Readonly<ThemeSwitcherProps>) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const activePillLayoutId = useId();

  const options = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "system" as const, icon: Monitor, label: "System" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
  ];

  return (
    <ThemeToggler
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={setTheme}
    >
      {({ effective, toggleTheme }) => {
        const activeOption =
          options.find((option) => option.value === effective) ?? options[1];
        const ActiveIcon = activeOption.icon;

        if (mobileMenu) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="unstyled"
                  type="button"
                  className="w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-secondary-text hover:bg-surface-secondary hover:text-primary-text transition-colors cursor-pointer"
                  aria-label="Change appearance"
                >
                  <span className="flex items-center gap-3">
                    <ActiveIcon
                      className="w-4 h-4 text-primary"
                      strokeWidth={1.75}
                    />
                    Appearance
                  </span>
                  <span className="text-xs text-secondary-text">
                    {activeOption.label}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-48 rounded-xl border border-border bg-surface p-1.5 shadow-lg"
              >
                {options.map(({ value, icon: Icon, label }) => {
                  const isActive = effective === value;
                  return (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => toggleTheme(value)}
                      className={cn(
                        "my-0.5 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary-light/80 font-semibold text-primary"
                          : "text-secondary-text hover:bg-surface-secondary/70 hover:text-primary-text",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon size={15} strokeWidth={isActive ? 2.2 : 1.75} />
                        {label}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                "relative m-0 flex w-fit max-w-60 shrink-0 select-none items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-surface-secondary/80 p-1 backdrop-blur-xs",
                "origin-center transition-all duration-300 ease-in-out",
                "opacity-100 scale-100",
                "group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:scale-90 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:opacity-0",
              )}
            >
              {options.map(({ value, icon: Icon, label }) => {
                const isActive = effective === value;
                return (
                  <Button
                    key={value}
                    variant="unstyled"
                    type="button"
                    onClick={() => toggleTheme(value)}
                    className={cn(
                      "relative z-10 flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      isActive
                        ? "font-medium text-primary-text"
                        : "text-secondary-text hover:text-primary-text",
                    )}
                    title={label}
                    aria-label={`Switch to ${label} theme`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={activePillLayoutId}
                        className="absolute inset-0 rounded-lg border border-border/50 bg-surface shadow-xs"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`${value}-${isActive}`}
                          initial={{ scale: 0.8, rotate: isActive ? -12 : 0 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <Icon
                            size={15}
                            strokeWidth={isActive ? 2.3 : 1.8}
                            className={cn(
                              "transition-colors duration-200",
                              isActive ? "text-primary" : "text-secondary-text",
                            )}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </span>
                  </Button>
                );
              })}
            </div>

            <div
              className={cn(
                "invisible absolute mx-auto origin-center scale-90 opacity-0 transition-all duration-300 ease-in-out",
                "group-data-[collapsible=icon]:relative group-data-[collapsible=icon]:visible group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:scale-100 group-data-[collapsible=icon]:opacity-100",
              )}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="unstyled"
                    type="button"
                    className="relative mx-auto flex cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-surface p-2 shadow-2xs transition-all hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    title={`Theme: ${activeOption.label}`}
                    aria-label={`Current theme: ${activeOption.label}. Click to change.`}
                  >
                    <ActiveIcon
                      size={16}
                      className="text-primary"
                      strokeWidth={2}
                    />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="right"
                  align="center"
                  sideOffset={12}
                  className="w-38 rounded-xl border border-border/80 bg-surface/95 p-1.5 shadow-lg backdrop-blur-md"
                >
                  {options.map(({ value, icon: Icon, label }) => {
                    const isActive = effective === value;
                    return (
                      <DropdownMenuItem
                        key={value}
                        onClick={() => toggleTheme(value)}
                        className={cn(
                          "my-0.5 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                          isActive
                            ? "bg-primary-light/80 font-semibold text-primary"
                            : "text-secondary-text hover:bg-surface-secondary/70 hover:text-primary-text",
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={15}
                            strokeWidth={isActive ? 2.2 : 1.75}
                            className={
                              isActive ? "text-primary" : "text-secondary-text"
                            }
                          />
                          <span>{label}</span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      }}
    </ThemeToggler>
  );
}
