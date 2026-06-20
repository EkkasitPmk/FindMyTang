"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";
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
import ExpenseForm from "../components/ExpenseForm";
import IncomeForm from "../components/IncomeForm";
import TransactionList from "../components/TransactionList";
import EmptyTransactions from "../components/EmptyTransactions";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";

type TransactionType = "EXPENSE" | "INCOME";

export default function TransactionsContainer() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TransactionType>("EXPENSE");
  const [globalError, setGlobalError] = useState<string | null>(null);

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
    setGlobalError(null);
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
      setGlobalError("Failed to save transaction. Please try again.");
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
  };

  const onExpenseSubmit = (values: CreateExpenseFormValues) => {
    setGlobalError(null);
    createExpense({
      assetId: values.assetId,
      categoryId: values.categoryId,
      amount: values.amount,
      note: values.note || undefined,
      transactionDate: new Date(values.transactionDate).toISOString(),
    });
  };

  const onIncomeSubmit = (values: CreateIncomeFormValues) => {
    setGlobalError(null);
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
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-6 border-b border-outline-variant">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="">Transactions</h1>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg active-press"
          >
            {isFormOpen ? <X size={24} /> : <Plus size={24} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pt-6">
        {isFormOpen && (
          <div className="px-4 mb-8 animate-subtle-pop">
            <div className="p-6 rounded-2xl border border-outline-variant shadow-sm">
              <div className="flex rounded-xl p-1 mb-6">
                <button
                  onClick={() => setActiveTab("EXPENSE")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === "EXPENSE"
                      ? "bg-surface text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setActiveTab("INCOME")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === "INCOME"
                      ? "bg-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Income
                </button>
              </div>

              {activeTab === "EXPENSE" ? (
                <ExpenseForm
                  register={expenseForm.register}
                  handleSubmit={expenseForm.handleSubmit}
                  onSubmit={onExpenseSubmit}
                  errors={expenseForm.formState.errors}
                  isPending={isExpensePending}
                  globalError={globalError}
                  assets={assets}
                  categories={categories}
                />
              ) : (
                <IncomeForm
                  register={incomeForm.register}
                  handleSubmit={incomeForm.handleSubmit}
                  onSubmit={onIncomeSubmit}
                  errors={incomeForm.formState.errors}
                  isPending={isIncomePending}
                  globalError={globalError}
                  assets={assets}
                  categories={categories}
                />
              )}
            </div>
          </div>
        )}

        <FilterBar
          type={type}
          assetId={assetId}
          categoryId={categoryId}
          dateRange={dateRange}
          onTypeChange={handleFilterChange(setType)}
          onAssetChange={handleFilterChange(setAssetId)}
          onCategoryChange={handleFilterChange(setCategoryId)}
          onDateRangeChange={handleFilterChange(setDateRange)}
          assets={assets}
          categories={categories}
        />

        {isTxsLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length > 0 ? (
          <>
            <TransactionList transactions={transactions} />
            {meta && (
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        ) : (
          <EmptyTransactions />
        )}
      </main>
    </div>
  );
}
