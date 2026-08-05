"use client";
import { useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  RotateCcwKey,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "../hooks/account.hook";
import {
  changePasswordSchema,
  updateProfileSchema,
  ChangePasswordFormValues,
  UpdateProfileFormValues,
} from "../schemas/account.form.schema";
import ChangePasswordModal from "../components/ChangePasswordModal";
import AvatarSection from "../components/AvatarSection";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import { useQueryClient } from "@tanstack/react-query";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AccountContainer() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete: isDeleteModalHardDelete,
    setIsHardDelete: setIsDeleteModalHardDelete,
    inputValue: deleteModalInputValue,
    setInputValue: setDeleteModalInputValue,
  } = useConfirmModal();
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState();

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const clearGuestData = useGuestStore((state) => state.clearGuestData);
  const setGuestMode = useGuestStore((state) => state.setGuestMode);
  const { data: user, isLoading } = useMeQuery();

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation({
      onSuccess: () => {
        setModalState({
          isOpen: true,
          status: "success",
          message: t("profileUpdated"),
        });
      },
      onError: (error) => {
        const errorMsg =
          error.response?.data?.message || "Failed to update profile";
        setModalState({
          isOpen: true,
          status: "error",
          message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
        });
      },
    });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
    },
    values: {
      displayName: user?.displayName || "",
    },
  });

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePasswordMutation({
      onSuccess: () => {
        toast.success(t("passwordChanged"));
        handleClosePasswordModal();
      },
      onError: (error) => {
        handleFormError(
          error,
          changePasswordForm.setError,
          "Failed to change password",
          {
            current: "currentPassword",
            "new password": ["newPassword", "confirmNewPassword"], // NOSONAR
            match: ["newPassword", "confirmNewPassword"],
          },
        );
      },
    });

  const handlePasswordSubmit = (values: ChangePasswordFormValues) => {
    changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    });
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    changePasswordForm.reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleUpdateAvatar = (avatarUrl: string | null) => {
    updateProfile({ avatarUrl });
  };

  const handleSelectAvatar = (avatarUrl: string) => {
    handleUpdateAvatar(avatarUrl);
    setIsSelectingAvatar(false);
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateAvatar(null);
  };

  const handleUpdateProfile = (values: UpdateProfileFormValues) => {
    updateProfile({ displayName: values.displayName });
  };

  const { mutate: deleteAccount, isPending: isDeletingAccount } =
    useDeleteAccountMutation({
      onSuccess: () => {
        setModalState({
          isOpen: true,
          status: "success",
          message: "Account deleted successfully",
          shouldRedirect: true,
        });
      },
      onError: (error) => {
        const errorMsg =
          error.response?.data?.message || "Failed to delete account";
        setModalState({
          isOpen: true,
          status: "error",
          message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
        });
        closeDeleteModal();
      },
    });

  const handleModalClose = async () => {
    const shouldRedirect = modalState.shouldRedirect;
    resetModalState();
    if (shouldRedirect) {
      closeDeleteModal();
      await clearGuestData();
      setGuestMode(false);
      queryClient.clear();
      window.location.href = "/login";
    }
  };

  const handleConfirmDeleteAccount = () => {
    deleteAccount();
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center gap-4 my-6">
          <Skeleton className="w-18 h-18 rounded-full border border-border" />
        </div>

        <section className="space-y-10 px-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <div className="bg-surface rounded-b-none rounded-md border border-border p-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
            <div className="bg-surface rounded-t-none rounded-md border-t-0 border border-border p-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-14 w-full rounded-md border border-border" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-expense/20" />
            <div className="space-y-3 rounded-xl border border-expense/20 bg-expense-light/10 p-4">
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  let loadingMessage: string | undefined;
  if (modalState.isOpen) {
    loadingMessage = modalState.message;
  } else if (isDeletingAccount) {
    loadingMessage = t("deletingAccount");
  } else {
    loadingMessage = t("updating") || "Updating...";
  }

  return (
    <>
      {/* Avatar Selection Presentation Component */}
      <AvatarSection
        user={user}
        isUpdating={isUpdating}
        isSelectingAvatar={isSelectingAvatar}
        onToggleSelectingAvatar={() => setIsSelectingAvatar(!isSelectingAvatar)}
        onCloseSelectingAvatar={() => setIsSelectingAvatar(false)}
        onSelectAvatar={handleSelectAvatar}
        onRemoveAvatar={handleRemoveAvatar}
      />

      <section className="space-y-10 md:space-y-4 px-4 pb-18 md:pb-4">
        {/* Personal Info Form Presentation Component (React Hook Form & Zod) */}
        <PersonalInfoForm
          user={user}
          onUpdateProfile={handleUpdateProfile}
          isUpdating={isUpdating}
          register={registerProfile}
          handleSubmit={handleSubmitProfile}
          errors={profileErrors}
          isDirty={isProfileDirty}
        />

        {/* Change Password Block */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-secondary-text uppercase">
            {t("security")}
          </p>
          <Button
            variant="unstyled"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full bg-surface rounded-md border border-border p-4 text-left hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-text">
                <RotateCcwKey size={16} />
                <p className="text-xs font-semibold uppercase">
                  {t("changePassword")}
                </p>
              </div>
              <ChevronRight className="text-secondary-text/70" size={16} />
            </div>
          </Button>
        </div>

        {/* Danger Zone */}
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
              onClick={openDeleteModal}
              className="w-full rounded-lg border border-expense/60 bg-surface p-3 text-left text-xs font-semibold uppercase text-expense hover:border-expense hover:bg-expense-light/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Trash2 size={15} strokeWidth={1.75} />
                {t("deleteAccountBtn")}
              </div>
            </Button>
          </div>
        </div>
      </section>

      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
          register={changePasswordForm.register}
          handleSubmit={changePasswordForm.handleSubmit}
          onSubmit={handlePasswordSubmit}
          errors={changePasswordForm.formState.errors}
          isPending={isChangingPassword}
          showCurrent={showCurrentPassword}
          showNew={showNewPassword}
          showConfirm={showConfirmPassword}
          onToggleShowCurrent={() =>
            setShowCurrentPassword(!showCurrentPassword)
          }
          onToggleShowNew={() => setShowNewPassword(!showNewPassword)}
          onToggleShowConfirm={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDeleteAccount}
          icon={Trash2}
          title={t("deleteAccountTitle")}
          des={t("deleteAccountDesc")}
          confirmLabel={t("deleteBtn")}
          withHardDeleteOption={true}
          isHardDelete={isDeleteModalHardDelete}
          onHardDeleteChange={setIsDeleteModalHardDelete}
          inputValue={deleteModalInputValue}
          onInputChange={setDeleteModalInputValue}
          expectedInputToConfirm="DELETE"
          hardDeleteCheckboxLabel={t("deleteAccountCheckbox")}
        />
      )}

      <LoadingModal
        isOpen={modalState.isOpen || isUpdating || isDeletingAccount}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={loadingMessage}
        onClose={handleModalClose}
      />
    </>
  );
}
