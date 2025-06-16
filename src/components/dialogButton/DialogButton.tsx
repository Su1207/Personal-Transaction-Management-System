import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types";
import { getCategories } from "@/services/api";
import { toast } from "sonner";
import { useTransactionStore } from "@/lib/store/transactionStore";
import { useCategoryStore } from "@/lib/store/categoryStore";

type TransactionType = "INCOME" | "EXPENSE";

export function DialogButton() {
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

  const { addTransaction } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories().catch((error) => {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    });
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) => cat.type === type);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!selectedCategoryId) {
      toast.error("Please select a category");
      //   console.error("No category selected");
      return;
    }

    const payload = {
      description: (formData.get("description") as string) || "",
      amount: parseFloat(formData.get("amount") as string),
      type,
      categoryId: selectedCategoryId!,
      date: new Date(formData.get("date") as string).toISOString(),
    };

    try {
      await addTransaction(payload);
      toast.success("Transaction created successfully");
      setOpen(false);
      setSelectedCategoryId(undefined);
    } catch (error) {
      console.error("Transaction creation error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="bg-gray-800">
          Create Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="m-0 grid" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Fill all the required details here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Short description"
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
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="grid">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="datetime-local" required />
          </div>

          <div className="grid">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(val: TransactionType) => {
                setType(val);
                setSelectedCategoryId(undefined); // Reset category when type changes
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
}
