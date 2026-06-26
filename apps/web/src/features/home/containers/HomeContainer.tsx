"use client";
import { useState } from "react";
import {
  useAssets,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} from "@/features/assets/hooks/assets.hook";
import { Asset, AssetType } from "@/features/assets/types/assets.type";
import { toast } from "react-toastify";
import FinancialSnapshotContainer from "../../financialSnapshot/containers/FinancialSnapshotContainer";
import RecentJournalContainer from "@/features/journal/containers/RecentJournalContainer";
import ListAssetsContainer from "../../assets/containers/ListAssetsContainer";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";

export default function HomeContainer() {
  const { data: assets, isLoading, error } = useAssets();
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<AssetType>(AssetType.CASH);
  const [editBalance, setEditBalance] = useState<number | "">("");

  const { mutate: updateAsset, isPending: isUpdating } = useUpdateAssetMutation(
    {
      onSuccess: (data) => {
        toast.success(`Asset "${data.name}" updated successfully!`);
        setEditingId(null);
      },
      onError: (err) => {
        const message = err.response?.data?.message;
        const errorMsg = Array.isArray(message)
          ? message[0]
          : message || "Failed to update asset";
        toast.error(errorMsg);
      },
    },
  );

  const { mutate: deleteAsset, isPending: isDeleting } = useDeleteAssetMutation(
    {
      onSuccess: (data) => {
        toast.success(`Asset "${data.name}" deleted successfully!`);
      },
      onError: (err) => {
        const message = err.response?.data?.message;
        const errorMsg = Array.isArray(message)
          ? message[0]
          : message || "Failed to delete asset";
        toast.error(errorMsg);
      },
    },
  );

  const handleDelete = (id: string, name: string) => {
    // ponytail: using simple native confirmation dialog
    if (
      globalThis.confirm(`Are you sure you want to delete asset "${name}"?`)
    ) {
      deleteAsset(id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading assets...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-expense">
        Failed to load assets: {error.message || "Unknown error"}
      </div>
    );
  }

  const handleStartEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setEditName(asset.name);
    setEditType(asset.type);
    setEditBalance(asset.balance);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = (id: string) => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      toast.error("Asset name is required");
      return;
    }

    const balanceNum = editBalance === "" ? 0 : Number(editBalance);
    if (Number.isNaN(balanceNum)) {
      toast.error("Balance must be a valid number");
      return;
    }

    updateAsset({
      id,
      data: {
        name: trimmedName,
        type: editType,
        balance: balanceNum,
      },
    });
  };

  return (
    <>
      <div className="space-y-4">
        <FinancialSnapshotContainer />

        <ListAssetsContainer onAddAsset={() => setIsCreateAssetOpen(true)} />

        <RecentJournalContainer />
      </div>

      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
      )}
    </>
  );
}
