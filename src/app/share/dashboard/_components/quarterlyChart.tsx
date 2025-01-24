import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QuarterlySalesChart = ({ data, name }: { data: any[]; name: string }) => {
  // Calculate dynamic maximum value across all datasets
  const maxTotalSales = Math.max(...data.map((item) => item["Total sales amount"] || 0));
  const maxAverageSales = Math.max(...data.map((item) => item["Average sales amount"] || 0));
  const maxTotalOrders = Math.max(...data.map((item) => item["total_orders"] || 0));

  // Determine the highest maximum and add a margin for better visualization
  const maxRange = Math.max(maxTotalSales, maxAverageSales, maxTotalOrders) * 1.1; // Add 10% margin

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={data.length > 4 && data.length < 8 ? 1200 : data.length > 8 ? 2000 : 400}
        >
          <BarChart
            layout="vertical"
            barGap={5} // Adjust spacing between bars within a group
            barCategoryGap={80} // Increase spacing between groups of bars
            data={data}
            margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* Single X-Axis with Dynamic Range */}
            <XAxis
              type="number"
              domain={[0, maxRange]} // Dynamically set the domain
              tickFormatter={(value) => value.toLocaleString()} // Format numbers
            />
            <XAxis
              type="number"
              xAxisId={2}
              orientation="top"
              domain={[0, maxRange ]} // Dynamically set the domain
              tickFormatter={(value) => value.toLocaleString()} // Format numbers
            />

            <YAxis type="category" dataKey="quarter_year" />
            <Tooltip />
            <Legend />

            {/* Bars */}
            <Bar dataKey="Total sales amount" fill="#8884d8" name="Total Sales" barSize={20}>
              <LabelList
                dataKey="Total sales amount"
                position="right"
                style={{ fill: "#8884d8", fontWeight: "500", fontSize: "14px" }} // Medium font
              />
            </Bar>
            <Bar xAxisId={2} dataKey="Average sales amount" fill="#82ca9d" name="Average Sale" barSize={20}>
              <LabelList
                dataKey="Average sales amount"
                position="right"
                style={{ fill: "#82ca9d", fontWeight: "500", fontSize: "14px" }} // Medium font
              />
            </Bar>
            <Bar xAxisId={2} dataKey="total_orders" fill="#ffc658" name="Sale Count" barSize={20}>
              <LabelList
                dataKey="total_orders"
                position="right"
                style={{ fill: "#ffc658", fontWeight: "500", fontSize: "14px" }} // Medium font
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default QuarterlySalesChart;
