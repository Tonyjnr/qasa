import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

const data = [
  { name: "Sensor Logs (JSON)", value: 400, color: "#10b981" }, // emerald-500
  { name: "Images", value: 300, color: "#3b82f6" }, // blue-500
  { name: "Reports (PDF)", value: 300, color: "#f59e0b" }, // amber-500
  { name: "System", value: 200, color: "#64748b" }, // slate-500
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const StorageUsage = () => {
  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base text-foreground">Storage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
            Total: 1.2 GB / 5.0 GB used
        </div>
      </CardContent>
    </Card>
  );
};