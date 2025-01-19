/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SalesTable from "@/app/dashboards/_components/salesTable";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const QuestionVisualization = ({ params }: { params: any }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [groupBy, setGroupBy] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const parameters = React.use(params) as { questionId: string };
  const questionId = parameters.questionId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/questions/query`, {
          method: "POST",
          body: JSON.stringify({ questionId }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        console.log("Fetched Data:", data);

        // Convert numeric-like strings to numbers
        const processedData = data.data.map((row: any) => {
          const convertedRow: any = {};
          Object.entries(row).forEach(([key, value]) => {
            convertedRow[key] = isNaN(Number(value)) ? value : Number(value);
          });
          return convertedRow;
        });

        setChartData(processedData || []);
        setGroupBy(data.groupBy || []); // Storing groupBy for dynamic chart
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chartData || chartData.length === 0) {
    return <div>No data available to plot the chart.</div>;
  }

  // Dynamically extract groupBy columns
  const primaryGroupByColumn = groupBy[0]?.column || "";
  const secondaryGroupByColumn = groupBy[1]?.column || "";

  // Dynamically identify numeric columns
  const numericKeys =
    chartData.length > 0
      ? Object.keys(chartData[0]).filter(
          (key) =>
            key !== primaryGroupByColumn &&
            key !== secondaryGroupByColumn &&
            typeof chartData[0][key] === "number"
        )
      : [];

  // Group the data dynamically
  const aggregatedData = chartData.reduce((acc: any[], row: any) => {
    const primaryValue = row[primaryGroupByColumn];
    const secondaryValue = row[secondaryGroupByColumn];
    const numericValues = numericKeys.reduce(
      (acc: any, key: string) => ({ ...acc, [key]: row[key] }),
      {}
    );

    let primaryGroup = acc.find((item) => item[primaryGroupByColumn] === primaryValue);
    if (!primaryGroup) {
      primaryGroup = { [primaryGroupByColumn]: primaryValue };
      acc.push(primaryGroup);
    }

    primaryGroup[secondaryValue] = { ...primaryGroup[secondaryValue], ...numericValues };

    return acc;
  }, []);

  // Extract secondary groups dynamically
  const secondaryGroups = Array.from(
    new Set(chartData.map((row) => row[secondaryGroupByColumn]))
  );

  const colors = ["#007BFF", "#FF5733", "#28A745", "#FFC107", "#6C757D"];

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto", padding: "20px" }} className="w-full space-y-6">
      <Card className="p-6">
        <ResponsiveContainer width={"100%"} height={400}>
          {groupBy.length === 1 ? (
            <LineChart width={730} height={250} data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={primaryGroupByColumn} />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericKeys.map((key, index) => (
                <Line key={index} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </LineChart>
          ) : (
            <BarChart width={730} height={250} data={aggregatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={primaryGroupByColumn} />
              <YAxis />
              <Tooltip />
              <Legend />
              {secondaryGroups.map((group, index) => (
                <Bar
                  key={group}
                  dataKey={(d: any) => d[group] ? Object.values(d[group])[0] : 0}
                  fill={colors[index % colors.length]}
                  name={group}
                  barSize={20}
                  className="mx-12"
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card>
      <SalesTable data={chartData} className="h-full max-h-none" />
    </div>
  );
};

export default QuestionVisualization;
