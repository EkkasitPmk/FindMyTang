"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";

export default function DashboardAssetActions() {
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => setIsCreateAssetOpen(true)}
        className="flex items-center justify-center bg-surface-secondary hover:bg-border transition-colors p-1 rounded-full cursor-pointer"
        aria-label={t("addAsset")}
      >
        <Plus size={18} className="text-secondary-text" />
      </Button>

      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
      )}
    </>
  );
}
