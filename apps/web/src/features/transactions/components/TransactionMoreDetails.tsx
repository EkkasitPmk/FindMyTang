import Image from "next/image";
import { cn } from "@/shared/lib/utils/core.util";
import { ArrowDown, Calendar as CalendarLucide, Camera, X } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { CreateTransactionFormValues } from "../schemas/transaction.form.schema";
import ChooseADate from "./ChooseADate";
import { useImagePreview } from "@/shared/lib/hooks/useImagePreview.hook";
import { Button } from "@/shared/components/customs/Button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import type { Locale } from "react-day-picker";

interface TransactionMoreDetailsProps {
  isMoreDetailsOpen: boolean;
  setIsMoreDetailsOpen: (open: boolean) => void;
  displayDate: string;
  tempDate: Date | undefined;
  setTempDate: (date: Date | undefined) => void;
  displayMonth: Date | undefined;
  setDisplayMonth: (date: Date) => void;
  onPresetClick: (daysToAdd: number) => void;
  onConfirmDate: () => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
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
  isLoadingTx?: boolean;
  calendarLocale?: Locale;
}

export default function TransactionMoreDetails({
  isMoreDetailsOpen,
  setIsMoreDetailsOpen,
  displayDate,
  tempDate,
  setTempDate,
  displayMonth,
  setDisplayMonth,
  onPresetClick,
  onConfirmDate,
  isCalendarOpen,
  setIsCalendarOpen,
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
  isLoadingTx,
  calendarLocale,
}: Readonly<TransactionMoreDetailsProps>) {
  const { t } = useTranslation();
  const filePreview = useImagePreview(file);

  const renderAttachment = () => {
    if (file && filePreview) {
      return (
        <div className="w-full min-h-113 flex flex-col items-center justify-center rounded-md border-2 border-border relative overflow-hidden bg-surface-secondary/50">
          <Image
            src={filePreview}
            alt="attachment preview"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-contain"
            unoptimized={
              filePreview.startsWith("blob:") || filePreview.startsWith("data:")
            }
          />
          <Button
            variant="unstyled"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile();
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={16} className="text-white" />
          </Button>
        </div>
      );
    }

    if (attachmentUrl) {
      return (
        <div className="w-full min-h-113 flex flex-col items-center justify-center rounded-md border-2 border-border relative overflow-hidden bg-surface-secondary/50">
          <Image
            src={attachmentUrl}
            alt="existing attachment"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-contain"
            unoptimized={
              attachmentUrl.startsWith("blob:") ||
              attachmentUrl.startsWith("data:")
            }
          />
          <Button
            variant="unstyled"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile();
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={16} className="text-white" />
          </Button>
        </div>
      );
    }

    return (
      <div className="relative w-full">
        {isPhotoMenuOpen ? (
          <div className="relative w-full h-113 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-primary/40 border-dashed bg-primary/5">
            <Button
              variant="unstyled"
              type="button"
              onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
              className="absolute top-1 right-2"
            >
              <X className="text-destructive" />
            </Button>
            <Button
              variant="unstyled"
              type="button"
              className="text-sm font-medium text-center w-[80%] py-2.5 bg-surface border border-border rounded-lg hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onTakeAPhoto();
              }}
            >
              {t("takeAPhoto")}
            </Button>
            <Button
              variant="unstyled"
              type="button"
              className="text-sm font-medium text-center w-[80%] py-2.5 bg-surface border border-border rounded-lg hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAPhoto();
              }}
            >
              {t("selectAPhoto")}
            </Button>
          </div>
        ) : (
          <Button
            variant="unstyled"
            type="button"
            onClick={() => setIsPhotoMenuOpen(true)}
            className="w-full h-113 flex flex-col items-center justify-center gap-1 rounded-md border-2 border-border border-dashed hover:bg-surface-secondary/50 transition-colors cursor-pointer"
          >
            <Camera size={24} className="text-secondary-text" />
            <p className="text-sm font-medium text-secondary-text">
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
        <section className="space-y-1">
          <p className="uppercase text-sm text-secondary-text font-medium">
            {t("details")}
          </p>
          <div className="space-y-3">
            {isLoadingTx ? (
              <Skeleton className="w-full h-15 rounded-md" />
            ) : (
              <div className="relative w-full flex items-center gap-2 bg-surface rounded-md border border-border px-4 py-3">
                <CalendarLucide size={18} className="text-secondary-text" />
                <Button
                  variant="unstyled"
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="flex flex-col flex-1 text-left"
                >
                  <span className="text-secondary-text text-xs font-medium uppercase">
                    {t("date")}
                  </span>
                  <span className="text-sm font-medium">{displayDate}</span>
                </Button>
                {isCalendarOpen && (
                  <>
                    <Button
                      variant="unstyled"
                      type="button"
                      aria-label="Close calendar"
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity border-none outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCalendarOpen(false);
                      }}
                    />
                    <ChooseADate
                      selectedDate={tempDate}
                      onSelectDate={setTempDate}
                      displayMonth={displayMonth}
                      onMonthChange={setDisplayMonth}
                      onConfirm={onConfirmDate}
                      onPresetClick={onPresetClick}
                      locale={calendarLocale}
                    />
                  </>
                )}
              </div>
            )}

            {isLoadingTx ? (
              <Skeleton className="w-full h-27.5 rounded-md" />
            ) : (
              <div className="w-full bg-surface rounded-md border border-border px-4 py-3 space-y-1">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0   0 24 24"
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
                  <span className="text-secondary-text text-xs font-medium uppercase">
                    {t("description")}
                  </span>
                </div>

                <textarea
                  id="note"
                  placeholder={t("addANote")}
                  className="w-full min-h-15 max-h-30 placeholder:text-secondary-text outline-none transition-all bg-surface"
                  {...register("note")}
                ></textarea>
              </div>
            )}

            <div className="space-y-2">
              <p className="uppercase text-xs text-secondary-text font-medium">
                {t("attachment")}
              </p>
              {isLoadingTx ? (
                <Skeleton className="w-full h-113 rounded-md" />
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
