import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
  minLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchBar({
  onSearch,
  placeholder = "Search...",
  className,
  delay = 300,
  minLength = 3,
  onKeyDown,
  onFocus,
  onBlur,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const debouncedValueRef = useRef(value);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    // Determine if we should trigger the search
    // If clearing (empty string), trigger immediately (or handle as needed by parent)
    // If typing, wait for delay and minLength
    const shouldTrigger = value.length === 0 || value.length >= minLength;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (shouldTrigger) {
      timeoutRef.current = setTimeout(() => {
        if (value !== debouncedValueRef.current) {
          debouncedValueRef.current = value;
          onSearch(value);
        }
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, minLength, onSearch]);

  const handleClear = () => {
    setValue("");
    // Trigger clear immediately
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    debouncedValueRef.current = "";
    onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-8 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
      />
      {value.length > 0 && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
