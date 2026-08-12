"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../hooks/login.hook";
import { loginSchema, LoginFormValues } from "../schemas/login.form.schema";
import LoginForm from "../components/LoginForm";
import {
  getGuestDataCount,
  useGuestStore,
} from "@/shared/lib/storages/guest.storage";
import { useSyncGuestMutation } from "../../hooks/sync-guest.hook";
import GuestMigrationModal from "@/shared/components/customs/GuestMigrationModal";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { Clock3 } from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";

interface LoginContainerProps {
  initialShowRegistrationUnavailable?: boolean;
}

export default function LoginContainer({
  initialShowRegistrationUnavailable = false,
}: Readonly<LoginContainerProps>) {
  const router = useRouter();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [showRegistrationUnavailable, setShowRegistrationUnavailable] =
    useState(initialShowRegistrationUnavailable);
  const { modalState, setModalState, resetModalState } = useModalState();
  const setGuestMode = useGuestStore((state) => state.setGuestMode);
  const clearGuestData = useGuestStore((state) => state.clearGuestData);
  const syncGuest = useSyncGuestMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginUser, isPending } = useLoginMutation({
    onSuccess: async () => {
      const hasLocalData = (await getGuestDataCount()) > 0;
      if (hasLocalData) {
        setShowMigration(true);
        return;
      }
      setGuestMode(false);
      setModalState({
        isOpen: true,
        status: "success",
        message: t("loginSuccess"),
        shouldRedirect: true,
      });
    },
    onError: (error) => {
      handleFormError(error, setError, t("loginFailed"), {
        email: "email",
        password: "password", // NOSONAR
      });
    },
  });

  const handleModalClose = () => {
    const shouldRedirect = modalState.shouldRedirect;
    resetModalState();
    if (shouldRedirect) {
      setIsRedirecting(true);
      router.push("/dashboard");
    }
  };

  const finishMigration = async (merge: boolean) => {
    try {
      if (merge) await syncGuest.mutateAsync();
      else await clearGuestData();
      setGuestMode(false);
      setShowMigration(false);
      setModalState({
        isOpen: true,
        status: "success",
        message: merge ? t("guestDataSynced") : t("localDataDiscarded"),
        shouldRedirect: true,
      });
    } catch {
      // The mutation displays the API error; keep the choice open for retry.
    }
  };

  const onSubmit = (values: LoginFormValues) => {
    loginUser({
      email: values.email,
      password: values.password,
    });
  };

  const handleGuestLogin = () => {
    setIsRedirecting(true);
    setGuestMode(true);
    router.push("/dashboard");
  };

  return (
    <>
      <LoginForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        isPending={isPending || isRedirecting}
        onGuestLogin={handleGuestLogin}
        onSignUpClick={() => setShowRegistrationUnavailable(true)}
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />
      <LoadingModal
        isOpen={
          modalState.isOpen || ((isPending || isRedirecting) && !showMigration)
        }
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : t("loggingIn")}
        onClose={handleModalClose}
      />
      <GuestMigrationModal
        isOpen={showMigration}
        isPending={syncGuest.isPending}
        onMerge={() => void finishMigration(true)}
        onDiscard={() => void finishMigration(false)}
      />
      <ConfirmModal
        isOpen={showRegistrationUnavailable}
        onClose={() => setShowRegistrationUnavailable(false)}
        onConfirm={() => setShowRegistrationUnavailable(false)}
        icon={Clock3}
        title={t("registrationUnavailableTitle")}
        des={t("registrationUnavailableDesc")}
        confirmLabel={t("close")}
        showCancelButton={false}
        variant="primary"
      />
    </>
  );
}
