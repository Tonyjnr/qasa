import { useState } from "react";
import { Button } from "../../ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface DateRangeSelectorProps {
  days: number;
  onRangeChange: (days: number) => void;
}

export const DateRangeSelector = ({ days, onRangeChange }: DateRangeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const ranges = [
    { label: "Last 24 Hours", value: 1 },
    { label: "Last 7 Days", value: 7 },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 90 Days", value: 90 },
  ];

  const currentLabel = ranges.find(r => r.value === days)?.label || "Custom Range";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {ranges.map((range) => (
          <DropdownMenuItem
            key={range.value}
            onClick={() => {
              onRangeChange(range.value);
              setIsOpen(false);
            }}
            className="cursor-pointer"
          >
            {range.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
