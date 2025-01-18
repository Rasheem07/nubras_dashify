/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SalesTable from "@/app/dashboards/_components/salesTable";
import React, { useEffect, useState } from "react";

const QuestionVisualization = ({ params }: { params: any }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        console.log("Fetched Data:", data); // Debug log

        setChartData(data.data);
        setGroupBy(data.groupBy); // Storing groupBy for dynamic chart
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  // Handle dynamic generation of X-axis based on groupBy

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ maxWidth: "100%", overflowX: "auto", padding: "20px" }}
      className="w-full"
    >
      <SalesTable data={chartData} className="h-full max-h-none" />
    </div>
  );
};

export default QuestionVisualization;
