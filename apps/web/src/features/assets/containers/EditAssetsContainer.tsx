"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schemas/assets.schema";
import { useUpdateAssetMutation } from "../hooks/assets.hook";
import { Asset, AssetType } from "../types/assets.type";
import AssetForm from "../components/AssetForm";

interface EditAssetsContainerProps {
  asset: Asset;
  onClose?: () => void;
}

export default function EditAssetsContainer({
  asset,
  onClose,
}: Readonly<EditAssetsContainerProps>) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selected, setSelected] = useState<string>(
    asset.type || AssetType.CASH,
  );

  const assetTypeList = Object.values(AssetType);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: asset.name,
      type: asset.type,
      balance: asset.balance as any,
      color: asset.color || "#2563EB",
    },
  });

  // Keep internal state synced if asset changes
  useEffect(() => {
    reset({
      name: asset.name,
      type: asset.type,
      balance: asset.balance as any,
      color: asset.color || "#2563EB",
    });
    setSelected(asset.type || AssetType.CASH);
  }, [asset, reset]);

  const handleSelect = (type: string) => {
    setSelected(type);
    setValue("type", type as AssetType);
    setIsSelectOpen(false);
  };

  const { mutate: updateAsset, isPending } = useUpdateAssetMutation({
    onSuccess: (data) => {
      toast.success(`Asset "${data.name}" updated successfully!`);
      if (onClose) onClose();
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
        toast.error("Failed to update asset. Please check validation rules.");
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

    updateAsset({
      id: asset.id,
      data: {
        name: values.name,
        type: values.type,
        balance: balanceNum,
        color: values.color,
      },
    });
  };

  const handleBlurBalance = () => {
    const currentVal = watch("balance");
    if (currentVal && !Number.isNaN(Number(currentVal))) {
      setValue("balance", Number(currentVal).toFixed(2) as any);
    }
  };

  return (
    <AssetForm
      isEdit={true}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
      isPending={isPending}
      selected={selected}
      isOpen={isSelectOpen}
      setIsOpen={setIsSelectOpen}
      assetTypeList={assetTypeList}
      handleSelect={handleSelect}
      onClose={onClose}
      currentColor={watch("color")}
      onSelectColor={(color) => setValue("color", color)}
      onBlurBalance={handleBlurBalance}
    />
  );
}
