import { ActivityRecommendation } from "../../services/activityRecommendation";
import type { HourlyForecast } from "../../services/activityRecommendation";
import { Dumbbell, Bike, Footprints, Clock } from "lucide-react";
import { COMPONENT_STYLES } from "../../lib/designTokens";
import { cn } from "../../lib/utils";

interface ExerciseAdvisorProps {
  currentAQI: number;
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
    <div
      className={cn(
        "rounded-2xl p-6 flex flex-col h-full",
        COMPONENT_STYLES.card.glass
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Dumbbell className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-bold text-foreground">Exercise Advisor</h3>
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
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
            >
              <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-bold text-foreground">
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
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-[hsl(var(--aqi-good))]" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Best 2h Window
            </span>
          </div>

          <div
            className="
            rounded-xl p-3 flex justify-between items-center
            bg-[hsl(var(--aqi-good)/0.1)]
            dark:bg-[hsl(var(--aqi-good)/0.15)]
            border border-[hsl(var(--aqi-good)/0.2)]
            dark:border-[hsl(var(--aqi-good)/0.3)]
          "
          >
            <div>
              <div className="font-bold text-[hsl(var(--aqi-good))]">
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
              <div className="text-xs text-[hsl(var(--aqi-good)/0.7)] mt-0.5">
                Forecast AQI Avg: {bestWindow.avgAqi}
              </div>
            </div>

            <div
              className="
              px-2 py-1 rounded-md text-xs font-bold shadow-sm
              bg-background dark:bg-card
              text-[hsl(var(--aqi-good))]
              border border-[hsl(var(--aqi-good)/0.2)]
              dark:border-[hsl(var(--aqi-good)/0.3)]
            "
            >
              Recommended
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
