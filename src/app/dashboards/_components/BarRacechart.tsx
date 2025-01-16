// components/HorizontalBarChart.tsx

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface HorizontalBarChartProps {
  data: DataItem[];
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<DataItem[]>(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(
        data.map((d) => ({
          name: d.name,
          value: Math.floor(Math.random() * 100), // Random value for race effect
        }))
      );
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} layout="vertical" className='duration-100'>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" barSize={20}>
          <LabelList dataKey="value" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalBarChart;
