"use client";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { cn } from "@/shared/lib/utils/core.util";

interface TransactionDescriptionFieldProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  label?: string;
}

export default function TransactionDescriptionField({
  id = "note",
  name,
  value,
  onChange,
  placeholder,
  maxLength = 255,
  className,
  label,
}: Readonly<TransactionDescriptionFieldProps>) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "w-full bg-surface rounded-md border border-border px-4 py-3 space-y-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-list-sort-descending-icon lucide-list-sort-descending text-secondary-text"
        >
          <path d="M15 12H3" />
          <path d="M3 5h18" />
          <path d="M9 19H3" />
        </svg>
        <label
          htmlFor={id}
          className="text-secondary-text text-xs font-medium uppercase cursor-pointer"
        >
          {label ?? t("description")}
        </label>
      </div>

      <textarea
        id={id}
        name={name}
        maxLength={maxLength}
        placeholder={placeholder ?? t("addANote")}
        className="w-full min-h-15 max-h-30 placeholder:text-secondary-text outline-none transition-all bg-surface resize-none text-sm text-primary-text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      ></textarea>
    </div>
  );
}
