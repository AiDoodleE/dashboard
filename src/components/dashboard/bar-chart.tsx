import * as React from "react"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart"
import { ChartSkeleton } from "@/components/ui/loading-skeleton"

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
]

export function BarChartDemo({ loading = false }: { loading?: boolean }) {
  if (loading) return <ChartSkeleton />
  return (
    <ChartContainer config={{uv: {label: 'UV'}, pv: {label: 'PV'}}}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Bar
          dataKey="pv"
          radius={[8, 8, 0, 0]}
          fill="url(#pv-gradient)"
          stroke="hsl(var(--primary))"
          strokeWidth={1.5}
        />
        <Bar
          dataKey="uv"
          radius={[8, 8, 0, 0]}
          fill="url(#uv-gradient)"
          stroke="hsl(var(--accent))"
          strokeWidth={1.5}
        />
        <defs>
          <linearGradient id="pv-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="uv-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.55" />
          </linearGradient>
        </defs>
      </ReBarChart>
    </ChartContainer>
  )
}
