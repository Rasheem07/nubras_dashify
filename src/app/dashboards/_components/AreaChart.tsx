
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SalesAreaChart: React.FC<{ data: any[] }> = ({ data }) => {
  const maxTotalAmount = Math.max(...data.map((d) => d.total_amount)).toFixed(
    0
  );
  const maxCount = Math.max(...data.map((d) => d.count)).toFixed(0);

  return (
    <ResponsiveContainer className="hidden md:block" height={450} width="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="period"
          name="Dates or periods"
          label={"Dates or periods "}
          tick={false}
        />
        {/* Left Y Axis for total_amount */}
        <YAxis
          yAxisId="left"
          domain={[0, Number(maxTotalAmount)]} // Dynamic range for total_amount with some padding
          label={{
            value: "Amounts in AED",
            angle: 90, // Rotates the label by 90 degrees
            position: "insideLeft", // Optional: adjust the label position
          }}
        />

        {/* Right Y Axis for count */}
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, Number(maxCount)]} // Dynamic range for count with some padding
          label={{
            value: "Sales quantity",
            angle: 90, // Rotates the label by 90 degrees
            position: "outsideLeft", // Optional: adjust the label position
          }}
        />
        <Tooltip />
        <Legend />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="total_amount"
          stroke="#8884d8"
          name="Total sales amount"
          fillOpacity={1}
          fill="url(#colorUv)"
          stackId="1"
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="count"
          stroke="#82ca9d"
          fillOpacity={1}
          name="Total no of sales"
          fill="url(#colorPv)"
          stackId="1"
        />

      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesAreaChart;
