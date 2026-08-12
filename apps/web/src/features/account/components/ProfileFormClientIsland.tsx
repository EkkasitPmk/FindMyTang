"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PersonalInfoForm from "./PersonalInfoForm";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { updateProfileAction } from "../services/account.actions";
import { syncProfileCache } from "../helpers/profile-cache.helper";
import {
  updateProfileSchema,
  UpdateProfileFormValues,
} from "../schemas/account.form.schema";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import type { UserProfile } from "@/shared/lib/types/user.type";

export default function ProfileFormClientIsland({
  user,
}: Readonly<{ user: UserProfile | null }>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const { modalState, setModalState, resetModalState } = useModalState();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { displayName: user?.displayName || "" },
    values: { displayName: user?.displayName || "" },
  });

  const onUpdateProfile = (values: UpdateProfileFormValues) => {
    startTransition(async () => {
      const result = await updateProfileAction({
        displayName: values.displayName,
      });
      if (result.success) {
        await syncProfileCache(queryClient, result.data);
        setModalState({
          isOpen: true,
          status: "success",
          message: t("profileUpdated"),
        });
        router.refresh();
        return;
      }
      if (result.field === "displayName") {
        setError("displayName", { type: "server", message: result.message });
        return;
      }
      if (result.fieldErrors?.displayName) {
        setError("displayName", {
          type: "server",
          message: result.fieldErrors.displayName,
        });
        return;
      }
      setModalState({ isOpen: true, status: "error", message: result.message });
    });
  };

  return (
    <>
      <PersonalInfoForm
        user={user}
        onUpdateProfile={onUpdateProfile}
        isUpdating={isPending}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isDirty={isDirty}
      />
      <LoadingModal
        isOpen={modalState.isOpen || isPending}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={
          modalState.isOpen
            ? modalState.message
            : t("updating") || "Updating..."
        }
        onClose={resetModalState}
      />
    </>
  );
}
