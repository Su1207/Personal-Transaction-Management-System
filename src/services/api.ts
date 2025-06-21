import {
  Category,
  CategoryData,
  Transaction,
  TransactionData,
} from "@/lib/types";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:8081/api";

export const getTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions`, {
      withCredentials: true,
    });
    return response.data as Transaction[];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const createTransaction = async (transaction: TransactionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/transactions`, transaction, {
      withCredentials: true,
    });
    if (response?.data && (response.data as Transaction)) {
      return { success: true, transaction: response.data as Transaction };
    }
    return { success: false, transaction: null };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const updateTransaction = async (
  id: number,
  transaction: TransactionData
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/transactions/${id}`,
      transaction,
      {
        withCredentials: true,
      }
    );

    if (response?.data && (response.data as Transaction)) {
      return { success: true, transaction: response.data as Transaction };
    }
    return { success: false, transaction: null };
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update transaction"
    );
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/transactions/${id}`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      return { success: true, message: "Transaction deleted successfully" };
    }
    return { success: false, message: "Failed to delete transaction" };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete transaction"
    );
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      withCredentials: true,
    });
    return response.data as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategories = async (category: CategoryData) => {
  try {
    const response = await axios.post(`${BASE_URL}/categories`, category, {
      withCredentials: true,
    });

    if (response?.data && (response.data as Category)) {
      return { success: true, category: response.data as Category };
    }
    return { success: false, category: null };
  } catch (error: any) {
    console.error("Error fetching categories:", error);

    // Check if server sent an error message
    const errorMessage =
      error.response?.data || "Something went wrong while creating category.";

    throw new Error(errorMessage);
  }
};

export const getMonthlyAnalytics = async (year: number, month: number) => {
  const res = await axios.get(
    `${BASE_URL}/transactions/analytics/monthly?month=${month}&year=${year}`,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const getYearlyAnalytics = async (year: number) => {
  const res = await axios.get(
    `${BASE_URL}/transactions/analytics/yearly?year=${year}`,
    {
      withCredentials: true,
      params: { year },
    }
  );
  return res.data;
};
