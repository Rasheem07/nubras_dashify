/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, usePagination } from "react-table";

export default function Home({ params }: { params: any }) {
  const { name } = React.use(params) as { name: string };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [Downloading, setDownloading] = useState(false);
  const [dateRange, setdateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [date, setdate] = useState("");
  const pageSize = 100;

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        let url = `/api/database/get?page=${page}&pageSize=${pageSize}&name=${name}&date=${date}`;

        // Append custom date range if selected and both dates are filled
        if (date === "custom" && dateRange.start && dateRange.end) {
          url += `&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        setData(result.data); // Use the data array
        setPageCount(Math.ceil(result.totalCount / pageSize)); // Calculate pageCount using totalCount
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [name, date, dateRange] // Make sure to include dateRange in the dependency array
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData(currentPage);
    }, 1000);

    // Cleanup timeout when component unmounts or when currentPage, date, or dateRange changes
    return () => clearTimeout(timeout);
  }, [currentPage, date, dateRange, fetchData]);

  // Dynamically generate table headers based on object keys
  const headers = useMemo(() => {
    return data.length > 0 ? Object.keys(data[0]) : [];
  }, [data]);

  // react-table setup
  const columns = useMemo(
    () =>
      headers.map((header) => ({
        Header: header.charAt(0).toUpperCase() + header.slice(1),
        accessor: header,
      })),
    [headers]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      usePagination
    );

  // Handling pagination
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const DownloadData: () => Promise<void> = useCallback(async () => {
    setDownloading(true);
    try {
      let downloadUrl = `/api/database/get/download?name=${name}&date=${date}`;

      // Include custom date range parameters if selected and both dates are filled
      if (date === "custom" && dateRange.start && dateRange.end) {
        downloadUrl += `&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`;
      }

      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch data for download");
      }

      const blob = await response.blob(); // Get the response as a Blob (binary data)
      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
      const a = document.createElement("a"); // Create a temporary anchor element
      a.href = url;
      a.download = `data_${name}_${date}.xlsx`; // Set filename for the download
      a.click(); // Trigger the download
      window.URL.revokeObjectURL(url); // Clean up the Blob URL
    } catch (error) {
      console.error("Error downloading data:", error);
    } finally {
      setDownloading(false);
    }
  }, [name, date, dateRange]);

  return (
    <div className="p-6 max-h-[calc(100vh-56px)] overflow-y-scroll w-full">
      <div className="space-y-4">
        {/* Pagination Controls */}
        <div className="mt-4 flex flex-col md:flex-row justify-between md:items-center text-sm">
          <h1 className="text-2xl font-semibold mb-4">
            Table for December 2024
          </h1>
          <div className="space-x-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 text-gray-700">
              Page {currentPage} of {pageCount}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === pageCount}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
        <div className="flex items-end justify-between gap-x-6 py-2">
          <div className="flex items-center gap-x-4">
            <Select defaultValue="all" onValueChange={setdate} value={date}>
              <SelectTrigger className="w-[250px]">
                {date !== "" ? date : "Select a date range"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="year">Current year</SelectItem>
                <SelectItem value="quarter">Current quarter</SelectItem>
                <SelectItem value="month">Current month</SelectItem>
                <SelectItem value="week">Current week</SelectItem>
                <SelectItem value="custom">Custom date</SelectItem>
              </SelectContent>
            </Select>
            {date === "custom" && (
              <>
                <div className="flex gap-x-4">
                  <Input
                    type="date"
                    min="2020-01-01"
                    max={new Date().toISOString().split("T")[0]} // Max is the current date
                    onChange={(e) =>
                      setdateRange((prev) => ({
                        ...prev,
                        start: e.target.value ? new Date(e.target.value) : null,
                      }))
                    }
                    name="startDate"
                    className="max-w-max"
                  />
                  <Input
                    type="date"
                    min="2020-01-01"
                    max={new Date().toISOString().split("T")[0]} // Max is the current date
                    onChange={(e) =>
                      setdateRange((prev) => ({
                        ...prev,
                        end: e.target.value ? new Date(e.target.value) : null,
                      }))
                    }
                    name="endDate"
                    className="max-w-max"
                  />
                </div>
              </>
            )}
          </div>
          {/* Excel Export Button */}
          <div className="mt-4">
            <button
              onClick={DownloadData}
              className="px-6 py-2 min-w-32 flex gap-x-1 items-center justify-center bg-green-500 text-white rounded"
            >
              {Downloading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Exporting data
                </>
              ) : (
                <>Export to Excel</>
              )}
            </button>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto max-w-[95vw]">
          <table
            {...getTableProps()}
            className="min-w-full max-w-[90vw] border rounded-sm table-auto border-collapse"
          >
            {/* Table Header */}
            <thead className="bg-gray-200">
              {loading ? (
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 border-b text-left font-semibold text-sm text-gray-500 bg-gray-300 animate-pulse"
                    >
                      <div className="h-4 bg-gray-400 rounded w-full"></div>
                    </th>
                  ))}
                </tr>
              ) : (
                headerGroups.map((headerGroup, i) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                    {headerGroup.headers.map((column, key) => (
                      <th
                        {...column.getHeaderProps()}
                        key={key}
                        className="px-6 py-3 border-b text-left font-semibold text-sm text-gray-600 text-nowrap"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))
              )}
            </thead>

            {/* Table Body */}
            <tbody
              {...getTableBodyProps()}
              className="overflow-y-auto max-h-96 min-h-[240px]"
            >
              {loading ? (
                // Loading Skeleton Rows
                <>
                  {[...Array(pageSize)].map((_, index) => (
                    <tr key={index} className="border-b animate-pulse">
                      <td
                        colSpan={headers.length}
                        className="py-4 px-6 text-gray-400"
                      >
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id}
                      className="border-b hover:bg-gray-50"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="px-6 py-3 text-sm text-gray-700 text-center text-nowrap"
                        >
                          {(() => {
                            const value = cell.value;
                            if (!value) {
                              return <span className="text-gray-400">N/A</span>;
                            }

                            // Check if the value is a number or string that can be converted to a number (for numerical fields)
                            if (
                              typeof value === "number" ||
                              !isNaN(Number(value))
                            ) {
                              return cell.render("Cell"); // Render it as a number
                            }

                            // If the value is a valid date (not 'NEW INVOICE NUM')
                            const date = new Date(value);
                            if (!isNaN(date.getTime())) {
                              return date.toLocaleDateString("default");
                            }

                            return cell.render("Cell"); // Otherwise, render the value as it is (text or other types)
                          })()}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
