/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams from Next.js
import SalesTable from "@/app/dashboards/_components/salesTable";
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
import Totals from "./_components/summaries";
import TotalsForCurrent from "./_components/summariesForCurrent";
import Totals17 from "./_components/summaries17";
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
  const [monthlyData, setmonthlyData] = useState<any[]>([]);
  const [quarterlyData, setquarterlyData] = useState<any[]>([]);
  const [haflyData, sethaflyData] = useState([]);
  const [yearlyData, setyearlyData] = useState([]);
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
  const [newOrders, setnewOrders] = useState<{
    invoices: any[];
    totals: any[];
    monthTotals: any[];
  }>({ invoices: [], totals: [], monthTotals: [] });
  const [oldOrders, setoldOrders] = useState<{
    invoices: any[];
    totals: any[];
    monthTotals: any[];
  }>({ invoices: [], totals: [], monthTotals: [] });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    // Check if the selected date is a valid full date (YYYY-MM-DD format)
    const formattedDate =
      selectedDate && selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
        ? selectedDate
        : null; // Only allow valid full dates (YYYY-MM-DD format)

    setSelectedDate(formattedDate);
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

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const response = await fetch("/api/monthly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: yearSelected,
        }),
      });

      const data = await response.json();
      if (!monthSelected) {
        const withoutlast = data.slice(0, data.length - 1);
        console.log(withoutlast);
        setmonthlyData(withoutlast);
      } else {
        setmonthlyData(data);
      }
    };
    fetchMonthlyData();
    const fetchQuarterlyData = async () => {
      const response = await fetch("/api/quarterly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: yearSelected,
        }),
      });

      const data = await response.json();
      if (!quarterSelected) {
        const withoutlast = data.slice(0, data.length - 1);
        console.log(withoutlast);
        setquarterlyData(withoutlast);
      } else {
        setquarterlyData(data);
      }
    };
    fetchQuarterlyData();
    const fetchHalflyData = async () => {
      const response = await fetch("/api/halfly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: yearSelected,
        }),
      });

      const data = await response.json();
      if (!halfYearSelected) {
        const withoutlast = data.slice(0, data.length - 1);
        console.log(withoutlast);
        sethaflyData(withoutlast);
      } else {
        setquarterlyData(data);
      }
    };
    fetchHalflyData();
    const fetchYearlyData = async () => {
      const response = await fetch("/api/yearly", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: yearSelected,
        }),
      });

      const data = await response.json();
      if (!yearSelected) {
        const withoutlast = data.slice(0, data.length - 1);
        console.log(withoutlast);
        setyearlyData(withoutlast);
      } else {
        setyearlyData(data);
      }
    };
    fetchYearlyData();
  }, [yearSelected, monthSelected, quarterSelected, halfYearSelected]);

  useEffect(() => {
    if (!selectedDate) return; // Don't fetch data if selectedDate is not fully entered
    const fetchData = async () => {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          type: "NEW ORDER PAYMENT",
        }),
      });

      const invoices = await response.json();
      setnewOrders(invoices);
    };

    fetchData();
    const fetchData2 = async () => {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          type: "OLD ORDER PAYMENT",
        }),
      });

      const invoices = await response.json();
      setoldOrders(invoices);
    };

    fetchData2();
  }, [selectedDate]);

  // Fetch data from API based on selected filters
  const [productMonthly, setproductMonthly] = useState([]);
  const [productMonthly2, setproductMonthly2] = useState([]);
  const [productMonthly3, setproductMonthly3] = useState([]);
  const [productMonthly4, setproductMonthly4] = useState([]);
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
      setproductMonthly(data.ProductsMonthly);
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
      setproductMonthly2(data.ProductsMonthly);
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
      setproductMonthly3(data.ProductsMonthly);
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
      setproductMonthly4(data.ProductsMonthly);
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
  // Paginated category data
  const paginatedCategoryData = categoryData;
  const paginatedCategoryData2 = categoryData2;
  const paginatedCategoryData3 = categoryData3;
  const paginatedCategoryData4 = categoryData4;

  const [productsDATA, setproductsDATA] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setproductsDATA(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full" id="container">
      <div className="bg-white z-10 p-4 pb-0 fixed top-0 w-full border-b border-gray-300">
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center">
            <Image
              src="/full-logo.jpeg"
              height={100}
              width={150}
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
            placeholder={selectedDate || "YYYY-MM-DD"}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="space-y-8 p-6  pt-[200px]">
        <div>
          <h1 className="text-2xl pt-4 text-teal-900 font-bold ">
            Nubras Daily Sales dashboard
          </h1>
          <p className="text-base font-sans">
            Nubras sales dashboard for {selectedDate}
          </p>
        </div>
        <TotalsForCurrent date={selectedDate as string} />
        <Card>
          <CardHeader>
            <CardTitle className="max-w-max font-bold text-teal-700">
              NUBRAS GENTS KANDORA SECTION
            </CardTitle>
            <CardDescription>add your description here</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <SalesTable
              name={`DAILY SALES DATA FOR NUBRAS GENTS KANDORA SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={paginatedCategoryData3 || []}
            />
            <SalesTable
              name={`PRODUCT LISTS FOR NUBRAS GENTS KANDORA SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={products3 || []}
            />
            <SalesTable
              name={`DAILY TOTALS FOR NUBRAS GENTS KANDORA SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={totals3 || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR PRODUCT LISTS ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={productMonthly3 || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR NUBRAS GENTS KANDORA SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={Monthlytotals3 || []}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="max-w-max font-bold text-teal-700">
              NUBRAS GENTS ITEM&apos;S SECTION
            </CardTitle>
            <CardDescription>add your description here</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <SalesTable
              name={`DAILY SALES DATA FOR NUBRAS GENTS ITEM'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={paginatedCategoryData || []}
            />
            <SalesTable
              name={`PRODUCT LISTS FOR NUBRAS GENTS ITEM'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={products || []}
            />
            <SalesTable
              name={`DAILY TOTALS FOR NUBRAS GENTS ITEM'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={totals || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR PRODUCT LISTS ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={productMonthly || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR NUBRAS GENTS ITEM'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={Monthlytotals || []}
            />
          </CardContent>
        </Card>

        {paginatedCategoryData4.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="max-w-max font-bold text-teal-700">
                NUBRAS GENTS JACKET SECTION
              </CardTitle>
              <CardDescription>add your description here</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <SalesTable
                name={`DAILY SALES DATA FOR NUBRAS GENTS KANDORA SECTION ${
                  selectedDate && `FOR ${selectedDate}`
                }`}
                data={paginatedCategoryData4 || []}
              />
              <SalesTable
                name={`PRODUCT LISTS FOR NUBRAS GENTS KANDORA SECTION ${
                  selectedDate && `FOR ${selectedDate}`
                }`}
                data={products4 || []}
              />
              <SalesTable
                name={`DAILY TOTALS FOR NUBRAS GENTS KANDORA SECTION ${
                  selectedDate && `FOR ${selectedDate}`
                }`}
                data={totals4 || []}
              />
              <SalesTable
                name={`MONTHLY TOTALS FOR PRODUCT LISTS ${
                  selectedDate && `FOR ${selectedDate}`
                }`}
                data={productMonthly4 || []}
              />
              <SalesTable
                name={`MONTHLY TOTALS FOR NUBRAS GENTS KANDORA SECTION ${
                  selectedDate && `FOR ${selectedDate}`
                }`}
                data={Monthlytotals4 || []}
              />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="max-w-max font-bold text-teal-700">
              NUBRAS JUNIOR KID&apos;S SECTION
            </CardTitle>
            <CardDescription>add your description here</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <SalesTable
              name={`DAILY SALES DATA FOR NUBRAS JUNIOR KID'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={paginatedCategoryData2 || []}
            />
            <SalesTable
              name={`PRODUCT LISTS FOR NUBRAS JUNIOR KID'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={products2 || []}
            />
            <SalesTable
              name={`DAILY TOTALS FOR NUBRAS JUNIOR KID'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={totals2 || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR PRODUCT LISTS ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={productMonthly2 || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR NUBRAS JUNIOR KID'S SECTION ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={Monthlytotals2 || []}
            />
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="max-w-max font-bold text-teal-700">
              NEW ORDER PAYMENT FOR {selectedDate}
            </CardTitle>
            <CardDescription>add your description here</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <SalesTable
              name={`NEW ORDER PAYMENT ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={newOrders!.invoices || []}
            />
            <SalesTable
              name={`TOTALS FOR NEW ORDER PAYMENT ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={newOrders!.totals || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR NEW ORDER PAYMENT ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={newOrders!.monthTotals || []}
            />
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle className="max-w-max font-bold text-teal-700">
              OLD ORDER PAYMENT FOR {selectedDate}
            </CardTitle>
            <CardDescription>add your description here</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <SalesTable
              name={`OLD ORDER PAYMENT ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={oldOrders!.invoices || []}
            />
            <SalesTable
              name={`TOTALS FOR OLD ORDER PAYMENT ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={oldOrders!.totals || []}
            />
            <SalesTable
              name={`MONTHLY TOTALS FOR OLD ORDER PAYMENT ${
                selectedDate && `FOR ${selectedDate}`
              }`}
              data={oldOrders!.monthTotals || []}
            />
          </CardContent>
        </Card>
      </div>
      <div className="p-6 space-y-4">
        <Totals />
        <SalesTable
          name={`All over sales for nubras product lists`}
          description="All over total quantity sold, total sales amount and
          average sales amount"
          data={productsDATA || []}
        />
      </div>
      <div className="p-6 xl:space-y-0 gap-8 grid grid-cols-1 grid-flow-row 2xl:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-teal-900">
            All over Nubras Daily Sales dashboard{" "}
            <span className="text-lg text-zinc-700 font-medium">
              (from 2017 to 2025 Daily book data)
            </span>
          </h1>
          <p className="text-base font-sans">Nubras sales dashboard</p>
        </div>
        <Totals17 />
        <div className="space-y-4">
          <SalesTable name={`MONTHLY SALES DATA `} data={monthlyData || []} />
        </div>
        <div className="space-y-4">
          <SalesTable
            name={`QUARTERLY SALES DATA  `}
            data={quarterlyData || []}
          />
        </div>
        <div className="space-y-6">
          <SalesTable name={`HALF YEARLY SALES DATA `} data={haflyData} />
        </div>

        <div className="space-y-6">
          <SalesTable name={`YEARLY SALES DATA  `} data={yearlyData || []} />
        </div>
        <MonthlySalesChart name={`MONTHLY SALES DATA `} data={monthlyData} />
        <QuarterlySalesChart
          name={`QUARTERLY SALES DATA  `}
          data={quarterlyData}
        />
        <HalfYearlySalesChart
          name={`HALF YEARLY SALES DATA  `}
          data={haflyData}
        />
        <YearlySalesChart name={`YEARLY SALES DATA  `} data={yearlyData} />
        {/* <CategoryChart data={paginatedCategoryData} /> */}
      </div>
    </div>
  );
}
