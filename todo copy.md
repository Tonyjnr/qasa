# Onboarding Flow, UI Enhancements & Role Management Implementation

## Objective

Implement an intelligent onboarding flow with role assignment, enhance UI with smooth scrolling and custom scrollbars, add resizable panels for layout control, enable role switching in user profiles, and unify the design system across Resident and Professional dashboards.

---

## 1. Implement Onboarding Flow with Role Assignment

### Create Onboarding Component Structure

**File: `src/components/onboarding/OnboardingFlow.tsx`**

```typescript
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

### Integrate Onboarding into App Flow

**File: `src/App.tsx`** (or your main routing file)

```typescript
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import type { UserRole } from "./types";

function App() {
  const { user, isLoaded } = useUser();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.unsafeMetadata?.role as UserRole | undefined;
      const hasCompletedOnboarding = user.unsafeMetadata?.onboardingCompleted;

      if (!hasCompletedOnboarding) {
        setNeedsOnboarding(true);
      } else {
        setUserRole(role || "resident");
      }
    }
  }, [isLoaded, user]);

  const handleOnboardingComplete = async (role: UserRole) => {
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role,
          onboardingCompleted: true,
        },
      });
      setUserRole(role);
      setNeedsOnboarding(false);
    }
  };

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (needsOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // ... rest of your app routing
}
```

---

## 2. Add Smooth Scrolling

### Install Dependency

```bash
npm install locomotive-scroll
# or
yarn add locomotive-scroll
```

### Create Smooth Scroll Provider

**File: `src/contexts/SmoothScrollProvider.tsx`**

```typescript
import { createContext, useContext, useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

interface SmoothScrollContextType {
  scroll: LocomotiveScroll | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  scroll: null,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    scrollRef.current = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]") as HTMLElement,
      smooth: true,
      multiplier: 1,
      class: "is-inview",
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    return () => {
      scrollRef.current?.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scroll: scrollRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
```

### Alternative: CSS-only Smooth Scrolling

**File: `src/index.css`** (Add to existing styles)

```css
/* Smooth scrolling for entire app */
html {
  scroll-behavior: smooth;
}

/* Enhanced smooth scrolling for specific containers */
.smooth-scroll {
  scroll-behavior: smooth;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Webkit browsers scrollbar smoothing */
.smooth-scroll::-webkit-scrollbar {
  width: 0px;
  transition: width 0.3s ease;
}

.smooth-scroll:hover::-webkit-scrollbar {
  width: 8px;
}
```

### Apply to Dashboard Containers

```typescript
// In Dashboard components, add to main scrollable container:
<main className="flex-1 overflow-y-auto smooth-scroll p-4 lg:p-10">
  {/* Content */}
</main>
```

---

## 3. Customize Scrollbar with Radix UI Theme

### Install Radix Scrollbar

```bash
npm install @radix-ui/react-scroll-area
# or
yarn add @radix-ui/react-scroll-area
```

### Create Custom Scrollbar Component

**File: `src/components/ui/scroll-area.tsx`**

```typescript
import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../../lib/utils";

const ScrollArea = React.forwardRef
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

const ScrollBar = React.forwardRef
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

### Apply Custom Scrollbar to Dashboards

```typescript
import { ScrollArea } from "../../components/ui/scroll-area";

// Replace overflow-y-auto main containers with:
<ScrollArea className="flex-1 h-full">
  <main className="p-4 lg:p-10">{/* Dashboard content */}</main>
</ScrollArea>;
```

---

## 4. Add Resizable Panels for Sidebar/Dashboard

### Install Resizable Component

```bash
npx shadcn-ui@latest add resizable
```

### Implement Resizable Layout for Resident Dashboard

**File: `src/pages/resident/Dashboard.tsx`**

```typescript
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";

export const Dashboard = () => {
  const { data, isLoading, error, setLocation } = useAirQuality({
    enablePolling: true,
  });

  // ... other state and handlers ...

  if (isLoading && !data) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full bg-background"
    >
      <Toaster position="top-center" />

      {/* Main Dashboard Content */}
      <ResizablePanel defaultSize={70} minSize={50}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-background px-6 py-4 md:h-20 md:flex-row md:items-center md:py-0">
            {/* ... header content ... */}
          </header>

          {/* Scrollable Content with Custom Scrollbar */}
          <ScrollArea className="flex-1">
            <main className="p-4 lg:p-10 dashboard-bg">
              {/* Map Section */}
              <section className="mb-8 relative z-0">
                {/* ... map content ... */}
              </section>

              {/* Health Insights */}
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

      {/* Resizable Handle */}
      <ResizableHandle
        withHandle
        className="bg-border hover:bg-primary/20 transition-colors"
      />

      {/* Right Sidebar */}
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

### Implement Resizable Layout for Professional Dashboard

**File: `src/pages/professional/Dashboard.tsx`**

```typescript
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function ProfessionalDashboard() {
  // ... state and handlers ...

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen w-full bg-background"
    >
      <Toaster position="top-center" />

      {/* Left Sidebar */}
      <ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
        <aside className="h-full flex flex-col border-r border-border bg-background">
          <div className="flex h-20 items-center border-b border-border px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                Pro
              </div>
              <span className="text-lg font-bold tracking-tight">Research</span>
            </div>
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
        </aside>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* Main Content Area */}
      <ResizablePanel defaultSize={60} minSize={40}>
        <div className="flex flex-1 flex-col h-full">
          {/* Header */}
          <header className="flex h-auto flex-col justify-between gap-4 border-b border-border bg-background px-6 py-4 md:h-20 md:flex-row md:items-center">
            {/* ... header content ... */}
          </header>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
            <main className="p-4 lg:p-10">
              {/* Conditional tab content */}
              {activeTab === "dashboard" && (
                <>{/* Map, widgets, pollutants, forecast */}</>
              )}
              {activeTab === "overview" && (
                <ResearchOverview datasets={datasets} />
              )}
              {activeTab === "risk" && <RiskCalculator data={data} />}
              {activeTab === "upload" && <DataUpload />}
              {activeTab === "reports" && <Reports />}
            </main>
          </ScrollArea>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20" />

      {/* Right Sidebar */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <ScrollArea className="h-full">
          <Sidebar
            data={data}
            isLoading={isLoading}
            onLocationSelect={handleLocationSelect}
          />
        </ScrollArea>
      </ResizablePanel>

      {/* AI Assistant */}
      <AIAssistant mode="professional" contextData={data} />
    </ResizablePanelGroup>
  );
}
```

---

## 5. Add Role Toggle in User Profile

### Create Role Toggle Component

**File: `src/components/profile/RoleToggle.tsx`**

```typescript
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

### Integrate into Profile View

**File: `src/pages/ProfileView.tsx`**

```typescript
import { UserProfile } from "@clerk/clerk-react";
import { RoleToggle } from "../components/profile/RoleToggle";
import { dark } from "@clerk/themes";

export const ProfileView = () => {
  return (
    <div className="min-h-screen w-full bg-background p-4 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clerk User Profile */}
        <div className="lg:col-span-2">
          <UserProfile
            path="/profile"
            routing="path"
            appearance={{
              baseTheme: dark,
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

          {/* Future: Notification Preferences, Location Management */}
        </div>
      </div>
    </div>
  );
};
```

---

### 2\. Component Design: `DataCard`

**File:** `src/components/dashboard/DataCard.tsx`

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
  children?: ReactNode; // For custom visualizations like the cigarette emojis
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

### 3\. Unit Testing: `DataCard.test.tsx`

**File:** `src/components/dashboard/DataCard.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { DataCard } from "./DataCard";
import { Activity } from "lucide-react";

describe("DataCard", () => {
  it("renders title, value, and unit correctly", () => {
    render(<DataCard title="PM2.5" value={12.5} unit="µg/m³" />);

    expect(screen.getByText("PM2.5")).toBeInTheDocument();
    expect(screen.getByText("12.5")).toBeInTheDocument();
    expect(screen.getByText("µg/m³")).toBeInTheDocument();
  });

  it("renders without unit gracefully", () => {
    render(<DataCard title="AQI" value={50} />);

    expect(screen.getByText("AQI")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <DataCard
        title="Health"
        value="Good"
        icon={<Activity data-testid="icon" />}
      />
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <DataCard title="Visualization" value={0}>
        <div data-testid="viz">Custom Viz</div>
      </DataCard>
    );

    expect(screen.getByTestId("viz")).toBeInTheDocument();
  });
});
```

### 4\. Refactoring: `PollutantGrid`

**File:** `src/components/dashboard/PollutantGrid.tsx`

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
            // Optional: visual bar as children
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

### 5\. Refactoring: `CigaretteWidget`

**File:** `src/components/dashboard/CigaretteWidget.tsx`

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
