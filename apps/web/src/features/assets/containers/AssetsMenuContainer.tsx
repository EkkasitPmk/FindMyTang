"use client";
import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useDeleteAssetMutation,
  useUpdateAssetMutation,
  useAssetUIStore,
} from "../hooks/assets.hook";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import AssetsMenu from "../components/AssetsMenu";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";

export default function AssetsMenuContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openSortSubMenu, setOpenSortSubMenu] = useState<
    "DATE" | "MONEY" | null
  >(null);
  const setSearchMode = useAssetUIStore((state) => state.setSearchMode);
  const setSearchKeyword = useAssetUIStore((state) => state.setSearchKeyword);
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

  const { t } = useTranslation();

  const {
    isOpen: isArchiveModalOpen,
    open: openArchiveModal,
    close: closeArchiveModal,
  } = useConfirmModal();

  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const nameParam = searchParams.get("name");
  const { data: assets } = useAssets();
  const currentAsset = assets?.find((a) => a.id === id);
  const name = currentAsset?.name || nameParam;
  const { modalState, setModalState, resetModalState } = useModalState();

  const { mutate: deleteAsset, isPending: isDeletingAsset } =
    useDeleteAssetMutation({
      onSuccess: () => {
        setModalState({
          isOpen: true,
          status: "success",
          message: "Asset deleted successfully!",
          shouldRedirect: true,
        });
      },
      onError: () => {
        setModalState({
          isOpen: true,
          status: "error",
          message: "Failed to delete asset.",
        });
      },
    });

  const { mutate: updateAsset, isPending: isUpdatingAsset } =
    useUpdateAssetMutation({
      onSuccess: () => {
        setModalState({
          isOpen: true,
          status: "success",
          message: "Asset archived successfully!",
          shouldRedirect: true,
        });
      },
      onError: () => {
        setModalState({
          isOpen: true,
          status: "error",
          message: "Failed to archive asset.",
        });
      },
    });

  const handleModalClose = () => {
    const shouldRedirect = modalState.shouldRedirect;
    resetModalState();
    if (shouldRedirect) {
      router.push("/");
    }
  };

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
        return t("income");
      case "EXPENSE":
        return t("expense");
      case "TRANSFER":
        return t("transfer");
      case "ADJUSTMENT":
        return t("adjustment");
      default:
        return t("noFilter");
    }
  })();

  const sortLabel = (() => {
    switch (sortType) {
      case "DATE_NEWEST":
        return t("newestFirst");
      case "DATE_OLDEST":
        return t("oldestFirst");
      case "AMOUNT_HIGHEST":
        return t("highestAmount");
      case "AMOUNT_LOWEST":
        return t("lowestAmount");
      default:
        return t("newestFirst");
    }
  })();

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
        onSearch={() => {
          setSearchKeyword("");
          setSearchMode(true);
        }}
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
      <LoadingModal
        isOpen={modalState.isOpen || isDeletingAsset || isUpdatingAsset}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : undefined}
        onClose={handleModalClose}
      />
    </>
  );
}
