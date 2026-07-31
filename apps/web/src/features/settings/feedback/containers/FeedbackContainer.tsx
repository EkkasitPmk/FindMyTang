"use client";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/animate-ui/components/radix/sheet";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import type { TranslationKey } from "@/shared/lib/configs/translations.config";
import FeedbackForm from "../components/FeedbackForm";
import { FEEDBACK_TYPES } from "../configs/feedback.config";
import { feedbackFormSchema } from "../schemas/feedback.form.schema";
import type { FeedbackFormValues } from "../types/feedback.type";
import { submitFeedback } from "../services/feedback.service";

interface FeedbackContainerProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackContainer({
  open,
  onClose,
}: Readonly<FeedbackContainerProps>) {
  const { t, currentLanguage } = useTranslation();
  const isGuest = useIsGuest();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    mode: "onChange",
    defaultValues: {
      type: undefined,
      message: "",
      email: "",
    },
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
  const confirmOpen = modalState.isOpen && modalState.status === "warning";

  const closeEverything = () => {
    reset();
    resetModalState();
    onClose();
  };

  const requestClose = () => {
    if (isDirty) {
      setModalState({ isOpen: true, status: "warning", message: "" });
      return;
    }
    closeEverything();
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    if (!accessKeyConfigured) return;

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      await submitFeedback(
        values,
        { language: currentLanguage, isGuest },
        controller.signal,
      );
      toast.success(t("feedbackSuccess"));
      closeEverything();
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
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => !nextOpen && requestClose()}
      >
        <SheetContent
          side="bottom"
          showCloseButton
          className="sm:mx-auto sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle>{t("feedbackTitle")}</SheetTitle>
            <SheetDescription>{t("feedbackDesc")}</SheetDescription>
          </SheetHeader>
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
            onTypeMenuToggle={(value) =>
              setTypeMenuOpen(value ?? !typeMenuOpen)
            }
          />
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={requestClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              form="feedback-form"
              disabled={!canSubmit}
              isLoading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t("feedbackSending") : t("sendFeedback")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={resetModalState}
        onConfirm={closeEverything}
        icon={AlertTriangle}
        title={t("feedbackDiscardTitle")}
        des={t("feedbackDiscardDesc")}
        confirmLabel={t("feedbackDiscardConfirm")}
        variant="warning"
      />
    </>
  );
}
