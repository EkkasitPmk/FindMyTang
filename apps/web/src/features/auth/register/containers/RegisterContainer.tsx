"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "../hooks/register.hook";
import {
  registerSchema,
  RegisterFormValues,
} from "../schemas/register.form.schema";
import RegisterForm from "../components/RegisterForm";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";

export default function RegisterContainer() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState();

  const { t } = useTranslation();

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
      setModalState({
        isOpen: true,
        status: "success",
        message: t("registerSuccess"),
        shouldRedirect: true,
      });
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

  const handleModalClose = () => {
    const shouldRedirect = modalState.shouldRedirect;
    resetModalState();
    if (shouldRedirect) {
      setIsRedirecting(true);
      router.push("/login");
    }
  };

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
        isOpen={modalState.isOpen || isPending || isRedirecting}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : t("registering")}
        onClose={handleModalClose}
      />
    </>
  );
}
