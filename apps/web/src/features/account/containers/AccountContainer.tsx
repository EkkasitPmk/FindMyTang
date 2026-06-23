"use client";
import { useState } from "react";
import { ChevronRight, RotateCcwKey, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMeQuery } from "@/features/nav/hooks/auth.hook";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../hooks/account.hook";
import {
  changePasswordSchema,
  updateProfileSchema,
  ChangePasswordFormValues,
  UpdateProfileFormValues,
} from "../schemas/account.schema";
import ChangePasswordModal from "../components/ChangePasswordModal";
import AvatarSection from "../components/AvatarSection";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ConfirmModal from "@/shared/components/custom/ConfirmModal";
import { useTranslation } from "@/shared/lib/i18n/useTranslation";

export default function AccountContainer() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();
  const { data: user, isLoading } = useMeQuery();

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation({
      onSuccess: () => {
        toast.success(t("profileUpdated"));
      },
      onError: (error) => {
        const errorMsg =
          error.response?.data?.message || "Failed to update profile";
        toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
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
        const errorMsg =
          error.response?.data?.message || "Failed to change password";
        let errorList: string[] = [];
        if (Array.isArray(errorMsg)) {
          errorList = errorMsg;
        } else if (errorMsg) {
          errorList = [errorMsg];
        }

        if (errorList.length === 0) {
          toast.error("Failed to change password");
          return;
        }

        errorList.forEach((msg) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("current")) {
            changePasswordForm.setError("currentPassword", {
              type: "server",
              message: msg,
            });
          } else if (
            lowerMsg.includes("new password") ||
            lowerMsg.includes("match")
          ) {
            changePasswordForm.setError("newPassword", {
              type: "server",
              message: msg,
            });
            changePasswordForm.setError("confirmNewPassword", {
              type: "server",
              message: msg,
            });
          } else {
            toast.error(msg);
          }
        });
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

  const handleConfirmDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    toast.info(t("deleteAccountInfo"));
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col items-center justify-center my-6">
          <div className="w-24 h-24 rounded-full bg-surface-secondary border border-border" />
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-white border border-border rounded-md" />
          <div className="h-16 bg-white border border-border rounded-md" />
        </div>
      </div>
    );
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

      <div className="space-y-8">
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
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full bg-white rounded-md border border-border p-4 text-left hover:bg-surface-secondary transition-colors cursor-pointer"
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
          </button>
        </div>

        {/* Delete Account Block */}
        <div className="space-y-1">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full bg-white rounded-md border text-xs font-semibold text-expense uppercase border-expense/60 p-4 text-left hover:bg-expense-light/20 hover:border-expense transition-colors cursor-pointer"
          >
            {t("deleteAccountBtn")}
          </button>
        </div>
      </div>

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
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDeleteAccount}
          icon={Trash2}
          title={t("deleteAccountTitle")}
          des={t("deleteAccountDesc")}
          confirmLabel={t("deleteBtn")}
        />
      )}
    </>
  );
}
