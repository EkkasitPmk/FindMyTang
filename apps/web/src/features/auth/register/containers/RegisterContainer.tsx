"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../hooks/register.hook";
import { registerSchema, RegisterFormValues } from "../schemas/register.schema";
import RegisterForm from "../components/RegisterForm";

export default function RegisterContainer() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

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
      toast.success("Registration successful! Redirecting to login...");
      // Redirect to login page on success
      router.push("/login");
    },
    onError: (error) => {
      // Handle API errors
      const message = error.response?.data?.message;
      let errorList: string[] = [];
      if (Array.isArray(message)) {
        errorList = message;
      } else if (message) {
        errorList = [message];
      }

      if (errorList.length === 0) {
        setGlobalError("Registration failed. Please try again.");
        return;
      }

      let hasGlobalError = false;

      errorList.forEach((msg) => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes("email")) {
          setError("email", { type: "server", message: msg });
        } else if (
          lowerMsg.includes("display name") ||
          lowerMsg.includes("displayname")
        ) {
          setError("displayName", { type: "server", message: msg });
        } else if (
          lowerMsg.includes("confirm password") ||
          lowerMsg.includes("confirmpassword")
        ) {
          setError("confirmPassword", { type: "server", message: msg });
        } else if (lowerMsg.includes("password")) {
          setError("password", { type: "server", message: msg });
        } else {
          setGlobalError(msg);
          hasGlobalError = true;
        }
      });

      if (!hasGlobalError) {
        setGlobalError(null);
      }
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setGlobalError(null);
    registerUser({
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      displayName: values.displayName,
    });
  };

  return (
    <RegisterForm
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
      isPending={isPending}
      globalError={globalError}
    />
  );
}
