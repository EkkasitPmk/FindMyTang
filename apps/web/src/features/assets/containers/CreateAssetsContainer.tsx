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

export default function CreateAssetsContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(AssetType.CASH);

  const assetTypeList = Object.values(AssetType);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: "",
      type: AssetType.CASH,
      balance: 0,
    },
  });

  const handleSelect = (type: string) => {
    setSelected(type);
    setValue("type", type as AssetType);
    setIsOpen(false);
  };

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
        toast.error("Failed to create asset. Please check validation rules.");
        return;
      }

      errorList.forEach((msg) => {
        const lowerMsg = msg.toLowerCase();
        if (lowerMsg.includes("name")) {
          setError("name", { type: "server", message: msg });
        } else if (lowerMsg.includes("type")) {
          setError("type", { type: "server", message: msg });
        } else if (lowerMsg.includes("balance")) {
          setError("balance", { type: "server", message: msg });
        } else {
          toast.error(msg);
        }
      });
    },
  });

  const onSubmit = (values: CreateAssetFormValues) => {
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
    });
  };

  return (
    <AssetForm
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
      isPending={isPending}
      selected={selected}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      assetTypeList={assetTypeList}
      handleSelect={handleSelect}
    />
  );
}
