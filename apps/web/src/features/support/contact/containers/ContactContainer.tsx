"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AlertTriangle, Mail } from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useSupportDiscardGuard } from "../../hooks/useSupportDiscardGuard.hook";
import type { TranslationKey } from "@/shared/lib/configs/translations.config";
import ContactForm from "../components/ContactForm";
import { contactFormSchema } from "../schemas/contact.form.schema";
import { submitSupportRequest } from "../../services/support.service";
import type { ContactFormValues } from "../types/contact.type";

export default function ContactContainer() {
  const { t, currentLanguage } = useTranslation();
  const isGuest = useIsGuest();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = form;

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

  const onSubmit = async (values: ContactFormValues) => {
    if (!accessKeyConfigured) return;

    setIsSubmitting(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      await submitSupportRequest(
        {
          subject: `[FindMyTang Contact] ${values.name}`,
          fields: values,
        },
        { language: currentLanguage, isGuest },
        controller.signal,
      );
      toast.success(t("contactSuccess"));
      reset();
      resetModalState();
    } catch (error) {
      console.error("Contact submission failed", error);
      toast.error(t("contactError"));
    } finally {
      window.clearTimeout(timeout);
      setIsSubmitting(false);
    }
  };

  const errorMessage = (message?: string) =>
    message ? t(message as TranslationKey) : undefined;
  const labels = {
    nameLabel: t("contactNameLabel"),
    namePlaceholder: t("contactNamePlaceholder"),
    emailLabel: t("contactEmailLabel"),
    emailPlaceholder: t("contactEmailPlaceholder"),
    phoneLabel: t("contactPhoneLabel"),
    phonePlaceholder: t("contactPhonePlaceholder"),
    messageLabel: t("contactMessageLabel"),
    messagePlaceholder: t("contactMessagePlaceholder"),
    sendLabel: t("contactSend"),
    sendingLabel: t("contactSending"),
  };
  const formErrors = {
    name: errorMessage(errors.name?.message),
    email: errorMessage(errors.email?.message),
    phone: errorMessage(errors.phone?.message),
    message: errorMessage(errors.message?.message),
  };

  return (
    <>
      <div className="flex shrink-0 flex-col gap-1.5 border-b border-border px-4 py-4 text-left">
        <h1 className="text-base font-semibold text-primary-text">
          {t("contactUsTitle")}
        </h1>
        <p className="text-sm text-secondary-text">{t("contactUsDesc")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div className="h-fit rounded-md border border-border px-4 py-4">
          <Mail className="mb-3 text-primary" />
          <span className="block text-sm font-semibold text-primary-text">
            Email
          </span>
          <a
            href="mailto:ekkasit.phumiket@gmail.com"
            className="break-all text-sm text-secondary-text hover:text-primary"
          >
            ekkasit.phumiket@gmail.com
          </a>
        </div>

        <ContactForm
          labels={labels}
          register={register}
          errors={formErrors}
          onSubmit={handleSubmit(onSubmit)}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
        />
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
