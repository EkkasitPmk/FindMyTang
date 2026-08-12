"use client";
import { useState, useTransition } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { deleteAccountAction } from "../services/account.actions";

export default function DangerZoneClientIsland() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const clearGuestData = useGuestStore((state) => state.clearGuestData);
  const setGuestMode = useGuestStore((state) => state.setGuestMode);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState();
  const modal = useConfirmModal();

  const confirmDelete = () => {
    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteAccountAction();
      setIsDeleting(false);
      if (result.success) {
        setModalState({
          isOpen: true,
          status: "success",
          message: "Account deleted successfully",
          shouldRedirect: true,
        });
        return;
      }
      setModalState({ isOpen: true, status: "error", message: result.message });
      modal.close();
    });
  };

  const closeLoading = async () => {
    const shouldRedirect = modalState.shouldRedirect;
    resetModalState();
    if (!shouldRedirect) return;
    modal.close();
    await clearGuestData();
    setGuestMode(false);
    queryClient.clear();
    router.replace("/login");
  };

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium text-expense uppercase">
          {t("dangerZone")}
        </p>
        <div className="space-y-3 rounded-xl border border-expense/40 bg-expense-light/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 shrink-0 text-expense"
              size={18}
              strokeWidth={1.75}
            />
            <p className="text-xs leading-relaxed text-secondary-text">
              {t("dangerZoneDesc")}
            </p>
          </div>
          <Button
            variant="unstyled"
            onClick={modal.open}
            className="w-full rounded-lg border border-expense/60 bg-surface p-3 text-left text-xs font-semibold uppercase text-expense hover:border-expense hover:bg-expense-light/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Trash2 size={15} strokeWidth={1.75} />
              {t("deleteAccountBtn")}
            </div>
          </Button>
        </div>
      </div>
      {modal.isOpen && (
        <ConfirmModal
          isOpen={modal.isOpen}
          onClose={modal.close}
          onConfirm={confirmDelete}
          icon={Trash2}
          title={t("deleteAccountTitle")}
          des={t("deleteAccountDesc")}
          confirmLabel={t("deleteBtn")}
          withHardDeleteOption={true}
          isHardDelete={modal.isHardDelete}
          onHardDeleteChange={modal.setIsHardDelete}
          inputValue={modal.inputValue}
          onInputChange={modal.setInputValue}
          expectedInputToConfirm={t("deleteConfirmationKeyword")}
          hardDeleteCheckboxLabel={t("deleteAccountCheckbox")}
        />
      )}
      <LoadingModal
        isOpen={modalState.isOpen || isDeleting || isPending}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : t("deletingAccount")}
        onClose={closeLoading}
      />
    </>
  );
}
