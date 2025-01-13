"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, usePagination } from "react-table";

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch data from the API
  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/database/get?page=${page}&pageSize=${pageSize}`
      );
      const result = await response.json();

      setData(result.data); // Use the data array
      setPageCount(Math.ceil(result.totalCount / pageSize)); // Calculate pageCount using totalCount
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch and when currentPage changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, fetchData]);

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

  return (
    <div className="p-2">
      <div className="overflow-x-auto max-w-[95vw]">
        <table
          {...getTableProps()}
          className="min-w-full max-w-[90vw] border rounded-sm table-auto border-collapse"
        >
          {/* Table Header */}
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup, i) => (
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
            ))}
          </thead>

          {/* Table Body */}
          <tbody
            {...getTableBodyProps()}
            className="overflow-y-auto max-h-96" // Add scroll behavior to the table body
          >
            {loading ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-4 text-gray-500"
                >
                  Loading...
                </td>
              </tr>
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
                        {cell.value ? (
                          cell.render("Cell")
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center text-sm max-w-max">
        <h1 className="text-2xl font-semibold mb-2">Table for</h1>
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
    </div>
  );
};

export default Table;
