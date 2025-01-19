/* eslint-disable @typescript-eslint/no-explicit-any */
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

const MonthlySalesChart = ({data}: {data: any[]}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Sales Data</CardTitle>
        <CardDescription>Count of sales and Total sales vs average sales</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId={1} />
            <YAxis yAxisId={2} orientation="right" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              yAxisId={1}
              dataKey="dailyTotalSaleAmount"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              yAxisId={2}
              dataKey="countOfSales"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              yAxisId={1}
              dataKey="averageSale"
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
