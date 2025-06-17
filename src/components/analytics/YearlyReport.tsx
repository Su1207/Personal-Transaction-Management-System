import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "sonner";
import { useTransactionStore } from "@/lib/store/transactionStore";
import { YearlyReportData } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { useAuthStore } from "@/lib/store/authStore";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatYearlyChartData = (data: YearlyReportData) => {
  return {
    labels: monthOrder,
    datasets: [
      {
        label: "Income",
        data: monthOrder.map((month) => data.monthlyIncome[month] ?? 0),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: false,
        tension: 0, // Changed from 0.4 to 0 for straight lines
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: "Expense",
        data: monthOrder.map((month) => data.monthlyExpense[month] ?? 0),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: false,
        tension: 0, // Changed from 0.4 to 0 for straight lines
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: "Net Savings",
        data: monthOrder.map((month) => data.monthlySavings[month] ?? 0),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: false,
        tension: 0, // Changed from 0.4 to 0 for straight lines
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow custom height
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#e5e7eb", // Light gray for dark theme
        font: {
          size: 12,
        },
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    tooltip: {
      backgroundColor: "rgba(31, 41, 55, 0.9)",
      titleColor: "#f9fafb",
      bodyColor: "#f9fafb",
      borderColor: "#4b5563",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(75, 85, 99, 0.3)",
        drawBorder: false,
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: "rgba(75, 85, 99, 0.3)",
        drawBorder: false,
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
        callback: function (value: any) {
          return "₹" + value.toLocaleString();
        },
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
};

type YearProp = {
  year: number;
};

const YearlyReport: React.FC<YearProp> = ({ year }) => {
  const yearData = useTransactionStore((state) => state.yearData);
  const yearLoading = useTransactionStore((state) => state.yearLoading);
  const [reportData, setReportData] = useState<YearlyReportData>({
    monthlyIncome: {},
    monthlyExpense: {},
    monthlySavings: {},
  });

  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (user && hasHydrated) {
      useTransactionStore
        .getState()
        .fetchYearlyAnalytics(year)
        .catch((error) => {
          console.error("Error fetching yearly analytics:", error);
          toast.error("Failed to load yearly report data");
        });
    }
  }, [year, user, hasHydrated]);

  useEffect(() => {
    if (yearData) {
      // Transform raw array into structured format
      const monthlyIncome: Record<string, number> = {};
      const monthlyExpense: Record<string, number> = {};
      const monthlySavings: Record<string, number> = {};

      yearData.forEach((entry: any) => {
        monthlyIncome[entry.month] = entry.income ?? 0;
        monthlyExpense[entry.month] = entry.expense ?? 0;
        monthlySavings[entry.month] = entry.savings ?? 0;
      });
      setReportData({
        monthlyIncome,
        monthlyExpense,
        monthlySavings,
      });
    }
  }, [yearData]);

  if (yearLoading)
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );

  if (!yearData)
    return (
      <div className="p-6 bg-gray-900 rounded-lg">
        <p className="text-red-400">No yearly report data found.</p>
      </div>
    );

  const chartData = formatYearlyChartData(reportData);

  return (
    <div className="p-6 bg-gray-900 rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        Yearly Financial Report - {year}
      </h2>

      {/* Chart container with controlled height */}
      <div className="bg-gray-800 p-4 rounded-lg" style={{ height: "400px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-green-500/20">
          <h3 className="text-green-400 text-sm font-medium">Total Income</h3>
          <p className="text-white text-xl font-semibold">
            ₹
            {Object.values(reportData.monthlyIncome)
              .reduce((a, b) => a + b, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-red-500/20">
          <h3 className="text-red-400 text-sm font-medium">Total Expenses</h3>
          <p className="text-white text-xl font-semibold">
            ₹
            {Object.values(reportData.monthlyExpense)
              .reduce((a, b) => a + b, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-blue-500/20">
          <h3 className="text-blue-400 text-sm font-medium">Total Savings</h3>
          <p className="text-white text-xl font-semibold">
            ₹
            {Object.values(reportData.monthlySavings)
              .reduce((a, b) => a + b, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YearlyReport;
