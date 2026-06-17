"use client";
import { useState } from "react";
import {
  useAssets,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} from "@/features/assets/hooks/assets.hook";
import { Asset, AssetType } from "@/features/assets/types/assets.type";
import { toast } from "react-toastify";

export default function HomeContainer() {
  const { data: assets, isLoading, error } = useAssets();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<AssetType>(AssetType.CASH);
  const [editBalance, setEditBalance] = useState<number | "">("");
  const [editCurrency, setEditCurrency] = useState("THB");

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
      <div className="p-6 text-red-500">
        Failed to load assets: {error.message || "Unknown error"}
      </div>
    );
  }

  const handleStartEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setEditName(asset.name);
    setEditType(asset.type);
    setEditBalance(asset.balance);
    setEditCurrency(asset.currency);
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
        currency: editCurrency.trim() || "THB",
      },
    });
  };

  return (
    <div className="p-2 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Asset List</h1>
      {!assets || assets.length === 0 ? (
        <p className="text-gray-500">No assets found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Balance</th>
                <th className="px-6 py-3">Currency</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {assets.map((asset) => {
                const isEditing = editingId === asset.id;
                return isEditing ? (
                  <tr key={asset.id} className="bg-primary/5">
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-gray-350 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 bg-white"
                        placeholder="Asset Name"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={editType}
                        onChange={(e) =>
                          setEditType(e.target.value as AssetType)
                        }
                        className="border border-gray-350 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 bg-white cursor-pointer"
                      >
                        <option value={AssetType.CASH}>Cash</option>
                        <option value={AssetType.BANK}>Bank Account</option>
                        <option value={AssetType.E_WALLET}>E-Wallet</option>
                        <option value={AssetType.CREDIT_CARD}>
                          Credit Card
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        step="any"
                        value={editBalance}
                        onChange={(e) =>
                          setEditBalance(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        className="border border-gray-350 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 bg-white"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={editCurrency}
                        onChange={(e) => setEditCurrency(e.target.value)}
                        className="border border-gray-350 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-900 bg-white"
                        placeholder="THB"
                      />
                    </td>
                    <td className="px-6 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleSave(asset.id)}
                        disabled={isUpdating}
                        className="bg-primary text-white font-semibold rounded px-3 py-1.5 text-xs hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="border border-gray-300 text-gray-700 font-semibold rounded px-3 py-1.5 text-xs hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{asset.type}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {asset.balance}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {asset.currency}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleStartEdit(asset)}
                        disabled={isDeleting}
                        className="text-primary hover:underline font-semibold text-sm cursor-pointer disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id, asset.name)}
                        disabled={isDeleting}
                        className="text-red-600 hover:underline font-semibold text-sm cursor-pointer disabled:opacity-50"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
