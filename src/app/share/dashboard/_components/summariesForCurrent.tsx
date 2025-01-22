/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard.js
import { useEffect, useState } from "react";
import SalesCard from "./card";

export default function TotalsForCurrent({ date }: { date: string }) {
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch("/api/summary/current", {
        method: "POST",
        body: JSON.stringify({ date }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setSalesData(data);
    }

    fetchSalesData();
  }, [date]);

  if (!salesData) return <p>Loading...</p>;

  return (
    <div className="space-y-4 mt-[150px] p-6">
      <h1 className="text-2xl font-bold text-teal-900">
        Summaries for all categories
      </h1>
      <div className="grid min-h-32 gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 ">
        {salesData.map((card, index) => {
          return card.nubras_product_catogories !== null ? (
            <SalesCard
              key={index}
              name={card.nubras_product_catogories}
              total={card.total_amount}
              title={`Total of ${card.nubras_product_catogories}`}
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
