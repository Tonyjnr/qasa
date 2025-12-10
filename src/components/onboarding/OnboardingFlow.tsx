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