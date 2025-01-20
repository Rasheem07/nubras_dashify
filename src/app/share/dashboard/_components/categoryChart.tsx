
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CategoryChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NUBRAS GENTS ITEM&apos;S SECTION</CardTitle>
        <CardDescription>Sales data for NUBRAS GENTS ITEM&apos;S SECTION</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width={"100%"} height={400}>

        <BarChart data={data} margin={{left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nubras_product_list" />
          <YAxis />
          <YAxis yAxisId={2} orientation="right" />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" yAxisId={2} />
          <Bar dataKey="total_amount" fill="#82ca9d" />
        </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
