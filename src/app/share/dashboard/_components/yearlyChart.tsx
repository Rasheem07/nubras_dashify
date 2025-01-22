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
const YearlySalesChart = ({data, name}: {data: any[], name: string}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" tickFormatter={(value) => `${value / 1000}k`} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Legend />
            
            {/* Bar for Total Sales */}
            <Bar
              yAxisId="left"
              dataKey="Total sales amount"
              name="Total Sales"
              fill="#8884d8"
              barSize={20}
            />
            
            {/* Line for Average Sale */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Average sales amount"
              name="Average Sale"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            
            {/* Line for Sale Count */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="total_orders"
              name="Sale Count"
              stroke="#ffc658"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default YearlySalesChart;
