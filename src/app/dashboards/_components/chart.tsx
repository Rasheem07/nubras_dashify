// pages/index.tsx

import { useEffect, useState } from 'react';
import BarRaceChart from './BarRacechart';

// Define types for the data structure
interface DataItem {
  name: string;
  value: number;
}

export default function Chart() {
  // Initial data
  const initialData: DataItem[] = [
    { name: 'A', value: 40 },
    { name: 'B', value: 80 },
    { name: 'C', value: 60 },
    { name: 'D', value: 20 },
    { name: 'E', value: 90 },
    { name: 'F', value: 50 },
  ];

  const [data, setData] = useState<DataItem[]>(initialData);

  useEffect(() => {
    // Simulate dynamic data change every 2 seconds
    const interval = setInterval(() => {
      setData(
        data.map((d) => ({
          name: d.name,
          value: Math.floor(Math.random() * 100), // Random value for race effect
        }))
      );
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [data]);

  return (
    <div style={{ textAlign: 'center' }} className='relative'>
      <h1>Dynamic Bar Race Chart</h1>
      <BarRaceChart data={data} />
    </div>
  );
}
