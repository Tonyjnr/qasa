import { ActivityRecommendation } from "../../services/activityRecommendation";
import type { HourlyForecast } from "../../services/activityRecommendation";
import { Dumbbell, Bike, Footprints, Clock } from "lucide-react";

interface ExerciseAdvisorProps {
  currentAQI: number;
  // expects proper forecast items. We might need to map your existing forecast data to match HourlyForecast if it doesn't already.
  // Existing 'forecast' in AQIData is: { time: string (ISO), aqi: number, icon: string }[] (from your services/airQualityService.ts)
  // This matches exactly!
  forecast: HourlyForecast[];
}

export function ExerciseAdvisor({
  currentAQI,
  forecast,
}: ExerciseAdvisorProps) {
  const bestWindow = ActivityRecommendation.findBestWindow(forecast, 2); // 2 hour window

  const activities = [
    { id: "running", label: "Running", icon: Dumbbell },
    { id: "cycling", label: "Cycling", icon: Bike },
    { id: "walking", label: "Walking", icon: Footprints },
  ] as const;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
          <Dumbbell className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-bold text-slate-900">Exercise Advisor</h3>
      </div>

      <div className="space-y-4 flex-1">
        {activities.map((act) => {
          const advice = ActivityRecommendation.getActivityAdvice(
            currentAQI,
            act.id
          );
          const Icon = act.icon;

          return (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50"
            >
              <Icon className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {act.label}
                </div>
                <div className={`text-xs font-medium ${advice.color}`}>
                  {advice.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bestWindow && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Best 2h Window
            </span>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 flex justify-between items-center">
            <div>
              <div className="text-emerald-900 font-bold">
                {new Date(bestWindow.start).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(bestWindow.end).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs text-emerald-600 mt-0.5">
                Forecast AQI Avg: {bestWindow.avgAqi}
              </div>
            </div>
            <div className="bg-white px-2 py-1 rounded-md text-xs font-bold text-emerald-600 shadow-sm border border-emerald-100">
              Recommended
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
