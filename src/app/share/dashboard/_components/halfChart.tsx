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
const HalfYearlySalesChart = ({data}: {data: any[]}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Half-Yearly Sales Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="interval" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            {/* Bar for Sale Count */}
            <Bar
              yAxisId="left"
              dataKey="saleCount"
              fill="#82ca9d"
              name="Sale Count"
              barSize={24}
            />
            {/* Line for Total Sales */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalSale"
              stroke="#8884d8"
              name="Total Sales"
            />
            {/* Line for Average Sale */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageSale"
              stroke="#ffc658"
              name="Average Sale"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HalfYearlySalesChart;
