import type { ComponentProps } from "react";
import {
  TabsContent,
  TabsContents,
} from "@/shared/components/animate-ui/components/animate/tabs";
import TransactionAmountField from "./TransactionAmountField";
import TransactionMoreDetails from "./TransactionMoreDetails";
import TransactionSelectionFields from "./TransactionSelectionFields";
import ChooseADate from "./ChooseADate";

interface TransactionTypeContentProps {
  options: Array<{ label: string; value: string }>;
  amount: ComponentProps<typeof TransactionAmountField>;
  selection: ComponentProps<typeof TransactionSelectionFields>;
  moreDetails: Omit<
    ComponentProps<typeof TransactionMoreDetails>,
    "datePicker"
  >;
  datePicker: ComponentProps<typeof ChooseADate>;
}

export default function TransactionTypeContent({
  options,
  amount,
  selection,
  moreDetails,
  datePicker,
}: Readonly<TransactionTypeContentProps>) {
  return (
    <TabsContents>
      {options.map((option) => (
        <TabsContent key={option.value} value={option.value}>
          <div className="space-y-4">
            <TransactionAmountField {...amount} />
            <TransactionSelectionFields {...selection} />
            <TransactionMoreDetails
              {...moreDetails}
              datePicker={<ChooseADate {...datePicker} />}
            />
          </div>
        </TabsContent>
      ))}
    </TabsContents>
  );
}
