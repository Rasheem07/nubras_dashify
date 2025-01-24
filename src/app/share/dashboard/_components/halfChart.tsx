import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HalfYearlySalesChart = ({ data, name }: { data: any[]; name: string }) => {
  // Calculate dynamic maximum values
  const maxTotalSales = Math.max(...data.map((item) => item["Total sales amount"] || 0));
  const maxAverageSales = Math.max(...data.map((item) => item["Average sales amount"] || 0));
  const maxTotalOrders = Math.max(...data.map((item) => item["total_orders"] || 0));

  // Add margin for better visualization
  const maxLeftAxis = Math.max(maxAverageSales, maxTotalOrders) * 1.1; // Left Y-Axis (Average Sales & Sale Count)
  const maxRightAxis = maxTotalSales * 1.1; // Right Y-Axis (Total Sales)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="half_year" />
            {/* Dynamic Left Y-Axis */}
            <YAxis
              yAxisId="left"
              domain={[0, maxLeftAxis]}
              tickFormatter={(value) => value.toLocaleString()} // Format numbers
            />
            {/* Dynamic Right Y-Axis */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, maxRightAxis]}
              tickFormatter={(value) => value.toLocaleString()} // Format numbers
            />
            <Tooltip />
            <Legend />
            {/* Bar for Sale Count */}
            <Bar
              yAxisId="left"
              dataKey="total_orders"
              fill="#82ca9d"
              name="Sale Count"
              barSize={24}
            />
            {/* Line for Total Sales */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Total sales amount"
              stroke="#8884d8"
              name="Total Sales amount"
            />
            {/* Line for Average Sale */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Average sales amount"
              stroke="#ffc658"
              name="Average Sales amount"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HalfYearlySalesChart;
