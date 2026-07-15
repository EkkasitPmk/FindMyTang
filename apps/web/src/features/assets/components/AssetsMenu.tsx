import {
  EllipsisVertical,
  Trash2,
  Archive,
  ChevronRight,
  Funnel,
  Search,
  ArrowUpDown,
} from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import MenuItem from "@/shared/components/customs/MenuItem";
import MenuCheckboxItem from "@/shared/components/customs/MenuCheckboxItem";
import { RefObject } from "react";
import { Button } from "@/shared/components/customs/Button";

interface AssetsMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  isArchiveModalOpen: boolean;
  setIsArchiveModalOpen: (isOpen: boolean) => void;
  menuRef: RefObject<HTMLDivElement | null>;
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
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  onFilterSelect: (
    type: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT",
  ) => void;
  sortType?: "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST";
  sortLabel: string;
  isSortOpen: boolean;
  openSortSubMenu: "DATE" | "MONEY" | null;
  onSortToggle: () => void;
  onSortSubMenuToggle: (menu: "DATE" | "MONEY") => void;
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
  isFilterOpen,
  onFilterToggle,
  onFilterSelect,
  sortType = "DATE_NEWEST",
  sortLabel,
  isSortOpen,
  openSortSubMenu,
  onSortToggle,
  onSortSubMenuToggle,
  onSortSelect,
}: Readonly<AssetsMenuProps>) {
  return (
    <>
      <div className="relative" ref={menuRef}>
        <Button
          variant="unstyled"
          type="button"
          className="p-1 mr-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <EllipsisVertical size={18} />
        </Button>
        {isOpen && (
          <div className="absolute right-3 top-full flex flex-col items-start w-44 bg-surface rounded-md py-1 shadow-md z-50 border border-border">
            <MenuItem
              onClick={() => {
                setIsOpen(false);
                onSearch?.();
              }}
              className="flex items-center gap-2"
            >
              <Search size={16} className="text-secondary-text" />
              <span className="text-base">Search</span>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onFilterToggle();
              }}
              className="relative flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <Funnel size={16} className="text-secondary-text" />
                <div className="flex flex-col text-left">
                  <span className="text-base">Filter</span>
                  <span className="text-[10px] text-secondary-text leading-tight">
                    {filterLabel}
                  </span>
                </div>
              </div>
              <ChevronRight
                size={16}
                className={`transition-transform ${isFilterOpen ? "rotate-90" : ""}`}
              />

              {isFilterOpen && (
                <div className="absolute top-full left-0 w-full bg-surface flex flex-col py-1 shadow-md rounded-md z-50 border border-border">
                  <MenuCheckboxItem
                    label="No Filter"
                    labelSize="base"
                    isSelected={filterType === "ALL"}
                    onClick={() => onFilterSelect("ALL")}
                  />
                  <MenuCheckboxItem
                    label="Income"
                    labelSize="base"
                    isSelected={filterType === "INCOME"}
                    onClick={() => onFilterSelect("INCOME")}
                  />
                  <MenuCheckboxItem
                    label="Expense"
                    labelSize="base"
                    isSelected={filterType === "EXPENSE"}
                    onClick={() => onFilterSelect("EXPENSE")}
                  />
                  <MenuCheckboxItem
                    label="Transfer"
                    labelSize="base"
                    isSelected={filterType === "TRANSFER"}
                    onClick={() => onFilterSelect("TRANSFER")}
                  />
                  <MenuCheckboxItem
                    label="Adjustment"
                    labelSize="base"
                    isSelected={filterType === "ADJUSTMENT"}
                    onClick={() => onFilterSelect("ADJUSTMENT")}
                  />
                </div>
              )}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                onSortToggle();
              }}
              className="relative flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-secondary-text" />
                <div className="flex flex-col text-left">
                  <span className="text-base">Sort</span>
                  <span className="text-[10px] text-secondary-text leading-tight">
                    {sortLabel}
                  </span>
                </div>
              </div>
              <ChevronRight
                size={16}
                className={`transition-transform ${isSortOpen ? "rotate-90" : ""}`}
              />

              {isSortOpen && (
                <div className="absolute top-full left-0 w-full bg-surface flex flex-col py-1 shadow-md rounded-md z-50 border border-border">
                  <MenuCheckboxItem
                    label="Date"
                    labelSize="base"
                    isSelected={
                      sortType === "DATE_NEWEST" || sortType === "DATE_OLDEST"
                    }
                    onClick={() => onSortSubMenuToggle("DATE")}
                    hasSubMenu={true}
                    isSubMenuOpen={openSortSubMenu === "DATE"}
                  >
                    <MenuCheckboxItem
                      label="Newest First"
                      labelSize="base"
                      isSelected={sortType === "DATE_NEWEST"}
                      onClick={() => onSortSelect("DATE_NEWEST")}
                    />
                    <MenuCheckboxItem
                      label="Oldest First"
                      labelSize="base"
                      isSelected={sortType === "DATE_OLDEST"}
                      onClick={() => onSortSelect("DATE_OLDEST")}
                    />
                  </MenuCheckboxItem>

                  <MenuCheckboxItem
                    label="Money"
                    labelSize="base"
                    isSelected={
                      sortType === "AMOUNT_HIGHEST" ||
                      sortType === "AMOUNT_LOWEST"
                    }
                    onClick={() => onSortSubMenuToggle("MONEY")}
                    hasSubMenu={true}
                    isSubMenuOpen={openSortSubMenu === "MONEY"}
                  >
                    <MenuCheckboxItem
                      label="Highest Amount"
                      labelSize="base"
                      isSelected={sortType === "AMOUNT_HIGHEST"}
                      onClick={() => onSortSelect("AMOUNT_HIGHEST")}
                    />
                    <MenuCheckboxItem
                      label="Lowest Amount"
                      labelSize="base"
                      isSelected={sortType === "AMOUNT_LOWEST"}
                      onClick={() => onSortSelect("AMOUNT_LOWEST")}
                    />
                  </MenuCheckboxItem>
                </div>
              )}
            </MenuItem>

            <div className="h-px bg-surface-secondary my-1 w-full" />

            <MenuItem
              onClick={() => {
                setIsOpen(false);
                setIsArchiveModalOpen(true);
              }}
              className="text-base flex items-center gap-2"
            >
              <Archive size={16} className="text-secondary-text" />
              <span>Archive Asset</span>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsOpen(false);
                setIsDeleteModalOpen(true);
              }}
              className="text-expense text-base flex items-center gap-2"
            >
              <Trash2 size={16} className="text-expense" />
              <span>Delete Asset</span>
            </MenuItem>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={onArchive}
        icon={Archive}
        title="Archive Asset"
        des={`Are you sure you want to archive "${assetName || "this asset"}"? You can restore it later.`}
        confirmLabel="Archive"
        variant="warning"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(isHardDelete) => onDelete(isHardDelete)}
        icon={Trash2}
        title="Delete Asset"
        des={`Are you sure you want to delete ${assetName || "this asset"}? This action cannot be undone.`}
        confirmLabel="Delete"
        withHardDeleteOption={true}
        hardDeleteCheckboxLabel="Delete permanently (Hard Delete)"
        expectedInputToConfirm={assetName || ""}
        isHardDelete={isHardDelete}
        onHardDeleteChange={setIsHardDelete}
        inputValue={inputValue}
        onInputChange={setInputValue}
      />
    </>
  );
}
