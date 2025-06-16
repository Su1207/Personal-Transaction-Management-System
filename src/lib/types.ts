export interface User {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
}

export type Transaction = {
  id: number;
  description: string;
  amount: number;
  date: string; // or Date if you're parsing it
  type: "EXPENSE" | "INCOME";
  categoryName: string;
  categoryId: number;
};

export type TransactionData = {
  description: string;
  amount: number;
  date: string; // or Date if you're parsing it
  type: "EXPENSE" | "INCOME";
  categoryId: number;
};

export type Category = {
  id: number;
  name: string;
  type: "EXPENSE" | "INCOME";
  default: boolean;
};

export type CategoryData = {
  name: string;
  type: "EXPENSE" | "INCOME";
};

export type MonthlyReportData = {
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
};

export type YearlyReportData = {
  monthlyIncome: Record<string, number>;
  monthlyExpense: Record<string, number>;
  monthlySavings: Record<string, number>;
};

export type YearlyRawItem = {
  month: string;
  income: number;
  expense: number;
  savings: number;
};
