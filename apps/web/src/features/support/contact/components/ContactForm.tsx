import type { SubmitEventHandler } from "react";
import type { UseFormRegister } from "react-hook-form";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Input } from "@/shared/components/customs/Input";
import type { ContactFormValues } from "../types/contact.type";

interface ContactFormLabels {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendLabel: string;
  sendingLabel: string;
}

interface ContactFormProps {
  labels: ContactFormLabels;
  register: UseFormRegister<ContactFormValues>;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  canSubmit: boolean;
  isSubmitting: boolean;
}

export default function ContactForm({
  labels,
  register,
  errors,
  onSubmit,
  canSubmit,
  isSubmitting,
}: Readonly<ContactFormProps>) {
  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      className="space-y-4 rounded-md border border-border p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-primary-text">
          {labels.nameLabel} <span className="text-expense">*</span>
        </label>
        <Input
          type="text"
          placeholder={labels.namePlaceholder}
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-expense">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-primary-text">
          {labels.emailLabel} <span className="text-expense">*</span>
        </label>
        <Input
          type="email"
          placeholder={labels.emailPlaceholder}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-expense">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-primary-text">
          {labels.phoneLabel} <span className="text-expense">*</span>
        </label>
        <Input
          type="tel"
          placeholder={labels.phonePlaceholder}
          {...register("phone")}
        />
        {errors.phone && <p className="text-xs text-expense">{errors.phone}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-primary-text">
          {labels.messageLabel} <span className="text-expense">*</span>
        </label>
        <textarea
          rows={5}
          placeholder={labels.messagePlaceholder}
          className="w-full resize-none rounded-lg border border-border/50 bg-background px-4 py-3 text-sm text-primary-text outline-none transition-all placeholder:text-secondary-text/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-expense">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        form="contact-form"
        disabled={!canSubmit}
        isLoading={isSubmitting}
        className="w-full py-5 text-sm"
      >
        {isSubmitting ? labels.sendingLabel : labels.sendLabel}
      </Button>
    </form>
  );
}
