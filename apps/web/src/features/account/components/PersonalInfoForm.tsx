import { Check, Loader2, Pencil } from "lucide-react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { UpdateProfileFormValues } from "../schemas/account.schema";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Input } from "@/shared/components/customs/Input";
import { Button } from "@/shared/components/customs/Button";

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
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-secondary-text uppercase">
        {t("personalInfo")}
      </p>

      <form onSubmit={handleSubmit(onUpdateProfile)} className="m-0">
        <div className="bg-surface rounded-b-none rounded-md border border-border p-4 m-0">
          <div className="space-y-1">
            <p className="text-xs text-secondary-text font-semibold uppercase">
              {t("displayName")}
            </p>
            <div className="relative flex flex-col gap-1">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  disabled={isUpdating}
                  placeholder={t("placeholderDisplayName")}
                  className="pr-10"
                  error={!!errors.displayName}
                  {...register("displayName")}
                />
                {isDirty ? (
                  <Button
                    variant="unstyled"
                    type="submit"
                    disabled={isUpdating}
                    className="absolute right-3 p-1 text-primary hover:bg-primary-light rounded-full transition-colors cursor-pointer"
                    title={t("saveChanges")}
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
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

      <div className="bg-surface rounded-t-none rounded-md border-t-0 border border-border p-4">
        <div className="space-y-1">
          <p className="text-xs text-secondary-text font-semibold uppercase">
            {t("emailAddressLabel")}
          </p>
          <Input
            type="text"
            readOnly
            value={user?.email || t("guestUserText")}
            placeholder=""
            className="text-secondary-text/80 bg-background/50 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
