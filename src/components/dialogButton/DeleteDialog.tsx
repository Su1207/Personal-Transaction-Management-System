import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteCategory, deleteTransaction } from "@/services/api";
import { useTransactionStore } from "@/lib/store/transactionStore";
import { useCategoryStore } from "@/lib/store/categoryStore";

interface DeleteDialogProps {
  id: number;
  type: "category" | "transaction";
}

const DeleteDialog = ({ id, type }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const { fetchTransactions, fetchMonthlyAnalytics, fetchYearlyAnalytics } =
    useTransactionStore();
  const { fetchCategories } = useCategoryStore();
  const handleDelete = async (id: number) => {
    try {
      if (type === "transaction") {
        const res = await deleteTransaction(id);
        if (!res.success) {
          toast.error(res.message || "Failed to delete item");
          return;
        }
        await fetchTransactions();
        await fetchMonthlyAnalytics(currentYear, currentMonth);
        await fetchYearlyAnalytics(currentYear);
        toast.success("Transaction deleted successfully");
      } else if (type === "category") {
        console.log("Deleting category with ID:", id);
        const res = await deleteCategory(id);
        if (!res.success) {
          toast.error(res.message || "Failed to delete category");
          return;
        }
        await fetchCategories();
        toast.success("Category deleted successfully");
      }
      setOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error((error as any)?.response?.data || "Failed to delete item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this
            {type === "category" ? "category" : "transaction"}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleDelete(id);
            }}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
