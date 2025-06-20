import { columns } from "./Column";
import { DataTable } from "./DataTable";
import { useEffect } from "react";
import { useTransactionStore } from "@/lib/store/transactionStore";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/authStore";

export default function TransactionTable() {
  const transactions = useTransactionStore((state) => state.transactions);
  const loading = useTransactionStore((state) => state.loading);

  const { user, hasHydrated, isInitializing } = useAuthStore();

  useEffect(() => {
    if (user && hasHydrated && !isInitializing) {
      useTransactionStore
        .getState()
        .fetchTransactions()
        .catch((err) =>
          toast.error("Error fetching transactions: " + err.message)
        );
    }
  }, [user, hasHydrated, isInitializing]);

  console.log("TransactionTable data:", transactions);

  if (isInitializing || loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-600" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return <DataTable columns={columns} data={transactions} />;
}
