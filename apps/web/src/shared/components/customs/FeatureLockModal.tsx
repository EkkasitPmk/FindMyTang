import { Lock, X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface FeatureLockModalProps {
  isOpen: boolean;
  featureName: string;
  onClose: () => void;
  onSignUp: () => void;
}

export default function FeatureLockModal({
  isOpen,
  featureName,
  onClose,
  onSignUp,
}: Readonly<FeatureLockModalProps>) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <Button
        variant="unstyled"
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 bg-primary-text/25 backdrop-blur-xs w-full h-full border-none p-0 outline-none"
      />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-surface rounded-2xl w-[90%] max-w-sm shadow-xl overflow-hidden border border-border flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 p-6",
        )}
      >
        <Button
          variant="unstyled"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-secondary text-secondary-text transition-colors"
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={1.5} />
        </Button>

        <div className="flex flex-col items-center justify-center mb-6 text-center mt-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
            <Lock className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-primary-text mb-2">
            {t("unlockFeature").replace("{featureName}", featureName)}
          </h3>
          <p className="text-sm text-secondary-text">
            {t("unlockFeatureDesc").replace(/{featureName}/g, featureName)}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            onClick={onSignUp}
            className="w-full py-2.5 font-medium"
          >
            {t("signUpToUnlock")}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full py-2.5 font-medium"
          >
            {t("notNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
