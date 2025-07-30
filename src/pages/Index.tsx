import { useState, useEffect, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricCard } from "@/components/dashboard/metric-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ConversionsChart } from "@/components/dashboard/conversions-chart"
import { TrafficSourcesChart } from "@/components/dashboard/traffic-sources-chart"
import { CampaignTable } from "@/components/dashboard/campaign-table"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { PredictiveAnalytics } from "@/components/dashboard/predictive-analytics"
import { metricsData, getUpdatedMetrics, MetricData } from "@/lib/mock-data"
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton"
import { Button } from "@/components/ui/button"
import { 
  RefreshCw, 
  Calendar, 
  Download, 
  Filter, 
  Settings, 
  BarChart2, 
  LineChart, 
  PieChart, 
  Zap, 
  Activity,
  Home,
  Users,
  CreditCard,
  Bell,
  Search
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useKeyboardShortcuts } from "@/lib/keyboard-shortcuts"
import { motion, AnimatePresence } from "framer-motion"

// Mock data for quick stats
const quickStats = [
  { 
    name: 'Active Campaigns', 
    value: '12', 
    change: '+2.1%', 
    trend: 'up',
    icon: <Activity className="h-5 w-5" />,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Avg. Session', 
    value: '4m 32s', 
    change: '+12.3%', 
    trend: 'up',
    icon: <LineChart className="h-5 w-5" />,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Bounce Rate', 
    value: '34.2%', 
    change: '-5.1%', 
    trend: 'down',
    icon: <BarChart2 className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-500'
  },
  { 
    name: 'Conversion', 
    value: '3.42%', 
    change: '+1.2%', 
    trend: 'up',
    icon: <PieChart className="h-5 w-5" />,
    color: 'from-emerald-500 to-teal-500'
  },
];

const Index = () => {
  const [metrics, setMetrics] = useState<MetricData[]>(metricsData)
  const [isRealTime, setIsRealTime] = useState(false)
  const [loading, setLoading] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(() => {
      setMetrics(getUpdatedMetrics())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isRealTime])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2b] via-[#232946]/80 to-[#0a0c18] dark:bg-[#0a0c18] relative">
      {/* Glass blur overlay that changes with theme */}
      <div className="fixed inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-3xl transition-all duration-300 pointer-events-none" />
      {/* Space theme overlays removed, handled by GalaxyBackground */}
      <div className="flex h-screen overflow-hidden relative z-10">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0 z-10">
          <div className="flex flex-col w-64 border-r border-slate-200/50 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/100 backdrop-blur-xl">
            <div className="flex items-center h-16 px-6 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Analytics
                </h1>
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {['Dashboard', 'Analytics', 'Campaigns', 'Audience', 'Settings'].map((item, index) => {
                const icons = [
                  <Home key="home" className="h-5 w-5" />,
                  <BarChart2 key="analytics" className="h-5 w-5" />,
                  <CreditCard key="campaigns" className="h-5 w-5" />,
                  <Users key="audience" className="h-5 w-5" />,
                  <Settings key="settings" className="h-5 w-5" />
                ];
                return (
                  <a
                    key={item}
                    href="#"
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      index === 0
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="mr-3">{icons[index]}</span>
                    {item}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navigation */}
          <header className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search..."
                  />
                </div>
                
                <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Bell className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    JD
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 relative z-10 bg-white/80 dark:bg-slate-900/100 backdrop-blur-sm">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#232946] to-[#181e2a] backdrop-blur-2xl rounded-2xl border border-blue-900/60 p-7 shadow-[0_4px_32px_0_rgba(0,80,255,0.10)] hover:shadow-[0_0_32px_0_rgba(0,80,255,0.18)] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ring-2 ring-blue-500/30`}>
                      {stat.icon}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-blue-900/40 text-blue-200 tracking-wide shadow-[0_0_8px_0_rgba(0,80,255,0.18)]`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="mt-6 text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">{stat.value}</h3>
                  <p className="mt-2 text-base font-medium text-blue-200/80 tracking-wide">{stat.name}</p>
                  {/* Glow effect */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-20 bg-blue-500/30 blur-2xl rounded-full z-0" />
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Charts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Revenue Chart Tile */}
                <div className="group h-80">
                  <div className="relative h-full overflow-hidden rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {loading ? <ChartSkeleton /> : <RevenueChart />}
                  </div>
                </div>
                
                {/* Traffic Sources Chart Tile */}
                <div className="group h-80">
                  <div className="relative h-full overflow-hidden rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {loading ? <ChartSkeleton /> : <TrafficSourcesChart />}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Metrics & Table */}
              <div className="space-y-6">
                {/* Key Metrics Tiles */}
                <div className="space-y-4">
                  {loading
                    ? Array.from({ length: 2 }).map((_, i) => <MetricCardSkeleton key={i} />)
                    : metrics.slice(0, 2).map((metric) => (
                        <motion.div
                          key={metric.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="group transition-all duration-300 hover:scale-105"
                        >
                          <div className="relative overflow-hidden rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <MetricCard data={metric} />
                          </div>
                        </motion.div>
                      ))}
                </div>
                
                {/* Conversions Chart Tile */}
                <div className="group h-80">
                  <div className="relative h-full overflow-hidden rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {loading ? <ChartSkeleton /> : <ConversionsChart />}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Row - Campaign Table */}
            <div className="mt-6">
              <div className="group h-96">
                <div className="relative h-full overflow-hidden rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {loading ? <TableSkeleton /> : <CampaignTable />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
