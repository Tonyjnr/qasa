
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
import { format, isValid, parseISO } from "date-fns";

// Pollutant colors mapping
const POLLUTANT_COLORS: Record<string, string> = {
  pm25: "#ef4444", // red-500
  pm10: "#f97316", // orange-500
  o3: "#3b82f6",   // blue-500
  no2: "#8b5cf6",  // violet-500
  so2: "#eab308",  // yellow-500
  co: "#64748b",   // slate-500
};

interface TrendChartProps {
  data: any[];
  pollutants: string[];
}

export function TrendChart({ data, pollutants }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground bg-accent/10 rounded-lg">
        No data available for the selected range.
      </div>
    );
  }

  const formatDateTick = (value: string) => {
    // Check if value is basically a time "HH:00" or Date "YYYY-MM-DD"
    // If it's a full ISO string, format it.
    // Assuming data.date might be ISO string or just "2024-01-01"
    const date = new Date(value);
    if (isValid(date)) {
        // If data points are less than 24 (hourly for a day), show time
        if (data.length <= 24 && value.includes("T")) {
             return format(date, "HH:mm");
        }
        return format(date, "MMM dd");
    }
    return value;
  };

  return (
    <div className="h-[350px] w-full p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDateTick}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid hsl(var(--border))', 
                backgroundColor: 'hsl(var(--popover))', 
                color: 'hsl(var(--popover-foreground))',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ fontSize: '12px', fontWeight: 500 }}
            labelFormatter={(label) => {
                const d = new Date(label);
                return isValid(d) ? format(d, "PPP p") : label;
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
          {pollutants.map((pollutant) => (
            <Line
              key={pollutant}
              type="monotone"
              dataKey={pollutant}
              stroke={POLLUTANT_COLORS[pollutant.toLowerCase()] || "#888888"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name={pollutant.toUpperCase()}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
