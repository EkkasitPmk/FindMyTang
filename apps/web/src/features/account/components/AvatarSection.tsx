import { Check, CircleX, Pencil } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Avatar from "@/shared/components/customs/Avatar";
import { AVATARS } from "../configs/account.config";
import { useTranslation } from "@/shared/lib/i18n/useTranslation";

interface AvatarSectionProps {
  user:
    | {
        avatarUrl?: string | null;
      }
    | null
    | undefined;
  isUpdating: boolean;
  isSelectingAvatar: boolean;
  onToggleSelectingAvatar: () => void;
  onCloseSelectingAvatar: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
  onRemoveAvatar: (e: React.MouseEvent) => void;
}

export default function AvatarSection({
  user,
  isUpdating,
  isSelectingAvatar,
  onToggleSelectingAvatar,
  onCloseSelectingAvatar,
  onSelectAvatar,
  onRemoveAvatar,
}: Readonly<AvatarSectionProps>) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-4 my-6">
      <div className="relative">
        <button
          onClick={onToggleSelectingAvatar}
          disabled={isUpdating}
          className="relative bg-background border border-border rounded-full p-1 hover:ring-4 hover:ring-primary/10 transition-all group w-18 h-18 flex items-center justify-center"
        >
          <Avatar url={user?.avatarUrl} size={72} iconSize={26} />
          {!isUpdating && (
            <span className="absolute bottom-0 right-0 z-10 bg-white p-1 rounded-full border border-border group-hover:bg-primary-light transition-colors">
              <Pencil
                size={14}
                className="text-secondary-text group-hover:text-primary"
              />
            </span>
          )}
        </button>

        {user?.avatarUrl && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={onRemoveAvatar}
            className="absolute -top-2 -right-1 z-10 bg-white hover:bg-expense-light/20 text-secondary-text hover:text-expense p-0.5 rounded-full border border-border shadow-xs transition-all hover:scale-110 cursor-pointer flex items-center justify-center"
            title={t("removeAvatar")}
          >
            <CircleX size={16} />
          </button>
        )}
      </div>

      {isSelectingAvatar && (
        <>
          {/* Backdrop สำหรับดักจับการคลิกที่ว่างเพื่อปิด */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default w-full h-full bg-transparent border-none p-0 outline-none"
            onClick={onCloseSelectingAvatar}
          />
          <div className="absolute top-full mt-1 w-full max-w-sm bg-white border border-border rounded-lg p-4 z-20 shadow-sm animate-in slide-in-from-top-2 duration-200">
            <p className="text-xs font-semibold text-secondary-text mb-3 uppercase tracking-wider text-center">
              {t("selectAvatar")}
            </p>
            <div className="grid grid-cols-3 gap-3 justify-items-center">
              {AVATARS.map((avatar) => {
                const isSelected = user?.avatarUrl === avatar;
                return (
                  <button
                    key={avatar}
                    onClick={() => onSelectAvatar(avatar)}
                    className={cn(
                      "relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-md",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 scale-105"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <Avatar url={avatar} size={64} />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full p-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
