import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import SalesTable from "./salesTable";

// Define the sales data structure
interface SalesData {
  location: string;
  total: number;
  average: number;
}

interface DataByYear {
  [year: string]: SalesData[];
}

const data: DataByYear = {
  "2021": [{ location: "ABU DHABI", total: 4679941, average: 4679941 }],
  "2022": [{ location: "ABU DHABI", total: 5592651, average: 5592651 }],
  "2023": [{ location: "ABU DHABI", total: 6626216, average: 6626216 }],
  "2024": [
    { location: "ABU DHABI", total: 6527808, average: 1506389.8 },
    { location: "AL AIN", total: 11195, average: 1506389.8 },
    { location: "DUBAI", total: 13923, average: 1506389.8 },
    { location: "PICKUP BY SHOP", total: 975563, average: 1506389.8 },
    { location: "SHARJA", total: 3460, average: 1506389.8 },
  ],
  "2025": [
    { location: "AL AIN", total: 8124, average: 138100 },
    { location: "PICKUP BY SHOP", total: 268076, average: 138100 },
  ],
};

const barColors = [
  "#2ecc71", // Green for positive
  "#e74c3c", // Red for negative/decline
  "#f39c12", // Gold/Yellow for neutral/average
  "#8e44ad", // Purple for variety
  "#3498db", // Blue for another variety
  "#16a085", // Teal for fresh
];

// Line color for moving average (soft blue)
const lineColor = "#3498db"; // Professional blue for moving average

// Format data for the chart
const formatDataForChart = () => {
  const allLocations = new Set<string>();
  Object.values(data).forEach((yearData) => {
    yearData.forEach((entry) => {
      allLocations.add(entry.location);
    });
  });

  return Object.keys(data).map((year) => {
    const yearData: {
      year: string;
      [location: string]: number | string;
      average: number;
    } = { year, average: 0 };

    let totalAverage = 0;
    let locationCount = 0;

    allLocations.forEach((location) => {
      const entry = data[year].find((item) => item.location === location);
      yearData[location] = entry ? entry.total : 0;
      if (entry) {
        totalAverage += entry.average;
        locationCount++;
      }
    });

    yearData.average = totalAverage / locationCount;

    return yearData;
  });
};

// Calculate moving averages
const calculateMovingAverage = (
  data: { year: string; average: number }[],
  windowSize: number = 3
) => {
  const movingAverages = [];
  for (let i = 0; i < data.length; i++) {
    const window = data.slice(Math.max(0, i - windowSize + 1), i + 1);
    const sum = window.reduce((acc, curr) => acc + curr.average, 0);
    const average = sum / window.length;
    movingAverages.push({ year: data[i].year, movingAverage: average });
  }
  return movingAverages;
};

const MultiBarGroupedChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartData = formatDataForChart();
  const movingAverageData = calculateMovingAverage(chartData);

  useEffect(() => {
    // Register Chart.js components
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarController,
      BarElement,
      LineController,
      LineElement,
      Title,
      Tooltip,
      Legend,
      PointElement
    );

    const chart = new ChartJS(chartRef.current!, {
      type: "bar",
      data: {
        labels: chartData.map((item) => item.year),
        datasets: [
          // Bars for each location (multiple bars with different predefined colors)
          ...Object.keys(chartData[0])
            .map((key, index) => {
              if (key === "year" || key === "average") return undefined;

              return {
                label: key,
                data: chartData.map(
                  (yearData) => yearData[key as keyof typeof yearData]
                ),
                backgroundColor: barColors[index % barColors.length], // Cycle through predefined colors
                borderColor: barColors[index % barColors.length],
                borderWidth: 2,
                yAxisID: "y",
                barPercentage: 0.6,
                categoryPercentage: 0.5,
                type: "bar",
              } as const;
            })
            .filter(
              (dataset): dataset is Exclude<typeof dataset, undefined> =>
                dataset !== undefined
            ),

          // Line for moving averages (same y-axis as the bars)
          {
            label: "Moving Average",
            data: movingAverageData.map((item) => item.movingAverage),
            borderColor: lineColor, // Using predefined tomato red for the line
            backgroundColor: lineColor,
            fill: false,
            tension: 0.4,
            type: "line",
            yAxisID: "y", // Same y-axis as the bars
            pointRadius: 5,
            pointBackgroundColor: lineColor,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Sales by Year with Moving Average",
            padding: 20,
            font: {
              size: 18,
            },
            color: "#4b5563", // Dark gray for the title
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for tooltips
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: lineColor,
            borderWidth: 1,
            cornerRadius: 5,
          },
          legend: {
            position: "top",
            labels: {
              color: "#4b5563", // Dark gray for legend labels
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#e5e7eb", // Light gray grid lines
            },
          },
        },
      },
    });

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartData, movingAverageData]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto my-8">
      <div className="w-full p-4 bg-white rounded-lg shadow-xl border">
        <canvas ref={chartRef} className="max-h-[500px] w-full h-full"></canvas>
      </div>
      <SalesTable data={chartData} />
    </div>
  );
};

export default MultiBarGroupedChart;
