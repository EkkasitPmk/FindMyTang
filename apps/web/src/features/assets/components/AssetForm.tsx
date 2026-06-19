import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { CreateAssetFormValues } from "../schemas/assets.schema";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils";

interface AssetFormProps {
  register: UseFormRegister<CreateAssetFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateAssetFormValues>;
  onSubmit: (values: CreateAssetFormValues) => void;
  errors: FieldErrors<CreateAssetFormValues>;
  isPending: boolean;
  selected: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assetTypeList: string[];
  handleSelect: (type: string) => void;
}

export default function AssetForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  selected,
  isOpen,
  setIsOpen,
  assetTypeList,
  handleSelect,
}: Readonly<AssetFormProps>) {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface mb-2">
          Create New Asset
        </h2>
        <p className="text-sm text-on-surface-variant">
          Add a new financial account or wallet to track your balance.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Asset Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Cash, Main Bank Account"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-md text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-error font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1 relative">
          <label
            htmlFor="type"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Asset Type
          </label>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-12 px-4 text-left bg-surface-container-low border border-outline/10 rounded-md text-on-surface focus:border-primary/35 outline-none transition-all cursor-pointer"
            {...register("type")}
          >
            <span>{selected}</span>
            <svg
              className={`w-5 h-5 inline float-right mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#6B7280"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isOpen && (
            <ul className="absolute top-full w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2 z-20">
              {assetTypeList.map((type) => (
                <li key={type}>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-4 py-2 text-sm flex items-center justify-between hover:bg-indigo-500 hover:text-white cursor-pointer text-left",
                      selected === type && "bg-surface-container-low",
                    )}
                    onClick={() => handleSelect(type)}
                  >
                    <span>{type}</span>
                    {selected === type && <Check size={18} />}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {errors.type && (
            <p className="text-xs text-error font-medium">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="balance"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Initial Balance
          </label>
          <input
            id="balance"
            type="number"
            step="any"
            placeholder="0.00"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-md text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("balance")}
          />
          {errors.balance && (
            <p className="text-xs text-error font-medium">
              {errors.balance.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="fixed bottom-0 left-0 right-0 p-4 md:static z-10">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-primary text-white font-semibold rounded-md flex items-center justify-center hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Creating..." : "Create Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
