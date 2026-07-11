"use client";
import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useDeleteAssetMutation,
  useUpdateAssetMutation,
  useAssetUIStore,
} from "../hooks/assets.hook";
import { toast } from "react-toastify";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import AssetsMenu from "../components/AssetsMenu";
import LoadingModal from "@/shared/components/customs/LoadingModal";

export default function AssetsMenuContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openSortSubMenu, setOpenSortSubMenu] = useState<
    "DATE" | "MONEY" | null
  >(null);
  const setSearchMode = useAssetUIStore((state) => state.setSearchMode);
  const filterType = useAssetUIStore((state) => state.filterType);
  const setFilterType = useAssetUIStore((state) => state.setFilterType);
  const sortType = useAssetUIStore((state) => state.sortType);
  const setSortType = useAssetUIStore((state) => state.setSortType);
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete,
    setIsHardDelete,
    inputValue,
    setInputValue,
  } = useConfirmModal();

  const {
    isOpen: isArchiveModalOpen,
    open: openArchiveModal,
    close: closeArchiveModal,
  } = useConfirmModal();

  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const { mutate: deleteAsset, isPending: isDeletingAsset } =
    useDeleteAssetMutation({
      onSuccess: () => {
        toast.success("Asset deleted successfully!");
        router.push("/");
      },
      onError: () => {
        toast.error("Failed to delete asset.");
      },
    });

  const { mutate: updateAsset, isPending: isUpdatingAsset } =
    useUpdateAssetMutation({
      onSuccess: () => {
        toast.success("Asset archived successfully!");
        router.push("/");
      },
      onError: () => {
        toast.error("Failed to archive asset.");
      },
    });

  const handleDelete = (isHardDelete?: boolean) => {
    if (id) {
      deleteAsset({ id, hardDelete: isHardDelete });
    }
  };

  const handleArchive = () => {
    if (id) {
      updateAsset({ id, data: { isArchived: true } });
    }
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
    if (!isFilterOpen) {
      setIsSortOpen(false);
      setOpenSortSubMenu(null);
    }
  };

  const handleFilterSelect = (
    type: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER" | "ADJUSTMENT",
  ) => {
    setFilterType(type);
    setIsFilterOpen(false);
    setIsOpen(false);
  };

  const handleSortToggle = () => {
    setIsSortOpen(!isSortOpen);
    if (!isSortOpen) {
      setIsFilterOpen(false);
      setOpenSortSubMenu(null);
    } else {
      setOpenSortSubMenu(null);
    }
  };

  const handleSortSubMenuToggle = (menu: "DATE" | "MONEY") => {
    setOpenSortSubMenu((prev) => (prev === menu ? null : menu));
  };

  const handleSortSelect = (
    type: "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST",
  ) => {
    setSortType(type);
    setIsSortOpen(false);
    setOpenSortSubMenu(null);
    setIsOpen(false);
  };

  const filterLabel = (() => {
    switch (filterType) {
      case "INCOME":
        return "Income";
      case "EXPENSE":
        return "Expense";
      case "TRANSFER":
        return "Transfer";
      case "ADJUSTMENT":
        return "Adjustment";
      default:
        return "No Filter";
    }
  })();

  const sortLabel = (() => {
    switch (sortType) {
      case "DATE_NEWEST":
        return "Newest (Date)";
      case "DATE_OLDEST":
        return "Oldest (Date)";
      case "AMOUNT_HIGHEST":
        return "Highest Amount";
      case "AMOUNT_LOWEST":
        return "Lowest Amount";
      default:
        return "Newest (Date)";
    }
  })();

  useClickOutside(
    menuRef,
    () => {
      setIsOpen(false);
      setIsFilterOpen(false);
      setIsSortOpen(false);
      setOpenSortSubMenu(null);
    },
    isOpen,
  );

  return (
    <>
      <AssetsMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={(open) =>
          open ? openDeleteModal() : closeDeleteModal()
        }
        isArchiveModalOpen={isArchiveModalOpen}
        setIsArchiveModalOpen={(open) =>
          open ? openArchiveModal() : closeArchiveModal()
        }
        isHardDelete={isHardDelete}
        setIsHardDelete={setIsHardDelete}
        inputValue={inputValue}
        setInputValue={setInputValue}
        menuRef={menuRef}
        assetName={name}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onSearch={() => setSearchMode(true)}
        filterType={filterType}
        filterLabel={filterLabel}
        isFilterOpen={isFilterOpen}
        onFilterToggle={handleFilterToggle}
        onFilterSelect={handleFilterSelect}
        sortType={sortType}
        sortLabel={sortLabel}
        isSortOpen={isSortOpen}
        openSortSubMenu={openSortSubMenu}
        onSortToggle={handleSortToggle}
        onSortSubMenuToggle={handleSortSubMenuToggle}
        onSortSelect={handleSortSelect}
      />
      <LoadingModal isOpen={isDeletingAsset || isUpdatingAsset} />
    </>
  );
}
