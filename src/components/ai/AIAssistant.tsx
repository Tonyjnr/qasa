import { useState, useRef, useEffect } from "react";
import { Bot, X, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
};

interface AIAssistantProps {
  mode: "resident" | "professional";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextData?: any; // Data to "feed" the AI for context
}

export function AIAssistant({ mode, contextData }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      text:
        mode === "resident"
          ? "Hi! I'm QASA AI. I can help you understand today's air quality and plan your outdoor activities. How can I help?"
          : "QASA Research Assistant online. I can help you analyze datasets, calculate risk models, or generate reports from your sensor network.",
      timestamp: new Date(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsLoading(true);

    // Mock AI Latency and Logic
    setTimeout(() => {
      let responseText = "I'm processing that request...";
      const lowerInput = newUserMsg.text.toLowerCase();

      if (mode === "resident") {
        if (
          lowerInput.includes("run") ||
          lowerInput.includes("jog") ||
          lowerInput.includes("exercise")
        ) {
          const aqi = contextData?.aqi || 80; // Fallback if no data
          if (aqi < 50)
            responseText = `With an AQI of ${aqi}, it's a great time for a run! The air is clean.`;
          else if (aqi < 100)
            responseText = `The AQI is ${aqi} (Moderate). You can go for a run, but if you're sensitive, maybe keep it short.`;
          else
            responseText = `I wouldn't recommend running right now. The AQI is ${aqi}, which is unhealthy for exertion.`;
        } else if (lowerInput.includes("mask")) {
          responseText =
            "Based on current PM2.5 levels, carrying a mask is recommended if you plan to be outdoors for more than an hour.";
        } else {
          responseText =
            "I can analyze current pollutant levels for you. Try asking 'Can I go for a run?' or 'Do I need a mask?'";
        }
      } else {
        // Professional Mode Logic
        if (lowerInput.includes("trend") || lowerInput.includes("analysis")) {
          responseText =
            "Analyzing dataset 'Lagos_Mainland_Q3'... I've detected a 15% increase in NO2 levels during morning peak hours compared to last month. Shall I generate a PDF report?";
        } else if (lowerInput.includes("export")) {
          responseText =
            "I've prepared the CSV export for the selected time range. You can find it in the 'Reports' tab.";
        } else {
          responseText =
            "I'm ready to assist with your research data. You can ask for 'Trend Analysis' or 'Export Options'.";
        }
      }

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* --- Floating Trigger Button --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 mb-2 animate-in slide-in-from-right-10 fade-in duration-300">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Ask AI about Air Quality
            </p>
          </div>
        )}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
            isOpen
              ? "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Sparkles className="h-6 w-6 animate-pulse" />
          )}
        </Button>
      </div>

      {/* --- Chat Window --- */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-700 dark:bg-slate-900",
            isExpanded
              ? "w-[90vw] h-[80vh] md:w-[600px]"
              : "w-[90vw] h-[500px] md:w-[380px]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {mode === "resident" ? "QASA AI" : "Research Assistant"}
                </h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {/* Simple icon switch based on state */}
                <span className="sr-only">Toggle Expand</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  {isExpanded ? (
                    <path
                      d="M4 11L11 4M11 4H5M11 4V10"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M2 13L9 6M9 6H3M9 6V12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex gap-1">
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  mode === "resident"
                    ? "Ask about air quality..."
                    : "Ask about data..."
                }
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="absolute right-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!inputValue.trim() || isLoading}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
