import React, { useEffect, useState } from "react";
import SalesCard from "./card";

export default function CategorySummary({ date }: { date: string }) {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch("/api/summary/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date }),
      }); // Replace with your API endpoint
      const data = await response.json();
      setSalesData(data);
    }

    fetchSalesData();
  }, [date]);

  return (
    <>
      {salesData.map((item, index) => (
        <SalesCard
          key={index}
          name={item["Product Category"]}
          title="Category Total"
          total={item["Category Total"]}
          title2="Current Month Total"
          average={item["Current Month Total"]}
          title3="Selected Date Total"
          value3={item["Selected Date Total"]}
        />
      ))}
    </>
  );
}
