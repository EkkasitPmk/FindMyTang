"use client";
import { useEffect } from "react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function JournalError({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error("Journal rendering failed", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <h2 className="text-lg font-semibold text-primary-text">
        {t("authSessionError")}
      </h2>
      <p className="max-w-md text-sm text-secondary-text">
        {t("authSessionError")}
      </p>
      <Button type="button" onClick={() => reset()}>
        {t("retry")}
      </Button>
    </div>
  );
}
