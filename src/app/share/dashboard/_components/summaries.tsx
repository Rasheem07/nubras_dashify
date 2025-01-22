// pages/dashboard.js
import { useEffect, useState } from 'react';
import SalesCard from './card';

export default function Totals() {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    async function fetchSalesData() {
      const response = await fetch('/api/summary');
      const data = await response.json();
      setSalesData(data);
    }

    fetchSalesData();
  }, []);

  if (!salesData) return <p>Loading...</p>;

  const cardsData = [
    { name: 'Product Quantity', total: salesData['Total Product Quantity'], average: salesData['Average Product Quantity'], bgColor: 'bg-blue-100' },
    { name: 'Visa Payment', total: salesData['Total Visa Payment'], average: salesData['Average Visa Payment'], bgColor: 'bg-green-100' },
    { name: 'Bank Transfer Payment', total: salesData['Total Bank Transfer Payment'], average: salesData['Average Bank Transfer Payment'], bgColor: 'bg-yellow-100' },
    { name: 'Cash Payment', total: salesData['Total Cash Payment'], average: salesData['Average Cash Payment'], bgColor: 'bg-red-100' },
    { name: 'Advance Payment', total: salesData['Total Advance Amount Payment'], average: salesData['Average Advance Amount Payment'], bgColor: 'bg-purple-100' },
    { name: 'Total Amount', total: salesData['Total Amount'], average: salesData['Average Amount'], bgColor: 'bg-teal-100' },
    { name: 'Tax Amount', total: salesData['Total Tax Amount'], average: salesData['Average Tax Amount'], bgColor: 'bg-indigo-100' },
    { name: 'Amount Excluding Tax', total: salesData['Total Amount Excluding Tax'], average: salesData['Average Amount Excluding Tax'], bgColor: 'bg-orange-100' },
    { name: 'Balance Amount', total: salesData['Total Balance Amount'], average: salesData['Average Balance Amount'], bgColor: 'bg-pink-100' },
  ];

  return (
    <div className="grid mt-[150px] min-h-64 gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  p-6 bg-gray-100">
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
  );
}
