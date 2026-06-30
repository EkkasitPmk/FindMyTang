"use client";
import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDeleteAssetMutation } from "../hooks/assets.hook";
import { toast } from "react-toastify";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import { useConfirmModal } from "@/shared/lib/hooks/useConfirmModal.hook";
import AssetsMenu from "../components/AssetsMenu";
import LoadingModal from "@/shared/components/customs/LoadingModal";

export default function AssetsMenuContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
    isHardDelete,
    setIsHardDelete,
    inputValue,
    setInputValue,
  } = useConfirmModal();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const { mutate: deleteAsset, isPending: isDeletingAsset } =
    useDeleteAssetMutation({
      onSuccess: () => {
        toast.success("Asset deleted successfully!");
        router.push("/");
      },
      onError: () => {
        toast.error("Failed to delete asset.");
      },
    });

  const handleDelete = (isHardDelete?: boolean) => {
    if (id) {
      deleteAsset({ id, hardDelete: isHardDelete });
    }
  };

  useClickOutside(menuRef, () => setIsOpen(false), isOpen);

  return (
    <>
      <AssetsMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={(open) =>
          open ? openDeleteModal() : closeDeleteModal()
        }
        isHardDelete={isHardDelete}
        setIsHardDelete={setIsHardDelete}
        inputValue={inputValue}
        setInputValue={setInputValue}
        menuRef={menuRef}
        assetName={name}
        onDelete={handleDelete}
      />
      <LoadingModal isOpen={isDeletingAsset} />
    </>
  );
}
