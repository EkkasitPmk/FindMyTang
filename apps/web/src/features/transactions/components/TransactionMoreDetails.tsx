import { cn } from "@/shared/lib/utils/core.util";
import { ArrowDown, Calendar as CalendarLucide, Camera, X } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { CreateTransactionFormValues } from "../schemas/transaction.form.schema";
import { useImagePreview } from "../hooks/useImagePreview.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { AttachmentOptionButton } from "./AttachmentOptionButton";
import { TransactionAttachmentPreview } from "./TransactionAttachmentPreview";
import TransactionDescriptionField from "./TransactionDescriptionField";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/animate-ui/primitives/radix/collapsible";
import type { ReactNode } from "react";

interface TransactionMoreDetailsProps {
  isMoreDetailsOpen: boolean;
  setIsMoreDetailsOpen: (open: boolean) => void;
  displayDate: string;
  onOpenCalendar: () => void;
  isCalendarOpen: boolean;
  onCalendarOpenChange: (open: boolean) => void;
  datePicker: ReactNode;
  isPhotoMenuOpen: boolean;
  setIsPhotoMenuOpen: (open: boolean) => void;
  file: File | null;
  attachmentUrl?: string | null;
  onRemoveFile: () => void;
  onTakeAPhoto: () => void;
  onSelectAPhoto: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<CreateTransactionFormValues>;
  noteValue: string;
  onNoteChange: (value: string) => void;
  isLoadingTx?: boolean;
}

export default function TransactionMoreDetails({
  isMoreDetailsOpen,
  setIsMoreDetailsOpen,
  displayDate,
  onOpenCalendar,
  isCalendarOpen,
  onCalendarOpenChange,
  datePicker,
  isPhotoMenuOpen,
  setIsPhotoMenuOpen,
  file,
  attachmentUrl,
  onRemoveFile,
  onTakeAPhoto,
  onSelectAPhoto,
  fileInputRef,
  cameraInputRef,
  handleFileChange,
  register,
  noteValue,
  onNoteChange,
  isLoadingTx,
}: Readonly<TransactionMoreDetailsProps>) {
  const { t } = useTranslation();
  const filePreview = useImagePreview(file);
  const noteField = register("note");

  const renderAttachment = () => {
    if (file && filePreview) {
      return (
        <TransactionAttachmentPreview
          src={filePreview}
          alt="attachment preview"
          onRemove={onRemoveFile}
        />
      );
    }

    if (attachmentUrl) {
      return (
        <TransactionAttachmentPreview
          src={attachmentUrl}
          alt="existing attachment"
          onRemove={onRemoveFile}
        />
      );
    }

    return (
      <div className="relative w-full">
        {isPhotoMenuOpen ? (
          <div className="relative flex h-113 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-5">
            <Button
              variant="unstyled"
              type="button"
              onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
              className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-primary/10"
            >
              <X className="text-destructive" />
            </Button>
            <AttachmentOptionButton
              label={t("takeAPhoto")}
              onClick={(e) => {
                e.stopPropagation();
                onTakeAPhoto();
              }}
            />
            <AttachmentOptionButton
              label={t("selectAPhoto")}
              onClick={(e) => {
                e.stopPropagation();
                onSelectAPhoto();
              }}
            />
          </div>
        ) : (
          <Button
            variant="unstyled"
            tapScale={1}
            hoverScale={1}
            type="button"
            onClick={() => setIsPhotoMenuOpen(true)}
            className="group flex h-113 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border transition-colors hover:border-primary hover:bg-surface-secondary/50"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/15">
              <Camera size={22} className="text-primary" />
            </span>
            <p className="text-sm font-medium text-secondary-text transition-colors group-hover:text-primary">
              {t("addPhoto")}
            </p>
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          variant="unstyled"
          type="button"
          onClick={() => setIsMoreDetailsOpen(!isMoreDetailsOpen)}
          className="my-0 flex items-center justify-center gap-2 text-primary text-sm shrink-0"
        >
          {isMoreDetailsOpen ? t("lessDetails") : t("moreDetails")}
          <ArrowDown
            size={16}
            className={cn(
              "transition-transform",
              isMoreDetailsOpen && "-rotate-180",
            )}
          />
        </Button>
      </div>

      {isMoreDetailsOpen && (
        <section className="space-y-1 px-4 lg:px-0">
          <p className="uppercase text-sm text-secondary-text font-medium">
            {t("details")}
          </p>
          <div className="space-y-3">
            {isLoadingTx ? (
              <Skeleton className="w-full h-15 rounded-md" />
            ) : (
              <Collapsible
                open={isCalendarOpen}
                onOpenChange={onCalendarOpenChange}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="unstyled"
                    type="button"
                    tapScale={1}
                    hoverScale={1}
                    onClick={() => {
                      if (!isCalendarOpen) onOpenCalendar();
                    }}
                    className={cn(
                      "relative w-full flex items-center gap-2 bg-surface rounded-md border border-border px-4 py-3",
                      isCalendarOpen && "rounded-bl-none rounded-br-none",
                    )}
                  >
                    <CalendarLucide size={18} className="text-secondary-text" />
                    <div className="flex flex-col flex-1 text-left">
                      <span className="text-secondary-text text-xs font-medium uppercase">
                        {t("date")}
                      </span>
                      <span className="text-sm font-medium">{displayDate}</span>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent keepRendered>
                  {datePicker}
                </CollapsibleContent>
              </Collapsible>
            )}

            {isLoadingTx ? (
              <Skeleton className="w-full h-27.5 rounded-md" />
            ) : (
              <TransactionDescriptionField
                id="note"
                name={noteField.name}
                value={noteValue}
                onChange={(value) => {
                  void noteField.onChange({
                    target: { value, name: noteField.name },
                  });
                  onNoteChange(value);
                }}
              />
            )}

            <div className="space-y-2">
              <p className="uppercase text-xs text-secondary-text font-medium">
                {t("attachment")}
              </p>
              {isLoadingTx ? (
                <Skeleton className="h-113 w-full rounded-xl" />
              ) : (
                renderAttachment()
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={cameraInputRef}
                onChange={handleFileChange}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
