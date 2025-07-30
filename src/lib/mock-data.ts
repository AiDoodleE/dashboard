// Mock data for ADmyBRAND Insights Dashboard

export interface MetricData {
  title: string
  value: string
  change: number
  icon: string
  color: string
}

export interface ChartDataPoint {
  name: string
  value?: number
  revenue?: number
  users?: number
  conversions?: number
  date?: string
}

export interface TableRow {
  id: string
  campaign: string
  clicks: number
  impressions: number
  ctr: number
  conversions: number
  revenue: number
  status: "active" | "paused" | "completed"
  date: string
}

// Key metrics for dashboard cards
export const metricsData: MetricData[] = [
  {
    title: "Total Revenue",
    value: "$847,329",
    change: 12.5,
    icon: "TrendingUp",
    color: "success"
  },
  {
    title: "Active Users",
    value: "24,563",
    change: 8.2,
    icon: "Users",
    color: "primary"
  },
  {
    title: "Conversions",
    value: "1,429",
    change: -2.4,
    icon: "Target",
    color: "warning"
  },
  {
    title: "Growth Rate",
    value: "23.8%",
    change: 5.7,
    icon: "BarChart3",
    color: "accent"
  }
]

// Line chart data for revenue over time
export const revenueChartData: ChartDataPoint[] = [
  { name: "Jan", revenue: 65000, users: 2400, value: 65000 },
  { name: "Feb", revenue: 71000, users: 2800, value: 71000 },
  { name: "Mar", revenue: 58000, users: 2200, value: 58000 },
  { name: "Apr", revenue: 78000, users: 3200, value: 78000 },
  { name: "May", revenue: 82000, users: 3600, value: 82000 },
  { name: "Jun", revenue: 85000, users: 4000, value: 85000 },
  { name: "Jul", revenue: 91000, users: 4200, value: 91000 },
  { name: "Aug", revenue: 89000, users: 4100, value: 89000 },
  { name: "Sep", revenue: 95000, users: 4500, value: 95000 },
  { name: "Oct", revenue: 102000, users: 4800, value: 102000 },
  { name: "Nov", revenue: 110000, users: 5200, value: 110000 },
  { name: "Dec", revenue: 125000, users: 5800, value: 125000 }
]

// Bar chart data for conversions by channel
export const conversionsByChannelData: ChartDataPoint[] = [
  { name: "Google Ads", conversions: 1245, value: 1245 },
  { name: "Facebook", conversions: 987, value: 987 },
  { name: "Instagram", conversions: 743, value: 743 },
  { name: "LinkedIn", conversions: 567, value: 567 },
  { name: "Twitter", conversions: 432, value: 432 },
  { name: "Email", conversions: 678, value: 678 }
]

// Donut chart data for traffic sources
export const trafficSourcesData: ChartDataPoint[] = [
  { name: "Organic Search", value: 4567, revenue: 125000 },
  { name: "Paid Search", value: 3421, revenue: 98000 },
  { name: "Social Media", value: 2341, revenue: 67000 },
  { name: "Direct", value: 1876, revenue: 45000 },
  { name: "Email", value: 1234, revenue: 32000 },
  { name: "Referral", value: 987, revenue: 21000 }
]

// Table data for campaign performance
export const campaignTableData: TableRow[] = [
  {
    id: "1",
    campaign: "Summer Sale 2024",
    clicks: 12543,
    impressions: 89764,
    ctr: 13.97,
    conversions: 234,
    revenue: 23450,
    status: "active",
    date: "2024-07-15"
  },
  {
    id: "2", 
    campaign: "Back to School",
    clicks: 9876,
    impressions: 67543,
    ctr: 14.62,
    conversions: 187,
    revenue: 18700,
    status: "active",
    date: "2024-07-10"
  },
  {
    id: "3",
    campaign: "Q3 Brand Awareness",
    clicks: 15432,
    impressions: 123456,
    ctr: 12.5,
    conversions: 298,
    revenue: 29800,
    status: "active",
    date: "2024-07-01"
  },
  {
    id: "4",
    campaign: "Product Launch",
    clicks: 8765,
    impressions: 54321,
    ctr: 16.13,
    conversions: 156,
    revenue: 15600,
    status: "paused",
    date: "2024-06-25"
  },
  {
    id: "5",
    campaign: "Holiday Retargeting",
    clicks: 11234,
    impressions: 78901,
    ctr: 14.23,
    conversions: 203,
    revenue: 20300,
    status: "completed",
    date: "2024-06-20"
  },
  {
    id: "6",
    campaign: "Mobile App Install",
    clicks: 13567,
    impressions: 95432,
    ctr: 14.21,
    conversions: 267,
    revenue: 26700,
    status: "active",
    date: "2024-07-12"
  },
  {
    id: "7",
    campaign: "Video Campaign",
    clicks: 7890,
    impressions: 45678,
    ctr: 17.28,
    conversions: 134,
    revenue: 13400,
    status: "active",
    date: "2024-07-08"
  },
  {
    id: "8",
    campaign: "Email Nurture",
    clicks: 6543,
    impressions: 34567,
    ctr: 18.92,
    conversions: 112,
    revenue: 11200,
    status: "active",
    date: "2024-07-05"
  }
]

// Function to simulate real-time data updates
export const generateRandomUpdate = (baseValue: number, variance: number = 0.1): number => {
  const change = (Math.random() - 0.5) * variance
  return Math.round(baseValue * (1 + change))
}

// Function to get updated metrics
export const getUpdatedMetrics = (): MetricData[] => {
  return metricsData.map(metric => ({
    ...metric,
    value: metric.title === "Total Revenue" 
      ? `$${generateRandomUpdate(847329).toLocaleString()}`
      : metric.title === "Active Users"
      ? generateRandomUpdate(24563).toLocaleString()
      : metric.title === "Conversions"
      ? generateRandomUpdate(1429).toLocaleString()
      : `${(generateRandomUpdate(23.8, 0.05)).toFixed(1)}%`,
    change: parseFloat((metric.change + (Math.random() - 0.5) * 2).toFixed(1))
  }))
}