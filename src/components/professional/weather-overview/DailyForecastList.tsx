import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Calendar } from 'lucide-react';
import type { ForecastDaily } from '../../../types/weather';
import { format } from 'date-fns';

export const DailyForecastList = ({ data }: { data: ForecastDaily[] }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" /> 5-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((day, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-24">
                <p className="font-medium">{format(new Date(day.date), 'EEE')}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(day.date), 'MMM d')}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.weatherIcon}.png`} 
                  alt={day.weatherDescription}
                  className="h-8 w-8"
                />
                <span className="text-xs text-muted-foreground hidden sm:inline-block w-20 capitalize truncate">
                  {day.weatherDescription}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm w-32 justify-end">
                <span className="font-bold">{Math.round(day.tempMax)}°</span>
                <span className="text-muted-foreground">{Math.round(day.tempMin)}°</span>
              </div>
              
              <div className="text-xs text-blue-500 w-12 text-right">
                {Math.round((day.precipitationProbability || 0) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
