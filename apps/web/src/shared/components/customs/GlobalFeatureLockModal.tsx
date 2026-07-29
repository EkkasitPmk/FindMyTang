import FeatureLockModal from "@/shared/components/customs/FeatureLockModal";
import { useFeatureLockLogic } from "@/shared/lib/hooks/useFeatureLockLogic.hook";

export default function GlobalFeatureLockModal() {
  const lockLogic = useFeatureLockLogic();

  if (!lockLogic.isReady) return null;

  return (
    <FeatureLockModal
      isOpen={lockLogic.isOpen}
      featureName={lockLogic.featureName}
      onClose={lockLogic.onClose}
      onSignUp={lockLogic.onSignUp}
    />
  );
}
