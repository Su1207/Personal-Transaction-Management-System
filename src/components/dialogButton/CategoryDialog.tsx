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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCategoryStore } from "@/lib/store/categoryStore";

type TransactionType = "INCOME" | "EXPENSE";

export function CategoryDialog() {
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [open, setOpen] = useState(false);

  const { addCategory } = useCategoryStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: (formData.get("name") as string)!,
      type,
    };

    try {
      await addCategory(payload);
      toast.success("Category created successfully");
      setOpen(false);
    } catch (error) {
      console.error("Category creation error:", error);
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="bg-gray-800">
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="m-0 grid" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
            <DialogDescription>
              Fill all the required details here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid">
            <Label htmlFor="description">Category Name</Label>
            <Input id="name" name="name" placeholder="Category Name" required />
          </div>

          <div className="grid">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(val: TransactionType) => {
                setType(val);
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

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
