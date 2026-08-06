import { RotateCcw, Trash } from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import ImagePreviewModal from "@/shared/components/customs/ImagePreviewModal";
import LoadingModal, {
  type LoadingModalProps,
} from "@/shared/components/customs/LoadingModal";

interface TransactionListModalsProps {
  isRestoreOpen: boolean;
  onCloseRestore: () => void;
  onConfirmRestore: () => void;
  restoreTitle: string;
  restoreDescription: string;
  restoreLabel: string;
  isDeleteOpen: boolean;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  deleteTitle: string;
  deleteDescription: string;
  deleteLabel: string;
  withHardDeleteOption: boolean;
  isHardDelete: boolean;
  onHardDeleteChange: (value: boolean) => void;
  hardDeleteLabel: string;
  loadingModal: Pick<LoadingModalProps, "isOpen" | "status" | "message">;
  onCloseLoading: () => void;
  previewImageUrl: string | null;
  onClosePreview: () => void;
}

export default function TransactionListModals({
  isRestoreOpen,
  onCloseRestore,
  onConfirmRestore,
  restoreTitle,
  restoreDescription,
  restoreLabel,
  isDeleteOpen,
  onCloseDelete,
  onConfirmDelete,
  deleteTitle,
  deleteDescription,
  deleteLabel,
  withHardDeleteOption,
  isHardDelete,
  onHardDeleteChange,
  hardDeleteLabel,
  loadingModal,
  onCloseLoading,
  previewImageUrl,
  onClosePreview,
}: Readonly<TransactionListModalsProps>) {
  return (
    <>
      <ConfirmModal
        isOpen={isRestoreOpen}
        onClose={onCloseRestore}
        onConfirm={onConfirmRestore}
        icon={RotateCcw}
        title={restoreTitle}
        des={restoreDescription}
        confirmLabel={restoreLabel}
        variant="success"
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        icon={Trash}
        title={deleteTitle}
        des={deleteDescription}
        confirmLabel={deleteLabel}
        variant="danger"
        withHardDeleteOption={withHardDeleteOption}
        isHardDelete={isHardDelete}
        onHardDeleteChange={onHardDeleteChange}
        hardDeleteCheckboxLabel={hardDeleteLabel}
      />
      <LoadingModal {...loadingModal} onClose={onCloseLoading} />
      <ImagePreviewModal
        isOpen={!!previewImageUrl}
        onClose={onClosePreview}
        imageUrl={previewImageUrl || ""}
      />
    </>
  );
}
