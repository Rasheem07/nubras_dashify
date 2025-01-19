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
const QuarterlySalesChart = ({data}: {data: any[]}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quarterly Sales Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            layout="vertical"
            barGap={5} // Adjust spacing between bars within a group
            barCategoryGap={80} // Increase spacing between groups of bars
            data={data}
            margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            
            {/* X-Axis for Total Sales */}
            <XAxis
              type="number"
              stroke="#8884d8"
              axisLine={{ stroke: "#8884d8" }}
              tick={{ fill: "#8884d8" }}
            />
            
            {/* X-Axis for Average Sale */}
            <XAxis
              type="number"
              orientation="top"
              stroke="#82ca9d"
              axisLine={{ stroke: "#82ca9d" }}
              tick={{ fill: "#82ca9d" }}
              offset={-20}
            />
            
            {/* X-Axis for Sale Count */}
            <XAxis
              type="number"
              orientation="top"
              stroke="#ffc658"
              xAxisId={2}
              axisLine={{ stroke: "#ffc658" }}
              tick={{ fill: "#ffc658" }}
              offset={-40}
            />
            
            <YAxis type="category" dataKey="quarterYear" />
            <Tooltip />
            <Legend />
            
            {/* Bars */}
            <Bar dataKey="totalSale" fill="#8884d8" name="Total Sales" barSize={20}>
              <LabelList
                dataKey="totalSale"
                position="right"
                style={{ fill: "#8884d8", fontWeight: "500" }} // Medium font
              />
            </Bar>
            <Bar dataKey="averageSale" xAxisId={2} fill="#82ca9d" name="Average Sale" barSize={20}>
              <LabelList
                dataKey="averageSale"
                position="right"
                style={{ fill: "#82ca9d", fontWeight: "500" }} // Medium font
              />
            </Bar>
            <Bar dataKey="saleCount" xAxisId={2} fill="#ffc658" name="Sale Count" barSize={20}>
              <LabelList
                dataKey="saleCount"
                position="right"
                style={{ fill: "#ffc658", fontWeight: "500" }} // Medium font
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default QuarterlySalesChart;
