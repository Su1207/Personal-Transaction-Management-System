import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "sonner";
import { useTransactionStore } from "@/lib/store/transactionStore";
import { Skeleton } from "../ui/skeleton";
import { useAuthStore } from "@/lib/store/authStore";

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Color palettes for better visual distinction
const incomeColors = [
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#84cc16",
  "#65a30d",
  "#4d7c0f",
  "#365314",
  "#1a2e05",
];

const expenseColors = [
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#9a3412",
  "#7c2d12",
];

const formatPieChartData = (
  data: Record<string, number> | null | undefined,
  colors: string[],
  label: string
) => {
  if (!data || Object.keys(data).length === 0) {
    return {
      labels: ["No data"],
      datasets: [
        {
          label: "No data available",
          data: [1],
          backgroundColor: ["#4b5563"],
          borderColor: ["#374151"],
          borderWidth: 1,
        },
      ],
    };
  }

  const labels = Object.keys(data);
  const values = Object.values(data);

  return {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors
          .slice(0, labels.length)
          .map((color) => color + "80"),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        color: "#e5e7eb",
        font: {
          size: 11,
        },
        usePointStyle: true,
        pointStyle: "circle",
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: "rgba(31, 41, 55, 0.9)",
      titleColor: "#f9fafb",
      bodyColor: "#f9fafb",
      borderColor: "#4b5563",
      borderWidth: 1,
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
};

type monthlyProp = {
  month: number;
  year: number;
};

const MonthlyReport: React.FC<monthlyProp> = ({ month, year }) => {
  const monthData = useTransactionStore((state) => state.monthData);
  const monthLoading = useTransactionStore((state) => state.monthLoading);

  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && user && month && year) {
      useTransactionStore
        .getState()
        .fetchMonthlyAnalytics(year, month)
        .catch((error) => {
          console.error("Error fetching monthly analytics:", error);
          toast.error("Failed to load monthly report data.");
        });
    }
  }, [month, year, hasHydrated, user]);

  const getMonthName = (monthNum: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNum - 1] || monthNum;
  };

  const incomeChartData = formatPieChartData(
    monthData.incomeByCategory,
    incomeColors,
    "Income"
  );
  const expenseChartData = formatPieChartData(
    monthData.expenseByCategory,
    expenseColors,
    "Expenses"
  );

  if (monthLoading) {
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

  if (!monthData) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg">
        <p className="text-red-400">No report data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Monthly Report - {getMonthName(month)} {year}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-green-500/20">
          <h3 className="text-green-400 text-sm font-medium">Total Income</h3>
          <p className="text-white text-xl font-semibold">
            ₹{monthData.totalIncome?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-red-500/20">
          <h3 className="text-red-400 text-sm font-medium">Total Expenses</h3>
          <p className="text-white text-xl font-semibold">
            ₹{monthData.totalExpense?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-blue-500/20">
          <h3 className="text-blue-400 text-sm font-medium">Net Savings</h3>
          <p
            className={`text-xl font-semibold ${
              monthData.netSavings >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            ₹{monthData.netSavings?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Income by Category
          </h3>
          <div style={{ height: "300px" }}>
            <Pie data={incomeChartData} options={chartOptions} />
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Expenses by Category
          </h3>
          <div style={{ height: "300px" }}>
            <Pie data={expenseChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Category Breakdown Tables */}
      {monthData.incomeByCategory &&
        Object.keys(monthData.incomeByCategory).length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Income Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(monthData.incomeByCategory).map(
                ([category, amount], index) => (
                  <div
                    key={category}
                    className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            incomeColors[index % incomeColors.length],
                        }}
                      ></div>
                      <span className="text-gray-300 text-sm">{category}</span>
                    </div>
                    <span className="text-green-400 font-medium">
                      ₹{amount.toLocaleString()}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {monthData.expenseByCategory &&
        Object.keys(monthData.expenseByCategory).length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Expense Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(monthData.expenseByCategory).map(
                ([category, amount], index) => (
                  <div
                    key={category}
                    className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            expenseColors[index % expenseColors.length],
                        }}
                      ></div>
                      <span className="text-gray-300 text-sm">{category}</span>
                    </div>
                    <span className="text-red-400 font-medium">
                      ₹{amount.toLocaleString()}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default MonthlyReport;
