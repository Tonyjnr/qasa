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
import { useTheme } from "../../../contexts/ThemeProvider";

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
  const { theme } = useTheme();

  const chartData = data.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.date), "MMM dd HH:mm"),
  }));

  // Theme-aware colors
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
  const tooltipBg = theme === 'dark' ? '#1e293b' : '#ffffff'; // slate-800 : white
  const tooltipBorder = theme === 'dark' ? '#334155' : '#e2e8f0';

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
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="formattedDate"
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: `1px solid ${tooltipBorder}`,
                  backgroundColor: tooltipBg,
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                }}
                itemStyle={{
                  color: theme === 'dark' ? '#e2e8f0' : '#334155'
                }}
                labelStyle={{
                  color: theme === 'dark' ? '#94a3b8' : '#64748b',
                  marginBottom: '0.5rem'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="#2563eb" // Blue-600
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="AQI"
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="#10b981" // Emerald-500
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="PM2.5"
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#f59e0b" // Amber-500
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                name="PM10"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};