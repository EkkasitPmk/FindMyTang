"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useLoginMutation } from "../hooks/login.hook";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import LoginForm from "../components/LoginForm";
import {
  getGuestDataCount,
  useGuestStore,
} from "@/shared/lib/storages/guest.storage";
import { useSyncGuestMutation } from "../../hooks/sync-guest.hook";
import GuestMigrationModal from "@/shared/components/customs/GuestMigrationModal";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import LoadingModal from "@/shared/components/customs/LoadingModal";

export default function LoginContainer() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
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
      setGuestMode(false);
      setIsRedirecting(true);
      const hasLocalData = (await getGuestDataCount()) > 0;
      if (hasLocalData) {
        setShowMigration(true);
        return;
      }
      toast.success("Login successful! Redirecting...");
      window.location.href = "/home";
    },
    onError: (error) => {
      handleFormError(
        error,
        setError,
        "Login failed. Please check your credentials.",
        {
          email: "email",
          password: "password", // NOSONAR
        },
      );
    },
  });

  const finishMigration = async (merge: boolean) => {
    try {
      if (merge) await syncGuest.mutateAsync();
      else await clearGuestData();
      setShowMigration(false);
      toast.success(
        merge ? "Guest data synced successfully" : "Local data discarded",
      );
      window.location.href = "/home";
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

  const handleGoogleLogin = () => {
    setIsRedirecting(true);
    setGuestMode(false);
    window.location.href = "/home";
  };

  const handleGuestLogin = () => {
    setIsRedirecting(true);
    setGuestMode(true);
    window.location.href = "/home";
  };

  return (
    <>
      <LoginForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        isPending={isPending || isRedirecting}
        onGoogleLogin={handleGoogleLogin}
        onGuestLogin={handleGuestLogin}
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />
      <LoadingModal
        isOpen={(isPending || isRedirecting) && !showMigration}
        message="Logging in..."
      />
      <GuestMigrationModal
        isOpen={showMigration}
        isPending={syncGuest.isPending}
        onMerge={() => void finishMigration(true)}
        onDiscard={() => void finishMigration(false)}
      />
    </>
  );
}
