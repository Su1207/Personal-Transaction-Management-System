import { create } from "zustand";
import {
  createTransaction,
  getMonthlyAnalytics,
  getTransactions,
  getYearlyAnalytics,
} from "@/services/api";
import {
  MonthlyReportData,
  Transaction,
  TransactionData,
  YearlyRawItem,
} from "../types";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

type TransactionStore = {
  transactions: Transaction[];
  loading: boolean;
  yearLoading: boolean;
  monthLoading: boolean;
  monthData: MonthlyReportData;
  yearData: YearlyRawItem[];
  fetchTransactions: () => Promise<void>;
  addTransaction: (data: TransactionData) => Promise<void>;
  fetchMonthlyAnalytics: (year: number, month: number) => Promise<void>;
  fetchYearlyAnalytics: (year: number) => Promise<void>;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  monthData: {
    incomeByCategory: {},
    expenseByCategory: {},
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
  },
  yearData: [],
  loading: true,
  yearLoading: false,
  monthLoading: false,
  fetchTransactions: async () => {
    set({ loading: true });
    try {
      const data = await getTransactions();
      set({ transactions: data, loading: false });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ loading: false });
    }
  },

  addTransaction: async (data: TransactionData) => {
    await createTransaction(data);
    const res = await getTransactions(); // re-fetch
    const monthData = await getMonthlyAnalytics(currentYear, currentMonth);
    const yearData = await getYearlyAnalytics(currentYear);
    set({ transactions: res, monthData, yearData, loading: false });
  },

  fetchMonthlyAnalytics: async (year, month) => {
    try {
      set({ monthLoading: true });
      const data: MonthlyReportData = await getMonthlyAnalytics(year, month);
      set({ monthData: data, monthLoading: false });
    } catch (error) {
      console.error("Error fetching monthly analytics:", error);
      set({ monthLoading: false });
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  },
  fetchYearlyAnalytics: async (year) => {
    try {
      set({ yearLoading: true });
      const data = await getYearlyAnalytics(year);
      // Transform raw array into structured format

      set({ yearData: data, yearLoading: false });
    } catch (error) {
      console.error("Error fetching yearly analytics:", error);
      set({ yearLoading: false });
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  },
}));
