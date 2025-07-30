import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn(
      "animate-pulse rounded-md bg-muted",
      className
    )} />
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="p-6 rounded-lg border bg-card glass animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-8 w-32" />
          <div className="flex items-center space-x-2">
            <LoadingSkeleton className="h-4 w-4 rounded-full" />
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-20" />
          </div>
        </div>
        <LoadingSkeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-lg border bg-card glass animate-pulse">
      <div className="space-y-2 mb-4">
        <LoadingSkeleton className="h-6 w-48" />
        <LoadingSkeleton className="h-4 w-64" />
      </div>
      <LoadingSkeleton className="h-72 w-full" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="p-6 rounded-lg border bg-card glass animate-pulse">
      <div className="space-y-2 mb-4">
        <LoadingSkeleton className="h-6 w-48" />
        <LoadingSkeleton className="h-4 w-64" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <LoadingSkeleton className="h-4 flex-1" />
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}