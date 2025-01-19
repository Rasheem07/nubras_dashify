"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams from Next.js
import SalesTable from "@/app/dashboards/_components/salesTable";
import salesData from "./_data/monthlyData";
import quarterlySalesData from "./_data/quarterlySalesData";
import halfYearlySalesData from "./_data/halfYearlySalesData";
import yearlySalesData from "./_data/yearlySalesData";
import MonthlySalesChart from "./_components/monthlyChart";
import QuarterlySalesChart from "./_components/quarterlyChart";
import HalfYearlySalesChart from "./_components/halfChart";
import YearlySalesChart from "./_components/yearlyChart";
import Image from "next/image";

export default function Dashboard() {
  const searchParams = useSearchParams(); // Get the search params from URL
  const [yearSelected, setYearSelected] = useState<string | null>(searchParams.get("year"));
  const [monthSelected, setMonthSelected] = useState<string | null>(searchParams.get("month"));
  const [quarterSelected, setQuarterSelected] = useState<string | null>(searchParams.get("quarter"));
  const [halfYearSelected, setHalfYearSelected] = useState<string | null>(searchParams.get("halfYear"));

  // Data filtering function
  const filterData = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[],
    yearSelected: string | null,
    monthSelected: string | null,
    quarterSelected: string | null,
    halfYearSelected: string | null
  ) => {
    return data.filter((item) => {
      let isValid = true;
  
      // Filter by year (applies to all data types)
      if (yearSelected) {
        isValid =
          isValid &&
          (item.year
            ? item.year === yearSelected
            : item.month?.includes(yearSelected) ||
              item.quarterYear?.includes(yearSelected) ||
              item.interval?.includes(yearSelected));
      }
  
      // Filter by month (only applies to monthly data)
      if (monthSelected && data === salesData) {
        isValid = isValid && item.month.includes(monthSelected); // Compare month part only
      }
  
      // Filter by quarter (only applies to quarterly data)
      if (quarterSelected && data === quarterlySalesData) {
        const quarter = item.quarterYear.split("-")[1]; // Extract the quarter part from `quarterYear` (e.g., "Q1", "Q2")
        isValid = isValid && quarter === quarterSelected; // Compare only the quarter part
      }
  
      // Filter by half-year (only applies to half-yearly data)
      if (halfYearSelected && data === halfYearlySalesData) {
        const halfYear = item.interval.split("-")[1]; // Extract the half-year part from `interval` (e.g., "H1", "H2")
        isValid = isValid && halfYear === halfYearSelected; // Compare only the half-year part
      }
  
      return isValid;
    });
  };

  // Handle change for dropdown filters
  const handleFilterChange = (filter: string, value: string | null) => {
    // Update the selected filter state
    switch (filter) {
      case "year":
        setYearSelected(value);
        break;
      case "month":
        setMonthSelected(value);
        break;
      case "quarter":
        setQuarterSelected(value);
        break;
      case "halfYear":
        setHalfYearSelected(value);
        break;
    }
  };

  // Update the URL with the new search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (yearSelected) params.set("year", yearSelected);
    if (monthSelected) params.set("month", monthSelected);
    if (quarterSelected) params.set("quarter", quarterSelected);
    if (halfYearSelected) params.set("halfYear", halfYearSelected);
    
    window.history.replaceState({}, "", "?" + params.toString());
  }, [yearSelected, monthSelected, quarterSelected, halfYearSelected]);

  // Get unique options for dropdowns (you can extract these dynamically from your data)
  const yearOptions = ["2025", "2024", "2023", "2022", "2021", "2020"];
  const monthOptions = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const quarterOptions = ["Q1", "Q2", "Q3", "Q4"];
  const halfYearOptions = ["H1", "H2"];

  // Filtered data based on selected filters
  const filteredMonthlyData = filterData(salesData, yearSelected, monthSelected, quarterSelected, halfYearSelected);
  const filteredQuarterlyData = filterData(quarterlySalesData, yearSelected, null, quarterSelected, halfYearSelected);
  const filteredHalfYearlyData = filterData(halfYearlySalesData, yearSelected, null, quarterSelected, halfYearSelected);
  const filteredYearlyData = filterData(yearlySalesData, yearSelected, null, quarterSelected, halfYearSelected);

  return (
    <div className="w-full" id="container">
      <div className="bg-white z-10 p-4 pb-0 fixed top-0 w-full border-b border-gray-300">
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center">
            <Image
              src="/icons/full-logo.jpeg"
              height={60}
              width={80}
              quality={100}
              alt="Logo"
              className="aspect-auto mix-blend-difference"
            />
          </div>
        </div>
        <div className="flex space-x-4 justify-center my-4">
          <select value={yearSelected || ''} onChange={(e) => handleFilterChange("year", e.target.value)} className="px-4 py-2 border rounded">
            <option value="">Select Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select value={monthSelected || ''} onChange={(e) => handleFilterChange("month", e.target.value)} className="px-4 py-2 border rounded">
            <option value="">Select Month</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select value={quarterSelected || ''} onChange={(e) => handleFilterChange("quarter", e.target.value)} className="px-4 py-2 border rounded">
            <option value="">Select Quarter</option>
            {quarterOptions.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
          <select value={halfYearSelected || ''} onChange={(e) => handleFilterChange("halfYear", e.target.value)} className="px-4 py-2 border rounded">
            <option value="">Select Half-Year</option>
            {halfYearOptions.map((half) => (
              <option key={half} value={half}>
                {half}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 mt-[150px] xl:space-y-0 gap-4 space-y-6 grid grid-cols-1 grid-flow-row 2xl:grid-cols-2">
        {/* Cards */}
        <MonthlySalesChart data={filteredMonthlyData} />
        <SalesTable data={filteredMonthlyData} />
        <QuarterlySalesChart data={filteredQuarterlyData} />
        <SalesTable data={filteredQuarterlyData} />
        <HalfYearlySalesChart data={filteredHalfYearlyData} />
        <SalesTable data={filteredHalfYearlyData} />
        <YearlySalesChart data={filteredYearlyData} />
        <SalesTable data={filteredYearlyData} />
      </div>
    </div>
  );
}
