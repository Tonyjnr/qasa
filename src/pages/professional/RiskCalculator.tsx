import { useState } from "react";
import {
  Calculator,
  Menu,
  UploadCloud,
  FileText,
  LayoutDashboard,
  X,
  Info,
  AlertOctagon,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { useAirQuality } from "../../hooks/useAirQuality";
import { toast, Toaster } from "sonner";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";

// --- Nav Logic (Duplicate for now, ideally shared layout) ---
const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: Calculator, label: "Risk Calculator", path: "/risk-calculator" },
  { icon: UploadCloud, label: "Data Upload", path: "/data-upload" },
  { icon: FileText, label: "Reports", path: "/reports" },
];

export const RiskCalculator = () => {
  const { data } = useAirQuality({
    enablePolling: true,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // --- Calculator State ---
  const [age, setAge] = useState(30);
  const [exposureHours, setExposureHours] = useState(2);
  const [pm25Level, setPm25Level] = useState(data?.pollutants.pm25 || 35);
  const [activityLevel, setActivityLevel] = useState<
    "low" | "moderate" | "high"
  >("moderate");
  const [riskResult, setRiskResult] = useState<{
    score: number;
    level: string;
    color: string;
  } | null>(null);

  const calculateRisk = () => {
    // Simple heuristic model for demo
    // Base risk from PM2.5
    let risk = (pm25Level / 10) * exposureHours;

    // Multipliers
    if (activityLevel === "high") risk *= 1.5;
    if (age > 60 || age < 10) risk *= 1.2;

    let level = "Low";
    let color = "text-emerald-500";

    if (risk > 20) {
      level = "Moderate";
      color = "text-yellow-500";
    }
    if (risk > 50) {
      level = "High";
      color = "text-orange-500";
    }
    if (risk > 100) {
      level = "Severe";
      color = "text-destructive";
    }

    setRiskResult({ score: Math.min(risk, 100), level, color });
    toast.success("Risk assessment calculated");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Toaster position="top-center" />

      {/* Sidebar (Shared) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[230px] flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:flex",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              Pro
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              QASA Research
            </span>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-border bg-background/50 px-6 backdrop-blur-sm lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-foreground">
              Risk Calculator
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className={COMPONENT_STYLES.card.base}>
                  <CardHeader>
                    <CardTitle>Exposure Parameters</CardTitle>
                    <CardDescription>
                      Configure the scenario to estimate health risks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* PM2.5 Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        PM2.5 Concentration (µg/m³)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          value={pm25Level}
                          onChange={(e) => setPm25Level(Number(e.target.value))}
                          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <span className="w-16 text-right font-mono font-bold text-foreground">
                          {pm25Level}
                        </span>
                      </div>
                    </div>

                    {/* Exposure Time */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Exposure Duration (Hours)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={exposureHours}
                          onChange={(e) =>
                            setExposureHours(Number(e.target.value))
                          }
                          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <span className="w-16 text-right font-mono font-bold text-foreground">
                          {exposureHours}h
                        </span>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Subject Age (Years)
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Physical Activity Level
                      </label>
                      <div className="flex gap-2">
                        {(["low", "moderate", "high"] as const).map((lvl) => (
                          <Button
                            key={lvl}
                            variant={
                              activityLevel === lvl ? "default" : "outline"
                            }
                            onClick={() => setActivityLevel(lvl)}
                            className="flex-1 capitalize"
                          >
                            {lvl}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={calculateRisk}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Calculate Risk Score
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Result Panel */}
              <div className="lg:col-span-1">
                {riskResult ? (
                  <Card
                    className={cn(
                      COMPONENT_STYLES.card.base,
                      "h-full border-t-4 border-t-primary"
                    )}
                  >
                    <CardHeader>
                      <CardTitle>Assessment Result</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div
                        className={cn(
                          "text-5xl font-black mb-2",
                          riskResult.color
                        )}
                      >
                        {riskResult.level}
                      </div>
                      <div className="text-sm text-muted-foreground mb-6">
                        Risk Category
                      </div>

                      <div className="w-full bg-muted rounded-full h-4 mb-2 overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-1000",
                            riskResult.score > 50
                              ? "bg-destructive"
                              : "bg-emerald-500"
                          )}
                          style={{
                            width: `${Math.min(riskResult.score, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Score: {riskResult.score.toFixed(1)} / 100
                      </p>

                      <div className="mt-8 p-4 bg-accent/50 rounded-xl w-full text-sm">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary mt-0.5" />
                          <p className="text-muted-foreground">
                            This model suggests{" "}
                            {riskResult.score > 50
                              ? "immediate mitigation"
                              : "standard precautions"}
                            . Subjects over 60 show 20% higher sensitivity.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 text-muted-foreground bg-accent/20">
                    <AlertOctagon className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-center">
                      Enter parameters and calculate to see risk model results.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <AIAssistant mode="professional" contextData={data} />
    </div>
  );
};
