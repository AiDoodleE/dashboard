import * as React from "react"
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart"
import { ChartSkeleton } from "@/components/ui/loading-skeleton"

const data = [
  { name: 'Direct', value: 400 },
  { name: 'Referral', value: 300 },
  { name: 'Social', value: 300 },
  { name: 'Organic', value: 200 },
]

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))'
]

export function PieChartDemo({ loading = false }: { loading?: boolean }) {
  if (loading) return <ChartSkeleton />
  return (
    <ChartContainer config={{Direct: {label: 'Direct'}, Referral: {label: 'Referral'}, Social: {label: 'Social'}, Organic: {label: 'Organic'}}}>
      <RePieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={72}
          fill="hsl(var(--primary))"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
      </RePieChart>
    </ChartContainer>
  )
}
