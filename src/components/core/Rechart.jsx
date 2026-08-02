import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Rechart({ data }) {
  const chartData = data.map((item) => {
    const [year, month] = item.year_month.split("-");
    
    const date = new Date(Number(year), Number(month) - 1);

    return {
      month: date.toLocaleString("default", { month: "short", year: "numeric" }),
      total: item.total,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}