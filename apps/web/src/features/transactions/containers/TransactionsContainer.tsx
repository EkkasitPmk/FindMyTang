"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  createExpenseSchema,
  CreateExpenseFormValues,
} from "../schemas/expense.schema";
import { useCreateExpenseMutation } from "../hooks/transaction.hook";
import { useAssets } from "@/features/assets/hooks/assets.hook";
import { useCategories } from "@/features/category/hooks/category.hook";
import ExpenseForm from "../components/ExpenseForm";

export default function TransactionsContainer() {
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { data: assets = [] } = useAssets();
  const { data: categories = [] } = useCategories();

  const now = new Date();

  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      assetId: "",
      categoryId: "",
      amount: undefined,
      note: "",
      transactionDate: localIso,
    },
  });

  const { mutate: createExpense, isPending } = useCreateExpenseMutation({
    onSuccess: () => {
      toast.success("Expense recorded!");
      reset({
        assetId: "",
        categoryId: "",
        amount: undefined,
        note: "",
        transactionDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 16),
      });
      setGlobalError(null);
    },
    onError: (error) => {
      const message = error.response?.data?.message;
      let errorList: string[] = [];
      if (Array.isArray(message)) {
        errorList = message;
      } else if (message) {
        errorList = [message];
      }

      if (errorList.length === 0) {
        setGlobalError("Failed to save expense. Please try again.");
        return;
      }

      let hasGlobalError = false;
      errorList.forEach((msg) => {
        const lower = msg.toLowerCase();
        if (lower.includes("asset")) {
          setError("assetId", { type: "server", message: msg });
        } else if (lower.includes("category")) {
          setError("categoryId", { type: "server", message: msg });
        } else if (lower.includes("amount") || lower.includes("balance")) {
          setError("amount", { type: "server", message: msg });
        } else {
          setGlobalError(msg);
          hasGlobalError = true;
        }
      });

      if (!hasGlobalError) setGlobalError(null);
    },
  });

  const onSubmit = (values: CreateExpenseFormValues) => {
    setGlobalError(null);
    createExpense({
      assetId: values.assetId,
      categoryId: values.categoryId,
      amount: values.amount,
      note: values.note || undefined,
      transactionDate: new Date(values.transactionDate).toISOString(),
    });
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-surface flex items-center justify-center">
      <ExpenseForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        isPending={isPending}
        globalError={globalError}
        assets={assets}
        categories={categories}
      />
    </div>
  );
}
