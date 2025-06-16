import { Transaction } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="font-medium text-gray-300">
          {date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-gray-300 font-medium">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({}) => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.original.type;

      return (
        <div
          className={`font-semibold text-center ${
            type === "INCOME" ? "text-green-400" : "text-red-400"
          }`}
        >
          {type === "INCOME" ? "+" : "-"}₹
          {amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({}) => <div className="text-center">Type</div>,
    cell: ({ row }) => {
      const type = row.getValue("type") as Transaction["type"];
      return (
        <div className="flex justify-center">
          <span
            className={`text-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              type === "INCOME"
                ? "bg-green-900/20 text-green-400 border-green-800"
                : "bg-red-900/20 text-red-400 border-red-800"
            }`}
          >
            {type === "INCOME" ? "Income" : "Expense"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: ({}) => <div className="text-center">Category</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/20 text-blue-400 border border-blue-800">
          {row.getValue("categoryName")}
        </span>
      </div>
    ),
  },
];
