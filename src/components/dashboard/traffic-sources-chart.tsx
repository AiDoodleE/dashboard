import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { trafficSourcesData } from "@/lib/mock-data"

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))'
]

export function TrafficSourcesChart() {
  return (
    <Card className="col-span-3 hover-lift glass animate-slide-up">
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>
          Distribution of website traffic by source
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={trafficSourcesData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {trafficSourcesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(34, 40, 60, 0.98)', // more opaque, lighter blue
                color: '#fff',
                border: '1.5px solid hsl(var(--primary))',
                borderRadius: 'var(--radius)',
                fontSize: '14px',
                boxShadow: '0 0 12px 2px hsl(var(--primary-glow))',
                backdropFilter: 'blur(6px)'
              }}
              formatter={(value, name, props) => [
                `${value} visitors`,
                props.payload.name
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => value}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}