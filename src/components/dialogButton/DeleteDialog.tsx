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
import { deleteTransaction } from "@/services/api";
import { useTransactionStore } from "@/lib/store/transactionStore";

interface DeleteDialogProps {
  transactionId: number;
}

const DeleteDialog = ({ transactionId }: DeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const { fetchTransactions, fetchMonthlyAnalytics, fetchYearlyAnalytics } =
    useTransactionStore();
  const handleDelete = async (transactionId: number) => {
    try {
      const res = await deleteTransaction(transactionId);
      if (!res.success) {
        toast.error(res.message || "Failed to delete item");
        return;
      }
      await fetchTransactions();
      await fetchMonthlyAnalytics(currentYear, currentMonth);
      await fetchYearlyAnalytics(currentYear);
      setOpen(false);
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
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
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleDelete(transactionId);
              console.log("Item deleted");
              setOpen(false);
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
