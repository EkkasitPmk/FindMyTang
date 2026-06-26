"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  ArrowDown,
  ArrowRight,
  Coffee,
  Coins,
  Landmark,
  Plus,
  Utensils,
  X,
} from "lucide-react";
import {
  createExpenseSchema,
  CreateExpenseFormValues,
} from "../schemas/expense.schema";
import {
  createIncomeSchema,
  CreateIncomeFormValues,
} from "../schemas/income.schema";
import {
  useCreateExpenseMutation,
  useCreateIncomeMutation,
  useTransactionsQuery,
} from "../hooks/transaction.hook";
import { useAssets } from "@/features/assets/hooks/assets.hook";
import { useCategories } from "@/features/category/hooks/category.hook";

import { cn } from "@/shared/lib/utils";

type TransactionType = "EXPENSE" | "INCOME";

export default function TransactionsContainer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TransactionType>("EXPENSE");

  // Filters State
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [assetId, setAssetId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [dateRange, setDateRange] = useState("THIS_MONTH");

  const queryParams = useMemo(() => {
    const params: any = { page, limit: 10 };
    if (type) params.type = type;
    if (assetId) params.assetId = assetId;
    if (categoryId) params.categoryId = categoryId;

    const now = new Date();
    if (dateRange === "THIS_MONTH") {
      params.from = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();
      params.to = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).toISOString();
    } else if (dateRange === "LAST_MONTH") {
      params.from = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      ).toISOString();
      params.to = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
    } else if (dateRange === "THIS_YEAR") {
      params.from = new Date(now.getFullYear(), 0, 1).toISOString();
      params.to = new Date(now.getFullYear(), 11, 31).toISOString();
    }

    return params;
  }, [page, type, assetId, categoryId, dateRange]);

  const { data, isLoading: isTxsLoading } = useTransactionsQuery(queryParams);
  const transactions = data?.items || [];
  const meta = data?.meta;

  const { data: assets = [] } = useAssets();
  const { data: categories = [] } = useCategories();

  const now = new Date();
  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  // Expense Form
  const expenseForm = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      assetId: "",
      categoryId: "",
      amount: undefined,
      note: "",
      transactionDate: localIso,
    },
  });

  // Income Form
  const incomeForm = useForm<CreateIncomeFormValues>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: {
      assetId: "",
      categoryId: "",
      amount: undefined,
      note: "",
      transactionDate: localIso,
    },
  });

  const resetForms = () => {
    const freshIso = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);
    const defaults = {
      assetId: "",
      categoryId: "",
      amount: undefined,
      note: "",
      transactionDate: freshIso,
    };
    expenseForm.reset(defaults);
    incomeForm.reset(defaults);
  };

  const { mutate: createExpense, isPending: isExpensePending } =
    useCreateExpenseMutation({
      onSuccess: () => {
        toast.success("Expense recorded!");
        resetForms();
        setIsFormOpen(false);
      },
      onError: (error) => {
        handleError(error, expenseForm.setError);
      },
    });

  const { mutate: createIncome, isPending: isIncomePending } =
    useCreateIncomeMutation({
      onSuccess: () => {
        toast.success("Income recorded!");
        resetForms();
        setIsFormOpen(false);
      },
      onError: (error) => {
        handleError(error, incomeForm.setError);
      },
    });

  const handleError = (error: any, setError: any) => {
    const message = error.response?.data?.message;
    let errorList: string[] = [];
    if (Array.isArray(message)) {
      errorList = message;
    } else if (message) {
      errorList = [message];
    }

    if (errorList.length === 0) {
      toast.error("Failed to save transaction. Please try again.");
      return;
    }

    errorList.forEach((msg) => {
      const lower = msg.toLowerCase();
      if (lower.includes("asset")) {
        setError("assetId", { type: "server", message: msg });
      } else if (lower.includes("category")) {
        setError("categoryId", { type: "server", message: msg });
      } else if (lower.includes("amount") || lower.includes("balance")) {
        setError("amount", { type: "server", message: msg });
      } else {
        toast.error(msg);
      }
    });
  };

  const onExpenseSubmit = (values: CreateExpenseFormValues) => {
    createExpense({
      assetId: values.assetId,
      categoryId: values.categoryId,
      amount: values.amount,
      note: values.note || undefined,
      transactionDate: new Date(values.transactionDate).toISOString(),
    });
  };

  const onIncomeSubmit = (values: CreateIncomeFormValues) => {
    createIncome({
      assetId: values.assetId,
      categoryId: values.categoryId,
      amount: values.amount,
      note: values.note || undefined,
      transactionDate: new Date(values.transactionDate).toISOString(),
    });
  };

  const handleFilterChange = (setter: any) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <form className="space-y-4">
      <p className="text-center text-2xl font-bold">Add Transaction</p>

      <section className="bg-primary-light flex rounded-lg text-xs font-medium p-1">
        {/* exp. เวลากด */}
        <button className="w-full grow bg-primary text-white font-bold py-2 rounded-md">
          Expense
        </button>
        <button className="w-full grow py-2 rounded-md">Income</button>
        <button className="w-full grow py-2 rounded-md">Transfer</button>
        <button className="w-full grow py-2 rounded-md">Adjustment</button>
      </section>

      <section className="flex items-center justify-center gap-2">
        <span className="text-4xl font-bold">฿</span>
        <input
          id="balance"
          type="number"
          step="any"
          placeholder="0.00"
          className={cn(
            "w-60 bg-background border-0 border-b border-border outline-none transition-all text-center text-3xl font-bold",
            "tracking-wide",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          )}
          // {...register("")}
          // onBlur={(e) => {
          //   void register("").onBlur(e);
          //   onBlurBalance?.();
          // }}
        />
      </section>

      <section className="space-y-1">
        <p className="uppercase text-sm text-secondary-text font-medium">
          CATEGORY
        </p>
        <div className="grid grid-cols-5 gap-y-2 overflow-auto max-h-[24vh]">
          {/* exp. เมื่อถูกกดเลือก */}
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-primary-light">
              <Utensils size={18} className="text-primary-text" />
            </span>
            <span className="uppercase text-text-primary-text text-xs font-medium truncate">
              FOOD
            </span>
          </button>
          {/* exp. เมื่อถูกกดเลือก */}
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1">
            <span className="p-3 rounded-xl bg-surface-secondary">
              <Coffee size={18} className="text-secondary-text" />
            </span>
            <span className="uppercase text-secondary-text text-xs font-medium truncate">
              coffee
            </span>
          </button>
        </div>
      </section>

      <section className="space-y-1">
        <p className="uppercase text-sm text-secondary-text font-medium">
          ASSET
        </p>
        <div className="flex gap-2 overflow-auto">
          <button className="flex items-center justify-center border border-primary bg-primary-light gap-3 w-fit max-w-30 rounded-md px-4 py-2">
            <span className="bg-background p-2 rounded-full">
              <Landmark size={18} className="text-primary" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-primary-text">SCB</span>
              <span className="text-xs text-secondary-text">BANK</span>
            </div>
          </button>
          <button className="flex items-center justify-center border border-border bg-surface-secondary gap-3 w-fit max-w-30 rounded-md px-4 py-2">
            <span className="bg-background p-2 rounded-full">
              <Coins size={18} className="text-primary-text" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-primary-text">CASH</span>
              <span className="text-xs text-secondary-text">CASH</span>
            </div>
          </button>
          <button className="flex items-center justify-center border border-border bg-surface-secondary gap-3 w-fit max-w-30 rounded-md px-4 py-2">
            <span className="bg-background p-2 rounded-full">
              <Coins size={18} className="text-primary-text" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-primary-text">CASH</span>
              <span className="text-xs text-secondary-text">CASH</span>
            </div>
          </button>
          <button className="flex items-center justify-center border border-border bg-surface-secondary gap-3 w-fit max-w-30 rounded-md px-4 py-2">
            <span className="bg-background p-2 rounded-full">
              <Coins size={18} className="text-primary-text" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-primary-text">CASH</span>
              <span className="text-xs text-secondary-text">CASH</span>
            </div>
          </button>
        </div>
      </section>

      {/* More Details */}
      <button className="my-0 w-full flex items-center justify-center gap-2 text-primary text-sm">
        More Details
        <ArrowDown size={16} />
      </button>

      {/* <section className="space-y-1">
        <p className="uppercase text-sm text-secondary-text font-medium">
          DETAILS
        </p>
      </section> */}
      {/* More Details */}

      {/* Save Transaction */}
      <section className="fixed bottom-20 left-0 right-0 mx-4">
        <button className="flex items-center justify-center gap-2 bg-primary w-full text-white py-3 rounded-xl text-base font-bold">
          Save Transaction
          <ArrowRight size={18} />
        </button>
      </section>
      {/* Save Transaction */}
    </form>
  );
}
