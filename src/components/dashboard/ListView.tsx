import { Wind, Droplets, Sun, CloudRain, Activity } from "lucide-react";
import type { AQIData } from "../../types";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
interface ListViewProps {
  data: AQIData | null;
}

// Helper function for AQI status
const getAQIStatus = (aqi: number) => {
  if (aqi <= 50)
    return {
      label: "Good",
      desc: "Air quality is satisfactory",
      color: "text-green-500",
    };
  if (aqi <= 100)
    return {
      label: "Moderate",
      desc: "Acceptable; some pollutants may be a concern",
      color: "text-yellow-500",
    };
  if (aqi <= 150)
    return {
      label: "Unhealthy for Sensitive Groups",
      desc: "Members of sensitive groups may experience health effects",
      color: "text-orange-500",
    };
  if (aqi <= 200)
    return {
      label: "Unhealthy",
      desc: "Everyone may begin to experience health effects",
      color: "text-red-500",
    };
  if (aqi <= 300)
    return {
      label: "Very Unhealthy",
      desc: "Health warnings of emergency conditions",
      color: "text-purple-500",
    };
  return {
    label: "Hazardous",
    desc: "Health alert: everyone may experience more serious health effects",
    color: "text-rose-500",
  };
};

export const ListView = ({ data }: ListViewProps) => {
  if (!data) return null;

  const status = getAQIStatus(data.aqi);

  // Common adaptive card style
  const cardClass =
    "bg-card/60 backdrop-blur-md border border-border shadow-sm rounded-2xl";

  return (
    <div className="relative h-full w-full overflow-y-auto p-4 space-y-4 text-foreground">
      <div className="relative z-10 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Weather Details
        </h2>
        <p className="text-sm text-muted-foreground">
          Comprehensive forecast & metrics
        </p>
      </div>

      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{data.aqi}</div>
              <p className="text-xs text-muted-foreground">Current Index</p>
            </div>
            <div className="text-right">
              <div className={cn("text-sm font-bold", status.color)}>
                {status.label}
              </div>
              <p className="text-xs text-muted-foreground">{status.desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              12{" "}
              <span className="text-xs text-muted-foreground font-normal">
                km/h
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              84{" "}
              <span className="text-xs text-muted-foreground font-normal">
                %
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UV Index</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              5.5{" "}
              <span className="text-xs text-muted-foreground font-normal">
                Med
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rain</CardTitle>
            <CloudRain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              12{" "}
              <span className="text-xs text-muted-foreground font-normal">
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={cardClass}>
        <CardHeader>
          <CardTitle>Pollutants</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {Object.entries(data.pollutants).map(([key, value], idx, arr) => (
            <div key={key}>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none uppercase text-muted-foreground">
                    {key}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-bold text-foreground">
                    {value}
                  </div>
                  <div className="h-2 w-16 rounded-full bg-slate-200/50">
                    <div className="h-full w-1/2 rounded-full bg-blue-500" />
                  </div>
                </div>
              </div>
              {/* Divider between items, but not after the last one */}
              {idx < arr.length - 1 && (
                <div className="h-px w-full bg-slate-200/60" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
