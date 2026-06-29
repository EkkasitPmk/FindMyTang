import { EllipsisVertical, Trash2 } from "lucide-react";
import ConfirmModal from "@/shared/components/customs/ConfirmModal";
import MenuItem from "@/shared/components/customs/MenuItem";
import { RefObject } from "react";
import { Button } from "@/shared/components/customs/Button";

interface AssetsMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  menuRef: RefObject<HTMLDivElement | null>;
  assetName: string | null;
  onDelete: () => void;
}

export default function AssetsMenu({
  isOpen,
  setIsOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  menuRef,
  assetName,
  onDelete,
}: Readonly<AssetsMenuProps>) {
  return (
    <>
      <div className="relative" ref={menuRef}>
        <Button
          variant="unstyled"
          type="button"
          className="p-1 mr-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <EllipsisVertical size={18} />
        </Button>
        {isOpen && (
          <div className="absolute right-3 top-full flex flex-col items-start w-32 bg-white rounded-md py-2 shadow-md z-50 border border-gray-100">
            <MenuItem onClick={() => setIsOpen(false)}>Filter</MenuItem>
            <MenuItem onClick={() => setIsOpen(false)}>Search</MenuItem>
            <MenuItem onClick={() => setIsOpen(false)}>Sort</MenuItem>
            <MenuItem onClick={() => setIsOpen(false)}>Archive Asset</MenuItem>
            <MenuItem
              onClick={() => {
                setIsOpen(false);
                setIsDeleteModalOpen(true);
              }}
              className="hover:bg-red-50 text-red-500"
            >
              Delete Asset
            </MenuItem>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDelete}
        icon={Trash2}
        title="Delete Asset"
        des={`Are you sure you want to delete ${assetName || "this asset"}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </>
  );
}
