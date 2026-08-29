"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { RotateCcw, Trash2, Archive, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Slide } from "@/shared/components/animate-ui/primitives/effects/slide";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  getListBottomPaddingClass,
  reorderList,
  toggleSelectedId,
} from "../helpers/asset.helper";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import ManageAssetsSkeleton from "../components/ManageAssetsSkeleton";
import CreateAssetsContainer from "./CreateAssetsContainer";

export default function ManageAssetsContainer({
  initialAssets,
  embedded = false,
  contentClassName,
}: Readonly<{
  initialAssets?: Asset[];
  embedded?: boolean;
  contentClassName?: string;
}>) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: assets, isPending } = useAssets({
    includeDeleted: true,
    initialData: initialAssets,
  });
  const isLoading = isPending;

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);

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
  const archivedAssets =
    assets?.filter((a) => !a.deletedAt && a.isArchived) ?? [];
  const deletedAssets = assets?.filter((a) => Boolean(a.deletedAt)) ?? [];

  if (assets !== prevAssets) {
    setPrevAssets(assets);
    setLocalActiveAssets(activeAssets);
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
    onSuccess: () => {
      router.refresh();
      setModalState({
        isOpen: true,
        status: "success",
        message: "Asset restored successfully!",
      });
    },
    onError: () =>
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to restore asset.",
      }),
  });

  const deleteAsset = useDeleteAssetMutation({
    onSuccess: () => {
      router.refresh();
      setModalState({
        isOpen: true,
        status: "success",
        message: "Asset deleted successfully!",
      });
    },
    onError: () =>
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to delete asset.",
      }),
  });

  const { mutate: updateAsset, isPending: isUpdatingAsset } =
    useUpdateAssetMutation({
      onSuccess: () => {
        router.refresh();
        setModalState({
          isOpen: true,
          status: "success",
          message: "Asset updated successfully!",
        });
      },
      onError: () =>
        setModalState({
          isOpen: true,
          status: "error",
          message: "Failed to update asset.",
        }),
    });

  const { mutate: reorderAssets } = useReorderAssetsMutation({
    onSuccess: () => router.refresh(),
    onError: () => toast.error("Failed to update asset order."),
  });

  const bulkDeleteAssets = useBulkDeleteAssetsMutation({
    onSuccess: () => {
      router.refresh();
      setModalState({
        isOpen: true,
        status: "success",
        message: "Assets deleted successfully!",
      });
      setSelectedIds(new Set());
      setEditingList(false);
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
      router.refresh();
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
      router.refresh();
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
    setSelectedIds((prev) => toggleSelectedId(prev, id));
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
      <div className={contentClassName}>
        <ManageAssetsSkeleton />
      </div>
    );
  }

  const listBottomPaddingClass = getListBottomPaddingClass(
    isEditingList,
    embedded,
  );

  return (
    <>
      {embedded && (
        <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-primary-text">
              {t("manageAssets")}
            </h2>
            <p className="text-xs text-secondary-text">{t("navAssetsDesc")}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!isEditingList && (
              <Button
                variant="unstyled"
                type="button"
                onClick={() => setIsCreateAssetOpen(true)}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <Plus aria-hidden="true" className="size-4" />
                {t("addAsset")}
              </Button>
            )}
            {assets && assets.length > 0 && (
              <Button
                variant="unstyled"
                type="button"
                aria-pressed={isEditingList}
                onClick={() => setEditingList(!isEditingList)}
                className="h-9 cursor-pointer rounded-lg border border-border bg-surface-secondary px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary-light"
              >
                {isEditingList ? t("done") : t("edit")}
              </Button>
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col lg:pt-4",
          contentClassName,
        )}
      >
        <AnimatePresence initial={false}>
          {embedded && isEditingList && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mx-4 mb-2 hidden min-h-12 items-center justify-between gap-4 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 lg:flex"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-white"
                >
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                <span
                  aria-live="polite"
                  className="truncate text-sm font-semibold text-primary-text"
                >
                  {selectedIds.size} {t("selected")}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-investment/30 text-investment hover:bg-investment-light"
                  disabled={!hasActiveSelected}
                  onClick={openBulkArchiveModal}
                >
                  <Archive aria-hidden="true" />
                  {t("archive")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-income/30 text-income hover:bg-income-light"
                  disabled={!hasDeletedSelected}
                  onClick={openBulkRestoreModal}
                >
                  <RotateCcw aria-hidden="true" />
                  {t("restore")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-expense/30 text-expense hover:bg-expense-light"
                  disabled={selectedIds.size === 0}
                  onClick={openBulkDeleteModal}
                >
                  <Trash2 aria-hidden="true" />
                  {t("delete")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 py-2 space-y-4 md:pt-0",
            localActiveAssets.length === 0 &&
              archivedAssets.length === 0 &&
              deletedAssets.length === 0 &&
              "my-2 pb-4",
            listBottomPaddingClass,
          )}
        >
          {/* Active Assets */}
          {localActiveAssets.length > 0 && (
            <motion.div layout className="space-y-1 pt-2 sm:p-0 lg:space-y-2">
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
                  draggable={false}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  inlineActions={embedded}
                />
              ))}
            </motion.div>
          )}

          {/* Archived Assets Section */}
          {archivedAssets.length > 0 && (
            <motion.div
              layout
              className={cn(
                "space-y-1 lg:space-y-2",
                (localActiveAssets.length !== 0 ||
                  deletedAssets.length !== 0) &&
                  "pt-2 border-t border-border",
              )}
            >
              <span className="text-xs font-medium text-disabled-text uppercase tracking-wider px-1">
                {t("archived")}
              </span>
              {archivedAssets.map((asset) => (
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
                  inlineActions={embedded}
                />
              ))}
            </motion.div>
          )}

          {/* Deleted Assets Section */}
          {deletedAssets.length > 0 && (
            <motion.div
              layout
              className={cn(
                "space-y-1 lg:space-y-2",
                (localActiveAssets.length !== 0 ||
                  archivedAssets.length !== 0) &&
                  "pt-2 border-t border-border",
              )}
            >
              <span className="text-xs font-medium text-disabled-text uppercase tracking-wider px-1">
                {t("deleted")}
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
                  inlineActions={embedded}
                />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {localActiveAssets.length === 0 &&
            archivedAssets.length === 0 &&
            deletedAssets.length === 0 && (
              <div
                className={cn(
                  "flex flex-col items-center justify-center text-secondary-text text-base",
                  embedded ? "h-48" : "h-[70vh]",
                )}
              >
                {t("noAssetsFound")}
              </div>
            )}
        </section>

        {/* Bulk Bottom Bar */}
        <AnimatePresence>
          {isEditingList && (
            <Slide
              asChild
              direction="up"
              offset={96}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div
                className={cn(
                  "absolute bottom-4 left-3 right-3 z-50 rounded-[1.5rem] border border-border/70 bg-surface/95 px-1.5 py-1.5 backdrop-blur-xl",
                  embedded && "lg:hidden",
                )}
              >
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="flex min-h-10 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold text-secondary-text">
                    {selectedIds.size} {t("selected")}
                  </span>
                  <div className="flex min-w-max flex-1 items-center justify-end gap-0.5">
                    {hasActiveSelected && (
                      <Button
                        variant="unstyled"
                        className="flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 text-[0.5625rem] font-semibold text-investment transition-colors hover:bg-investment-light focus-visible:ring-2 focus-visible:ring-primary/50"
                        disabled={selectedIds.size === 0}
                        onClick={openBulkArchiveModal}
                      >
                        <Archive className="h-4.5 w-4.5" strokeWidth={2} />
                        {t("archive")}
                      </Button>
                    )}
                    {hasDeletedSelected && (
                      <Button
                        variant="unstyled"
                        className="flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 text-[0.5625rem] font-semibold text-income transition-colors hover:bg-income-light focus-visible:ring-2 focus-visible:ring-primary/50"
                        disabled={selectedIds.size === 0}
                        onClick={openBulkRestoreModal}
                      >
                        <RotateCcw className="h-4.5 w-4.5" strokeWidth={2} />
                        {t("restore")}
                      </Button>
                    )}
                    <Button
                      variant="unstyled"
                      className="flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 text-[0.5625rem] font-semibold text-expense transition-colors hover:bg-expense-light focus-visible:ring-2 focus-visible:ring-expense/50"
                      disabled={selectedIds.size === 0}
                      onClick={openBulkDeleteModal}
                    >
                      <Trash2 className="h-4.5 w-4.5" strokeWidth={2} />
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </div>
            </Slide>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      {editingAsset && (
        <EditAssetsContainer
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
        />
      )}

      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
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
        expectedInputToConfirm={t("deleteConfirmationKeyword")}
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
