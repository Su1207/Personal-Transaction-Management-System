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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TransactionType } from "./DialogButton";
import { toast } from "sonner";
import { updateTransaction } from "@/services/api";
import { TransactionData } from "@/lib/types";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { useTransactionStore } from "@/lib/store/transactionStore";

type TransactionUpdateProps = {
  transactionId: number;
  transactionData: TransactionData;
};

const UpdateDialog: React.FC<TransactionUpdateProps> = ({
  transactionId,
  transactionData,
}) => {
  const [type, setType] = useState<TransactionType>(transactionData?.type);
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    transactionData?.categoryId
  );
  const { categories, fetchCategories } = useCategoryStore();
  const { fetchTransactions, fetchMonthlyAnalytics, fetchYearlyAnalytics } =
    useTransactionStore();

  const currentMonth = new Date().getFullYear();
  const currentYear = new Date().getMonth() + 1;

  useEffect(() => {
    fetchCategories().catch((error) => {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    });
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!selectedCategoryId) {
      toast.error("No category selected");
      return;
    }
    const payload = {
      description: (formData.get("description") as string) || "",
      amount: parseFloat(formData.get("amount") as string),
      date: new Date(formData.get("date") as string).toISOString(),
      type,
      categoryId: selectedCategoryId,
    };
    try {
      await updateTransaction(transactionId, payload);
      toast.success("Transaction updated successfully");
      await fetchTransactions();
      await fetchMonthlyAnalytics(currentYear, currentMonth);
      await fetchYearlyAnalytics(currentYear);
      setOpen(false);
    } catch (error) {
      console.error("Transaction update error:", error);
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="m-0 grid" onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Fill all the required details here. Click update when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Short description"
              defaultValue={transactionData.description}
              required
            />
          </div>

          <div className="grid">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={transactionData.amount.toString()}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="grid">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              required
              defaultValue={transactionData?.date}
            />
          </div>

          <div className="grid">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(val: TransactionType) => {
                setType(val);
                setSelectedCategoryId(transactionData?.categoryId);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid">
            <Label>Category</Label>
            <Select
              value={selectedCategoryId?.toString() || ""}
              onValueChange={(val) => setSelectedCategoryId(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
