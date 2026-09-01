import { Lock } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/animate-ui/components/radix/dialog";
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 bg-surface border-border">
        <DialogHeader className="flex flex-col items-center justify-center text-center mt-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-bold text-primary-text text-center mb-1">
            {t("unlockFeature").replace("{featureName}", featureName)}
          </DialogTitle>
          <DialogDescription className="text-sm text-secondary-text text-center">
            {t("unlockFeatureDesc").replaceAll("{featureName}", featureName)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
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
      </DialogContent>
    </Dialog>
  );
}
