import { Trash } from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import LoadingModal, {
  type LoadingModalProps,
} from "@/shared/components/customs/LoadingModal";

interface TransactionModalsProps {
  isDeleteModalOpen: boolean;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  isHardDelete: boolean;
  onHardDeleteChange: (value: boolean) => void;
  confirmInput: string;
  onConfirmInputChange: (value: string) => void;
  deleteTitle: string;
  deleteDescription: string;
  deleteLabel: string;
  deletePermanentlyLabel: string;
  loadingModal: Pick<LoadingModalProps, "isOpen" | "status" | "message">;
  onCloseLoading: () => void;
}

export default function TransactionModals({
  isDeleteModalOpen,
  onCloseDelete,
  onConfirmDelete,
  isHardDelete,
  onHardDeleteChange,
  confirmInput,
  onConfirmInputChange,
  deleteTitle,
  deleteDescription,
  deleteLabel,
  deletePermanentlyLabel,
  loadingModal,
  onCloseLoading,
}: Readonly<TransactionModalsProps>) {
  return (
    <>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        icon={Trash}
        title={deleteTitle}
        des={deleteDescription}
        confirmLabel={deleteLabel}
        withHardDeleteOption={true}
        isHardDelete={isHardDelete}
        onHardDeleteChange={onHardDeleteChange}
        hardDeleteCheckboxLabel={deletePermanentlyLabel}
        inputValue={confirmInput}
        onInputChange={onConfirmInputChange}
      />
      <LoadingModal {...loadingModal} onClose={onCloseLoading} />
    </>
  );
}
