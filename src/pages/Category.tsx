import { useEffect, useState } from "react";
import { Edit, Trash2, MoreHorizontal, Plus, Shield } from "lucide-react";
import type { Category } from "@/lib/types";
import { getCategories } from "@/services/api";
import { toast } from "sonner";
import { useCategoryStore } from "@/lib/store/categoryStore";
import { CategoryDialog } from "@/components/dialogButton/CategoryDialog";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/lib/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";

const Category = () => {
  const categories = useCategoryStore((state) => state.categories);
  const loading = useCategoryStore((state) => state.loading);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      useCategoryStore
        .getState()
        .fetchCategories()
        .catch((error) => {
          console.error("Error fetching categories:", error);
          toast.error("Failed to load categories");
        });
    }
  }, [user]);

  const handleUpdate = (category: Category) => {
    console.log("Update category:", category);
    // Add your update logic here
  };

  const handleDelete = (category: Category) => {
    console.log("Delete category:", category);
  };

  const renderTypeCell = (type: string | null) => {
    if (!type) {
      return (
        <div className="text-center">
          <span className="text-gray-500 italic">No Type</span>
        </div>
      );
    }
    return (
      <div className="text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            type === "INCOME"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {type}
        </span>
      </div>
    );
  };

  const renderStatusCell = (isDefault: boolean) => {
    return (
      <div className="text-center">
        {isDefault ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-blue-500 text-blue-400 bg-blue-500/10">
            <Shield className="h-3 w-3 mr-1" />
            Default
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-500 text-gray-400">
            Custom
          </span>
        )}
      </div>
    );
  };

  const renderActionsCell = (category: Category) => {
    const canModify = !category.default;

    if (loading) {
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

    if (!canModify) {
      return (
        <div className="text-center">
          <span className="text-gray-500 text-sm">Protected</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">
        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleUpdate(category)}
            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white hover:text-white rounded text-sm flex items-center gap-1 transition-colors"
          >
            <Edit className="h-3 w-3" />
            Edit
          </button>

          <button
            onClick={() => handleDelete(category)}
            className="h-8 px-3 bg-red-600 hover:bg-red-700 border border-red-600 text-white hover:text-white rounded text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className="sm:hidden relative">
          <button className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                handleUpdate(category);
              }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => {
                handleDelete(category);
              }}
              className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex md:flex-row flex-col items-center md:gap-0 gap-6 md:justify-between  mb-6">
            <div className="md:text-left text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
              <p className="text-gray-400">
                Manage your income and expense categories. Default categories
                are protected and cannot be modified.
              </p>
            </div>
            <CategoryDialog />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {categories.length}
              </div>
              <div className="text-gray-400 text-sm">Total Categories</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {categories.filter((cat) => cat.type === "INCOME").length}
              </div>
              <div className="text-gray-400 text-sm">Income Categories</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-red-400">
                {categories.filter((cat) => cat.type === "EXPENSE").length}
              </div>
              <div className="text-gray-400 text-sm">Expense Categories</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">
                {categories.filter((cat) => !cat.default).length}
              </div>
              <div className="text-gray-400 text-sm">Custom Categories</div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800 shadow-lg overflow-hidden">
            <table className="min-w-full overflow-scroll">
              <thead>
                <tr className="border-b border-gray-700 hover:bg-gray-700/50">
                  <th className="text-gray-300 font-semibold bg-gray-900/50 px-4 py-3 text-center">
                    ID
                  </th>
                  <th className="text-gray-300 font-semibold bg-gray-900/50 px-4 py-3 text-left">
                    Category Name
                  </th>
                  <th className="text-gray-300 font-semibold bg-gray-900/50 px-4 py-3 text-center">
                    Type
                  </th>
                  <th className="text-gray-300 font-semibold bg-gray-900/50 px-4 py-3 text-center">
                    Status
                  </th>
                  <th className="text-gray-300 font-semibold bg-gray-900/50 px-4 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className={`
                      border-b border-gray-700 hover:bg-gray-700/30 transition-colors
                      ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-850"}
                    `}
                    >
                      <td className="text-gray-300 px-4 py-3 text-center font-medium">
                        {category.id}
                      </td>
                      <td className="text-gray-300 px-4 py-3">
                        <div className="font-medium">
                          {category.name || (
                            <span className="text-gray-500 italic">
                              Unnamed Category
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-gray-300 px-4 py-3">
                        {renderTypeCell(category.type)}
                      </td>
                      <td className="text-gray-300 px-4 py-3">
                        {renderStatusCell(category.default)}
                      </td>
                      <td className="text-gray-300 px-4 py-3">
                        {renderActionsCell(category)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-gray-700/30">
                    <td colSpan={5} className="h-24 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-4xl">📂</div>
                        <div className="text-lg font-medium">
                          No categories found
                        </div>
                        <div className="text-sm text-gray-500">
                          Create your first category to get started.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {categories.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700 rounded-b-lg">
              <div className="text-sm text-gray-400">
                Showing {categories.length} of {categories.length} categories
              </div>
              <div className="text-sm text-gray-400">
                {categories.filter((cat) => !cat.default).length} editable,{" "}
                {categories.filter((cat) => cat.default).length} protected
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Category;
