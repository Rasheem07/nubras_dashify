/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/dashboard.js
import { useEffect, useState } from "react";
import SalesCard from "./card";

export default function TotalsForCurrent({ date }: { date: string }) {
  const [salesData, setSalesData] = useState<{
    category: any[];
    payment: any[];
  }>({ category: [], payment: [] });

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
    <>
      <div className="grid min-h-32 gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 ">
        {salesData.category.map((card, index) => {
          return card.product_categories !== null ? (
            <SalesCard
              key={index}
              name={card.product_categories}
              total={card.total_amount}
              title={`Total of ${card.product_categories}`}
            />
          ) : null;
        })}
      </div>
      <div className="grid min-h-32 gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 ">
        {salesData.payment.map((card, index) => {
          return card.product_categories !== null ? (
            <SalesCard
              key={index}
              name={card.invoice_type}
              total={card.total_amount}
              title={`Total of ${card.invoice_type}`}
            />
          ) : null;
        })}
      </div>
    </>
  );
}
