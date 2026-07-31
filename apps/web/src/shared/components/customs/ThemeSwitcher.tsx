import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  const activeOption = options.find((opt) => opt.value === theme) || options[1];
  const ActiveIcon = activeOption.icon;

  return (
    <div className="relative flex items-center justify-center w-full">
      {/* Expanded View (Normal / Mobile Drawer / Expanded Sidebar) */}
      <div
        className={cn(
          "relative flex items-center justify-center m-0 p-1 bg-surface-secondary/80 backdrop-blur-xs rounded-xl border border-border/80 w-fit mx-auto shrink-0 select-none overflow-hidden origin-center",
          "transition-all duration-300 ease-in-out",
          "opacity-100 scale-100 max-w-60",
          "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-90 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:absolute",
        )}
      >
        {options.map(({ value, icon: Icon, label }) => {
          const isActive = theme === value;
          return (
            <Button
              key={value}
              variant="unstyled"
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "relative z-10 py-1.5 px-3.5 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 whitespace-nowrap text-xs",
                isActive
                  ? "text-primary-text font-medium"
                  : "text-secondary-text hover:text-primary-text",
              )}
              title={label}
              aria-label={`Switch to ${label} theme`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeThemePill"
                  className="absolute inset-0 bg-surface rounded-lg shadow-xs border border-border/50"
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

      {/* Collapsed View (Only active when sidebar is in collapsed icon mode) */}
      <div
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out origin-center",
          "opacity-0 scale-90 pointer-events-none absolute invisible",
          "group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:scale-100 group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:relative group-data-[collapsible=icon]:visible",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="unstyled"
              type="button"
              className="relative p-2 bg-surface mx-auto rounded-xl border border-border/60 shadow-2xs flex items-center justify-center transition-all hover:bg-surface-secondary cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              title={`Theme: ${activeOption.label}`}
              aria-label={`Current theme: ${activeOption.label}. Click to change.`}
            >
              <ActiveIcon size={16} className="text-primary" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="center"
            sideOffset={12}
            className="w-38 p-1.5 rounded-xl border border-border/80 bg-surface/95 backdrop-blur-md shadow-lg"
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
}
