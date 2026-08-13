"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useSupportDiscardGuard } from "../../hooks/useSupportDiscardGuard.hook";
import type { TranslationKey } from "@/shared/lib/configs/translations.config";
import FeedbackForm from "../components/FeedbackForm";
import { FEEDBACK_TYPES } from "../configs/feedback.config";
import { feedbackFormSchema } from "../schemas/feedback.form.schema";
import { submitSupportRequest } from "../../services/support.service";
import type { FeedbackFormValues } from "../types/feedback.type";

export default function FeedbackContainer({
  header,
}: Readonly<{ header?: ReactNode }>) {
  const { t, currentLanguage } = useTranslation();
  const isGuest = useIsGuest();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [selectedType, setSelectedType] =
    useState<FeedbackFormValues["type"]>();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    mode: "onChange",
    defaultValues: { type: undefined, message: "", email: "" },
  });
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = form;
  const typeLabels = Object.fromEntries(
    FEEDBACK_TYPES.map((value) => [
      value,
      t(`feedbackType${value}` as TranslationKey),
    ]),
  );
  const labels = {
    sensitiveDataWarning: t("feedbackSensitiveDataWarning"),
    typeLabel: t("feedbackTypeLabel"),
    typePlaceholder: t("feedbackTypePlaceholder"),
    messageLabel: t("feedbackMessageLabel"),
    messagePlaceholder: t("feedbackMessagePlaceholder"),
    emailLabel: t("feedbackEmailLabel"),
    emailPlaceholder: t("feedbackEmailPlaceholder"),
  };
  const accessKeyConfigured = Boolean(
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
  );
  const canSubmit = isValid && accessKeyConfigured && !isSubmitting;
  const { modalState, resetModalState } = useSupportDiscardGuard(isDirty);
  const confirmOpen = modalState.isOpen && modalState.status === "warning";

  const closeEverything = () => {
    reset();
    resetModalState();
    router.push("/settings");
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    if (!accessKeyConfigured) return;

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      await submitSupportRequest(
        {
          subject: `[FindMyTang Feedback][${values.type}]`,
          fields: {
            feedback_type: values.type,
            message: values.message,
            ...(values.email ? { email: values.email } : {}),
          },
        },
        { language: currentLanguage, isGuest },
        controller.signal,
      );
      toast.success(t("feedbackSuccess"));
      reset();
      setSelectedType(undefined);
      resetModalState();
    } catch (error) {
      console.error("Feedback submission failed", error);
      toast.error(t("feedbackError"));
    } finally {
      window.clearTimeout(timeout);
      setIsSubmitting(false);
    }
  };

  const formErrors = {
    type: errors.type?.message
      ? t(errors.type.message as TranslationKey)
      : undefined,
    message: errors.message?.message
      ? t(errors.message.message as TranslationKey)
      : undefined,
    email: errors.email?.message
      ? t(errors.email.message as TranslationKey)
      : undefined,
  };

  return (
    <>
      {header}
      <FeedbackForm
        register={register}
        labels={labels}
        typeLabels={typeLabels}
        errors={formErrors}
        selectedType={selectedType}
        onTypeSelect={(value) => {
          const nextType = value as FeedbackFormValues["type"];
          setSelectedType(nextType);
          setValue("type", nextType, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        onSubmit={handleSubmit(onSubmit)}
        typeMenuOpen={typeMenuOpen}
        onTypeMenuToggle={(value) => setTypeMenuOpen(value ?? !typeMenuOpen)}
      />

      <div className="px-4 py-3 mt-3">
        <Button
          type="submit"
          form="feedback-form"
          disabled={!canSubmit}
          isLoading={isSubmitting}
          className="w-full py-5"
        >
          {isSubmitting ? t("feedbackSending") : t("sendFeedback")}
        </Button>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={resetModalState}
        onConfirm={closeEverything}
        icon={AlertTriangle}
        title={t("supportDiscardTitle")}
        des={t("supportDiscardDesc")}
        confirmLabel={t("supportDiscardConfirm")}
        variant="warning"
      />
    </>
  );
}
