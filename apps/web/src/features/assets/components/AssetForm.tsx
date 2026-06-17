import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import { CreateAssetFormValues } from "../schemas/assets.schema";
import { AssetType } from "../types/assets.type";

interface AssetFormProps {
  register: UseFormRegister<CreateAssetFormValues>;
  handleSubmit: UseFormHandleSubmit<CreateAssetFormValues>;
  onSubmit: (values: CreateAssetFormValues) => void;
  errors: FieldErrors<CreateAssetFormValues>;
  isPending: boolean;
  globalError: string | null;
}

export default function AssetForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  globalError,
}: Readonly<AssetFormProps>) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-surface-container rounded-2xl shadow-xl border border-outline/10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-on-surface mb-2">
          Create New Asset
        </h2>
        <p className="text-sm text-on-surface-variant">
          Add a new financial account or wallet to track your balance.
        </p>
      </div>

      {globalError && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="flex flex-col gap-2">
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
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-error font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="type"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Asset Type
          </label>
          <select
            id="type"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all cursor-pointer"
            {...register("type")}
          >
            <option value={AssetType.CASH}>Cash</option>
            <option value={AssetType.BANK}>Bank Account</option>
            <option value={AssetType.E_WALLET}>E-Wallet</option>
            <option value={AssetType.CREDIT_CARD}>Credit Card</option>
          </select>
          {errors.type && (
            <p className="text-xs text-error font-medium">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Balance */}
        <div className="flex flex-col gap-2">
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
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("balance")}
          />
          {errors.balance && (
            <p className="text-xs text-error font-medium">
              {errors.balance.message}
            </p>
          )}
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="currency"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Currency
          </label>
          <input
            id="currency"
            type="text"
            placeholder="THB"
            className="w-full h-12 px-4 bg-surface-container-low border border-outline/10 rounded-lg text-on-surface focus:border-primary/35 outline-none transition-all"
            {...register("currency")}
          />
          {errors.currency && (
            <p className="text-xs text-error font-medium">
              {errors.currency.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 mt-4 bg-primary text-white font-semibold rounded-lg flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Creating..." : "Create Asset"}
        </button>
      </form>
    </div>
  );
}
