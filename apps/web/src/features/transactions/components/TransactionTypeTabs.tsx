import type { ReactNode } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/components/animate-ui/components/animate/tabs";

interface TransactionTypeOption {
  label: string;
  value: string;
}

interface TransactionTypeTabsProps {
  value: string;
  options: TransactionTypeOption[];
  isLoading: boolean;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export default function TransactionTypeTabs({
  value,
  options,
  isLoading,
  onValueChange,
  children,
}: Readonly<TransactionTypeTabsProps>) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="gap-3">
      <TabsList className="w-full">
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded-lg" />
        ) : (
          options.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))
        )}
      </TabsList>
      {children}
    </Tabs>
  );
}
