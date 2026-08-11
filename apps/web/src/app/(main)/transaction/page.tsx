import TransactionsRouteContainer from "@/features/transactions/containers/TransactionsRouteContainer";

export default async function TransactionPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ id?: string }> }>) {
  const { id } = await searchParams;

  return <TransactionsRouteContainer transactionId={id} />;
}
