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
