/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface AqiPollutantLineChartProps {
  data: {
    date: string;
    aqi: number;
    pm25?: number;
    pm10?: number;
    [key: string]: any;
  }[];
  title: string;
}

export const AqiPollutantLineChart = ({
  data,
  title,
}: AqiPollutantLineChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.date), "MMM dd HH:mm"),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="formattedDate"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="AQI"
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="PM2.5"
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="PM10"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
