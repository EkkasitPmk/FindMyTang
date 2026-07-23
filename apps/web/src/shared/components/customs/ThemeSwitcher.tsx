import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/animate/dropdown-menu";

export default function ThemeSwitcher() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-1 bg-surface-secondary/60 rounded-xl border border-border/60 h-9.5 w-fit mx-auto shrink-0">
        <div className="w-4 h-4 rounded-full bg-surface-secondary/50 animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <div className="relative flex items-center justify-center p-1 bg-surface-secondary/80 backdrop-blur-xs rounded-xl border border-border/80 w-fit mx-auto shrink-0 transition-all duration-300 ease-in-out select-none overflow-hidden group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:bg-surface group-data-[collapsible=icon]:shadow-2xs group-data-[collapsible=icon]:border-border/60">
        {options.map(({ value, icon: Icon, label }) => {
          const isActive = theme === value;
          return (
            <DropdownMenuTrigger asChild key={value}>
              <button
                onClick={() => setTheme(value)}
                className={cn(
                  "relative z-10 py-1.5 px-3.5 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 whitespace-nowrap",
                  isActive
                    ? "text-primary-text font-medium group-data-[collapsible=icon]:p-1.5"
                    : "text-secondary-text hover:text-primary-text group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:overflow-hidden",
                )}
                title={label}
                aria-label={`Switch to ${label} theme`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeThemePill"
                    className="absolute inset-0 bg-surface rounded-lg shadow-xs border border-border/50 group-data-[collapsible=icon]:hidden"
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
              </button>
            </DropdownMenuTrigger>
          );
        })}
      </div>

      <DropdownMenuContent
        side="right"
        align="center"
        sideOffset={12}
        className="w-38 p-1.5 rounded-xl border border-border/80 bg-surface/95 backdrop-blur-md shadow-lg hidden group-data-[collapsible=icon]:block"
      >
        {options.map(({ value, icon: Icon, label }) => {
          const isActive = theme === value;
          return (
            <DropdownMenuItem
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center justify-between cursor-pointer py-2 px-3 rounded-lg text-xs font-medium transition-colors my-0.5",
                isActive
                  ? "bg-primary-light/80 text-primary font-semibold"
                  : "text-secondary-text hover:text-primary-text hover:bg-surface-secondary/70",
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={15}
                  strokeWidth={isActive ? 2.2 : 1.75}
                  className={isActive ? "text-primary" : "text-secondary-text"}
                />
                <span>{label}</span>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check
                    size={14}
                    className="text-primary shrink-0 stroke-[2.5]"
                  />
                </motion.div>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
