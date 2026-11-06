"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAssetSchema,
  CreateAssetFormValues,
} from "../schemas/assets.form.schema";
import { useCreateAssetMutation } from "../hooks/assets.hook";
import AssetForm from "../components/AssetForm";
import LoadingModal from "@/shared/components/customs/LoadingModal";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import { AssetType } from "@/shared/lib/types/asset.type";
import { useModalState } from "@/shared/lib/hooks/useModalState.hook";
import { useRouter } from "next/navigation";

interface CreateAssetsContainerProps {
  onClose?: () => void;
}

export default function CreateAssetsContainer({
  onClose,
}: Readonly<CreateAssetsContainerProps>) {
  const router = useRouter();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selected, setSelected] = useState<string>(AssetType.CASH);
  const { modalState, setModalState, resetModalState } = useModalState();

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
      color: "#2563EB",
      includeInSnapshot: true,
      savingsAmount: "",
    },
  });

  const currentColor = useWatch({ control, name: "color" });
  const includeInSnapshot =
    useWatch({ control, name: "includeInSnapshot" }) ?? true;

  const handleSelect = (type: string) => {
    setSelected(type);
    setValue("type", type as AssetType);
    setIsSelectOpen(false);
  };

  const { mutate: createAsset, isPending } = useCreateAssetMutation({
    onSuccess: (data) => {
      router.refresh();
      setModalState({
        isOpen: true,
        status: "success",
        message: `Asset "${data.name}" created successfully!`,
      });
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
      setModalState({
        isOpen: true,
        status: "error",
        message: "Failed to create asset.",
      });
    },
  });

  const handleModalClose = () => {
    resetModalState();
    if (modalState.status === "success") {
      reset();
      if (onClose) onClose();
    }
  };

  const onSubmit = (values: CreateAssetFormValues) => {
    const balanceNum =
      values.balance === "" ||
      values.balance === null ||
      values.balance === undefined
        ? undefined
        : Number(values.balance);

    const savingsAmountNum =
      values.savingsAmount === "" ||
      values.savingsAmount === null ||
      values.savingsAmount === undefined
        ? 0
        : Number(values.savingsAmount);

    createAsset({
      name: values.name,
      type: values.type,
      balance: balanceNum,
      color: values.color,
      includeInSnapshot: values.includeInSnapshot ?? true,
      savingsAmount: savingsAmountNum,
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
    const bal = Number(getValues("balance") || 0);
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
