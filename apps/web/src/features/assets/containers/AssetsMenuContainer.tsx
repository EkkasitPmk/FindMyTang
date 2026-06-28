"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDeleteAssetMutation } from "../hooks/assets.hook";
import { toast } from "react-toastify";
import AssetsMenu from "../components/AssetsMenu";

export default function AssetsMenuContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const { mutate: deleteAsset } = useDeleteAssetMutation({
    onSuccess: () => {
      toast.success("Asset deleted successfully!");
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to delete asset.");
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteAsset(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <AssetsMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      menuRef={menuRef}
      assetName={name}
      onDelete={handleDelete}
    />
  );
}
