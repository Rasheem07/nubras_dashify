import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MonthlySalesChart = ({ data, name }: { data: any[]; name: string }) => {
  // Calculate the max values dynamically
  const maxTotalSales = Math.max(...data.map((item) => item["Total sales amount"] || 0));
  const maxTotalOrders = Math.max(...data.map((item) => item["total_orders"] || 0));

  // Add a margin to the maximum value for better visualization
  const margin = 10; // Adjust margin as needed
  const maxSalesWithMargin = maxTotalSales + margin;
  const maxOrdersWithMargin = maxTotalOrders + margin;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Count of sales and Total sales vs average sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month_year" />
            {/* Y-Axis for Total sales and Average sales */}
            <YAxis
              yAxisId={1}
              domain={[0, maxSalesWithMargin]} // Dynamic domain based on calculated max
              tickFormatter={(value) => value.toLocaleString()} // Format for readability
            />
            {/* Y-Axis for Total orders */}
            <YAxis
              yAxisId={2}
              orientation="right"
              domain={[0, maxOrdersWithMargin]} // Dynamic domain based on calculated max
              tickFormatter={(value) => value.toLocaleString()} // Format for readability
            />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              yAxisId={1}
              dataKey="Total sales amount"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              yAxisId={2}
              dataKey="total_orders"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              yAxisId={1}
              dataKey="Average sales amount"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlySalesChart;
