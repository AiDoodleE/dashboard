import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles, AlertTriangle, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Insight = {
  id: string
  type: 'positive' | 'warning' | 'info'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  timestamp: Date
  suggestedAction?: string
}

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dynamically import jsPDF only when needed, with error handling and ESM compatibility
  const [error, setError] = useState<string | null>(null);
  const handleGenerateReport = async () => {
    setError(null);
    try {
      console.log('Generate Report button clicked');
      const jsPDFModule = await import('jspdf/dist/jspdf.umd.min.js');
      const jsPDF = jsPDFModule.jsPDF;
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('AI Insights Report', 14, 18);
      doc.setFontSize(12);
      let y = 30;
      insights.forEach((insight, i) => {
        doc.setFont(undefined, 'bold');
        doc.text(`${i + 1}. ${insight.title}`, 14, y);
        y += 7;
        doc.setFont(undefined, 'normal');
        doc.text(`Impact: ${insight.impact}`, 18, y);
        y += 6;
        doc.text(`Type: ${insight.type}`, 18, y);
        y += 6;
        doc.text(`Description: ${insight.description}`, 18, y, { width: 170 });
        y += 8;
        if (insight.suggestedAction) {
          doc.text(`Suggested Action: ${insight.suggestedAction}`, 18, y, { width: 170 });
          y += 8;
        }
        doc.text(`Timestamp: ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(insight.timestamp))}`, 18, y);
        y += 10;
        if (y > 270 && i !== insights.length - 1) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save('ai-insights-report.pdf');
    } catch (err) {
      setError('Failed to generate PDF. Please try again or check the console.');
      alert('Failed to generate PDF. Please try again or check the console.');
      // eslint-disable-next-line no-console
      console.error('PDF generation error:', err);
    }
  };

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockInsights: Insight[] = [
      {
        id: '1',
        type: 'positive',
        title: 'Conversion Rate Surge',
        description: 'Your conversion rate has increased by 23% compared to last week. The new campaign is performing exceptionally well.',
        impact: 'high',
        timestamp: new Date(),
        suggestedAction: 'Consider increasing the campaign budget to maximize results.'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Bounce Rate Alert',
        description: 'Bounce rate on the landing page has increased by 15% in the last 24 hours.',
        impact: 'medium',
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        suggestedAction: 'Review recent changes and check for technical issues.'
      },
      {
        id: '3',
        type: 'info',
        title: 'Traffic Trend',
        description: 'Mobile traffic has increased by 18% week over week.',
        impact: 'low',
        timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
        suggestedAction: 'Optimize mobile experience further to capitalize on this trend.'
      }
    ]
    
    const timer = setTimeout(() => {
      setInsights(mockInsights)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/10 text-red-500'
      case 'medium': return 'bg-yellow-500/10 text-yellow-500'
      case 'low': return 'bg-blue-500/10 text-blue-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive': return <Sparkles className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <Sparkles className="h-4 w-4 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <Card className="border-dashed border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <Button variant="outline" size="sm" disabled>
              <span className="animate-pulse">Analyzing data...</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleGenerateReport} disabled={isLoading || insights.length === 0}>
            <span>Generate Report</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          {error && (
            <div className="text-xs text-red-600 mt-1">{error}</div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="group relative p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getTypeIcon(insight.type)}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-medium px-2 py-0.5",
                        getImpactColor(insight.impact)
                      )}
                    >
                      {insight.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.suggestedAction && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground">Suggested Action</p>
                      <p className="text-sm">{insight.suggestedAction}</p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Intl.DateTimeFormat('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(insight.timestamp))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
