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
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { handleFormError } from "@/shared/lib/helpers/form.helper";

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
      handleFormError(
        error,
        setError,
        "Failed to update asset. Please check validation rules.",
        {
          name: "name",
          type: "type",
          balance: "balance",
        },
      );
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
    <>
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
      <LoadingModal isOpen={isPending} />
    </>
  );
}
