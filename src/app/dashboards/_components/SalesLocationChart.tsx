import React from 'react'; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line
} from 'recharts';

// Defining the data structure with types
interface SalesData {
  location: string;
  total: number;
  average: number;
}

interface DataByYear {
  [year: string]: SalesData[];
}

const data: DataByYear = {
  "2021": [
    { location: "ABU DHABI", total: 4679941, average: 5856654 },
  ],
  "2022": [
    { location: "ABU DHABI", total: 5592651, average: 5856654 },
  ],
  "2023": [
    { location: "ABU DHABI", total: 6626216, average: 5856654 },
  ],
  "2024": [
    { location: "ABU DHABI", total: 6527808, average: 5856654 },
    { location: "AL AIN", total: 11195, average: 9659.5 },
    { location: "DUBAI", total: 13923, average: 13923 },
    { location: "PICKUP BY SHOP", total: 975563, average: 621819.5 },
    { location: "SHARJA", total: 3460, average: 3460 },
  ],
  "2025": [
    { location: "AL AIN", total: 8124, average: 9659.5 },
    { location: "PICKUP BY SHOP", total: 268076, average: 621819.5 },
  ],
};

// Formatting the data for the chart
const formatDataForChart = () => {
  const allLocations = new Set<string>();
  Object.values(data).forEach(yearData => {
    yearData.forEach(entry => {
      allLocations.add(entry.location);
    });
  });

  return Object.keys(data).map((year) => {
    const yearData: { year: string; [location: string]: number | string; average: number } = { year, average: 0 };

    let totalAverage = 0;
    let locationCount = 0;

    allLocations.forEach(location => {
      const entry = data[year].find(item => item.location === location);
      yearData[location] = entry ? entry.total : 0;
      if (entry) {
        totalAverage += entry.average;
        locationCount++;
      }
    });

    // Calculate the average for the year
    yearData.average = totalAverage / locationCount;

    return yearData;
  });
};

// Generate random color for each location
const getColorForLocation = (location: string) => {
  const colors: { [key: string]: string } = {
    "ABU DHABI": "#8884d8",
    "AL AIN": "#82ca9d",
    "DUBAI": "#ff7300",
    "PICKUP BY SHOP": "#ff5e57",
    "SHARJA": "#0088cc"
  };

  return colors[location] || "#000000"; // Default to black if not defined
};

const SalesLocationChart = () => {
  const chartData = formatDataForChart();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />

        {Object.keys(chartData[0]).map((key, index) => {
          // Skip the "year" and "average" fields
          if (key === "year" || key === "average") return null;

          return (
            <Bar
              key={index}
              dataKey={key} // Accessing total amount for each location
              name={key}
              fill={getColorForLocation(key)} // Assigning a color based on location
            />
          );
        })}

        {/* Add Line Chart for average values */}
        <Line
          dataKey="average"
          type="monotone"
          stroke="#ff7300"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesLocationChart;
