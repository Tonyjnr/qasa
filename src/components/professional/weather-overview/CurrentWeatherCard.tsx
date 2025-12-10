import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Cloud, Droplets, Thermometer, Wind, Eye, Gauge } from 'lucide-react';
import type { CurrentWeather } from '../../../types/weather';

export const CurrentWeatherCard = ({ data }: { data: CurrentWeather }) => {
  const metrics = [
    { label: "Humidity", value: `${data.humidity}%`, icon: Droplets, color: "text-blue-500" },
    { label: "Wind", value: `${data.windSpeed} m/s ${data.windDirection}`, icon: Wind, color: "text-slate-500" },
    { label: "Pressure", value: `${data.pressure} hPa`, icon: Gauge, color: "text-red-500" },
    { label: "Visibility", value: `${(data.visibility / 1000).toFixed(1)} km`, icon: Eye, color: "text-purple-500" },
    { label: "Feels Like", value: `${Math.round(data.feelsLike)}°`, icon: Thermometer, color: "text-orange-500" },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Cloud className="h-4 w-4" /> Current Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <img 
            src={`https://openweathermap.org/img/wn/${data.weatherIcon}@2x.png`} 
            alt={data.weatherDescription}
            className="h-16 w-16 bg-blue-500/10 rounded-full"
          />
          <div>
            <div className="text-4xl font-bold">{Math.round(data.temperature)}°</div>
            <p className="text-sm text-muted-foreground capitalize font-medium">{data.weatherDescription}</p>
          </div>
        </div>

        <div className="space-y-3">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-accent/30 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md bg-accent/50 ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
              </div>
              <span className="font-semibold text-sm">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};