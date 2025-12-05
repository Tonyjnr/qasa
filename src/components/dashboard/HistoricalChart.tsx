import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { type DailySummary } from "../../services/historicalData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface HistoricalChartProps {
  data: DailySummary[];
  trend?: {
    direction: "improving" | "worsening" | "stable";
    confidence: number;
    slope: number;
  };
}

export function HistoricalChart({ data, trend }: HistoricalChartProps) {
  // Format data for Recharts
  const chartData = data.map((d) => ({
    date: format(new Date(d.date), "MMM dd"),
    aqi: d.aqiAvg,
  }));

  const getGradientColor = (aqi: number) => {
    // This is just for the gradient definition ID, logic is handled in the SVG defs usually
    // or we can settle for a single color for the area
    if (aqi > 150) return "#ef4444"; // red-500
    if (aqi > 100) return "#f97316"; // orange-500
    if (aqi > 50) return "#eab308"; // yellow-500
    return "#22c55e"; // green-500
  };

  // Determine current average color
  const avg = data.reduce((sum, d) => sum + d.aqiAvg, 0) / (data.length || 1);
  const mainColor = getGradientColor(avg);

  return (
    <Card className="bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900">
            30-Day AQI Trend
          </CardTitle>
          {trend && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                trend.direction === "improving"
                  ? "bg-green-100 text-green-700"
                  : trend.direction === "worsening"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {trend.direction === "improving" && (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.direction === "worsening" && (
                <TrendingUp className="h-3 w-3" />
              )}
              {trend.direction === "stable" && <Minus className="h-3 w-3" />}
              <span className="uppercase tracking-wide">{trend.direction}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={mainColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={mainColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#64748b", marginBottom: "4px" }}
              />
              <ReferenceLine
                y={50}
                stroke="#22c55e"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{
                  value: "Good",
                  position: "insideRight",
                  fontSize: 10,
                  fill: "#22c55e",
                }}
              />
              <ReferenceLine
                y={100}
                stroke="#eab308"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
                label={{
                  value: "Moderate",
                  position: "insideRight",
                  fontSize: 10,
                  fill: "#eab308",
                }}
              />

              <Area
                type="monotone"
                dataKey="aqi"
                stroke={mainColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAqi)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
