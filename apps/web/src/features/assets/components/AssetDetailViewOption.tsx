import { ChevronDown } from "lucide-react";
import { RefObject } from "react";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import { AssetFilterType } from "../types/assets.type";

interface AssetDetailViewOptionProps {
  viewOption: string;
  viewOptionsList: string[];
  isViewOptionOpen: boolean;
  viewOptionRef: RefObject<HTMLDivElement | null>;
  onViewOptionToggle: () => void;
  onViewOptionSelect: (option: string) => void;
  isLoadingTransactions: boolean;
  filterType?: AssetFilterType;
  totalTransactionsCount: number;
  onClearFilter?: () => void;
}

export default function AssetDetailViewOption({
  viewOption,
  viewOptionsList,
  isViewOptionOpen,
  viewOptionRef,
  onViewOptionToggle,
  onViewOptionSelect,
  isLoadingTransactions,
  filterType = "ALL",
  totalTransactionsCount,
  onClearFilter,
}: Readonly<AssetDetailViewOptionProps>) {
  const { t } = useTranslation();

  return (
    <section className="flex items-center justify-between px-4">
      <DropdownMenu open={isViewOptionOpen} onOpenChange={onViewOptionToggle}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="unstyled"
            hoverScale={1}
            tapScale={1}
            type="button"
            ref={viewOptionRef as unknown as React.Ref<HTMLButtonElement>}
            className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-primary-text hover:text-primary transition-colors cursor-pointer outline-none select-none group"
          >
            <span>{t(viewOption as TranslationKey)}</span>
            <ChevronDown
              size={18}
              className={cn(
                "transition-transform duration-200 text-secondary-text group-hover:text-primary",
                isViewOptionOpen && "-rotate-180",
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text z-50 min-w-44"
        >
          <DropdownMenuGroup>
            {viewOptionsList.map((opt) => {
              const isSelected = opt === viewOption;
              return (
                <DropdownMenuItem
                  key={opt}
                  onSelect={() => onViewOptionSelect(opt)}
                  className={cn(
                    "w-full justify-between px-2.5 py-1.5 text-sm cursor-pointer rounded-lg my-0.5",
                    isSelected
                      ? "text-primary font-semibold bg-primary-light/60"
                      : "text-primary-text",
                  )}
                >
                  {t(opt as TranslationKey)}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {isLoadingTransactions ? (
        <span className="h-4 w-14 rounded bg-surface-secondary animate-pulse" />
      ) : (
        <div className="flex items-center gap-1.5">
          {filterType !== "ALL" && (
            <Button
              variant="unstyled"
              hoverScale={1}
              tapScale={1}
              type="button"
              onClick={onClearFilter}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.6875rem] font-medium text-secondary-text hover:text-primary-text bg-surface-secondary hover:bg-surface-secondary/80 transition-colors cursor-pointer"
              title={t("noFilter")}
            >
              <span>{t(filterType.toLowerCase() as TranslationKey)}</span>
              <span className="text-[0.625rem] opacity-70">✕</span>
            </Button>
          )}
          <span className="text-xs sm:text-sm font-medium text-secondary-text tabular-nums">
            {totalTransactionsCount} {t("items")}
          </span>
        </div>
      )}
    </section>
  );
}
