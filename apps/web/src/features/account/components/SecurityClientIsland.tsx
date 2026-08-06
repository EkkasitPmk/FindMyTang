"use client";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { ChevronRight, RotateCcwKey } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ChangePasswordModal from "./ChangePasswordModal";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { handleFormError } from "@/shared/lib/helpers/form.helper";
import { changePasswordAction } from "../services/account.actions";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "../schemas/account.form.schema";
import { useRouter } from "next/navigation";

export default function SecurityClientIsland() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const close = () => {
    setIsOpen(false);
    form.reset();
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const submit = (values: ChangePasswordFormValues) => {
    startTransition(async () => {
      const result = await changePasswordAction(values);
      if (result.success) {
        toast.success(t("passwordChanged"));
        close();
        router.refresh();
        return;
      }
      if (
        result.field === "currentPassword" ||
        result.field === "newPassword" ||
        result.field === "confirmNewPassword"
      ) {
        form.setError(result.field, {
          type: "server",
          message: result.message,
        });
        return;
      }
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (
            field === "currentPassword" ||
            field === "newPassword" ||
            field === "confirmNewPassword"
          ) {
            form.setError(field, { type: "server", message });
          }
        }
        return;
      }
      handleFormError(
        { response: { data: { message: result.message } } },
        form.setError,
        "Failed to change password",
        {
          current: "currentPassword",
          "new password": ["newPassword", "confirmNewPassword"], // NOSONAR
          match: ["newPassword", "confirmNewPassword"],
        },
      );
    });
  };

  return (
    <>
      <div className="space-y-1">
        <p className="text-sm font-medium text-secondary-text uppercase">
          {t("security")}
        </p>
        <Button
          variant="unstyled"
          onClick={() => setIsOpen(true)}
          className="w-full bg-surface rounded-md border border-border p-4 text-left hover:bg-surface-secondary transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-secondary-text">
              <RotateCcwKey size={16} />
              <p className="text-xs font-semibold uppercase">
                {t("changePassword")}
              </p>
            </div>
            <ChevronRight className="text-secondary-text/70" size={16} />
          </div>
        </Button>
      </div>
      {isOpen && (
        <ChangePasswordModal
          isOpen={isOpen}
          onClose={close}
          register={form.register}
          handleSubmit={form.handleSubmit}
          onSubmit={submit}
          errors={form.formState.errors}
          isPending={isPending}
          showCurrent={showCurrent}
          showNew={showNew}
          showConfirm={showConfirm}
          onToggleShowCurrent={() => setShowCurrent(!showCurrent)}
          onToggleShowNew={() => setShowNew(!showNew)}
          onToggleShowConfirm={() => setShowConfirm(!showConfirm)}
        />
      )}
    </>
  );
}
