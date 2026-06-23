import { Check, Loader2, Pencil } from "lucide-react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { UpdateProfileFormValues } from "../schemas/account.schema";

interface PersonalInfoFormProps {
  user:
    | {
        email: string | null;
        displayName: string;
      }
    | null
    | undefined;
  onUpdateProfile: (values: UpdateProfileFormValues) => void;
  isUpdating: boolean;
  register: UseFormRegister<UpdateProfileFormValues>;
  handleSubmit: UseFormHandleSubmit<UpdateProfileFormValues>;
  errors: FieldErrors<UpdateProfileFormValues>;
  isDirty: boolean;
}

export default function PersonalInfoForm({
  user,
  onUpdateProfile,
  isUpdating,
  register,
  handleSubmit,
  errors,
  isDirty,
}: Readonly<PersonalInfoFormProps>) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-secondary-text">PERSONAL INFO</p>

      <form onSubmit={handleSubmit(onUpdateProfile)}>
        <div className="bg-white rounded-b-none rounded-md border border-border p-4 m-0">
          <div className="space-y-1">
            <p className="text-xs text-secondary-text font-semibold">
              DISPLAY NAME
            </p>
            <div className="relative flex flex-col gap-1">
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled={isUpdating}
                  placeholder="Enter display name"
                  {...register("displayName")}
                  className="w-full px-3 py-2 border border-border rounded-md focus:border-primary/35 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-foreground bg-background pr-10"
                />
                {isDirty ? (
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="absolute right-3 p-1 text-primary hover:bg-primary-light rounded-full transition-colors cursor-pointer"
                    title="Save Changes"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  <Pencil className="absolute right-3 w-4 h-4 text-secondary-text/60 pointer-events-none" />
                )}
              </div>
              {errors.displayName && (
                <p className="text-xs text-expense mt-1">
                  {errors.displayName.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-t-none rounded-md border-t-0 border border-border p-4">
        <div className="space-y-1">
          <p className="text-xs text-secondary-text font-semibold">
            EMAIL ADDRESS
          </p>
          <input
            type="text"
            readOnly
            value={user?.email || "Guest User"}
            placeholder=""
            className="w-full px-3 py-2 border border-border rounded-md text-secondary-text/80 bg-background/50 cursor-not-allowed outline-none"
          />
        </div>
      </div>
    </div>
  );
}
