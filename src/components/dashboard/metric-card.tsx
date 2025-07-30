import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Target, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MetricData } from "@/lib/mock-data"

const iconMap = {
  TrendingUp,
  Users,
  Target,
  BarChart3
}

interface MetricCardProps {
  data: MetricData
  className?: string
}

export function MetricCard({ data, className }: MetricCardProps) {
  const Icon = iconMap[data.icon as keyof typeof iconMap] || TrendingUp
  const isPositive = data.change > 0
  
  return (
    <Card className={cn(
      "p-6 hover-lift glass animate-fade-in border-[1.5px] border-[hsl(var(--border))] shadow-[var(--shadow-glow)] backdrop-blur-md",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{data.title}</p>
          <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent drop-shadow-lg">{data.value}</p>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-success drop-shadow-glow" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive drop-shadow-glow" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-success" : "text-destructive"
            )}>
              {isPositive ? "+" : ""}{data.change}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-full shadow-[0_0_16px_4px_hsl(var(--primary-glow))] border border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.12)]",
          data.color === "success" && "bg-success/10 text-success border-success",
          data.color === "primary" && "bg-primary/10 text-primary border-primary",
          data.color === "warning" && "bg-warning/10 text-warning border-warning",
          data.color === "accent" && "bg-accent/10 text-accent border-accent"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}