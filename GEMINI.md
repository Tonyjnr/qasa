Here is the implementation of the tasks outlined in `todo copy.md`. This includes the Onboarding Flow, UI Enhancements (Smooth Scroll, Resizable Panels), Role Management, and Component Refactoring.

### 1\. New Components

**File:** `src/components/onboarding/OnboardingFlow.tsx`
_Implements the onboarding questionnaire to assign roles._

```tsx
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { cn } from "../../lib/utils";
import type { UserRole } from "../../types";

interface OnboardingQuestion {
  id: string;
  question: string;
  description?: string;
  options: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    weight: { resident: number; professional: number };
  }[];
}

const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: "purpose",
    question: "What brings you to QASA?",
    description: "Help us understand your primary goal",
    options: [
      {
        value: "daily_health",
        label: "Monitor air quality for daily health decisions",
        weight: { resident: 3, professional: 0 },
      },
      {
        value: "research",
        label: "Conduct research or analyze pollution data",
        weight: { resident: 0, professional: 3 },
      },
      {
        value: "family_safety",
        label: "Keep my family safe from pollution",
        weight: { resident: 2, professional: 0 },
      },
      {
        value: "policy_making",
        label: "Inform policy decisions or environmental planning",
        weight: { resident: 0, professional: 2 },
      },
    ],
  },
  {
    id: "usage_frequency",
    question: "How often will you check air quality data?",
    description: "This helps us customize your experience",
    options: [
      {
        value: "multiple_daily",
        label: "Multiple times per day",
        weight: { resident: 2, professional: 1 },
      },
      {
        value: "daily",
        label: "Once daily",
        weight: { resident: 2, professional: 0 },
      },
      {
        value: "weekly",
        label: "Weekly for trends",
        weight: { resident: 0, professional: 2 },
      },
      {
        value: "as_needed",
        label: "As needed for specific analyses",
        weight: { resident: 0, professional: 2 },
      },
    ],
  },
  {
    id: "data_needs",
    question: "What type of information do you need?",
    description: "Select your primary interest",
    options: [
      {
        value: "simple_aqi",
        label: "Simple AQI readings and health recommendations",
        weight: { resident: 3, professional: 0 },
      },
      {
        value: "detailed_pollutants",
        label: "Detailed pollutant breakdowns (PM2.5, NO2, etc.)",
        weight: { resident: 1, professional: 2 },
      },
      {
        value: "raw_data",
        label: "Raw data for export and analysis",
        weight: { resident: 0, professional: 3 },
      },
      {
        value: "historical_trends",
        label: "Historical trends and forecasting",
        weight: { resident: 1, professional: 2 },
      },
    ],
  },
  {
    id: "technical_level",
    question: "How would you describe your technical background?",
    description: "No wrong answers - we'll tailor the interface for you",
    options: [
      {
        value: "general_user",
        label: "General user - I want simple, clear information",
        weight: { resident: 3, professional: 0 },
      },
      {
        value: "some_technical",
        label: "Some technical knowledge - comfortable with data",
        weight: { resident: 1, professional: 1 },
      },
      {
        value: "technical",
        label: "Technical professional - familiar with environmental data",
        weight: { resident: 0, professional: 2 },
      },
      {
        value: "researcher",
        label: "Researcher/Scientist - need advanced tools",
        weight: { resident: 0, professional: 3 },
      },
    ],
  },
];

interface OnboardingFlowProps {
  onComplete: (role: UserRole) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { user } = useUser();

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const isLastStep = currentStep === ONBOARDING_QUESTIONS.length - 1;
  const canProceed = answers[currentQuestion.id] !== undefined;

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      const role = calculateRole();
      onComplete(role);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const calculateRole = (): UserRole => {
    let residentScore = 0;
    let professionalScore = 0;

    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = ONBOARDING_QUESTIONS.find((q) => q.id === questionId);
      const option = question?.options.find((opt) => opt.value === answerValue);

      if (option) {
        residentScore += option.weight.resident;
        professionalScore += option.weight.professional;
      }
    });

    return professionalScore > residentScore ? "professional" : "resident";
  };

  const progress = ((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 flex-col justify-center gap-[3px] overflow-hidden rounded-full bg-white/10 p-2 backdrop-blur-sm">
              <div className="h-1 w-full rounded-full bg-[#4285F4]" />
              <div className="h-1 w-[80%] rounded-full bg-[#26A69A]" />
              <div className="h-1 w-full rounded-full bg-[#0F9D58]" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              QASA
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-slate-400">
            Let's personalize your experience in just a few questions
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>
              Question {currentStep + 1} of {ONBOARDING_QUESTIONS.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.description && (
              <CardDescription className="text-slate-400">
                {currentQuestion.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-[1.02] hover:shadow-lg",
                  answers[currentQuestion.id] === option.value
                    ? "border-blue-500 bg-blue-500/10 shadow-blue-500/20"
                    : "border-slate-700 bg-slate-900/30 hover:border-slate-600"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{option.label}</span>
                  {answers[currentQuestion.id] === option.value && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25"
          >
            {isLastStep ? "Complete Setup" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**File:** `src/components/profile/RoleToggle.tsx`
_Allows users to switch roles in settings._

```tsx
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loader2, Shield, Briefcase, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "../../types";

export function RoleToggle() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const currentRole = (user?.unsafeMetadata?.role as UserRole) || "resident";

  const handleRoleSwitch = async () => {
    if (!user) return;

    const newRole: UserRole =
      currentRole === "resident" ? "professional" : "resident";

    setIsLoading(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: newRole,
        },
      });

      toast.success(
        `Switched to ${
          newRole === "resident" ? "Resident" : "Professional"
        } mode`,
        {
          description: "Reloading dashboard...",
        }
      );

      // Reload to apply new role
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Failed to switch role:", error);
      toast.error("Failed to switch role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Account Mode
        </CardTitle>
        <CardDescription>
          Switch between Resident and Professional modes based on your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Role Display */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border">
          <div className="flex items-center gap-3">
            {currentRole === "resident" ? (
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-emerald-500" />
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">
                {currentRole === "resident"
                  ? "Resident Mode"
                  : "Professional Mode"}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentRole === "resident"
                  ? "Simplified dashboard for daily monitoring"
                  : "Advanced tools for research and analysis"}
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            ACTIVE
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4" />
            <span>
              Switch to{" "}
              <span className="font-semibold text-foreground">
                {currentRole === "resident" ? "Professional" : "Resident"}
              </span>{" "}
              mode to access{" "}
              {currentRole === "resident"
                ? "advanced research tools, data export, and API access"
                : "simplified health-focused interface"}
            </span>
          </div>

          <Button
            onClick={handleRoleSwitch}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              <>
                Switch to{" "}
                {currentRole === "resident" ? "Professional" : "Resident"} Mode
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Info Note */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <strong>Note:</strong> Your data and preferences will be preserved
          when switching modes. You can switch back anytime from your profile
          settings.
        </div>
      </CardContent>
    </Card>
  );
}
```

**File:** `src/components/ui/scroll-area.tsx`
_Custom scrollbar component using Radix UI._

```tsx
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../../lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border hover:bg-border/80 transition-colors" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
```

**File:** `src/components/ui/resizable.tsx`
_Standard shadcn-ui Resizable implementation (make sure to install `react-resizable-panels`)_

```tsx
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../../lib/utils";

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
```

**File:** `src/components/dashboard/DataCard.tsx`
_Unified card component for stats._

```tsx
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";
import { COMPONENT_STYLES } from "../../lib/designTokens";

export interface DataCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const DataCard = ({
  title,
  value,
  unit,
  icon,
  description,
  children,
  className,
  trend,
}: DataCardProps) => {
  return (
    <Card
      className={cn(
        COMPONENT_STYLES.card.glass,
        "rounded-2xl transition-transform hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && (
            <span className="text-xs text-muted-foreground">{unit}</span>
          )}
        </div>

        {trend && (
          <div
            className={cn(
              "text-xs mt-1 font-medium",
              trend.isPositive ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}% from yesterday
          </div>
        )}

        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}

        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
};
```

### 2\. Refactoring Components

**File:** `src/components/dashboard/PollutantGrid.tsx`
_Updated to use the new DataCard._

```tsx
import type { Pollutants } from "../../types";
import { DataCard } from "./DataCard";

interface PollutantGridProps {
  pollutants: Pollutants;
}

export const PollutantGrid = ({ pollutants }: PollutantGridProps) => {
  const items = [
    { label: "PM2.5", val: pollutants.pm25, unit: "µg/m³" },
    { label: "PM10", val: pollutants.pm10, unit: "µg/m³" },
    { label: "O₃", val: pollutants.o3, unit: "ppb" },
    { label: "NO₂", val: pollutants.no2, unit: "ppb" },
    { label: "SO₂", val: pollutants.so2, unit: "ppb" },
    { label: "CO", val: pollutants.co, unit: "ppm" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-foreground">Pollutants</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((p, i) => (
          <DataCard
            key={i}
            title={p.label}
            value={p.val}
            unit={p.unit}
            children={
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted/20">
                <div
                  className="h-full bg-primary/50"
                  style={{
                    width: `${Math.min((Number(p.val) / 100) * 100, 100)}%`,
                  }}
                />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};
```

**File:** `src/components/dashboard/CigaretteWidget.tsx`
_Refactored to use DataCard._

```tsx
import { CigaretteEquivalence } from "../../services/cigaretteEquivalence";
import { DataCard } from "./DataCard";

interface CigaretteWidgetProps {
  pm25: number;
}

export function CigaretteWidget({ pm25 }: CigaretteWidgetProps) {
  const cigarettes = CigaretteEquivalence.calculate(pm25);
  const impact = CigaretteEquivalence.getHealthImpact(cigarettes);
  const viz = CigaretteEquivalence.getVisualization(cigarettes);

  return (
    <DataCard
      title="Cigarette Equivalent"
      value={cigarettes.toFixed(1)}
      unit="cigs/day"
      icon={<span className="text-xl">🚬</span>}
      className="h-full"
    >
      <div className="space-y-4">
        <div className="text-3xl tracking-widest leading-relaxed break-words">
          {viz}
        </div>

        <p className="text-sm text-foreground bg-background/40 rounded-lg p-3 backdrop-blur-sm border border-border/50">
          {impact}
        </p>

        <p className="text-[10px] text-muted-foreground">
          Based on Berkeley Earth research (2016): 22 µg/m³ PM2.5 ≈ 1
          cigarette/day
        </p>
      </div>
    </DataCard>
  );
}
```

### 3\. Updates

**File:** `src/App.tsx`
_Integrates the Onboarding Flow._

```tsx
import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { AuthDialog } from "./components/auth/AuthDialog";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import type { UserRole } from "./types";
import { ThemeProvider } from "./contexts/ThemeProvider";

// Lazy load pages
const AuthView = lazy(() =>
  import("./pages/AuthView").then((m) => ({ default: m.AuthView }))
);
const ResidentDashboard = lazy(() =>
  import("./pages/resident/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const MapView = lazy(() =>
  import("./pages/resident/MapView").then((m) => ({ default: m.MapView }))
);
const TrendsView = lazy(() =>
  import("./pages/resident/TrendsView").then((m) => ({ default: m.TrendsView }))
);
const NotificationsView = lazy(() =>
  import("./pages/resident/NotificationsView").then((m) => ({
    default: m.NotificationsView,
  }))
);
const ProfileView = lazy(() =>
  import("./pages/ProfileView").then((m) => ({ default: m.ProfileView }))
);

const ProfessionalDashboard = lazy(() =>
  import("./pages/professional/Dashboard").then((m) => ({
    default: m.default,
  }))
);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoutes() {
  const { user, isLoaded } = useUser();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [role, setRole] = useState<UserRole>("resident");

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.unsafeMetadata?.role as UserRole | undefined;
      const hasCompletedOnboarding = user.unsafeMetadata?.onboardingCompleted;

      if (!hasCompletedOnboarding && !userRole) {
        setNeedsOnboarding(true);
      } else {
        setRole(userRole || "resident");
      }
    }
  }, [isLoaded, user]);

  const handleOnboardingComplete = async (newRole: UserRole) => {
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: newRole,
          onboardingCompleted: true,
        },
      });
      setRole(newRole);
      setNeedsOnboarding(false);
    }
  };

  if (!isLoaded) return <LoadingSpinner />;

  if (needsOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <Routes>
      {/* Resident Routes */}
      {role === "resident" && (
        <>
          <Route path="/" element={<ResidentDashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/trends" element={<TrendsView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/profile" element={<ProfileView />} />
        </>
      )}

      {/* Professional Routes */}
      {role === "professional" && (
        <>
          <Route path="/" element={<ProfessionalDashboard />} />
          <Route path="/profile" element={<ProfileView />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("resident");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignedOut>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <AuthView
                  onRoleSelect={setSelectedRole}
                  onGetStarted={() => setAuthOpen(true)}
                />
                <AuthDialog
                  open={authOpen}
                  onOpenChange={setAuthOpen}
                  defaultRole={selectedRole}
                />
              </>
            }
          />
        </Routes>
      </SignedOut>
      <SignedIn>
        <ProtectedRoutes />
      </SignedIn>
    </Suspense>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Toaster position="top-center" />
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
```

**File:** `src/pages/resident/Dashboard.tsx`
_Implement Resizable Panels and Custom Scrollbar._

```tsx
import { Search, Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAirQuality } from "../../hooks/useAirQuality";
import { UserButton } from "@clerk/clerk-react";
import { PollutantGrid } from "../../components/dashboard/PollutantGrid";
import { ForecastList } from "../../components/dashboard/ForecastList";
import { Sidebar } from "../../components/layout/Sidebar";
import { CigaretteWidget } from "../../components/dashboard/CigaretteWidget";
import { ExerciseAdvisor } from "../../components/dashboard/ExerciseAdvisor";
import { useState } from "react";
import { searchLocation } from "../../services/api";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { AIAssistant } from "../../components/ai/AIAssistant";
import { InteractiveMap } from "../../components/dashboard/InteractiveMap";
import { ListView } from "../../components/dashboard/ListView";
import { dark } from "@clerk/themes";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";

export const Dashboard = () => {
  const { data, isLoading, error, refresh, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to search location");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setLocation(lat, lng);
    setShowSearchResults(false);
    setSearchQuery("");
    toast.success(`Location changed to ${name}`);
  };

  // --- LOADING STATE ---
  if (isLoading && !data) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">
          Loading Air Quality Data...
        </p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Connection Failed
          </h2>
          <p className="mb-8 max-w-md text-muted-foreground">{error}</p>
          <button
            onClick={() => refresh()}
            className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full bg-background font-sans text-foreground"
    >
      <Toaster position="top-center" />

      {/* --- MAIN CONTENT PANEL --- */}
      <ResizablePanel defaultSize={70} minSize={50}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-background px-6 py-4 md:h-20 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Dashboard
                </span>
                <span className="text-xs">›</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Resident
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Air Quality Monitor
              </h1>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <div className="relative flex-1 md:w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    if (val.length >= 3) {
                      searchLocation(val).then((results) => {
                        setSearchResults(results.slice(0, 5));
                        setShowSearchResults(true);
                      });
                    } else {
                      setShowSearchResults(false);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className={`w-full rounded-full border-none bg-background py-3 pl-10 pr-4 shadow-sm ring-1 ring-border transition-shadow focus:ring-2 focus:ring-primary ${
                    isSearching ? "opacity-50" : ""
                  }`}
                  disabled={isSearching}
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-3xl border border-border bg-popover text-popover-foreground shadow-lg">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleLocationSelect(
                            result.lat,
                            result.lng,
                            result.name
                          )
                        }
                        className="w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent last:border-b-0"
                      >
                        <div className="font-medium text-foreground">
                          {result.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.state ? `${result.state}, ` : ""}
                          {result.country}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />

                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none">
                      <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                      <Bell className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            High Pollution Alert
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Air quality in Lagos is deteriorating.
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-4 cursor-pointer">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Weekly Report Ready
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your exposure summary is available.
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <UserButton
                  appearance={{
                    baseTheme: dark,
                    elements: {
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                  userProfileProps={{
                    appearance: {
                      baseTheme: dark,
                      elements: {
                        rootBox: "overflow-hidden",
                        card: "overflow-hidden",
                        scrollBox: "overflow-hidden",
                        footer: "hidden",
                        footerAction: "hidden",
                        navbarMobileMenuFooter: "hidden",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </header>

          <ScrollArea className="flex-1">
            <main className="p-4 lg:p-10 dashboard-bg">
              {/* Map Section */}
              <section className="mb-8 relative z-0">
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="text-xl font-bold text-foreground">
                    Live Overview
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />{" "}
                    Live data from network
                  </div>
                </div>

                <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-border transition-all">
                  <InteractiveMap
                    data={data}
                    onLocationChange={(lat, lng) => {
                      setLocation(lat, lng);
                      toast.info("Fetching AQI for new location...");
                    }}
                  />

                  {/* Help / Detailed View Trigger */}
                  <div className="absolute right-4 top-4 z-[500]">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-lg transition-transform hover:scale-110 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
                          title="Detailed View"
                        >
                          <span className="text-lg font-bold">?</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[68vw] h-[90vh] p-0 overflow-hidden bg-background border-border shadow-2xl rounded-3xl">
                        <div className="h-full w-full overflow-hidden">
                          <ListView data={data} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </section>

              {/* Health Insights Section */}
              {data && (
                <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <CigaretteWidget pm25={data.pollutants.pm25} />
                  <ExerciseAdvisor
                    currentAQI={data.aqi}
                    forecast={data.forecast}
                  />
                </section>
              )}

              {/* Pollutants & Forecast */}
              {data && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <PollutantGrid pollutants={data.pollutants} />
                  <ForecastList forecast={data.forecast} />
                </div>
              )}
            </main>
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* --- RIGHT SIDEBAR PANEL --- */}
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <ScrollArea className="h-full">
          {data && (
            <Sidebar
              data={data}
              isLoading={isLoading}
              onLocationSelect={handleLocationSelect}
            />
          )}
        </ScrollArea>
      </ResizablePanel>

      {/* AI Assistant */}
      <AIAssistant mode="resident" contextData={data} />
    </ResizablePanelGroup>
  );
};
```

**File:** `src/pages/professional/Dashboard.tsx`
_Updates professional dashboard with Resizable layout, Scrollbar, and real data integration._

```tsx
import { useState } from "react";
import { UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import {
  FileText,
  Calculator,
  UploadCloud,
  LayoutDashboard,
  Search,
  Bell,
  X,
  Menu,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useAirQuality } from "../../hooks/useAirQuality";
import { PollutantGrid } from "../../components/dashboard/PollutantGrid";
import { ForecastList } from "../../components/dashboard/ForecastList";
import { Sidebar } from "../../components/layout/Sidebar";
import { CigaretteWidget } from "../../components/dashboard/CigaretteWidget";
import { ExerciseAdvisor } from "../../components/dashboard/ExerciseAdvisor";
import { InteractiveMap } from "../../components/dashboard/InteractiveMap";
import { Toaster, toast } from "sonner";
import { cn } from "../../lib/utils";
import { searchLocation } from "../../services/api";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { AIAssistant } from "../../components/ai/AIAssistant";

// Sub-pages (lazy loaded in a real app, imported directly here for simplicity)
import { Overview } from "./Overview";
import { RiskCalculator } from "./RiskCalculator";
import { DataUpload } from "./DataUpload";
import { Reports } from "./Reports";
import { ResearchOverview } from "./ResearchOverview"; // Assuming this is distinct from Overview

// Mock datasets for the research overview
const MOCK_DATASETS = [
  {
    id: "1",
    name: "Lagos_Mainland_Q3.csv",
    size: "2.4 MB",
    uploadedAt: new Date().toISOString(),
    type: "csv",
    status: "ready",
  },
  {
    id: "2",
    name: "Industrial_Zone_Sensors.json",
    size: "156 KB",
    uploadedAt: new Date().toISOString(),
    type: "json",
    status: "ready",
  },
];

export default function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Use the same real data hook as Resident dashboard
  const { data, isLoading, setLocation } = useAirQuality({
    enablePolling: true,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await searchLocation(searchQuery);
      if (results.length > 0) {
        setLocation(results[0].lat, results[0].lng, results[0].name);
        toast.success(`Location changed to ${results[0].name}`);
      } else {
        toast.error("Location not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    }
  };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Live Monitor" },
    { id: "overview", icon: FileText, label: "Research Overview" },
    { id: "risk", icon: Calculator, label: "Risk Calculator" },
    { id: "upload", icon: UploadCloud, label: "Data Upload" },
    { id: "reports", icon: FileText, label: "Reports" },
  ];

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full bg-background"
    >
      <Toaster position="top-center" />

      {/* --- LEFT SIDEBAR (Navigation) --- */}
      <ResizablePanel
        defaultSize={15}
        minSize={12}
        maxSize={20}
        className={cn(
          "bg-background border-r border-border transition-all duration-300",
          !isSidebarOpen && "hidden"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center border-b border-border px-6 justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                Pro
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Research
              </span>
            </div>
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <nav className="space-y-1 p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* --- CENTER CONTENT --- */}
      <ResizablePanel defaultSize={60} minSize={40}>
        <div className="flex flex-1 flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-background px-6 py-4 md:h-20 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button
                  className="p-2 -ml-2 text-muted-foreground"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground capitalize">
                  {navItems.find((n) => n.id === activeTab)?.label}
                </h1>
              </div>
            </div>

            <div className="flex w-full items-center gap-3 md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-full border bg-background py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <ThemeToggle />
              <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent">
                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                <Bell className="h-5 w-5" />
              </button>
              <UserButton />
            </div>
          </header>

          {/* Main Scrollable Area */}
          <ScrollArea className="flex-1">
            <main className="p-4 lg:p-8 bg-muted/10 h-full">
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  {/* Map Section */}
                  <div className="h-80 w-full rounded-2xl overflow-hidden border border-border shadow-sm">
                    <InteractiveMap
                      data={data}
                      onLocationChange={(lat, lng) => setLocation(lat, lng)}
                    />
                  </div>

                  {/* Widgets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CigaretteWidget pm25={data.pollutants.pm25} />
                    <ExerciseAdvisor
                      currentAQI={data.aqi}
                      forecast={data.forecast}
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <PollutantGrid pollutants={data.pollutants} />
                    <ForecastList forecast={data.forecast} />
                  </div>
                </div>
              )}

              {activeTab === "overview" && (
                <>
                  <Overview datasets={MOCK_DATASETS} />
                  <div className="mt-8">
                    <ResearchOverview datasets={MOCK_DATASETS} />
                  </div>
                </>
              )}

              {activeTab === "risk" && <RiskCalculator data={data} />}
              {activeTab === "upload" && <DataUpload />}
              {activeTab === "reports" && <Reports />}
            </main>
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* --- RIGHT SIDEBAR (Summary) --- */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
        <ScrollArea className="h-full">
          <Sidebar
            data={data}
            isLoading={isLoading}
            onLocationSelect={(lat, lng, name) => setLocation(lat, lng, name)}
          />
        </ScrollArea>
      </ResizablePanel>

      <AIAssistant mode="professional" contextData={data} />
    </ResizablePanelGroup>
  );
}
```

**File:** `src/pages/ProfileView.tsx`
_Updated to include RoleToggle._

```tsx
import { UserProfile } from "@clerk/clerk-react";
import { RoleToggle } from "../components/profile/RoleToggle";
import { dark } from "@clerk/themes";
import { useTheme } from "../contexts/ThemeProvider";

export const ProfileView = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen w-full bg-background p-4 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clerk User Profile */}
        <div className="lg:col-span-2">
          <UserProfile
            path="/profile"
            routing="path"
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-none rounded-xl",
                navbar: "hidden",
                navbarMobileMenuButton: "hidden",
                headerTitle: "text-foreground font-bold",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary:
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                formFieldInput: "bg-background border-input text-foreground",
                footer: "hidden",
              },
            }}
          />
        </div>

        {/* Custom Settings Column */}
        <div className="space-y-6">
          <RoleToggle />

          {/* Add more custom settings components here if needed */}
        </div>
      </div>
    </div>
  );
};
```

**File:** `src/index.css`
_Updated for Smooth Scrolling._

```css
@import "tailwindcss";

/* ... (keep existing @theme block) ... */
@theme {
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));

  --color-aqi-good: hsl(var(--aqi-good));
  --color-aqi-moderate: hsl(var(--aqi-moderate));
  --color-aqi-unhealthy-sensitive: hsl(var(--aqi-unhealthy-sensitive));
  --color-aqi-unhealthy: hsl(var(--aqi-unhealthy));
  --color-aqi-very-unhealthy: hsl(var(--aqi-very-unhealthy));
  --color-aqi-hazardous: hsl(var(--aqi-hazardous));

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

@layer base {
  :root {
    /* ... (keep existing vars) ... */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221 83% 53%;
    --primary-foreground: 0 0% 100%;
    --secondary: 214 32% 91%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 214 32% 91%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 142 76% 36%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221 83% 53%;
    --radius: 0.75rem;

    /* AQI Colors (HSL) */
    --aqi-good: 158 64% 52%;
    --aqi-moderate: 45 93% 47%;
    --aqi-unhealthy-sensitive: 25 95% 53%;
    --aqi-unhealthy: 0 72% 51%;
    --aqi-very-unhealthy: 348 83% 47%;
    --aqi-hazardous: 271 91% 65%;

    --dashboard-bg: 210 40% 98%;
  }

  .dark {
    /* ... (keep existing dark vars) ... */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 217.2 32.6% 17.5%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 213 94% 68%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 142 71% 45%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 213 94% 68%;

    /* AQI Colors (Adjusted for Dark Mode) */
    --aqi-good: 158 64% 52%;
    --aqi-moderate: 45 93% 55%;
    --aqi-unhealthy-sensitive: 25 95% 60%;
    --aqi-unhealthy: 0 72% 60%;
    --aqi-very-unhealthy: 348 83% 57%;
    --aqi-hazardous: 271 91% 70%;

    --dashboard-bg: 222.2 84% 4.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }

  /* --- Smooth Scrolling --- */
  html {
    scroll-behavior: smooth;
  }
}

@layer utilities {
  .glass {
    background-color: hsl(var(--background) / 0.6);
    border: 1px solid hsl(var(--border) / 0.5);
    backdrop-filter: blur(12px);
  }

  .dashboard-bg {
    background-color: hsl(var(--dashboard-bg));
  }

  .animate-marquee {
    animation: marquee 50s linear infinite;
  }

  /* Enhanced smooth scrolling for containers */
  .smooth-scroll {
    scroll-behavior: smooth;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .smooth-scroll::-webkit-scrollbar {
    width: 0px;
    transition: width 0.3s ease;
  }

  .smooth-scroll:hover::-webkit-scrollbar {
    width: 8px;
  }
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* Hide Clerk Development Footer */
.cl-footer,
.cl-footerAction,
.cl-logoBadge,
.cl-internal-b3fm6y {
  display: none !important;
}
```
