import { create } from "zustand";
import { Category, CategoryData } from "../types";
import { createCategories, getCategories } from "@/services/api";

type CategoryStore = {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: CategoryData) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: true,
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await getCategories();
      set({ categories: response, loading: false });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ loading: false });
    }
  },
  addCategory: async (category) => {
    try {
      const response = await createCategories(category);
      if (!response.success || !response.category) {
        throw new Error("Failed to create category");
      }
      set((state) => ({
        categories: [...state.categories, response.category],
      }));
    } catch (error) {
      console.error("Error adding category:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  },
}));
