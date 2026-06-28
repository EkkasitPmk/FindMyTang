import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import {
  ArrowDown,
  Calendar as CalendarLucide,
  Camera,
  CirclePlus,
  X,
} from "lucide-react";
import ChooseADate from "./ChooseADate";

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
  onRemoveFile: () => void;
  onTakeAPhoto: () => void;
  onSelectAPhoto: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onRemoveFile,
  onTakeAPhoto,
  onSelectAPhoto,
  fileInputRef,
  cameraInputRef,
  handleFileChange,
}: Readonly<TransactionMoreDetailsProps>) {
  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsMoreDetailsOpen(!isMoreDetailsOpen)}
          className="my-0 flex items-center justify-center gap-2 text-primary text-sm shrink-0"
        >
          {isMoreDetailsOpen ? "Less Details" : "More Details"}
          <ArrowDown
            size={16}
            className={cn(
              "transition-transform",
              isMoreDetailsOpen && "-rotate-180",
            )}
          />
        </button>
      </div>

      {isMoreDetailsOpen && (
        <section className="space-y-1">
          <p className="uppercase text-sm text-secondary-text font-medium">
            DETAILS
          </p>
          <div className="space-y-3">
            <div className="relative w-full flex items-center gap-2 bg-white rounded-md border border-border px-4 py-3">
              <CalendarLucide size={18} className="text-secondary-text" />
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex flex-col flex-1 text-left"
              >
                <span className="text-secondary-text text-xs font-medium">
                  DATE
                </span>
                <span className="text-sm font-medium">{displayDate}</span>
              </button>
              {isCalendarOpen && (
                <>
                  <button
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
                  />
                </>
              )}
            </div>

            <div className="w-full bg-white rounded-md border border-border px-4 py-3 space-y-1">
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
                <span className="text-secondary-text text-xs font-medium">
                  DESCRIPTION
                </span>
              </div>

              <textarea
                name="note"
                id="note"
                placeholder="Add a note..."
                className="w-full min-h-15 max-h-30 placeholder:text-secondary-text outline-none transition-all bg-white"
              ></textarea>
            </div>

            <div className="space-y-2">
              <p className="uppercase text-xs text-secondary-text font-medium">
                ATTACHMENT
              </p>
              {file ? (
                <div className="w-full flex flex-col items-center justify-center rounded-md border-2 border-border relative overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="attachment preview"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile();
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setIsPhotoMenuOpen(!isPhotoMenuOpen)}
                    className="w-full h-44 flex flex-col items-center justify-center gap-1 rounded-md border-2 border-border border-dashed"
                  >
                    <Camera size={24} className="text-secondary-text" />
                    <div className="text-secondary-text flex items-center gap-1">
                      <CirclePlus size={14} />
                      <p className="text-sm font-medium">Add Photo</p>
                    </div>
                  </button>

                  {isPhotoMenuOpen && (
                    <>
                      <button
                        type="button"
                        aria-label="Close photo menu"
                        className="fixed inset-0 z-10 w-full h-full cursor-default border-none outline-none bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPhotoMenuOpen(false);
                        }}
                      />
                      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-md border border-border flex flex-col items-start justify-center z-20 shadow-lg min-w-37.5">
                        <button
                          type="button"
                          className="text-sm font-medium text-left w-full py-2 hover:text-primary transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTakeAPhoto();
                          }}
                        >
                          Take a photo
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-left w-full py-2 hover:text-primary transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAPhoto();
                          }}
                        >
                          Select a photo
                        </button>
                      </div>
                    </>
                  )}
                </div>
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
