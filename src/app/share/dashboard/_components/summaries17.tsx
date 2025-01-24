// pages/dashboard.js
import { useEffect, useState } from 'react';
import SalesCard from './card';

export default function Totals17() {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch('/api/summary/all');
      const data = await response.json();
      setSalesData(data);
    }

    fetchSalesData();
  }, []);

  if (!salesData) return <p>Loading...</p>;

  const cardsData = [
    // { name: 'Product Quantity', total: salesData['Total Product Quantity'], average: salesData['Average Product Quantity'], bgColor: 'bg-blue-100' },
    { name: 'Advance Payment', total: salesData['Total Advance Amount Payment'], average: salesData['Average Advance Amount Payment'], bgColor: 'bg-purple-100' },
    { name: 'Total Amount', total: salesData['Total Amount'] , average: salesData['Average Amount'], bgColor: 'bg-teal-100' },
    { name: 'Balance Amount', total: salesData['Total Balance Amount'], average: salesData['Average Balance Amount'], bgColor: 'bg-pink-100' },
  ];

  return (
    <div className="space-y-4 ">
      <h1 className="text-2xl font-bold text-teal-900">
        Summaries for All Sales 
      </h1>
    <div className="grid  min-h-64 gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {cardsData.map((card, index) => (
        <SalesCard
          key={index}
          name={card.name}
          total={card.total}
          average={card.average}
          title={`Total of ${card.name}`}
          title2={`Average of ${card.name}`}
        />
      ))}
    </div>
    </div>
  );
}
