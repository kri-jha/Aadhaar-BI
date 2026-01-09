import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "primary" | "accent" | "warning" | "default";
  trend?: {
    value: number;
    label: string;
  };
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
}: KPICardProps) {
  const variantStyles = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    warning: "bg-warning text-warning-foreground",
    default: "bg-card text-card-foreground border border-border",
  };

  const iconBgStyles = {
    primary: "bg-primary-foreground/20",
    accent: "bg-accent-foreground/20",
    warning: "bg-warning-foreground/20",
    default: "bg-primary/10",
  };

  const iconStyles = {
    primary: "text-primary-foreground",
    accent: "text-accent-foreground",
    warning: "text-warning-foreground",
    default: "text-primary",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 kpi-shadow transition-transform duration-200 hover:scale-[1.02] animate-fade-in",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-90"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-sm",
                variant === "default" ? "text-muted-foreground" : "opacity-80"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-lg",
            iconBgStyles[variant]
          )}
        >
          <Icon className={cn("w-5 h-5", iconStyles[variant])} />
        </div>
      </div>
      {trend && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 text-sm",
            variant === "default" ? "text-muted-foreground" : "opacity-80"
          )}
        >
          <span
            className={cn(
              "font-medium",
              trend.value > 0 ? "text-success" : "text-destructive"
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </span>
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
