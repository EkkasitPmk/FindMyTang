"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schemas/assets.schema";
import { useCreateAssetMutation } from "../hooks/assets.hook";
import { AssetType } from "../types/assets.type";
import AssetForm from "../components/AssetForm";

export default function AssetsContainer() {
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: "",
      type: AssetType.CASH,
      balance: 0,
      currency: "THB",
    },
  });

  const { mutate: createAsset, isPending } = useCreateAssetMutation({
    onSuccess: (data) => {
      toast.success(`Asset "${data.name}" created successfully!`);
      reset();
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
        setGlobalError(
          "Failed to create asset. Please check validation rules.",
        );
        return;
      }

      let hasGlobalError = false;
      errorList.forEach((msg) => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes("name")) {
          setError("name", { type: "server", message: msg });
        } else if (lowerMsg.includes("type")) {
          setError("type", { type: "server", message: msg });
        } else if (lowerMsg.includes("balance")) {
          setError("balance", { type: "server", message: msg });
        } else if (lowerMsg.includes("currency")) {
          setError("currency", { type: "server", message: msg });
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

  const onSubmit = (values: CreateAssetFormValues) => {
    setGlobalError(null);
    const balanceNum =
      values.balance === "" ||
      values.balance === null ||
      values.balance === undefined
        ? undefined
        : Number(values.balance);

    createAsset({
      name: values.name,
      type: values.type,
      balance: balanceNum,
      currency: values.currency,
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-surface flex items-center justify-center">
      <AssetForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        isPending={isPending}
        globalError={globalError}
      />
    </div>
  );
}
