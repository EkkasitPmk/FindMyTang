"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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

export default function FeedbackContainer() {
  const { t, currentLanguage } = useTranslation();
  const isGuest = useIsGuest();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    mode: "onChange",
    defaultValues: { type: undefined, message: "", email: "" },
  });
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = form;
  const type = useWatch({ control, name: "type" });
  const message = useWatch({ control, name: "message" }) || "";

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
    router.back();
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
      <div className="flex shrink-0 flex-col gap-1.5 border-b border-border px-4 py-4 text-left">
        <h1 className="text-base font-semibold text-primary-text">
          {t("feedbackTitle")}
        </h1>
        <p className="text-sm text-secondary-text">{t("feedbackDesc")}</p>
      </div>
      <FeedbackForm
        register={register}
        labels={labels}
        typeLabels={typeLabels}
        errors={formErrors}
        selectedType={type}
        messageLength={message.length}
        onTypeSelect={(value) =>
          setValue("type", value as FeedbackFormValues["type"], {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        onSubmit={handleSubmit(onSubmit)}
        typeMenuOpen={typeMenuOpen}
        onTypeMenuToggle={(value) => setTypeMenuOpen(value ?? !typeMenuOpen)}
      />
      <div className="fixed bottom-0 w-full flex gap-3 border-t border-border px-4 py-3 [&>button]:h-10! [&>button]:min-h-10! [&>button]:min-w-0! [&>button]:flex-1! [&>button]:py-0! [&>button]:text-sm!">
        <Button
          type="submit"
          form="feedback-form"
          disabled={!canSubmit}
          isLoading={isSubmitting}
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
