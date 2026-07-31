"use client";
import { useState, useEffect } from "react";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import {
  useDeleteAssetMutation,
  useRestoreAssetMutation,
  useUpdateAssetMutation,
  useAssetUIStore,
  useReorderAssetsMutation,
  useBulkDeleteAssetsMutation,
  useBulkArchiveAssetsMutation,
  useBulkRestoreAssetsMutation,
} from "../hooks/assets.hook";
import { Asset } from "@/shared/lib/types/asset.type";
import { toast } from "react-toastify";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import ManageAssetItem from "../components/ManageAssetItem";
import EditAssetsContainer from "./EditAssetsContainer";
import { RotateCcw, Trash2, Archive } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { reorderList } from "../helpers/asset.helper";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

const SKELETON_ITEMS = Array.from({ length: 4 }, (_, i) => i);

export default function ManageAssetsContainer() {
  const { t } = useTranslation();
  const { data: assets, isPending } = useAssets({ includeDeleted: true });
  const isLoading = isPending;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const isEditingList = useAssetUIStore((state) => state.isEditingList);
  const setEditingList = useAssetUIStore((state) => state.setEditingList);
  const setHasAssets = useAssetUIStore((state) => state.setHasAssets);

  // Local state for drag and drop
  const [localActiveAssets, setLocalActiveAssets] = useState<Asset[]>([]);
  const [prevAssets, setPrevAssets] = useState<Asset[] | undefined>(undefined);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Multiple selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { modalState, setModalState, resetModalState } = useModalState();

  useEffect(() => {
    return () => {
      setEditingList(false);
      setSelectedIds(new Set());
    };
  }, [setEditingList]);

  useEffect(() => {
    if (assets) {
      setHasAssets(assets.length > 0);
    }
  }, [assets, setHasAssets]);

  const [prevIsEditingList, setPrevIsEditingList] = useState(isEditingList);
  if (isEditingList !== prevIsEditingList) {
    setPrevIsEditingList(isEditingList);
    if (!isEditingList) {
      setSelectedIds(new Set());
    }
  }

  const activeAssets =
    assets?.filter((a) => !a.deletedAt && !a.isArchived) ?? [];
  const deletedAssets =
    assets?.filter((a) => a.deletedAt || a.isArchived) ?? [];

  if (assets !== prevAssets) {
    setPrevAssets(assets);
    if (assets) {
      setLocalActiveAssets(activeAssets);
    } else {
      setLocalActiveAssets([]);
    }
  }

  // Modals
  const [assetToRestore, setAssetToRestore] = useState<Asset | null>(null);

  const {
    isOpen: isArchiveModalOpen,
    open: openArchiveModal,
    close: closeArchiveModal,
  } = useConfirmModal();
  const [assetToArchive, setAssetToArchive] = useState<Asset | null>(null);

  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete,
    setIsHardDelete,
    inputValue: confirmInput,
    setInputValue: setConfirmInput,
  } = useConfirmModal();
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  const {
    isOpen: isBulkDeleteModalOpen,
    open: openBulkDeleteModal,
    close: closeBulkDeleteModal,
    isHardDelete: isBulkHardDelete,
    setIsHardDelete: setIsBulkHardDelete,
    inputValue: bulkConfirmInput,
    setInputValue: setBulkConfirmInput,
  } = useConfirmModal();

  const {
    isOpen: isBulkArchiveModalOpen,
    open: openBulkArchiveModal,
    close: closeBulkArchiveModal,
  } = useConfirmModal();

  const {
    isOpen: isBulkRestoreModalOpen,
    open: openBulkRestoreModal,
    close: closeBulkRestoreModal,
  } = useConfirmModal();

  const restoreAsset = useRestoreAssetMutation({
    onSuccess: () =>
      setModalState({
        isOpen: true,
        status: "success",
        message: "Asset restored successfully!",
      }),
    onError: () =>
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to restore asset.",
      }),
  });

  const deleteAsset = useDeleteAssetMutation({
    onSuccess: () =>
      setModalState({
        isOpen: true,
        status: "success",
        message: "Asset deleted successfully!",
      }),
    onError: () =>
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to delete asset.",
      }),
  });

  const { mutate: updateAsset, isPending: isUpdatingAsset } =
    useUpdateAssetMutation({
      onSuccess: () =>
        setModalState({
          isOpen: true,
          status: "success",
          message: "Asset updated successfully!",
        }),
      onError: () =>
        setModalState({
          isOpen: true,
          status: "error",
          message: "Failed to update asset.",
        }),
    });

  const { mutate: reorderAssets } = useReorderAssetsMutation({
    onError: () => toast.error("Failed to update asset order."),
  });

  const bulkDeleteAssets = useBulkDeleteAssetsMutation({
    onSuccess: () => {
      setModalState({
        isOpen: true,
        status: "success",
        message: "Assets deleted successfully!",
      });
      setSelectedIds(new Set());
      closeBulkDeleteModal();
    },
    onError: () =>
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to delete assets.",
      }),
  });

  const bulkArchiveAssets = useBulkArchiveAssetsMutation({
    onSuccess: () => {
      setModalState({
        isOpen: true,
        status: "success",
        message: "Assets archived successfully!",
      });
      setSelectedIds(new Set());
      closeBulkArchiveModal();
    },
    onError: () =>
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to archive assets.",
      }),
  });

  const bulkRestoreAssets = useBulkRestoreAssetsMutation({
    onSuccess: () => {
      setModalState({
        isOpen: true,
        status: "success",
        message: "Assets restored successfully!",
      });
      setSelectedIds(new Set());
      closeBulkRestoreModal();
    },
    onError: () =>
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to restore assets.",
      }),
  });

  const selectedAssetsList = assets?.filter((a) => selectedIds.has(a.id)) ?? [];
  const hasActiveSelected = selectedAssetsList.some(
    (a) => !a.deletedAt && !a.isArchived,
  );
  const hasDeletedSelected = selectedAssetsList.some(
    (a) => a.deletedAt || a.isArchived,
  );

  const handleToggle = (id: string) => {
    if (isEditingList) return;
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setLocalActiveAssets(reorderList(localActiveAssets, draggedIndex, index));
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    reorderAssets(localActiveAssets.map((a) => a.id));
  };

  const handleTouchStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;
    const itemElement = element.closest("[data-index]") as HTMLElement | null;
    if (!itemElement) return;
    const targetIndexAttr = itemElement.dataset.index;
    if (targetIndexAttr === undefined) return;
    const targetIndex = Number.parseInt(targetIndexAttr, 10);
    if (Number.isNaN(targetIndex) || draggedIndex === targetIndex) return;

    setLocalActiveAssets(
      reorderList(localActiveAssets, draggedIndex, targetIndex),
    );
    setDraggedIndex(targetIndex);
  };

  const handleTouchEnd = () => {
    if (draggedIndex === null) return;
    setDraggedIndex(null);
    reorderAssets(localActiveAssets.map((a) => a.id));
  };

  if (isLoading) {
    return (
      <section className="px-4 my-2 space-y-1">
        {SKELETON_ITEMS.map((i) => (
          <div
            key={`manage-skeleton-${i}`}
            className="flex items-center justify-between bg-surface px-3 py-2.5 rounded-lg border-l-4 border-border"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-9.5 w-9.5 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <>
      <section
        className={cn(
          "px-4 space-y-4",
          localActiveAssets.length === 0 &&
            deletedAssets.length === 0 &&
            "my-2 pb-4",
          isEditingList ? "pb-18" : "pb-4",
        )}
      >
        {/* Active Assets */}
        {localActiveAssets.length > 0 && (
          <motion.div layout className="space-y-1 pt-2">
            {localActiveAssets.map((asset, index) => (
              <ManageAssetItem
                key={asset.id}
                asset={asset}
                isExpanded={expandedId === asset.id}
                onToggle={() => handleToggle(asset.id)}
                onEdit={() => setEditingAsset(asset)}
                onArchive={() => {
                  setAssetToArchive(asset);
                  openArchiveModal();
                }}
                onUnarchive={() => {
                  updateAsset({ id: asset.id, data: { isArchived: false } });
                }}
                onRestore={() => {}}
                onDelete={() => {
                  setAssetToDelete(asset);
                  openDeleteModal();
                }}
                isEditingList={isEditingList}
                isSelected={selectedIds.has(asset.id)}
                onToggleSelect={() => toggleSelect(asset.id)}
                index={index}
                draggedIndex={draggedIndex}
                draggable={isEditingList}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            ))}
          </motion.div>
        )}

        {/* Deleted Assets Section */}
        {deletedAssets.length > 0 && (
          <motion.div
            layout
            className={cn(
              "space-y-1",
              localActiveAssets.length !== 0 && "pt-2 border-t border-border",
            )}
          >
            <span className="text-xs font-medium text-disabled-text uppercase tracking-wider px-1">
              {t("archivedDeleted")}
            </span>
            <p className="px-1 text-xs text-secondary-text">
              {t("deletedItemsDesc")}
            </p>
            {deletedAssets.map((asset) => (
              <ManageAssetItem
                key={asset.id}
                asset={asset}
                isExpanded={expandedId === asset.id}
                onToggle={() => handleToggle(asset.id)}
                onEdit={() => {}}
                onArchive={() => {}}
                onUnarchive={() => {
                  updateAsset({ id: asset.id, data: { isArchived: false } });
                }}
                onRestore={() => {
                  setAssetToRestore(asset);
                }}
                onDelete={() => {
                  setAssetToDelete(asset);
                  openDeleteModal();
                }}
                isEditingList={isEditingList}
                isSelected={selectedIds.has(asset.id)}
                onToggleSelect={() => toggleSelect(asset.id)}
                draggable={false}
              />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {localActiveAssets.length === 0 && deletedAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-secondary-text text-base">
            {t("noAssetsFound")}
          </div>
        )}
      </section>

      {/* Bulk Bottom Bar */}
      <AnimatePresence>
        {isEditingList && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between gap-2 overflow-x-auto"
          >
            <span className="text-sm font-medium text-secondary-text whitespace-nowrap pl-2">
              {selectedIds.size} {t("selected")}
            </span>
            <div className="flex gap-2 min-w-max">
              {hasActiveSelected && (
                <Button
                  variant="default"
                  className="bg-investment-light hover:bg-investment/20 text-investment rounded-full px-4 text-xs h-9"
                  disabled={selectedIds.size === 0}
                  onClick={openBulkArchiveModal}
                >
                  <Archive size={16} className="mr-1.5 inline" />
                  {t("archive")}
                </Button>
              )}
              {hasDeletedSelected && (
                <Button
                  variant="default"
                  className="bg-income-light hover:bg-income/20 text-income rounded-full px-4 text-xs h-9"
                  disabled={selectedIds.size === 0}
                  onClick={openBulkRestoreModal}
                >
                  <RotateCcw size={16} className="mr-1.5 inline" />
                  {t("restore")}
                </Button>
              )}
              <Button
                variant="default"
                className="bg-expense hover:bg-expense-dark text-white rounded-full px-4 text-xs h-9"
                disabled={selectedIds.size === 0}
                onClick={openBulkDeleteModal}
              >
                <Trash2 size={16} className="mr-1.5 inline" />
                {t("delete")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editingAsset && (
        <EditAssetsContainer
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
        />
      )}

      {/* Archive Confirm */}
      <ConfirmModal
        isOpen={isArchiveModalOpen}
        onClose={() => {
          closeArchiveModal();
          setAssetToArchive(null);
        }}
        onConfirm={() => {
          if (assetToArchive) {
            updateAsset({ id: assetToArchive.id, data: { isArchived: true } });
            closeArchiveModal();
            setAssetToArchive(null);
          }
        }}
        icon={Archive}
        title={t("archiveConfirmTitle")}
        des={t("archiveConfirmDesc").replace(
          "{assetName}",
          assetToArchive?.name || "",
        )}
        confirmLabel={t("archive")}
        variant="warning"
      />

      {/* Restore Confirm */}
      <ConfirmModal
        isOpen={Boolean(assetToRestore)}
        onClose={() => setAssetToRestore(null)}
        onConfirm={() => {
          if (assetToRestore) {
            restoreAsset.mutate(assetToRestore.id);
            setAssetToRestore(null);
          }
        }}
        icon={RotateCcw}
        title={t("restore")}
        des={`Are you sure you want to restore "${assetToRestore?.name || ""}"? It will be active again.`}
        confirmLabel={t("restore")}
        variant="success"
      />

      {/* Bulk Delete Confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={() => {
          bulkDeleteAssets.mutate({
            ids: Array.from(selectedIds),
            hardDelete: isBulkHardDelete,
          });
        }}
        icon={Trash2}
        title={t("deleteSelectedAssets")}
        des={t("deleteSelectedAssetsDesc").replace(
          "{count}",
          selectedIds.size.toString(),
        )}
        confirmLabel={t("deleteAll")}
        withHardDeleteOption={true}
        hardDeleteCheckboxLabel={t("deletePermanently")}
        expectedInputToConfirm="DELETE"
        isHardDelete={isBulkHardDelete}
        onHardDeleteChange={setIsBulkHardDelete}
        inputValue={bulkConfirmInput}
        onInputChange={setBulkConfirmInput}
      />

      {/* Bulk Archive Confirm */}
      <ConfirmModal
        isOpen={isBulkArchiveModalOpen}
        onClose={closeBulkArchiveModal}
        onConfirm={() => {
          bulkArchiveAssets.mutate({ ids: Array.from(selectedIds) });
        }}
        icon={Archive}
        title={t("archiveSelectedAssets")}
        des={t("archiveSelectedAssetsDesc").replace(
          "{count}",
          selectedIds.size.toString(),
        )}
        confirmLabel={t("archiveAll")}
        variant="warning"
      />

      {/* Bulk Restore Confirm */}
      <ConfirmModal
        isOpen={isBulkRestoreModalOpen}
        onClose={closeBulkRestoreModal}
        onConfirm={() => {
          bulkRestoreAssets.mutate({ ids: Array.from(selectedIds) });
        }}
        icon={RotateCcw}
        title={t("restoreSelectedAssets")}
        des={t("restoreSelectedAssetsDesc").replace(
          "{count}",
          selectedIds.size.toString(),
        )}
        confirmLabel={t("restoreAll")}
        variant="success"
      />

      {/* Hard Delete Confirm */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          closeDeleteModal();
          setAssetToDelete(null);
        }}
        onConfirm={() => {
          if (assetToDelete) {
            const isAlreadyDeleted = Boolean(assetToDelete.deletedAt);
            deleteAsset.mutate({
              id: assetToDelete.id,
              hardDelete: isAlreadyDeleted ? true : isHardDelete,
            });
            closeDeleteModal();
            setAssetToDelete(null);
          }
        }}
        icon={Trash2}
        title={
          assetToDelete?.deletedAt
            ? t("deletePermanentlyModalTitle")
            : t("deleteConfirmTitle")
        }
        des={
          assetToDelete?.deletedAt
            ? t("deletePermanentlyModalDesc").replace(
                "{assetName}",
                assetToDelete?.name || "",
              )
            : t("deleteConfirmDesc").replace(
                "{assetName}",
                assetToDelete?.name || "",
              )
        }
        confirmLabel={t("delete")}
        withHardDeleteOption={!assetToDelete?.deletedAt}
        hardDeleteCheckboxLabel={t("deletePermanently")}
        expectedInputToConfirm={assetToDelete?.name || ""}
        isHardDelete={isHardDelete}
        onHardDeleteChange={setIsHardDelete}
        inputValue={confirmInput}
        onInputChange={setConfirmInput}
      />

      <LoadingModal
        isOpen={
          modalState.isOpen ||
          restoreAsset.isPending ||
          deleteAsset.isPending ||
          isUpdatingAsset ||
          bulkDeleteAssets.isPending ||
          bulkArchiveAssets.isPending ||
          bulkRestoreAssets.isPending
        }
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : undefined}
        onClose={resetModalState}
      />
    </>
  );
}
