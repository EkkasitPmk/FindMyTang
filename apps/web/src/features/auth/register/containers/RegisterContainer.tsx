"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../hooks/register.hook";
import {
  registerSchema,
  RegisterFormValues,
} from "../schemas/register.form.schema";
import RegisterForm from "../components/RegisterForm";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

export default function RegisterContainer() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const { mutate: registerUser, isPending } = useRegisterMutation({
    onSuccess: () => {
      setIsRedirecting(true);
      toast.success(t("registerSuccess"));
      // Redirect to login page on success
      router.push("/login");
    },
    onError: (error) => {
      handleFormError(error, setError, t("registerFailed"), {
        email: "email",
        "display name": "displayName",
        displayname: "displayName",
        "confirm password": "confirmPassword", // NOSONAR
        confirmpassword: "confirmPassword", // NOSONAR
        password: "password", // NOSONAR
      });
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerUser({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      displayName: values.displayName,
    });
  };

  return (
    <>
      <RegisterForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        isPending={isPending || isRedirecting}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
        onToggleShowConfirmPassword={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
      />
      <LoadingModal
        isOpen={isPending || isRedirecting}
        message={t("registering")}
      />
    </>
  );
}
