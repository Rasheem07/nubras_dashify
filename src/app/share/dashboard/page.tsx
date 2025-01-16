/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  TrendingUp,
  ShoppingCart,
  LucideShare2,
  Timer,
  Bookmark,
  Info,
  TrendingDown,
  FormInput,
  Download,
  X,
  Ghost,
  MessageCircleWarningIcon,
  AreaChartIcon,
} from "lucide-react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jsPDF } from "jspdf";
import { Input } from "@/components/ui/input";
import FinancialCard from "@/app/dashboards/_components/NumberCard";
import SalesAreaChart from "@/app/dashboards/_components/AreaChart";
import SalesTable from "@/app/dashboards/_components/salesTable";

export default function Dashboard() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState({
    totalAmount: 0,
    totalProfit: 0,
    totalExpenses: 0,
    averageSales: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [month, setMonth] = useState("01"); // Month selection for single and month
  const [quarter, setQuarter] = useState("q1"); // Quarter selection
  const [half, setHalf] = useState("first"); // Half year selection
  const [startDate, setStartDate] = useState(""); // Custom start date
  const [endDate, setEndDate] = useState(""); // Custom end date
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [productsData, setproductsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Category selection
  const [selectedLocation, setSelectedLocation] = useState(""); // Location selection
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [salesPerson, setsalesPerson] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [orderPaymentStatus, setorderPaymentStatus] = useState("");
  const [personData, setpersonData] = useState([]);
  const [chartDataForpersons, setchartDataForpersons] = useState<any[]>([]);
  const [dateRange, setdateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [date, setdate] = useState("all");
  const [RangeData, setRangeData] = useState<any[]>([]);

  const exportToPdf = async () => {
    const doc = new jsPDF();
    const element = document.getElementById("container") as HTMLElement;

    // Get the full height of the scrollable container
    const totalHeight = element.scrollHeight;

    // Scroll the container from top to bottom in chunks (if it's long)
    let currentY = 0;
    const chunkHeight = 500; // You can adjust this for how much to capture at a time

    while (currentY < totalHeight) {
      // Scroll the container to the current position
      element.scrollTo(0, currentY);

      // Capture the content
      await new Promise<void>((resolve) => {
        doc.html(element, {
          callback: function (doc) {
            if (currentY + chunkHeight >= totalHeight) {
              // This is the last chunk, save the PDF
              doc.save("exported-file.pdf");
            } else {
              // Otherwise, add the next chunk of content
              currentY += chunkHeight;
              resolve();
            }
          },
          x: 10, // Left margin
          y: 10, // Top margin (to ensure content starts at the top)
          width: 180, // Width to fit the content
          windowWidth: 800, // Virtual window width for scaling
        });
      });
    }
  };

  const [result, setResult] = useState<any[] | any>([]); // For storing API result
  const [loading, setLoading] = useState(false); // To show a loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      type,
      month,
      quarter,
      half,
      startDate,
      endDate,
      year,
    };

    try {
      const response = await fetch("/api/dashboard/sum/total", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setResult({ error: data.error || "Something went wrong!" });
      }
    } catch (error) {
      setResult({ error: "Failed to fetch data." });
    } finally {
      setLoading(false);
    }
  };

  // Fetch chart data based on date range or selection
  useEffect(() => {
    const fetchChartData = async () => {
      if (
        (selectedPeriod === "custom" && (!startDate || !endDate)) ||
        (selectedPeriod !== "custom" && !month && !quarter && !half)
      ) {
        return;
      }

      try {
        const response = await fetch("/api/dashboard/comparisons/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: selectedPeriod,
            month,
            quarter,
            half,
            startDate,
            endDate,
            category: selectedCategory,
            location: selectedLocation,
            salesPerson,
            orderStatus,
            orderPaymentStatus,
          }),
        });
        const result = await response.json();
        setChartData(result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [
    startDate,
    endDate,
    selectedPeriod,
    month,
    quarter,
    half,
    selectedLocation,
    salesPerson,
    orderStatus,
    orderPaymentStatus,
    selectedCategory,
  ]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (
        (selectedPeriod === "custom" && (!startDate || !endDate)) ||
        (selectedPeriod !== "custom" && !month && !quarter && !half)
      ) {
        return;
      }

      try {
        const response = await fetch(
          "/api/dashboard/comparisons/sales/person",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: selectedPeriod,
              month,
              quarter,
              half,
              startDate,
              endDate,
              location: selectedLocation,
              orderStatus,
              orderPaymentStatus,
            }),
          }
        );
        const result = await response.json();
        setpersonData(result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [
    startDate,
    endDate,
    selectedPeriod,
    month,
    quarter,
    half,
    selectedLocation,
    salesPerson,
    orderStatus,
    orderPaymentStatus,
  ]);

  // Fetch category data based on selected period and category
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (
        (selectedPeriod === "custom" && (!startDate || !endDate)) ||
        (selectedPeriod !== "custom" && !month && !quarter && !half)
      ) {
        return;
      }

      try {
        const response = await fetch(
          "/api/dashboard/comparisons/sales/category",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: selectedPeriod,
              month,
              quarter,
              half,
              startDate,
              endDate,
              category: selectedCategory,
              location,
              salesPerson,
              orderStatus,
              orderPaymentStatus,
            }),
          }
        );
        const result = await response.json();
        setCategoryData(result);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, [
    startDate,
    endDate,
    selectedPeriod,
    month,
    quarter,
    half,
    selectedCategory,
    salesPerson,
    orderStatus,
    orderPaymentStatus,
  ]);

  // Fetch category data based on selected period and category
  useEffect(() => {
    const fetchCategoryProductsData = async () => {
      if (
        (selectedPeriod === "custom" && (!startDate || !endDate)) ||
        (selectedPeriod !== "custom" && !month && !quarter && !half)
      ) {
        return;
      }

      try {
        const response = await fetch(
          "/api/dashboard/comparisons/sales/products",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: selectedPeriod,
              month,
              quarter,
              half,
              startDate,
              endDate,
              category: selectedCategory,
              location,
              salesPerson,
              orderStatus,
              orderPaymentStatus,
            }),
          }
        );
        const result = await response.json();
        setproductsData(result);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryProductsData();
  }, [
    startDate,
    endDate,
    selectedPeriod,
    month,
    quarter,
    half,
    selectedCategory,
    salesPerson,
    orderStatus,
    orderPaymentStatus,
  ]);

  // Fetch location data based on selected period and location
  useEffect(() => {
    const fetchLocationData = async () => {
      if (
        (selectedPeriod === "custom" && (!startDate || !endDate)) ||
        (selectedPeriod !== "custom" && !month && !quarter && !half)
      ) {
        return;
      }

      try {
        const response = await fetch(
          "/api/dashboard/comparisons/saleslocation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: selectedPeriod,
              month,
              quarter,
              half,
              startDate,
              endDate,
              location: selectedLocation,
            }),
          }
        );
        const result = await response.json();
        setLocationData(result);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, [
    startDate,
    endDate,
    selectedPeriod,
    month,
    quarter,
    half,
    selectedLocation,
  ]);

  const selectedType = () => {
    if (type == "month") {
      return month;
    } else if (type == "quarter") {
      return quarter;
    } else if (type === "half") {
      return half;
    }
    return "";
  };

  const handleDoubleClick = (setValue: Dispatch<SetStateAction<string>>) => {
    setValue(""); // Unselect the option on double-click
  };

  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const selectedType = () => {
      if (type === "month") {
        setPlaceholder(month);
      } else if (type === "quarter") {
        setPlaceholder(quarter);
      } else if (type === "half") {
        setPlaceholder(half);
      }
    };

    selectedType();
  }, [type, month, quarter, half, setPlaceholder]);

  // Prepare data for Recharts
  // Assuming your API returns data with columns: year, total_sales, total_sales_count, and sales_person
  // Prepare data for Recharts
  // Assuming your API returns data with columns: year, total_sales, total_sales_count, and sales_person
  function groupDataByYear(personData: any[]) {
    const groupedData: any = {};

    // Collect the data for each year
    personData.forEach((row: any) => {
      const {
        year,
        "SALES PERSON": salesPerson,
        total_sales,
        total_sales_count,
      } = row;

      if (!groupedData[year]) {
        groupedData[year] = [];
      }

      groupedData[year].push({
        salesPerson,
        total_sales: parseInt(total_sales),
        total_sales_count: parseInt(total_sales_count),
      });
    });

    return groupedData;
  }
  const groupedData = groupDataByYear(personData);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      let url = `/api/database/get?page=${page}&date=${date}`;

      // Append custom date range if selected and both dates are filled
      if (date === "custom" && dateRange.start && dateRange.end) {
        url += `&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      setData(result.data); // Use the data arrayusing totalCount
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/api/dashboard/sales?date=${date}`;

        // Append custom date range if selected and both dates are filled
        if (date === "custom" && dateRange.start && dateRange.end) {
          url += `&start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`;
        }

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: selectedCategory,
            location: selectedLocation,
            salesPerson,
            orderStatus,
            orderPaymentStatus,
          }),
        });
        const result = await response.json();

        console.log(result);
        setRangeData(result); // Use the data arrayusing totalCount
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (date == "custom") {
      if (dateRange.start && dateRange.end) fetchData();
    } else {
      fetchData();
    }
  }, [
    date,
    dateRange,
    orderPaymentStatus,
    orderStatus,
    ,
    salesPerson,
    selectedCategory,
    selectedLocation,
  ]);

  return (
    <div
      className="w-full"
      id="container"
    >
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

        <div className="flex items-center gap-x-4">
          {["general", "dashboard", "comparisons"].map((tabName) => (
            <Button
              key={tabName}
              variant="ghost"
              size="sm"
              className={`${
                tab === tabName ? "border-b-2 border-gray-800" : ""
              } rounded-none transition`}
              onClick={() => setTab(tabName)}
            >
              {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {tab == "general" && (
        <>
          <form className=" m-5 flex items-end gap-4 " onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Select Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter year (e.g., 2024)"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Select Period Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose a period type</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="half">Half</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {type === "month" && (
              <div>
                <label
                  htmlFor="month"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Month
                </label>
                <input
                  type="number"
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter month number (1-12)"
                />
              </div>
            )}

            {type === "quarter" && (
              <div>
                <label
                  htmlFor="quarter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Quarter
                </label>
                <select
                  id="quarter"
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose a quarter</option>
                  <option value="q1">Q1</option>
                  <option value="q2">Q2</option>
                  <option value="q3">Q3</option>
                  <option value="q4">Q4</option>
                </select>
              </div>
            )}

            {type === "half" && (
              <div>
                <label
                  htmlFor="half"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Half
                </label>
                <select
                  id="half"
                  value={half}
                  onChange={(e) => setHalf(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose a half</option>
                  <option value="first">First Half</option>
                  <option value="second">Second Half</option>
                </select>
              </div>
            )}

            {type === "custom" && (
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {type === "custom" && (
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full max-w-max bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              submit
            </button>
          </form>
          <div className="mt-4 px-4">
            {result && result.length > 0 ? (
              <FinancialCard
                currentData={result[0]}
                icon={ShoppingCart}
                previousData={result[1]}
              />
            ) : (
              <div className="flex flex-col items-start w-full mt-5">
                <FormInput />
                <h1 className="text-2xl font-semibold">
                  Please fill the form for data.
                </h1>
                <p className="text-base font-sans text-gray-400">
                  Select a date for your Data.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Category Selection Card */}

      {/* Location Selection Card */}
      {tab == "dashboard" && (
        <div className="space-y-4 p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-x-4 gap-y-2 flex-1 flex-wrap">
            <Select defaultValue="all" onValueChange={setdate} value={date}>
              <SelectTrigger className="w-[250px] bg-white">
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
                    value={
                      dateRange.start
                        ? dateRange.start.toISOString().split("T")[0]
                        : ""
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
                    value={
                      dateRange.end
                        ? dateRange.end.toISOString().split("T")[0]
                        : ""
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
          <div className="flex items-center gap-x-4 border-t pt-2">
            {date !== "all" && date && (
              <Button
                onClick={() => setdate("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2 bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Date filter:{" "}
                {date === "custom"
                  ? dateRange.start?.toDateString() +
                    " to " +
                    dateRange.end?.toDateString()
                  : date}{" "}
                <X />
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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl" contentEditable>Sales Data according to selected date range</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[250px] md:max-h-none">
              <SalesAreaChart data={RangeData} />
              <div className="md:hidden flex flex-col py-6 items-center gap-2">
                <AreaChartIcon />
                <h1 className="text-base font-semibold">
                  Please view charts in larger screens
                </h1>
              </div>
            </CardContent>
          </Card>
          <SalesTable data={RangeData} />
        </div>
      )}

      {/* Chart Components */}
      {tab == "comparisons" && (
        <div className="p-4 space-y-4 max-w-7xl mx-auto">
          {/* Date Range Selection */}
          <div className="flex gap-4 flex-1 flex-wrap">
            <Select
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value)}
            >
              <SelectTrigger className="h-full bg-white w-[160px]">
                {selectedPeriod.charAt(0).toUpperCase() +
                  selectedPeriod.slice(1)}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Day</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="half">Half Year</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>

            {/* Single Day, Month, Quarter, Half Year Inputs */}
            {/* {selectedPeriod === "single" && (
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border p-2"
                placeholder="Month (MM)"
              />
            )} */}
            {selectedPeriod === "month" && (
              <Select value={month} onValueChange={(value) => setMonth(value)}>
                <SelectTrigger className="h-full bg-white w-[160px]">
                  {month}
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedPeriod === "quarter" && (
              <Select
                value={quarter}
                onValueChange={(value) => setQuarter(value)}
              >
                <SelectTrigger className="h-full bg-white w-[160px]">
                  {quarter.toUpperCase()}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1">Q1</SelectItem>
                  <SelectItem value="q2">Q2</SelectItem>
                  <SelectItem value="q3">Q3</SelectItem>
                  <SelectItem value="q4">Q4</SelectItem>
                </SelectContent>
              </Select>
            )}
            {selectedPeriod === "half" && (
              <Select value={half} onValueChange={(value) => setHalf(value)}>
                <SelectTrigger className="h-full bg-white w-[160px]">
                  {half}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Half</SelectItem>
                  <SelectItem value="second">Second Half</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Custom Date Range */}
            {selectedPeriod === "custom" && (
              <>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2"
                  placeholder="Start Date (MM-DD)"
                />
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2"
                  placeholder="End Date (MM-DD)"
                />
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

          <div className="flex items-center gap-x-4 border-t pt-2">
            {selectedPeriod && (
              <Button
                onClick={() => setdate("")}
                size={"sm"}
                variant={"outline"}
                className="flex items-center gap-x-2 bg-teal-500 hover:bg-teal-600 hover:text-zinc-100 text-zinc-100"
              >
                Selected period: {selectedPeriod} <X />
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
          <div className="space-y-4 my-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl" contentEditable>Sales Data</CardTitle>
                <CardDescription contentEditable>
                  Sales data for selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData} margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="total_sales" />
                    <YAxis yAxisId="total_count" orientation="right" />
                    <Tooltip />
                    <Bar
                      yAxisId="total_sales"
                      dataKey="total_sales"
                      fill="#8884d8"
                    />
                    <Bar
                      yAxisId="total_count"
                      dataKey="total_sales_count"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <SalesTable data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}
