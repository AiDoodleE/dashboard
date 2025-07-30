import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, PieChart, ArrowUpRight, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { BarChartDemo } from "./bar-chart"
import { PieChartDemo } from "./pie-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

type Timeframe = '7d' | '30d' | '90d' | '1y'
type Metric = 'revenue' | 'users' | 'conversion' | 'sessions'

type PredictionData = {
  metric: string
  current: number
  predicted: number
  change: number
  data: { date: string; actual: number; predicted: number }[]
}

export function PredictiveAnalytics() {
  const [timeframe, setTimeframe] = useState<Timeframe>('30d')
  const [selectedMetric, setSelectedMetric] = useState<Metric>('revenue')

  // Mock prediction data - in a real app, this would come from an API
  const predictionData: Record<Metric, PredictionData> = {
    revenue: {
      metric: 'Revenue',
      current: 125000,
      predicted: 148000,
      change: 18.4,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actual: 2500 + Math.sin(i / 2) * 500 + Math.random() * 300,
        predicted: 2500 + Math.sin(i / 2) * 500 + Math.random() * 300 + (i > 15 ? (i - 15) * 20 : 0)
      }))
    },
    users: {
      metric: 'Users',
      current: 8450,
      predicted: 10200,
      change: 20.7,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actual: 200 + Math.sin(i / 3) * 50 + Math.random() * 30,
        predicted: 200 + Math.sin(i / 3) * 50 + Math.random() * 30 + (i > 15 ? (i - 15) * 5 : 0)
      }))
    },
    conversion: {
      metric: 'Conversion Rate',
      current: 3.2,
      predicted: 3.8,
      change: 18.8,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actual: 2.8 + Math.sin(i / 4) * 0.5 + Math.random() * 0.3,
        predicted: 2.8 + Math.sin(i / 4) * 0.5 + Math.random() * 0.3 + (i > 15 ? (i - 15) * 0.03 : 0)
      }))
    },
    sessions: {
      metric: 'Sessions',
      current: 12450,
      predicted: 14800,
      change: 18.9,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actual: 300 + Math.sin(i / 2.5) * 70 + Math.random() * 40,
        predicted: 300 + Math.sin(i / 2.5) * 70 + Math.random() * 40 + (i > 15 ? (i - 15) * 8 : 0)
      }))
    }
  }

  const currentData = predictionData[selectedMetric]
  const isPositive = currentData.change >= 0

  // Show real charts instead of mock visualization
  const renderChart = () => (
    <div className="flex flex-col md:flex-row gap-4 items-stretch w-full">
      <div className="flex-1 min-w-0">
        <BarChartDemo />
      </div>
      <div className="flex-1 min-w-0">
        <PieChartDemo />
      </div>
    </div>
  )

  return (
    <Card className="border-dashed border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Predictive Analytics
            </CardTitle>
            <CardDescription className="mt-1">
              Forecasted metrics and trends based on historical data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Last {timeframe}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          defaultValue="revenue" 
          className="w-full"
          onValueChange={(value) => setSelectedMetric(value as Metric)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue" className="text-xs">Revenue</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
            <TabsTrigger value="conversion" className="text-xs">Conversion</TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs">Sessions</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current {currentData.metric}</p>
                <p className="text-2xl font-bold">
                  {typeof currentData.current === 'number' && currentData.metric !== 'conversion' 
                    ? `$${currentData.current.toLocaleString()}` 
                    : `${currentData.current}%`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Predicted {currentData.metric}</p>
                <p className="text-2xl font-bold">
                  {typeof currentData.predicted === 'number' && currentData.metric !== 'conversion' 
                    ? `$${currentData.predicted.toLocaleString()}` 
                    : `${currentData.predicted}%`}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Projected Change</p>
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{currentData.change}%
                  </span>
                </div>
              </div>
            </div>
            
            {renderChart()}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Predictions based on historical data and machine learning models.</p>
              <p className="mt-1">Confidence level: <span className="font-medium">87%</span></p>
            </div>
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Powered by AI/ML models</p>
          <Button variant="outline" size="sm" className="gap-1.5">
            <span>View Detailed Report</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
