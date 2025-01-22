/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, Suspense } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function ShareDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}

function Dashboard() {
  const searchParams = useSearchParams(); // Get the search params from URL
  const [yearSelected, setYearSelected] = useState<string | null>(
    searchParams.get("year")
  );
  const [monthSelected, setMonthSelected] = useState<string | null>(
    searchParams.get("month")
  );
  const [quarterSelected, setQuarterSelected] = useState<string | null>(
    searchParams.get("quarter")
  );
  const [halfYearSelected, setHalfYearSelected] = useState<string | null>(
    searchParams.get("halfYear")
  );
  const [branchSelected, setBranchSelected] = useState<string | null>("");
  const [categoryData, setCategoryData] = useState([]);
  const [categoryData2, setCategoryData2] = useState([]);
  const [categoryData3, setCategoryData3] = useState([]);
  const [products, setproducts] = useState([]);
  const [products4, setproducts4] = useState([]);
  const [totals, settotals] = useState([]);
  const [Monthlytotals, setMonthlytotals] = useState([]);
  const [products2, setproducts2] = useState([]);
  const [totals2, settotals2] = useState([]);
  const [Monthlytotals2, setMonthlytotals2] = useState([]);
  const [products3, setproducts3] = useState([]);
  const [totals3, settotals3] = useState([]);
  const [Monthlytotals3, setMonthlytotals3] = useState([]);
  const [totals4, settotals4] = useState([]);
  const [Monthlytotals4, setMonthlytotals4] = useState([]);
  const [categoryData4, setCategoryData4] = useState([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    searchParams.get("date")
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    // Check if the selected date is a valid full date (YYYY-MM-DD format)
    const formattedDate =
      selectedDate && selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
        ? selectedDate
        : null; // Only allow valid full dates (YYYY-MM-DD format)

    setSelectedDate(formattedDate);
  };

  // Data filtering function
  const filterData = (
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
      case "branch":
        setBranchSelected(value);
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
    if (selectedDate) params.set("date", selectedDate); // Sync selected date

    window.history.replaceState({}, "", "?" + params.toString());
  }, [
    yearSelected,
    monthSelected,
    quarterSelected,
    halfYearSelected,
    selectedDate,
  ]);

  // const monthMapping: { [key: string]: string } = {
  //   Jan: "01",
  //   Feb: "02",
  //   Mar: "03",
  //   Apr: "04",
  //   May: "05",
  //   Jun: "06",
  //   Jul: "07",
  //   Aug: "08",
  //   Sep: "09",
  //   Oct: "10",
  //   Nov: "11",
  //   Dec: "12",
  // };

  // Fetch data from API based on selected filters
  useEffect(() => {
    if (!selectedDate) return; // Don't fetch data if selectedDate is not fully entered
    const fetchData = async () => {
      const formattedDate = selectedDate;

      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: branchSelected,
          category: "NUBRAS GENTS ITEM'S SECTION",
          date: formattedDate, // Use the formatted date
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setCategoryData(data.data); // Update state with fetched data
      setproducts(data.products); // Update state with fetched data
      settotals(data.totals); // Update state with fetched data
      setMonthlytotals(data.monthTotals); // Update state with fetched data
    };
    fetchData();
    const fetchData2 = async () => {
      const formattedDate = selectedDate ? selectedDate : null;

      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: branchSelected,
          category: "NUBRAS JUNIOR KID'S SECTION",
          date: formattedDate, // Use the formatted date
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setCategoryData2(data.data); // Update state with fetched data
      setproducts2(data.products); // Update state with fetched data
      settotals2(data.totals); // Update state with fetched data
      setMonthlytotals2(data.monthTotals); // Update state with fetched data
    };
    fetchData2();
    const fetchData3 = async () => {
      const formattedDate = selectedDate ? selectedDate : null;

      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: branchSelected,
          category: "NUBRAS GENTS KANDORA SECTION",
          date: formattedDate, // Use the formatted date
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setCategoryData3(data.data); // Update state with fetched data
      setproducts3(data.products); // Update state with fetched data
      settotals3(data.totals); // Update state with fetched data
      setMonthlytotals3(data.monthTotals); // Update state with fetched data
    };
    fetchData3();
    const fetchData4 = async () => {
      const formattedDate = selectedDate ? selectedDate : null;

      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: branchSelected,
          category: "NUBRAS GENTS JACKET SECTION",
          date: formattedDate, // Use the formatted date
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setCategoryData4(data.data); // Update state with fetched data
      setproducts4(data.products); // Update state with fetched data
      settotals4(data.totals); // Update state with fetched data
      setMonthlytotals4(data.monthTotals);
    };
    fetchData4();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    yearSelected,
    monthSelected,
    quarterSelected,
    halfYearSelected,
    branchSelected,
    selectedDate, // Add selectedDate as a dependency
  ]);

  // Get unique options for dropdowns (you can extract these dynamically from your data)
  const yearOptions = ["2025", "2024", "2023", "2022", "2021", "2020"];
  const monthOptions = [
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
  const quarterOptions = ["Q1", "Q2", "Q3", "Q4"];
  const halfYearOptions = ["H1", "H2"];
  const branchOptions = ["ABU DHABI BRANCH", "KHALIFA CITY BRANCH"];

  // Filtered data based on selected filters
  const filteredMonthlyData = filterData(
    salesData,
    yearSelected,
    monthSelected,
    quarterSelected,
    halfYearSelected
  );
  const filteredQuarterlyData = filterData(
    quarterlySalesData,
    yearSelected,
    null,
    quarterSelected,
    halfYearSelected
  );
  const filteredHalfYearlyData = filterData(
    halfYearlySalesData,
    yearSelected,
    null,
    quarterSelected,
    halfYearSelected
  );
  const filteredYearlyData = filterData(
    yearlySalesData,
    yearSelected,
    null,
    quarterSelected,
    halfYearSelected
  );
  // Paginated category data
  const paginatedCategoryData = categoryData;
  const paginatedCategoryData2 = categoryData2;
  const paginatedCategoryData3 = categoryData3;
  const paginatedCategoryData4 = categoryData4;

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
        <div className="flex flex-wrap gap-4 justify-center my-4">
          <select
            value={yearSelected || ""}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Select Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={monthSelected || ""}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Select Month</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={quarterSelected || ""}
            onChange={(e) => handleFilterChange("quarter", e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Select Quarter</option>
            {quarterOptions.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
          <select
            value={halfYearSelected || ""}
            onChange={(e) => handleFilterChange("halfYear", e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Select Half-Year</option>
            {halfYearOptions.map((half) => (
              <option key={half} value={half}>
                {half}
              </option>
            ))}
          </select>
          <select
            value={branchSelected || ""}
            onChange={(e) => handleFilterChange("branch", e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Select Branch</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <input
            className="max-w-max border rouned-md px-2 "
            type="text"
            placeholder="YYYY-MM-DD"
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="p-6 mt-[150px] xl:space-y-0 gap-20 grid grid-cols-1 grid-flow-row 2xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle contentEditable className="max-w-max">
              NUBRAS GENTS KANDORA SECTION
            </CardTitle>
            <CardDescription contentEditable>
              add your description here
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <SalesTable
              name="DAILY SALES DATA FOR NUBRAS GENTS KANDORA SECTION"
              data={paginatedCategoryData3 || []}
            />
            <SalesTable
              name="PRODUCT LISTS FOR NUBRAS GENTS KANDORA SECTION"
              data={products3 || []}
            />
            <SalesTable
              name="DAILY TOTALS FOR NUBRAS GENTS KANDORA SECTION"
              data={totals3 || []}
            />
            <SalesTable
              name="MONTHLY TOTALS FOR NUBRAS GENTS KANDORA SECTION"
              data={Monthlytotals3 || []}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle contentEditable className="max-w-max">
              NUBRAS GENTS ITEM&apos;S SECTION
            </CardTitle>
            <CardDescription contentEditable>
              add your description here
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <SalesTable
              name="DAILY SALES DATA FOR NUBRAS GENTS ITEM'S SECTION"
              data={paginatedCategoryData || []}
            />
            <SalesTable
              name="PRODUCT LISTS FOR NUBRAS GENTS ITEM'S SECTION"
              data={products || []}
            />
            <SalesTable
              name="DAILY TOTALS FOR NUBRAS GENTS ITEM'S SECTION"
              data={totals || []}
            />
            <SalesTable
              name="MONTHLY TOTALS FOR NUBRAS GENTS ITEM'S SECTION"
              data={Monthlytotals || []}
            />
          </CardContent>
        </Card>

        {paginatedCategoryData4.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle contentEditable className="max-w-max">
                NUBRAS GENTS JACKET SECTION
              </CardTitle>
              <CardDescription contentEditable>
                add your description here
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <SalesTable
                name="DAILY SALES DATA FOR NUBRAS GENTS KANDORA SECTION"
                data={paginatedCategoryData4 || []}
              />
              <SalesTable
                name="PRODUCT LISTS FOR NUBRAS GENTS KANDORA SECTION"
                data={products4 || []}
              />
              <SalesTable
                name="DAILY TOTALS FOR NUBRAS GENTS KANDORA SECTION"
                data={totals4 || []}
              />
              <SalesTable
                name="MONTHLY TOTALS FOR NUBRAS GENTS KANDORA SECTION"
                data={Monthlytotals4 || []}
              />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle contentEditable className="max-w-max">
              NUBRAS JUNIOR KID&apos;S SECTION
            </CardTitle>
            <CardDescription contentEditable>
              add your description here
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <SalesTable
              name="DAILY SALES DATA FOR NUBRAS JUNIOR KID'S SECTION"
              data={paginatedCategoryData2 || []}
            />
            <SalesTable
              name="PRODUCT LISTS FOR NUBRAS JUNIOR KID'S SECTION"
              data={products2 || []}
            />
            <SalesTable
              name="DAILY TOTALS FOR NUBRAS JUNIOR KID'S SECTION"
              data={totals2 || []}
            />
            <SalesTable
              name="MONTHLY TOTALS FOR NUBRAS JUNIOR KID'S SECTION"
              data={Monthlytotals2 || []}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* <SalesTable name="NUBRAS GENTS JACKET SECTION" data={paginatedCategoryData4} /> */}
          <MonthlySalesChart data={filteredMonthlyData} />
          <SalesTable
            name="MONTHLY SALES DATA"
            data={filteredMonthlyData || []}
          />
        </div>
        <div className="space-y-6">
          <QuarterlySalesChart data={filteredQuarterlyData} />
          <SalesTable
            name="QUARTERLY SALES DATA"
            data={filteredQuarterlyData || []}
          />
        </div>
        <div className="space-y-6">
          <HalfYearlySalesChart data={filteredHalfYearlyData} />
          <SalesTable
            name="HALF YEARLY SALES DATA"
            data={filteredHalfYearlyData}
          />
        </div>

        <div className="space-y-6">
          <YearlySalesChart data={filteredYearlyData} />
          <SalesTable
            name="YEARLY SALES DATA"
            data={filteredYearlyData || []}
          />
        </div>
        {/* <CategoryChart data={paginatedCategoryData} /> */}
      </div>
    </div>
  );
}
