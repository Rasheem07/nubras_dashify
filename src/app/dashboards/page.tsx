"use client";
import { useEffect, useState } from "react";
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
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import NumberCard from "./_components/NumberCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  const [tab, setTab] = useState("general");
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
  const [selectedCategory, setSelectedCategory] = useState("NUBRAS GENTS KANDORA SECTION"); // Category selection
  const [selectedLocation, setSelectedLocation] = useState("ABU DHABI"); // Location selection

  // Fetch default yearly data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/sum/total", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        setData({
          totalAmount: result.totalAmountSum || 0,
          totalProfit: result.amountExcludingTaxSum || 0,
          totalExpenses: result.taxAmountSum || 0,
          averageSales: result.avgMonthlySales || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        const response = await fetch("/api/dashboard/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: selectedPeriod,
            month,
            quarter,
            half,
            startDate,
            endDate,
          }),
        });
        const result = await response.json();
        setChartData(result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [startDate, endDate, selectedPeriod, month, quarter, half]);

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
        const response = await fetch("/api/dashboard/sales/category", {
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
          }),
        });
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
        const response = await fetch("/api/dashboard/sales/location", {
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
        });
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

  return (
    <div className="w-full overflow-y-auto max-h-[calc(100vh-56px)]">
      <div className="bg-white p-6 pb-0 w-full border-b border-gray-300">
        <div className="flex items-center justify-center w-full">
        <Image
              src="/icons/full-logo.jpeg"
              height={120}
              width={140}
              alt="Al Nubras Logo"
              className="aspect-auto mix-blend-difference"
            />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-x-2">
            <Image
              src="/icons/Logo.jpeg"
              height={40}
              width={40}
              alt="Al Nubras Logo"
              className="aspect-auto mix-blend-difference"
            />
            <h1 className="text-lg font-semibold text-gray-800">
              Al-Nubras Sales Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-x-4">
            <Button size="icon" variant="ghost">
              <LucideShare2 />
            </Button>
            <Button size="icon" variant="ghost">
              <Timer />
            </Button>
            <Button size="icon" variant="ghost">
              <Bookmark />
            </Button>
            <Button size="icon" variant="ghost">
              <Info />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          {["general", "sales", "transactions"].map((tabName) => (
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

      {/* Date Range Selection */}
      <div className="mt-4 flex gap-4 flex-1 mx-4">
        <Select
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value)}
        >
          <SelectTrigger className="h-full bg-white w-[160px]">
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
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
        {selectedPeriod === "single" && (
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2"
            placeholder="Month (MM)"
          />
        )}
        {selectedPeriod === "month" && (
          <Select value={month} onValueChange={(value) => setMonth(value)}>
            <SelectTrigger className="h-full bg-white w-[160px]">{month}</SelectTrigger>
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
          <Select value={quarter} onValueChange={(value) => setQuarter(value)}>
            <SelectTrigger className="h-full bg-white w-[160px]">{quarter.toUpperCase()}</SelectTrigger>
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
            <SelectTrigger className="h-full bg-white w-[160px]">{half}</SelectTrigger>
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
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 px-4">
        <NumberCard
          title="Total Sales"
          description="The total sales amount"
          value={`AED ${data.totalAmount}`}
          icon={Banknote}
        />
        <NumberCard
          title="Total Revenue"
          description="The total profit made"
          value={`AED ${data.totalProfit}`}
          icon={TrendingUp}
        />
        <NumberCard
          title="Total Expenses"
          description="The total expenses incurred"
          value={`AED ${data.totalExpenses}`}
          icon={TrendingDown}
        />
        <NumberCard
          title="Average sales"
          description="Average sales per month"
          value={`AED ${data.averageSales.toFixed(2)}`}
          icon={ShoppingCart}
        />
      </div>

      {/* Category Selection Card */}

      {/* Location Selection Card */}

      {/* Chart Components */}
      <div className="grid grid-cols-2 gap-4 my-4 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales Data</CardTitle>
            <CardDescription>Sales data for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="#8884d8" />
                <Bar dataKey="total_sales_count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between w-full pr-6">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>
                Sales data grouped by categories
              </CardDescription>
            </CardHeader>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="h-full bg-white max-w-max">
                {selectedCategory || "Select Category"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NUBRAS GENTS KANDORA SECTION">NUBRAS GENTS KANDORA SECTION</SelectItem>
                <SelectItem value="NUBRAS JUNIOR KID'S SECTION">NUBRAS JUNIOR KID&apos;S SECTION</SelectItem>
                <SelectItem value="NUBRAS GENTS ITEM'S SECTION">NUBRAS GENTS ITEM&apos;S SECTION</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="#2196f3" />
                <Bar dataKey="total_quantity" fill="#343244" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center justify-between w-full">
            <CardHeader>
              <CardTitle>Sales by Locations</CardTitle>
              <CardDescription>Sales data grouped by locations</CardDescription>
            </CardHeader>
            <Select
              value={selectedLocation}
              onValueChange={(value) => setSelectedLocation(value)}
            >
              <SelectTrigger className="h-full bg-white max-w-max mr-6">
                {selectedLocation}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABU DHABI">ABU DHABI</SelectItem>
                <SelectItem value="PICKUP BY SHOP">PICKUP BY SHOP</SelectItem>
                <SelectItem value="SHARJAH">SHARJAH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={locationData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="#82ca9d" />
                <Bar dataKey="total_quantity" fill="#343244" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
