import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTable } from "react-table";
import * as XLSX from "xlsx"; // Import the xlsx library
import { Button } from "@/components/ui/button";

// Data structure for sample input
interface DataRow {
  [key: string]: string | number; // Allow any key-value pair
}

const Table = ({ data }: { data: DataRow[] }) => {
  // Dynamically generate columns from the keys of the first data object
  const columns = React.useMemo(
    () =>
      data.length > 0
        ? Object.keys(data[0]).map((key) => ({
            Header: key,
            accessor: key,
          }))
        : [],
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const getCellStyle = (value: string) => {
    // Apply background color based on cell value
    if (value === "OLD ORDER PAYMENT") {
      return "bg-red-300"; // Light red
    } else if (value === "NEW ORDER PAYMENT") {
      return "bg-teal-300"; // Light teal
    }
    return ""; // No specific style for other values
  };

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="min-w-full border shadow-sm"
        style={{
          tableLayout: "fixed", // Fix column widths
        }}
      >
        <thead className="bg-gray-300">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={Math.random()}
                  className="text-xs font-medium py-2 px-1 bg-gray-200 text-center border border-gray-300"
                  style={{
                    width: `${100 / columns.length}%`, // Distribute column widths equally
                    whiteSpace: "nowrap", // Prevent wrapping
                  }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={Math.random()}
                className={`${
                  rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-50`}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    key={Math.random()}
                    className={`text-xs py-1.5 px-1 text-center border border-gray-200 ${
                      getCellStyle(cell.value as string) // Apply the dynamic style here
                    }`}
                    style={{
                      whiteSpace: "nowrap", // Prevent wrapping
                      overflow: "hidden", // Hide overflowing text
                      textOverflow: "ellipsis", // Show ellipsis if text overflows
                    }}
                  >
                    {cell.value == null || cell.value === "" ? "-" : cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SalesTable = ({ data, className, name="Sales Data Table", description="Sales data for the selected period" }: { data: any[]; className?: string, name?: string; description?: string}) => {
  // Export function for Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data); // Convert data to worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sales Data"); // Append the worksheet to the workbook
    XLSX.writeFile(wb, "sales_data.xlsx"); // Trigger download as Excel file
  };

  return (
    <div className={cn("", className)}>
      <Card className="shadow-sm border border-gray-200  rounded-lg overflow-hidden">
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <div>

          <CardTitle  className="max-w-max font-bold text-teal-700">{name}</CardTitle>
          <CardDescription >{description}</CardDescription>
          </div>
          <Button
            onClick={exportToExcel}
            size={"sm"}
            className="px-6 py-2 max-w-max bg-teal-500 text-white hover:bg-teal-600"
          >
            Export Data
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <Table data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTable;
