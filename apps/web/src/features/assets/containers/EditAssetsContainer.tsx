"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editAssetSchema,
  CreateAssetFormValues,
} from "../schemas/assets.form.schema";
import { useUpdateAssetMutation } from "../hooks/assets.hook";
import { Asset, AssetType } from "@/shared/lib/types/asset.type";
import AssetForm from "../components/AssetForm";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { useRouter } from "next/navigation";

interface EditAssetsContainerProps {
  asset: Asset;
  onClose?: (newName?: string) => void;
}

export default function EditAssetsContainer({
  asset,
  onClose,
}: Readonly<EditAssetsContainerProps>) {
  const router = useRouter();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const { modalState, setModalState, resetModalState } = useModalState<{
    updatedName?: string;
  }>();

  const assetTypeList = Object.values(AssetType);

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateAssetFormValues>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: {
      name: asset.name,
      type: asset.type,
      balance: Number(asset.balance ?? 0).toFixed(2),
      color: asset.color || "#2563EB",
      includeInSnapshot: asset.includeInSnapshot ?? true,
      savingsAmount: Number(asset.savingsAmount ?? 0).toFixed(2),
    },
    values: {
      name: asset.name,
      type: asset.type,
      balance: Number(asset.balance ?? 0).toFixed(2),
      color: asset.color || "#2563EB",
      includeInSnapshot: asset.includeInSnapshot ?? true,
      savingsAmount: Number(asset.savingsAmount ?? 0).toFixed(2),
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const currentColor = useWatch({ control, name: "color" });
  const selected = useWatch({ control, name: "type" }) || AssetType.CASH;
  const includeInSnapshot =
    useWatch({ control, name: "includeInSnapshot" }) ?? true;

  const handleSelect = (type: string) => {
    setValue("type", type as AssetType);
    setIsSelectOpen(false);
  };

  const { mutate: updateAsset, isPending } = useUpdateAssetMutation({
    onSuccess: (data) => {
      router.refresh();
      setModalState({
        isOpen: true,
        status: "success",
        message: `Asset "${data.name}" updated successfully!`,
        updatedName: data.name,
      });
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
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to update asset.",
      });
    },
  });

  const handleModalClose = () => {
    const name = modalState.updatedName;
    resetModalState();
    if (modalState.status === "success" && onClose) {
      onClose(name);
    }
  };

  const onSubmit = (values: CreateAssetFormValues) => {
    const savingsAmountNum =
      values.savingsAmount === "" ||
      values.savingsAmount === null ||
      values.savingsAmount === undefined
        ? 0
        : Number(values.savingsAmount);

    updateAsset({
      id: asset.id,
      data: {
        name: values.name,
        type: values.type,
        color: values.color,
        includeInSnapshot: values.includeInSnapshot ?? true,
        savingsAmount: savingsAmountNum,
      },
    });
  };

  const handleBlurBalance = () => {
    const currentVal = getValues("balance");
    const cleanVal = String(currentVal ?? "").replaceAll(",", "");
    if (cleanVal && !Number.isNaN(Number(cleanVal))) {
      setValue("balance", Number(cleanVal).toFixed(2));
    }
  };

  const handleBlurSavingsAmount = () => {
    const currentVal = getValues("savingsAmount");
    const cleanVal = String(currentVal ?? "").replaceAll(",", "");
    if (cleanVal && !Number.isNaN(Number(cleanVal))) {
      setValue("savingsAmount", Number(cleanVal).toFixed(2));
    } else {
      setValue("savingsAmount", "0.00");
    }
  };

  const handleQuickSetSavings = (type: "half" | "full" | "clear") => {
    const bal = Number(asset.balance || 0);
    if (type === "half") {
      setValue("savingsAmount", (bal / 2).toFixed(2), { shouldDirty: true });
    } else if (type === "full") {
      setValue("savingsAmount", bal.toFixed(2), { shouldDirty: true });
    } else {
      setValue("savingsAmount", "0.00", { shouldDirty: true });
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
        includeInSnapshot={includeInSnapshot}
        onToggleIncludeInSnapshot={(val) =>
          setValue("includeInSnapshot", val, { shouldDirty: true })
        }
        onBlurSavingsAmount={handleBlurSavingsAmount}
        onQuickSetSavings={handleQuickSetSavings}
      />
      <LoadingModal
        isOpen={modalState.isOpen || isPending}
        status={modalState.isOpen ? modalState.status : "loading"}
        message={modalState.isOpen ? modalState.message : undefined}
        onClose={handleModalClose}
      />
    </>
  );
}
