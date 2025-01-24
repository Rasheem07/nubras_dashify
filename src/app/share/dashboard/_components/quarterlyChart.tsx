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
const HorizontalComposedChart = ({ data, name }: { data: any[]; name: string }) => {
  // Calculate dynamic maximum values for each axis
  const maxTotalSales = Math.max(...data.map((item) => item["Total sales amount"] || 0));
  const maxTotalOrders = Math.max(...data.map((item) => item["total_orders"] || 0));

  // Determine the highest maximum and add margins for better visualization
  const maxSalesRange = maxTotalSales * 1.1; // 10% margin for sales
  const maxOrdersRange = maxTotalOrders * 1.1; // 10% margin for orders

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            layout="horizontal"
            data={data}
            margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-Axis */}
            <XAxis dataKey="quarter_year" tickLine={false} />

            {/* Y-Axis for Total Sales */}
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[0, maxSalesRange]}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />

            {/* Y-Axis for Total Orders */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, maxOrdersRange]}
              tickFormatter={(value) => value.toLocaleString()}
            />

            <Tooltip />
            <Legend />

            {/* Bars for Total Sales */}
            <Bar
              yAxisId="left"
              dataKey="Total sales amount"
              fill="#8884d8"
              name="Total Sales"
              barSize={20}
            />

            {/* Line for Total Orders */}
            <Line
              yAxisId="right"
              dataKey="total_orders"
              stroke="#ffc658"
              name="Total Orders"
              strokeWidth={2}
              dot={{ r: 5 }}
            />

            {/* Line for Average Sales */}
            <Line
              yAxisId="left"
              dataKey="Average sales amount"
              stroke="#82ca9d"
              name="Average Sale"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HorizontalComposedChart;
