import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import { useTable } from "react-table";

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
            Header: key, // Header is the key of the object
            accessor: key, // Key to access the data for that column
          }))
        : [],
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table
      {...getTableProps()}
      className="min-w-full border shadow-sm overflow-hidden max-h-[250px] overflow-y-auto"
    >
      <thead className="bg-gray-300">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                key={column.id}
                className="px-6 py-3 text-center text-sm font-semibold bg-gray-200"
                style={{
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f7fafc", // Light gray background for headers
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
              key={row.id}
              className={`hover:bg-gray-50 ${rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
            >
              {row.cells.map((cell) => (
                <td
                  {...cell.getCellProps()}
                  key={cell.column.id}
                  className="px-6 py-3 text-sm text-center text-gray-600"
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "white",
                  }}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SalesTable = ({ data , className}: { data: any[] ; className?: string}) => {
  return (
    <div className={cn("max-h-[250px]", className)}>

    <Card className="shadow-sm border border-gray-200 min-h-[365px] rounded-lg overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle>Sales Data Table</CardTitle>
        <CardDescription>Sales data for the selected period</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <Table data={data} />
      </CardContent>
    </Card>
    </div>
  );
};

export default SalesTable;
