/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
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
  // Filter states
  const [yearSelected, setYearSelected] = useState<string | null>(null);
  const [monthSelected, setMonthSelected] = useState<string | null>(null);
  const [quarterSelected, setQuarterSelected] = useState<string | null>(null);
  const [halfYearSelected, setHalfYearSelected] = useState<string | null>(null);

  // Data filtering function
  const filterData = (data: any[], yearSelected: string | null, monthSelected: string | null, quarterSelected: string | null, halfYearSelected: string | null) => {
    return data.filter(item => {
      let isValid = true;

      if (yearSelected) {
        isValid = isValid && (item.year ? item.year === yearSelected : item.month?.includes(yearSelected) || item.quarterYear?.includes(yearSelected) || item.interval?.includes(yearSelected));
      }
      if (monthSelected) {
        isValid = isValid && item.month === monthSelected;
      }
      if (quarterSelected) {
        isValid = isValid && item.quarterYear === quarterSelected;
      }
      if (halfYearSelected) {
        isValid = isValid && item.interval === halfYearSelected;
      }

      return isValid;
    });
  };

  // Filtered data based on selected filters
  const filteredMonthlyData = filterData(salesData, yearSelected, monthSelected, quarterSelected, halfYearSelected);
  const filteredQuarterlyData = filterData(quarterlySalesData, yearSelected, monthSelected, quarterSelected, halfYearSelected);
  const filteredHalfYearlyData = filterData(halfYearlySalesData, yearSelected, monthSelected, quarterSelected, halfYearSelected);
  const filteredYearlyData = filterData(yearlySalesData, yearSelected, monthSelected, quarterSelected, halfYearSelected);

  // Handle change for dropdown filters
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearSelected(e.target.value);
    setMonthSelected(null); // Reset month selection when year changes
    setQuarterSelected(null); // Reset quarter selection when year changes
    setHalfYearSelected(null); // Reset half-year selection when year changes
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => setMonthSelected(e.target.value);
  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setQuarterSelected(e.target.value);
  const handleHalfYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setHalfYearSelected(e.target.value);

  // Get unique options for dropdowns
  const yearOptions = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"];
  
  // Dynamically generate months, quarters, and half years based on selected year
  const monthOptions = yearSelected ? Array.from({ length: 12 }, (_, i) => `${new Date(yearSelected, i).toLocaleString('default', { month: 'short' })}, ${yearSelected}`) : [];
  const quarterOptions = yearSelected ? [`${yearSelected}-Q1`, `${yearSelected}-Q2`, `${yearSelected}-Q3`, `${yearSelected}-Q4`] : [];
  const halfYearOptions = yearSelected ? [`${yearSelected}-H1`, `${yearSelected}-H2`] : [];

  // Handle removal of filters
  const removeFilter = (filterType: string) => {
    if (filterType === "year") setYearSelected(null);
    if (filterType === "month") setMonthSelected(null);
    if (filterType === "quarter") setQuarterSelected(null);
    if (filterType === "halfYear") setHalfYearSelected(null);
  };

  return (
    <div className="w-full" id="container">
      <div className="bg-white p-6 pb-0 w-full border-b border-gray-300">
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center">
            <Image
              src="/icons/full-logo.jpeg"
              height={100}
              width={120}
              quality={100}
              alt="Al Nubras Logo"
              className="aspect-auto mix-blend-difference"
            />
          </div>
        </div>
      </div>

      <div className="p-6 xl:space-y-0 gap-4 space-y-6 grid grid-cols-1 grid-flow-row 2xl:grid-cols-2">
        {/* Dropdown Filters */}
        <div className="flex space-x-4 mb-6">
          <select onChange={handleYearChange} className="px-4 py-2 border rounded">
            <option value="">Select Year</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select onChange={handleMonthChange} disabled={!yearSelected} className="px-4 py-2 border rounded">
            <option value="">Select Month</option>
            {monthOptions.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select onChange={handleQuarterChange} disabled={!yearSelected} className="px-4 py-2 border rounded">
            <option value="">Select Quarter</option>
            {quarterOptions.map(quarter => (
              <option key={quarter} value={quarter}>{quarter}</option>
            ))}
          </select>
          <select onChange={handleHalfYearChange} disabled={!yearSelected} className="px-4 py-2 border rounded">
            <option value="">Select Half-Year</option>
            {halfYearOptions.map(half => (
              <option key={half} value={half}>{half}</option>
            ))}
          </select>
        </div>

        {/* Cards */}
        <MonthlySalesChart data={filteredMonthlyData} />
        <SalesTable data={filteredMonthlyData} />
        <QuarterlySalesChart data={filteredQuarterlyData} />
        <SalesTable data={filteredQuarterlyData} />
        <HalfYearlySalesChart data={filteredHalfYearlyData} />
        <SalesTable data={filteredHalfYearlyData} />
        <YearlySalesChart data={filteredYearlyData} />
        <SalesTable data={filteredYearlyData} />

        {/* Selected Filters Container */}
        <div className="mt-6">
          <div className="flex space-x-4">
            {yearSelected && <div className="bg-gray-200 px-4 py-2 rounded-full">{yearSelected} <button onClick={() => removeFilter("year")} className="ml-2 text-red-600">x</button></div>}
            {monthSelected && <div className="bg-gray-200 px-4 py-2 rounded-full">{monthSelected} <button onClick={() => removeFilter("month")} className="ml-2 text-red-600">x</button></div>}
            {quarterSelected && <div className="bg-gray-200 px-4 py-2 rounded-full">{quarterSelected} <button onClick={() => removeFilter("quarter")} className="ml-2 text-red-600">x</button></div>}
            {halfYearSelected && <div className="bg-gray-200 px-4 py-2 rounded-full">{halfYearSelected} <button onClick={() => removeFilter("halfYear")} className="ml-2 text-red-600">x</button></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
