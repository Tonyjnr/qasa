import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Cloud, Droplets, Thermometer, Wind, Eye } from 'lucide-react';
import type { CurrentWeather } from '../../../types/weather';

export const CurrentWeatherCard = ({ data }: { data: CurrentWeather }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Cloud className="h-4 w-4" /> Current Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={`https://openweathermap.org/img/wn/${data.weatherIcon}@2x.png`} 
              alt={data.weatherDescription}
              className="h-16 w-16"
            />
            <div>
              <div className="text-4xl font-bold">{Math.round(data.temperature)}°</div>
              <p className="text-sm text-muted-foreground capitalize">{data.weatherDescription}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Feels Like</div>
            <div className="font-semibold">{Math.round(data.feelsLike)}°</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Wind className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-semibold">{data.windSpeed} m/s {data.windDirection}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="font-semibold">{data.pressure} hPa</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
            <Eye className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="font-semibold">{(data.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
