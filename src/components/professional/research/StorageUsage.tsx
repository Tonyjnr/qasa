/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only render label if slice is big enough
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export interface StorageMetrics {
  totalUsedBytes: number;
  totalLimitBytes: number;
  breakdown: { name: string; value: number; color: string }[];
}

export const StorageUsage = ({ metrics }: { metrics?: StorageMetrics }) => {
  // Fallback / Skeleton data if loading or empty
  const displayData =
    metrics && metrics.breakdown.length > 0
      ? metrics.breakdown
      : [{ name: "Empty", value: 1, color: "#e2e8f0" }];

  const totalUsed = metrics ? metrics.totalUsedBytes : 0;
  const totalLimit = metrics ? metrics.totalLimitBytes : 5368709120; // 5GB default

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          Storage Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={metrics?.breakdown.length ? renderCustomizedLabel : undefined}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatBytes(value)}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-foreground">
            {formatBytes(totalUsed)} used of {formatBytes(totalLimit)}
          </p>
          <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500" 
              style={{ width: `${Math.min((totalUsed / totalLimit) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};