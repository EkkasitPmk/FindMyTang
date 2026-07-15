"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schemas/assets.schema";
import { useCreateAssetMutation } from "../hooks/assets.hook";
import { AssetType } from "../types/assets.type";
import AssetForm from "../components/AssetForm";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { handleFormError } from "@/shared/lib/helpers/form.helper";

interface CreateAssetsContainerProps {
  onClose?: () => void;
}

export default function CreateAssetsContainer({
  onClose,
}: Readonly<CreateAssetsContainerProps>) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selected, setSelected] = useState<string>(AssetType.CASH);

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
      name: "",
      type: AssetType.CASH,
      balance: "",
      color: "var(--color-primary)",
    },
  });

  const currentColor = useWatch({ control, name: "color" });

  const handleSelect = (type: string) => {
    setSelected(type);
    setValue("type", type as AssetType);
    setIsSelectOpen(false);
  };

  const { mutate: createAsset, isPending } = useCreateAssetMutation({
    onSuccess: (data) => {
      toast.success(`Asset "${data.name}" created successfully!`);
      reset();
      if (onClose) onClose();
    },
    onError: (error) => {
      handleFormError(
        error,
        setError,
        "Failed to create asset. Please check validation rules.",
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

    createAsset({
      name: values.name,
      type: values.type,
      balance: balanceNum,
      color: values.color,
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
