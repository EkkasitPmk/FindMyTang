import { Plus, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Slide } from "@/shared/components/animate-ui/primitives/effects/slide";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface AssetDetailBottomBarProps {
  assetColor?: string | null;
  isAddMenuOpen: boolean;
  onAddTransactionClick: () => void;
  onAddMenuToggle: () => void;
  onAddMenuClose: () => void;
  onAddExpenseClick: () => void;
  onAddIncomeClick: () => void;
  onTransferClick: () => void;
  onAdjustmentClick: () => void;
}

export default function AssetDetailBottomBar({
  assetColor,
  isAddMenuOpen,
  onAddTransactionClick,
  onAddMenuToggle,
  onAddMenuClose,
  onAddExpenseClick,
  onAddIncomeClick,
  onTransferClick,
  onAdjustmentClick,
}: Readonly<AssetDetailBottomBarProps>) {
  const { t } = useTranslation();

  return (
    <Slide
      asChild
      direction="up"
      offset={96}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <section className="absolute bottom-4 left-3 right-3 z-50 rounded-xl border border-border/70 bg-surface/95 px-1.5 py-1.5 shadow-lg backdrop-blur-xl">
        <div
          className={cn(
            "relative flex w-full items-center rounded-lg bg-primary text-sm font-medium text-white shadow-sm transition-all",
            isAddMenuOpen ? "rounded-tl-none rounded-tr-none" : "",
          )}
          style={{ backgroundColor: assetColor || undefined }}
        >
          <Button
            variant="unstyled"
            onClick={onAddTransactionClick}
            className={cn(
              "flex min-h-10.5 flex-1 items-center justify-center gap-1.5 px-4 font-semibold text-white transition-colors hover:bg-black/10 cursor-pointer",
              isAddMenuOpen
                ? "rounded-tl-none rounded-tr-none rounded-br-none"
                : "rounded-tr-none rounded-br-none",
            )}
          >
            <Plus size={18} />
            <span>{t("addTransaction")}</span>
          </Button>

          <div className="min-h-10.5 w-px bg-white/20" />

          <Button
            variant="unstyled"
            onClick={onAddMenuToggle}
            aria-label="Toggle transaction types menu"
            className={cn(
              "flex min-h-10.5 w-12 items-center justify-center text-white transition-colors hover:bg-black/10 cursor-pointer",
              isAddMenuOpen
                ? "rounded-tr-none rounded-tl-none rounded-bl-none"
                : "rounded-tl-none rounded-bl-none",
            )}
          >
            <ChevronUp
              size={18}
              className={cn(
                "transition-transform duration-200",
                isAddMenuOpen && "rotate-180",
              )}
            />
          </Button>

          {isAddMenuOpen && (
            <>
              <Button
                variant="unstyled"
                type="button"
                aria-label="Close add menu"
                className="fixed inset-0 z-0 w-full h-full cursor-default focus:outline-none"
                onClick={onAddMenuClose}
                tabIndex={-1}
              />
              <div
                className="absolute bottom-full left-1/2 z-10 flex w-full -translate-x-1/2 flex-col overflow-hidden rounded-2xl rounded-bl-none rounded-br-none border border-border bg-primary py-1 text-white shadow-xl"
                style={{ backgroundColor: assetColor || undefined }}
              >
                <Button
                  variant="unstyled"
                  onClick={onAddExpenseClick}
                  className="w-full py-2.5 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                >
                  {t("expense")}
                </Button>
                <Button
                  variant="unstyled"
                  onClick={onAddIncomeClick}
                  className="w-full py-2.5 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                >
                  {t("income")}
                </Button>
                <Button
                  variant="unstyled"
                  onClick={onTransferClick}
                  className="w-full py-2.5 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                >
                  {t("transfer")}
                </Button>
                <Button
                  variant="unstyled"
                  onClick={onAdjustmentClick}
                  className="w-full py-2.5 text-sm hover:bg-black/10 font-medium"
                >
                  {t("adjustment")}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </Slide>
  );
}
