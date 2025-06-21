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
import { Category } from "@/lib/types";
import { updateCategory } from "@/services/api";

type TransactionType = "INCOME" | "EXPENSE";

type CategoryDialogProps = {
  categoryData?: Category;
};

export function CategoryDialog({ categoryData }: CategoryDialogProps) {
  const [type, setType] = useState<TransactionType>(
    categoryData ? categoryData.type : "EXPENSE"
  );
  const [open, setOpen] = useState(false);

  const { addCategory, fetchCategories } = useCategoryStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: (formData.get("name") as string)!,
      type,
    };

    try {
      if (categoryData) {
        const res = await updateCategory(categoryData.id, payload);
        if (!res.success) {
          toast.error("Failed to update category");
          return;
        }
        await fetchCategories();
        toast.success("Category updated successfully");
      } else {
        await addCategory(payload);
        toast.success("Category created successfully");
      }
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
          {categoryData ? "Update" : "Create Category"}
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
            <Input
              id="name"
              name="name"
              placeholder="Category Name"
              required
              defaultValue={categoryData?.name}
            />
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
