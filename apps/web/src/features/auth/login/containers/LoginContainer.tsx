"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLoginMutation } from "../hooks/login.hook";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import LoginForm from "../components/LoginForm";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import LoadingModal from "@/shared/components/customs/LoadingModal";

export default function LoginContainer() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const setGuestMode = useGuestStore((state) => state.setGuestMode);

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
    onSuccess: () => {
      setGuestMode(false);
      setIsRedirecting(true);
      toast.success("Login successful! Redirecting...");
      router.push("/home");
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

  const onSubmit = (values: LoginFormValues) => {
    loginUser({
      email: values.email,
      password: values.password,
    });
  };

  const handleGoogleLogin = () => {
    setIsRedirecting(true);
    setGuestMode(false);
    router.push("/home");
  };

  const handleGuestLogin = () => {
    setIsRedirecting(true);
    setGuestMode(true);
    router.push("/home");
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
        isOpen={isPending || isRedirecting}
        message="Logging in..."
      />
    </>
  );
}
