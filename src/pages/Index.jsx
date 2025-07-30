import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricCard } from "@/components/dashboard/metric-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { ConversionsChart } from "@/components/dashboard/conversions-chart"
import { TrafficSourcesChart } from "@/components/dashboard/traffic-sources-chart"
import { BarChartDemo } from "@/components/dashboard/bar-chart"
import { PieChartDemo } from "@/components/dashboard/pie-chart"
import { CampaignTable } from "@/components/dashboard/campaign-table"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { PredictiveAnalytics } from "@/components/dashboard/predictive-analytics"
import { metricsData, getUpdatedMetrics, revenueChartData, conversionsByChannelData, trafficSourcesData } from "@/lib/mock-data"
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton"
import { PerformanceMetricsFilter } from "@/components/dashboard/performance-metrics-filter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar, Download, Filter, Settings, BarChart2, LineChart, PieChart, Zap, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useKeyboardShortcuts } from "@/lib/keyboard-shortcuts"

import { DashboardSettings } from "@/components/dashboard/dashboard-settings"
import jsPDF from "jspdf"

import GalaxyBackground from '@/components/ui/galaxy-background';

// Mock data for quick stats
const quickStats = [
  { name: 'Active Campaigns', value: '12', change: '+2.1%', trend: 'up' },
  { name: 'Avg. Session', value: '4m 32s', change: '+12.3%', trend: 'up' },
  { name: 'Bounce Rate', value: '34.2%', change: '-5.1%', trend: 'down' },
  { name: 'Conversion', value: '3.42%', change: '+1.2%', trend: 'up' },
];

const Index = () => {
  const [metrics, setMetrics] = useState(metricsData)
  const [isRealTime, setIsRealTime] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Profile dropdown state
  const [activeFilters, setActiveFilters] = useState({
    timePeriod: "7d",
    revenueRange: "all",
    trafficSource: "all",
    highValue: false,
    repeatCustomers: false
  })

  // Filter the metrics data based on active filters
  const filteredMetrics = useMemo(() => {
    return metrics.filter(metric => {
      // Apply time period filter
      const date = new Date(metric.date)
      const now = new Date()
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

      switch (activeFilters.timePeriod) {
        case "7d": if (diffDays > 7) return false; break;
        case "30d": if (diffDays > 30) return false; break;
        case "90d": if (diffDays > 90) return false; break;
        case "1y": if (diffDays > 365) return false; break;
      }

      // Apply revenue range filter
      if (activeFilters.revenueRange !== "all") {
        const revenue = metric.revenue
        const [min, max] = activeFilters.revenueRange.split("-").map(Number)
        if (max) {
          if (revenue < min || revenue > max) return false
        } else {
          // Handle 10000+ case
          if (revenue < min) return false
        }
      }

      // Apply traffic source filter
      if (activeFilters.trafficSource !== "all" && 
          metric.source !== activeFilters.trafficSource) {
        return false
      }

      // Apply customer type filters
      if (activeFilters.highValue && !metric.isHighValue) return false
      if (activeFilters.repeatCustomers && !metric.isRepeatCustomer) return false

      return true
    })
  }, [metrics, activeFilters])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dashboardSettings, setDashboardSettings] = useState({
    sections: {
      "quick-stats": {
        id: "quick-stats",
        title: "Quick Stats",
        enabled: true,
        description: "Overview of key performance metrics",
        order: 0,
      },
      "performance-metrics": {
        id: "performance-metrics",
        title: "Performance Metrics",
        enabled: true,
        description: "Detailed performance indicators",
        order: 1,
      },
      "analytics-charts": {
        id: "analytics-charts",
        title: "Analytics Charts",
        enabled: true,
        description: "Revenue, conversions, and traffic charts",
        order: 2,
      },
      "page-interactions": {
        id: "page-interactions",
        title: "Page Interactions",
        enabled: true,
        description: "User interaction analytics",
        order: 3,
      },
      "campaign-performance": {
        id: "campaign-performance",
        title: "Campaign Performance",
        enabled: true,
        description: "Campaign metrics and results",
        order: 4,
      },
      "ai-insights": {
        id: "ai-insights",
        title: "AI Insights",
        enabled: true,
        description: "AI-powered analytics insights",
        order: 5,
      },
      "predictive-analytics": {
        id: "predictive-analytics",
        title: "Predictive Analytics",
        enabled: true,
        description: "Future trend predictions",
        order: 6,
      },
    },
    layoutMode: "grid",
    autoRefresh: false,
    refreshInterval: 5
  })

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

  // Handle dashboard settings changes
  useEffect(() => {
    if (dashboardSettings.autoRefresh !== isRealTime) {
      setIsRealTime(dashboardSettings.autoRefresh);
    }

    // Apply initial layout based on settings
    Object.entries(dashboardSettings.sections).forEach(([sectionId, section]) => {
      const elements = document.querySelectorAll(`[data-section="${sectionId}"]`);
      elements.forEach(element => {
        if (element) {
          element.style.order = section.order;
          element.style.display = section.enabled ? 'block' : 'none';
        }
      });
    });
  }, [dashboardSettings, isRealTime])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+alt+r': () => setIsRealTime(prev => !prev),
    'ctrl+alt+s': () => {
      console.log('Saving dashboard state...')
      // Add save functionality here
    },
    '?': () => {
      console.log('Show keyboard shortcuts help')
      // Show help modal
    },
    'f5': (e) => {
      e?.preventDefault()
      window.location.reload()
    }
  })

  return (
    <>
    <AnimatePresence mode="wait">

      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Main Content */}
      <motion.div
        key={typeof window !== 'undefined' && document?.documentElement?.className?.includes('dark') ? 'dark' : 'light'}
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 min-h-screen bg-gradient-to-br from-background/80 via-background/60 to-muted/10 dark:from-background/90 dark:via-background/80 dark:to-background/70 overflow-auto backdrop-blur-sm"
      >
        <DashboardHeader onOpenSettings={() => setSettingsOpen(true)} />
        <main className="container mx-auto px-1 sm:px-2 md:px-4 py-3 space-y-3 transition-all duration-300 max-w-[1500px]">
          {/* Top Row: Quick Stats + Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
            {/* Quick Stats */}
            {dashboardSettings.sections["quick-stats"].enabled && (
            <div 
              data-section="quick-stats"
              className="glass glow border border-purple-400 rounded-2xl shadow-md p-4 flex flex-col gap-2 bg-purple-500/10 dark:bg-card/70"
              style={{ order: dashboardSettings.sections["quick-stats"].order }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-primary">Quick Stats</span>
                  <span className="text-xs text-muted-foreground">Snapshot of your campaign performance today</span>
                </div>
                <Button size="xs" variant="ghost" className="gap-1.5 border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10" onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text("Quick Stats", 14, 18);
                  doc.setFontSize(12);
                  quickStats.forEach((stat, i) => {
                    doc.text(`${stat.name}: ${stat.value} (${stat.change})`, 14, 30 + i * 10);
                  });
                  doc.save("quick-stats.pdf");
                }}>
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              </div>
              <div className="border-b border-muted/30 my-1" />
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-1">
                {quickStats.map((stat, index) => {
                  // Extract a percentage for the progress indicator
                  let percent = 0;
                  if (stat.name === 'Active Campaigns') percent = Math.min(100, parseInt(stat.value) * 8);
                  else if (stat.name === 'Avg. Session') percent = 75;
                  else if (stat.name === 'Bounce Rate') percent = parseFloat(stat.value);
                  else if (stat.name === 'Conversion') percent = parseFloat(stat.value) * 20;
                  percent = Math.max(0, Math.min(100, Math.round(percent)));
                  return (
                    <div
                      key={index}
                      className="relative min-w-0 overflow-visible rounded-xl border border-purple-500 p-3 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:scale-[1.04] active:scale-95 group flex flex-col gap-2 bg-purple-400/20 dark:bg-background/80"
                      style={{
                        animation: `fade-in 0.6s cubic-bezier(0.4,0,0.2,1) both`,
                        animationDelay: `${index * 80}ms`
                      }}
                    >
                      <div className="flex flex-col min-w-0 w-full justify-between items-start gap-1">
                        <div className="min-w-0 w-full flex items-center gap-2">
                          <div className="relative w-8 h-8 mr-1">
                            <svg className="absolute top-0 left-0" width="32" height="32" viewBox="0 0 32 32">
                              <circle cx="16" cy="16" r="14" fill="none" stroke="#e9d5ff" strokeWidth="4" />
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                fill="none"
                                stroke="#a21caf"
                                strokeWidth="4"
                                strokeDasharray={2 * Math.PI * 14}
                                strokeDashoffset={2 * Math.PI * 14 * (1 - percent / 100)}
                                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
                                strokeLinecap="round"
                              />
                              <text x="16" y="20" textAnchor="middle" fontSize="10" fill="#a21caf" fontWeight="bold">{percent}%</text>
                            </svg>
                          </div>
                          <div className="min-w-0 w-full">
                            <p className="truncate text-xs font-semibold text-zinc-900 group-hover:text-primary transition-colors duration-200 dark:text-muted-foreground">{stat.name}</p>
                            <h3 className="truncate text-lg font-bold mt-1 group-hover:text-primary transition-colors duration-200 text-zinc-900 dark:text-primary">{stat.value}</h3>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-transparent group-hover:border-current transition-all duration-200",
                            stat.trend === 'up' ? 'bg-green-500/10 text-green-700' : 'bg-rose-500/10 text-rose-700'
                          )}
                          style={{width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}
            {/* Key Metrics */}
            {dashboardSettings.sections["performance-metrics"].enabled && (
            <div 
              data-section="performance-metrics"
              className="lg:col-span-2 flex flex-col gap-2"
              style={{ order: dashboardSettings.sections["performance-metrics"].order }}
            >
              <section className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold flex items-center gap-2 text-blue-800 dark:text-primary drop-shadow-sm" style={{textShadow: '0 1px 6px rgba(30,64,175,0.10)'}}>
                    <Activity className="h-5 w-5 text-blue-800 dark:text-primary" />
                    Performance Metrics
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5"
                      onClick={() => setFilterOpen(true)}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filter</span>
                      {Object.values(activeFilters).some(value => 
                        value !== "all" && value !== "7d" && value !== true
                      ) && (
                        <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 flex items-center justify-center">
                          •
                        </Badge>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Settings className="h-3.5 w-3.5" />
                      <span>Customize</span>
                    </Button>
                  </div>
                </div>
                <PerformanceMetricsFilter 
                  open={filterOpen}
                  onOpenChange={setFilterOpen}
                  filters={activeFilters}
                  setFilters={setActiveFilters}
                />
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
                    : metrics.slice(0, 4).map((metric, index) => (
                        <div
                          key={metric.title}
                          style={{ animationDelay: `${index * 100}ms` }}
                          className="transition-all duration-200 hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_32px_0_hsl(var(--primary-glow))] hover:z-10"
                        >
                          <MetricCard data={metric} />
                        </div>
                      ))}
                </div>
              </section>
            </div>
            )}
          </div>
          {/* Main Content Row: Charts, Table, Sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-start min-h-0">
            {/* Charts and Table (2/3) */}
            <div className="xl:col-span-2 flex flex-col gap-3 min-h-0">
              {/* Charts Section */}
              {dashboardSettings.sections["analytics-charts"].enabled && (
              <section 
                data-section="analytics-charts"
                className="flex flex-col gap-2 min-w-0"
                style={{ order: dashboardSettings.sections["analytics-charts"].order }}
              >
                <Tabs defaultValue="revenue" className="w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <h2 className="text-base font-medium flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      Analytics
                    </h2>
                    <TabsList>
                      <TabsTrigger value="revenue" className="text-xs">Revenue</TabsTrigger>
                      <TabsTrigger value="conversions" className="text-xs">Conversions</TabsTrigger>
                      <TabsTrigger value="traffic" className="text-xs">Traffic</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="revenue" className="mt-0">
                    <Card className="min-h-0">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-base">Revenue Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-36 md:h-44 xl:h-48">
                          <RevenueChart />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="conversions" className="mt-0">
                    <Card className="min-h-0">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-base">Conversion Funnel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-36 md:h-44 xl:h-48">
                          <ConversionsChart />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="traffic" className="mt-0">
                    <Card className="min-h-0">
                      <CardHeader className="pb-1">
                        <CardTitle className="text-base">Traffic Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-36 md:h-44 xl:h-48">
                          <TrafficSourcesChart />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>
              )}
              {/* Bar & Pie Charts Row */}
              {dashboardSettings.sections["page-interactions"].enabled && (
              <div 
                data-section="page-interactions"
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
                style={{ order: dashboardSettings.sections["page-interactions"].order }}
              >
                <div className="space-y-2">
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Page Interaction with New User
                  </h2>
                  <div className="bg-card/70 rounded-xl p-2 shadow-md min-h-[120px]">
                    <BarChartDemo loading={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Source of Traffic
                  </h2>
                  <div className="bg-card/70 rounded-xl p-2 shadow-md min-h-[120px]">
                    <PieChartDemo loading={loading} />
                  </div>
                </div>
              </div>
              )}
              {/* Campaign Table */}
              {dashboardSettings.sections["campaign-performance"].enabled && (
              <section 
                data-section="campaign-performance"
                className="flex flex-col gap-2 min-w-0"
                style={{ order: dashboardSettings.sections["campaign-performance"].order }}
              >
                <h2 className="text-base font-medium flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Campaign Performance
                </h2>
                <Card className="min-h-0">
                  <CardContent className="p-0 max-h-40 overflow-auto">
                    {loading ? <TableSkeleton /> : <CampaignTable />}
                  </CardContent>
                </Card>
              </section>
              )}
            </div>
            {/* Right Sidebar (1/3) */}
            <aside className="flex flex-col gap-3 min-w-0 max-h-[calc(100vh-120px)] overflow-auto">
              {/* AI Analytics Sections */}
              <div className="flex flex-col gap-3">
                {dashboardSettings.sections["ai-insights"].enabled && (
                  <div 
                    data-section="ai-insights"
                    style={{ order: dashboardSettings.sections["ai-insights"].order }}
                  >
                    <AIInsights />
                  </div>
                )}
                {dashboardSettings.sections["predictive-analytics"].enabled && (
                  <div 
                    data-section="predictive-analytics"
                    style={{ order: dashboardSettings.sections["predictive-analytics"].order }}
                  >
                    <PredictiveAnalytics />
                  </div>
                )}
              </div>
              
              {/* Quick Actions at the bottom */}
              <Card className="mt-auto">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      const doc = new jsPDF();
                      let y = 18;
                      doc.setFontSize(16);
                      doc.text("Dashboard Report", 14, y);
                      y += 10;
                      doc.setFontSize(13);
                      doc.text("Quick Stats", 14, y);
                      y += 8;
                      doc.setFontSize(11);
                      quickStats.forEach((stat) => {
                        doc.text(`${stat.name}: ${stat.value} (${stat.change})`, 16, y);
                        y += 6;
                      });
                      y += 4;
                      doc.setFontSize(13);
                      doc.text("Key Metrics", 14, y);
                      y += 8;
                      doc.setFontSize(11);
                      metricsData.forEach((metric) => {
                        doc.text(`${metric.title}: ${metric.value} (${metric.change >= 0 ? '+' : ''}${metric.change}%)`, 16, y);
                        y += 6;
                      });
                      y += 4;
                      doc.setFontSize(13);
                      doc.text("Revenue & Users (Monthly)", 14, y);
                      y += 8;
                      doc.setFontSize(10);
                      doc.text("Month   Revenue   Users", 16, y);
                      y += 6;
                      revenueChartData.forEach((row) => {
                        doc.text(`${row.name}   $${row.revenue?.toLocaleString()}   ${row.users}`, 16, y);
                        y += 5;
                      });
                      y += 4;
                      doc.setFontSize(13);
                      doc.text("Conversions by Channel", 14, y);
                      y += 8;
                      doc.setFontSize(10);
                      doc.text("Channel   Conversions", 16, y);
                      y += 6;
                      conversionsByChannelData.forEach((row) => {
                        doc.text(`${row.name}   ${row.conversions}`, 16, y);
                        y += 5;
                      });
                      y += 4;
                      doc.setFontSize(13);
                      doc.text("Traffic Sources", 14, y);
                      y += 8;
                      doc.setFontSize(10);
                      doc.text("Source   Value   Revenue", 16, y);
                      y += 6;
                      trafficSourcesData.forEach((row) => {
                        doc.text(`${row.name}   ${row.value}   $${row.revenue?.toLocaleString()}`, 16, y);
                        y += 5;
                      });
                      doc.save("dashboard-report.pdf");
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                    Dashboard Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      alert('Schedule Report functionality would open here.');
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule Report
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </main>
        </motion.div>
    </AnimatePresence>
    <DashboardSettings
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
      onSave={(settings) => {
        setDashboardSettings(settings);
        
        // Apply auto-refresh setting
        if (settings.autoRefresh !== isRealTime) {
          setIsRealTime(settings.autoRefresh);
          if (settings.autoRefresh) {
            // Start auto-refresh
            const interval = setInterval(() => {
              setMetrics(getUpdatedMetrics());
            }, settings.refreshInterval * 1000);
            return () => clearInterval(interval);
          }
        }

        // Apply section visibility and order changes immediately
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => {
          const sectionId = section.getAttribute('data-section');
          if (settings.sections[sectionId]) {
            section.style.order = settings.sections[sectionId].order;
            section.style.display = settings.sections[sectionId].enabled ? 'block' : 'none';
          }
        });
      }}
    />
    </>
  )
}

export default Index;
