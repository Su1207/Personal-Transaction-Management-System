import { columns } from "./Column";
import { DataTable } from "./DataTable";
import { useEffect } from "react";
import { useTransactionStore } from "@/lib/store/transactionStore";
import { Skeleton } from "../ui/skeleton";

export default function TransactionTable() {
  const { transactions, fetchTransactions, loading } = useTransactionStore();

  useEffect(() => {
    fetchTransactions().catch((err) =>
      console.error("Error fetching transactions:", err)
    );
  }, [fetchTransactions]);
  console.log("TransactionTable data:", transactions);

  if (!transactions.length && loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return <DataTable columns={columns} data={transactions} />;
}
