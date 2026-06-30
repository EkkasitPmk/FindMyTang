"use client";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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

  const assetTypeList = Object.values(AssetType);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: asset.name,
      type: asset.type,
      color: asset.color || "#2563EB",
    },
  });

  const currentColor = useWatch({ control, name: "color" });
  const selected = useWatch({ control, name: "type" }) || AssetType.CASH;

  // Keep internal state synced if asset changes
  useEffect(() => {
    reset({
      name: asset.name,
      type: asset.type,
      color: asset.color || "#2563EB",
    });
  }, [asset, reset]);

  const handleSelect = (type: string) => {
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
        ...(balanceNum !== undefined && { balance: balanceNum }),
        color: values.color,
      },
    });
  };

  const handleBlurBalance = () => {
    const currentVal = getValues("balance");
    if (currentVal && !Number.isNaN(Number(currentVal))) {
      setValue("balance", Number(currentVal).toFixed(2));
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
      currentColor={currentColor}
      onSelectColor={(color) => setValue("color", color)}
      onBlurBalance={handleBlurBalance}
    />
  );
}
