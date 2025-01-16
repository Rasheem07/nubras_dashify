/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState(""); // Category selection
  const [selectedLocation, setSelectedLocation] = useState(""); // Location selection
  const [salesPerson, setsalesPerson] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderPaymentStatus, setorderPaymentStatus] = useState("");

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        let url = `/api/database/get?page=${page}&pageSize=${pageSize}&name=${name}&date=${date}`;

        // Append custom date range if selected and both dates are filled
        if (date === "custom" && dateRange.start && dateRange.end) {
          url += `&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`;
        }

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: selectedCategory,
            location: selectedLocation,
            orderStatus: orderStatus,
            orderPaymentStatus: orderPaymentStatus,
            salesPerson: salesPerson,
          }),
        });
        const result = await response.json();

        setData(result.data); // Use the data array
        setPageCount(Math.ceil(result.totalCount / pageSize)); // Calculate pageCount using totalCount
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      name,
      date,
      dateRange,
      selectedCategory,
      selectedLocation,
      orderStatus,
      orderPaymentStatus,
      salesPerson,
    ] // Make sure to include dateRange in the dependency array
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

      const response = await fetch(downloadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          location: selectedLocation,
          orderStatus: orderStatus,
          orderPaymentStatus: orderPaymentStatus,
          salesPerson: salesPerson,
        }),
      });

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
  }, [
    name,
    date,
    dateRange,
    selectedCategory,
    selectedLocation,
    orderStatus,
    orderPaymentStatus,
    salesPerson,
  ]);

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
        <div className="flex flex-col space-y-4 gap-x-6 py-2">
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            <div className="flex items-center flex-wrap gap-2 w-full">
              <Select defaultValue="all" onValueChange={setdate} value={date}>
                <SelectTrigger className="w-[160px]">
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
                          start: e.target.value
                            ? new Date(e.target.value)
                            : null,
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
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="h-full bg-white max-w-max">
                  {selectedCategory || "Select Category"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NUBRAS GENTS KANDORA SECTION">
                    NUBRAS GENTS KANDORA SECTION
                  </SelectItem>
                  <SelectItem value="NUBRAS JUNIOR KID'S SECTION">
                    NUBRAS JUNIOR KID&apos;S SECTION
                  </SelectItem>
                  <SelectItem value="NUBRAS GENTS ITEM'S SECTION">
                    NUBRAS GENTS ITEM&apos;S SECTION
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedLocation}
                onValueChange={(value) => setSelectedLocation(value)}
              >
                <SelectTrigger className="h-full bg-white max-w-max">
                  {selectedLocation || "select a location"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABU DHABI">ABU DHABI</SelectItem>
                  <SelectItem value="PICKUP BY SHOP">PICKUP BY SHOP</SelectItem>
                  <SelectItem value="SHARJAH">SHARJAH</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={salesPerson}
                onValueChange={(value) => setsalesPerson(value)}
              >
                <SelectTrigger className="h-full bg-white max-w-max">
                  {salesPerson || "Select sales person"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADEEL">ADEEL</SelectItem>
                  <SelectItem value="EHSAN">EHSAN</SelectItem>
                  <SelectItem value="AZAD">AZAD</SelectItem>
                  <SelectItem value="M EHSAN">M EHSAN</SelectItem>
                  <SelectItem value="NASR">NASR</SelectItem>
                  <SelectItem value="MOHMOUD">MOHMOUD</SelectItem>
                  <SelectItem value="NAUSHAD">NAUSHAD</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={orderStatus}
                onValueChange={(value) => setOrderStatus(value)}
              >
                <SelectTrigger className="h-full bg-white max-w-max">
                  {orderStatus || "Select order status"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={orderPaymentStatus}
                onValueChange={(value) => setorderPaymentStatus(value)}
              >
                <SelectTrigger className="h-full bg-white max-w-max">
                  {orderPaymentStatus || "Select order payment status"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO PAYMENT">NO PAYMENT</SelectItem>
                  <SelectItem value="PARTIAL PAYMENT">ADVANCE PAID</SelectItem>
                  <SelectItem value="FULL PAYMENT">FULL PAID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end w-full">
              <Button
                onClick={DownloadData}
                className="bg-teal-500 hover:bg-teal-600 float-right"
              >
                {Downloading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Exporting data
                  </>
                ) : (
                  <>Export to Excel</>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t pt-2 flex-wrap">
            {date && (
              <Button
                onClick={() => setdate("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2 bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Selected period: {date} <X />
              </Button>
            )}
            {selectedCategory && (
              <Button
                onClick={() => setSelectedCategory("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2  bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Category filter: {selectedCategory} <X />
              </Button>
            )}
            {selectedLocation && (
              <Button
                onClick={() => setSelectedLocation("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2  bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Location filter: {selectedLocation} <X />
              </Button>
            )}
            {salesPerson && (
              <Button
                onClick={() => setsalesPerson("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2  bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Sales person filter: {salesPerson} <X />
              </Button>
            )}
            {orderStatus && (
              <Button
                onClick={() => setOrderStatus("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2  bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Order status filter: {orderStatus} <X />
              </Button>
            )}
            {orderPaymentStatus && (
              <Button
                onClick={() => setorderPaymentStatus("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2  bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Order payment status filter: {orderPaymentStatus} <X />
              </Button>
            )}
          </div>
          {/* Excel Export Button */}
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
