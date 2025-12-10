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
        {/* Headings */}
        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <div className="w-24">Date</div>
          <div className="w-28">Conditions</div>
          <div className="w-32 text-right">Temp (H/L)</div>
          <div className="w-16 text-right">Precip</div>
        </div>

        <div className="space-y-2">
          {data.map((day, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
              <div className="w-24">
                <p className="font-medium text-foreground">{format(new Date(day.date), 'EEE')}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(day.date), 'MMM d')}</p>
              </div>
              
              <div className="flex items-center gap-2 w-28">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.weatherIcon}.png`} 
                  alt={day.weatherDescription}
                  className="h-8 w-8"
                />
                <span className="text-xs text-muted-foreground capitalize truncate">
                  {day.weatherDescription}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 text-sm w-32">
                <span className="font-bold">{Math.round(day.tempMax)}°</span>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-muted-foreground">{Math.round(day.tempMin)}°</span>
              </div>
              
              <div className="text-xs font-medium text-blue-500 w-16 text-right">
                {Math.round((day.precipitationProbability || 0) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};