import {
  EllipsisVertical,
  Trash2,
  Archive,
  Funnel,
  Search,
  ArrowUpDown,
} from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { RefObject } from "react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";

interface AssetsMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  isArchiveModalOpen: boolean;
  setIsArchiveModalOpen: (isOpen: boolean) => void;
  menuRef?: RefObject<HTMLDivElement | null>;
  assetName: string | null;
  onDelete: (isHardDelete?: boolean) => void;
  onArchive: () => void;
  isHardDelete?: boolean;
  setIsHardDelete?: (value: boolean) => void;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  onSearch?: () => void;
  filterType?: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT";
  filterLabel: string;
  isFilterOpen?: boolean;
  onFilterToggle?: () => void;
  onFilterSelect: (
    type: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT",
  ) => void;
  sortType?: "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST";
  sortLabel: string;
  isSortOpen?: boolean;
  openSortSubMenu?: "DATE" | "MONEY" | null;
  onSortToggle?: () => void;
  onSortSubMenuToggle?: (menu: "DATE" | "MONEY") => void;
  onSortSelect: (
    type: "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST",
  ) => void;
}

export default function AssetsMenu({
  isOpen,
  setIsOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  isArchiveModalOpen,
  setIsArchiveModalOpen,
  menuRef,
  assetName,
  onDelete,
  onArchive,
  isHardDelete,
  setIsHardDelete,
  inputValue,
  setInputValue,
  onSearch,
  filterType = "ALL",
  filterLabel,
  onFilterSelect,
  sortType = "DATE_NEWEST",
  sortLabel,
  onSortSelect,
}: Readonly<AssetsMenuProps>) {
  const { t } = useTranslation();
  return (
    <>
      <div ref={menuRef}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="unstyled"
              tapScale={1}
              hoverScale={1}
              type="button"
              className="p-1 mr-2 cursor-pointer hover:bg-surface-secondary rounded-lg outline-none transition-colors"
            >
              <EllipsisVertical size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={4}
            className="w-48 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text z-50"
          >
            <DropdownMenuItem
              onSelect={() => {
                onSearch?.();
              }}
              className="flex items-center gap-2 cursor-pointer py-2"
            >
              <Search size={16} className="text-secondary-text" />
              <span className="text-sm">{t("search")}</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="w-full justify-between cursor-pointer py-2">
                <div className="flex items-center gap-2">
                  <Funnel size={16} className="text-secondary-text shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm">{t("filter")}</span>
                    <span className="text-[0.625rem] text-secondary-text leading-2">
                      {filterLabel}
                    </span>
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text">
                <DropdownMenuCheckboxItem
                  checked={filterType === "ALL"}
                  onSelect={() => onFilterSelect("ALL")}
                  className="cursor-pointer text-sm"
                >
                  {t("noFilter")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterType === "INCOME"}
                  onSelect={() => onFilterSelect("INCOME")}
                  className="cursor-pointer text-sm"
                >
                  {t("income")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterType === "EXPENSE"}
                  onSelect={() => onFilterSelect("EXPENSE")}
                  className="cursor-pointer text-sm"
                >
                  {t("expense")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterType === "TRANSFER"}
                  onSelect={() => onFilterSelect("TRANSFER")}
                  className="cursor-pointer text-sm"
                >
                  {t("transfer")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterType === "ADJUSTMENT"}
                  onSelect={() => onFilterSelect("ADJUSTMENT")}
                  className="cursor-pointer text-sm"
                >
                  {t("adjustment")}
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="w-full justify-between cursor-pointer py-2">
                <div className="flex items-center gap-2">
                  <ArrowUpDown
                    size={16}
                    className="text-secondary-text shrink-0"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-sm">{t("sort")}</span>
                    <span className="text-[0.625rem] text-secondary-text leading-2">
                      {sortLabel}
                    </span>
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer text-sm">
                    <span>{t("date")}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-36 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text">
                    <DropdownMenuCheckboxItem
                      checked={sortType === "DATE_NEWEST"}
                      onSelect={() => onSortSelect("DATE_NEWEST")}
                      className="cursor-pointer text-sm"
                    >
                      {t("newestFirst")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortType === "DATE_OLDEST"}
                      onSelect={() => onSortSelect("DATE_OLDEST")}
                      className="cursor-pointer text-sm"
                    >
                      {t("oldestFirst")}
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer text-sm">
                    <span>{t("money")}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-36 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text">
                    <DropdownMenuCheckboxItem
                      checked={sortType === "AMOUNT_HIGHEST"}
                      onSelect={() => onSortSelect("AMOUNT_HIGHEST")}
                      className="cursor-pointer text-sm"
                    >
                      {t("highestAmount")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortType === "AMOUNT_LOWEST"}
                      onSelect={() => onSortSelect("AMOUNT_LOWEST")}
                      className="cursor-pointer text-sm"
                    >
                      {t("lowestAmount")}
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() => setIsArchiveModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer text-sm py-2"
            >
              <Archive size={16} className="text-secondary-text" />
              <span>{t("archiveAsset")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 cursor-pointer text-sm py-2"
            >
              <Trash2 size={16} className="text-expense" />
              <span>{t("deleteAsset")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={onArchive}
        icon={Archive}
        title={t("archiveConfirmTitle")}
        des={t("archiveConfirmDesc").replace("{assetName}", assetName || "")}
        confirmLabel={t("archive")}
        variant="warning"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(isHardDelete) => onDelete(isHardDelete)}
        icon={Trash2}
        title={t("deleteConfirmTitle")}
        des={t("deleteConfirmDesc").replace("{assetName}", assetName || "")}
        confirmLabel={t("delete")}
        withHardDeleteOption={true}
        hardDeleteCheckboxLabel={t("deletePermanently")}
        expectedInputToConfirm={assetName || ""}
        isHardDelete={isHardDelete}
        onHardDeleteChange={setIsHardDelete}
        inputValue={inputValue}
        onInputChange={setInputValue}
      />
    </>
  );
}
