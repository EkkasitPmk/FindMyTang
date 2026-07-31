import type { SubmitEventHandler } from "react";
import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/shared/components/customs/Input";
import DropdownSelect from "@/shared/components/customs/DropdownSelect";
import { FEEDBACK_TYPES } from "../configs/feedback.config";
import type { FeedbackFormValues } from "../types/feedback.type";

interface FeedbackFormLabels {
  sensitiveDataWarning: string;
  typeLabel: string;
  typePlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
}

interface FeedbackFormProps {
  labels: FeedbackFormLabels;
  typeLabels: Record<string, string>;
  register: UseFormRegister<FeedbackFormValues>;
  errors: {
    type?: string;
    message?: string;
    email?: string;
  };
  selectedType?: FeedbackFormValues["type"];
  messageLength: number;
  onTypeSelect: (value: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  typeMenuOpen: boolean;
  onTypeMenuToggle: (open?: boolean) => void;
}

export default function FeedbackForm({
  labels,
  typeLabels,
  register,
  errors,
  selectedType,
  messageLength,
  onTypeSelect,
  onSubmit,
  typeMenuOpen,
  onTypeMenuToggle,
}: Readonly<FeedbackFormProps>) {
  return (
    <form
      id="feedback-form"
      onSubmit={onSubmit}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="relative min-h-0 flex-1">
        <div className="h-full min-h-0 space-y-4 overflow-y-auto px-4 py-4">
          <p className="rounded-lg border border-investment/30 bg-investment/10 px-3 py-2 text-xs leading-relaxed text-primary-text">
            {labels.sensitiveDataWarning}
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary-text">
              {labels.typeLabel} <span className="text-expense">*</span>
            </label>
            <DropdownSelect
              options={[...FEEDBACK_TYPES]}
              selected={selectedType || labels.typePlaceholder}
              optionLabels={typeLabels}
              isOpen={typeMenuOpen}
              onToggle={onTypeMenuToggle}
              onSelect={onTypeSelect}
              className="w-full"
            />
            {errors.type && (
              <p className="text-xs text-expense">{errors.type}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-primary-text">
                {labels.messageLabel} <span className="text-expense">*</span>
              </label>
              <span className="text-[11px] text-secondary-text">
                {messageLength}/1000
              </span>
            </div>
            <textarea
              maxLength={1000}
              rows={5}
              placeholder={labels.messagePlaceholder}
              className="w-full resize-none rounded-lg border border-border/50 bg-background px-4 py-3 text-sm text-primary-text outline-none transition-all placeholder:text-secondary-text/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-expense">{errors.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary-text">
              {labels.emailLabel}
            </label>
            <Input
              type="email"
              placeholder={labels.emailPlaceholder}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-expense">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
