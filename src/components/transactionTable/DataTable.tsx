import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "../dialogButton/DeleteDialog";
import UpdateDialog from "../dialogButton/UpdateDialog";
import { Transaction } from "@/lib/types";

interface DataTableProps<TData extends Transaction, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  showActions?: boolean;
}

export function DataTable<TData extends Transaction, TValue>({
  columns,
  data,
  showActions = true,
}: DataTableProps<TData, TValue>) {
  const actionsColumn: ColumnDef<TData, TValue> = {
    id: "actions",
    header: ({}) => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      const rowData = row.original;
      const transactionId = rowData?.id as number;
      console.log(rowData);
      const transactionData = {
        description: rowData.description,
        amount: rowData.amount,
        type: rowData.type,
        categoryId: rowData.categoryId,
        date: rowData.date,
      };

      return (
        <div className="flex items-center justify-center gap-2">
          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <UpdateDialog
              transactionId={transactionId}
              transactionData={transactionData}
            />
            <DeleteDialog transactionId={transactionId} />
          </div>

          {/* Mobile dropdown */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-800 border-gray-700"
              >
                <div className="px-0 py-0">
                  <DeleteDialog transactionId={transactionId} />
                  <UpdateDialog
                    transactionId={transactionId}
                    transactionData={transactionData}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );
    },
  };

  // Add actions column to the columns array if showActions is true
  const enhancedColumns = showActions ? [...columns, actionsColumn] : columns;

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {/* Table Container */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 shadow-lg overflow-hidden">
        <Table className="min-w-full overflow-scroll">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-700 hover:bg-gray-700/50"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-gray-300 font-semibold bg-gray-900/50 px-4 py-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    border-b border-gray-700 hover:bg-gray-700/30 transition-colors
                    ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-850"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-gray-300 px-4 py-3"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-gray-700/30">
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="h-24 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-4xl">📋</div>
                    <div className="text-lg font-medium">No data available</div>
                    <div className="text-sm text-gray-500">
                      There are no records to display at the moment.
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer with row count */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700 rounded-b-lg">
          <div className="text-sm text-gray-400">
            Showing {table.getRowModel().rows.length} of {data.length} row(s)
          </div>
          <div className="text-sm text-gray-400">
            Total: {data.length} record{data.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
