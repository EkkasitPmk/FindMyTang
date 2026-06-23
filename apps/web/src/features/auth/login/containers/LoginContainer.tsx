"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useLoginMutation } from "../hooks/login.hook";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import LoginForm from "../components/LoginForm";
import { useGuestStore } from "@/shared/lib/store/guest-store";

export default function LoginContainer() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
      toast.success("Login successful! Redirecting...");
      router.push("/home");
    },
    onError: (error) => {
      const message = error.response?.data?.message;
      let errorList: string[] = [];
      if (Array.isArray(message)) {
        errorList = message;
      } else if (message) {
        errorList = [message];
      }

      if (errorList.length === 0) {
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      errorList.forEach((msg) => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes("email")) {
          setError("email", { type: "server", message: msg });
        } else if (lowerMsg.includes("password")) {
          setError("password", { type: "server", message: msg });
        } else {
          toast.error(msg);
        }
      });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginUser({
      email: values.email,
      password: values.password,
    });
  };

  const handleGoogleLogin = () => {
    setGuestMode(false);
    router.push("/home");
  };

  const handleGuestLogin = () => {
    setGuestMode(true);
    router.push("/home");
  };

  return (
    <LoginForm
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
      isPending={isPending}
      onGoogleLogin={handleGoogleLogin}
      onGuestLogin={handleGuestLogin}
      showPassword={showPassword}
      onToggleShowPassword={() => setShowPassword(!showPassword)}
    />
  );
}
