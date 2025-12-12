/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import { useState, useRef, useEffect } from "react";
import { Bot, X, Sparkles, FileText, Send } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

interface AIAssistantProps {
  mode: "resident" | "professional";
  contextData?: any;
}

export function AIAssistant({ mode, contextData }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text:
              mode === "resident"
                ? "Hi! I'm QASA AI. I can check local air quality for you. Try asking 'Can I go for a run?'"
                : "QASA Research Assistant online. I can help analyze your datasets or generate risk reports.",
          },
        ],
      },
    ],
  });

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input }, { body: { mode, contextData } });
    setInput("");
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Action Button */}
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

      {/* Chat Window */}
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
                  Gateway Connected
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="sr-only">Toggle Expand</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                className="h-4 w-4 text-foreground"
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

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50"
          >
            {messages.map((msg: UIMessage) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none"
                  )}
                >
                  {msg.parts.map((part, index) => {
                    if (part.type === "text") {
                      return <span key={index}>{part.text}</span>;
                    }
                    if (
                      part.type === "tool-invocation" ||
                      part.type === "tool-generateReport" ||
                      (part.type === "dynamic-tool" &&
                        part.toolName === "generateReport")
                    ) {
                      const toolPart = part as any;
                      if (
                        toolPart.state === "result" ||
                        toolPart.state === "output-available"
                      ) {
                        return (
                          <div
                            key={toolPart.toolCallId || index}
                            className="mt-2 p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4 text-red-500" />
                            <span className="text-xs font-medium">
                              Report Generated
                            </span>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-0" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-150" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="relative flex items-center"
            >
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={
                  mode === "resident"
                    ? "How is the air today?"
                    : "Analyze current trends..."
                }
                className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="absolute right-1 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
