"use client";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/shared/lib/hooks/useMeQuery.hook";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

type AuthPageGuardProps = Readonly<{
  children: React.ReactNode;
}>;

const isUnauthorizedError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export default function AuthPageGuard({ children }: AuthPageGuardProps) {
  const router = useRouter();
  const mounted = useMounted();
  const isGuest = useIsGuest();
  const { t } = useTranslation();
  const { data: user, error, isPending, refetch } = useMeQuery();

  useEffect(() => {
    if (mounted && !isGuest && user) router.replace("/home");
  }, [isGuest, mounted, router, user]);

  if (!mounted || (!isGuest && isPending) || (!isGuest && user)) {
    return (
      <output
        className="min-h-screen flex items-center justify-center bg-background text-secondary-text"
        aria-label={t("authCheckingSession")}
      >
        {t("authCheckingSession")}
      </output>
    );
  }

  if (!isGuest && error && !isUnauthorizedError(error)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6 text-center text-secondary-text">
        <p>{t("authSessionError")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return { children };
}
