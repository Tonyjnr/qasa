/* eslint-disable react-hooks/set-state-in-effect */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
import { useState, useEffect } from "react";
import { Info, AlertOctagon, Activity, Clock, User, Wind } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";
import type { AQIData } from "../../types";

export const RiskCalculator = ({ data }: { data: AQIData }) => {
  // --- Calculator State ---
  const [age, setAge] = useState(30);
  const [exposureHours, setExposureHours] = useState(2);
  const [pm25Level, setPm25Level] = useState(data?.pollutants.pm25 || 35);
  const [activityLevel, setActivityLevel] = useState<
    "low" | "moderate" | "high"
  >("moderate");

  // Derived state for risk result (auto-calculates)
  const [riskResult, setRiskResult] = useState<{
    score: number;
    level: string;
    color: string;
    description: string;
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    // Simple heuristic model
    // Base risk from PM2.5
    let risk = (pm25Level / 10) * exposureHours;

    // Multipliers
    if (activityLevel === "high") risk *= 1.5;
    if (age > 60 || age < 10) risk *= 1.2;

    let level = "Low";
    let color = "text-emerald-500";
    let description =
      "Current conditions suggest a low health risk for the average individual. Continue normal activities.";
    let recommendations = [
      "Maintain awareness of air quality reports.",
      "Enjoy outdoor activities safely.",
    ];

    if (risk > 20) {
      level = "Moderate";
      color = "text-amber-500";
      description =
        "Moderate health risk indicated. Sensitive groups should consider limiting prolonged outdoor exertion.";
      recommendations = [
        "Check daily air quality forecasts.",
        "Sensitive individuals should limit strenuous outdoor activities.",
      ];
    }
    if (risk > 50) {
      level = "High";
      color = "text-orange-500";
      description =
        "High health risk. Everyone may begin to experience health effects; sensitive groups may experience more serious health effects.";
      recommendations = [
        "Reduce prolonged or heavy exertion outdoors.",
        "Sensitive groups should avoid outdoor activities.",
        "Consider wearing a mask if outdoors.",
      ];
    }
    if (risk > 100) {
      level = "Severe";
      color = "text-destructive";
      description =
        "Severe health risk. Health warnings of emergency conditions. The entire population is more likely to be affected.";
      recommendations = [
        "Avoid all outdoor physical activity.",
        "Keep windows and doors closed.",
        "Use air purifiers indoors if available.",
      ];
    }

    setRiskResult({
      score: Math.min(risk, 100),
      level,
      color,
      description,
      recommendations,
    });
  }, [age, exposureHours, pm25Level, activityLevel]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={COMPONENT_STYLES.card.base}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Exposure
                Parameters
              </CardTitle>
              <CardDescription>
                Configure the scenario to estimate health risks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* PM2.5 Input */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Wind className="h-4 w-4" /> PM2.5 Concentration (µg/m³)
                  </label>
                  <span className="font-mono font-bold text-foreground bg-accent px-2 py-1 rounded">
                    {pm25Level}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={pm25Level}
                  onChange={(e) => setPm25Level(Number(e.target.value))}
                  className={cn(
                    "w-full appearance-none rounded-full h-2 cursor-pointer",
                    "bg-slate-200 dark:bg-slate-700",
                    // Thumb styles
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
                    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500",
                    "[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                    // Focus styles
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                />
              </div>

              {/* Exposure Time */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Exposure Duration (Hours)
                  </label>
                  <span className="font-mono font-bold text-foreground bg-accent px-2 py-1 rounded">
                    {exposureHours}h
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={exposureHours}
                  onChange={(e) => setExposureHours(Number(e.target.value))}
                  className={cn(
                    "w-full appearance-none rounded-full h-2 cursor-pointer",
                    "bg-slate-200 dark:bg-slate-700",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
                    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500",
                    "[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                />
              </div>

              {/* Age */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Subject Age (Years)
                  </label>
                  <span className="font-mono font-bold text-foreground bg-accent px-2 py-1 rounded">
                    {age}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={cn(
                    "w-full appearance-none rounded-full h-2 cursor-pointer",
                    "bg-slate-200 dark:bg-slate-700",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
                    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500",
                    "[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  )}
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Physical Activity Level
                </label>
                <div className="flex gap-2">
                  {(["low", "moderate", "high"] as const).map((lvl) => (
                    <Button
                      key={lvl}
                      variant={activityLevel === lvl ? "default" : "outline"}
                      onClick={() => setActivityLevel(lvl)}
                      className="flex-1 capitalize"
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preset Scenarios */}
          <Card className={COMPONENT_STYLES.card.base}>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
                Presets
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="ghost"
                className="h-auto py-3 flex flex-col gap-1 border border-dashed border-border"
                onClick={() => {
                  setAge(30);
                  setExposureHours(1);
                  setPm25Level(30);
                  setActivityLevel("moderate");
                  toast.info("Loaded: Typical Commute");
                }}
              >
                <span className="font-bold">Commute</span>
              </Button>
              <Button
                variant="ghost"
                className="h-auto py-3 flex flex-col gap-1 border border-dashed border-border"
                onClick={() => {
                  setAge(25);
                  setExposureHours(2);
                  setPm25Level(75);
                  setActivityLevel("high");
                  toast.info("Loaded: Sport");
                }}
              >
                <span className="font-bold">Sport</span>
              </Button>
              <Button
                variant="ghost"
                className="h-auto py-3 flex flex-col gap-1 border border-dashed border-border"
                onClick={() => {
                  setAge(70);
                  setExposureHours(8);
                  setPm25Level(50);
                  setActivityLevel("low");
                  toast.info("Loaded: Elderly");
                }}
              >
                <span className="font-bold">Elderly</span>
              </Button>
              <Button
                variant="ghost"
                className="h-auto py-3 flex flex-col gap-1 border border-dashed border-border"
                onClick={() => {
                  setAge(8);
                  setExposureHours(4);
                  setPm25Level(90);
                  setActivityLevel("moderate");
                  toast.info("Loaded: Child");
                }}
              >
                <span className="font-bold">Child</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-1">
          {riskResult ? (
            <Card
              className={cn(
                "h-full border-t-4 sticky top-4 overflow-hidden",
                riskResult.score > 50
                  ? "border-t-destructive"
                  : "border-t-emerald-500"
              )}
            >
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Assessment Result
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 py-6">
                {/* Score Circle */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 mb-4">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${
                          (riskResult.score / 100) * 351.86
                        } 351.86`}
                        className={
                          riskResult.score > 50
                            ? "text-destructive"
                            : "text-emerald-500"
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold">
                        {riskResult.score.toFixed(0)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div
                    className={cn("text-xl font-bold mb-1", riskResult.color)}
                  >
                    {riskResult.level} Risk
                  </div>
                </div>

                {/* Description Box */}
                <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {riskResult.description}
                  </p>
                </div>

                {/* Recommendations List */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {riskResult.recommendations.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start text-sm p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <span
                          className={cn(
                            "mt-1.5 h-1.5 w-1.5 rounded-full shrink-0",
                            riskResult.score > 50
                              ? "bg-destructive"
                              : "bg-emerald-500"
                          )}
                        />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 text-muted-foreground bg-accent/20">
              <AlertOctagon className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-center">
                Adjust parameters to see risk analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
