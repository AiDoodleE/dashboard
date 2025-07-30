import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"
import { Search, ArrowUpDown, Download } from "lucide-react"
import { campaignTableData, TableRow as CampaignRow } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function downloadCSV(data: CampaignRow[]) {
  const headers = [
    "Campaign",
    "Clicks",
    "Impressions",
    "CTR %",
    "Conversions",
    "Revenue",
    "Status"
  ];
  const rows = data.map(row => [
    row.campaign,
    row.clicks,
    row.impressions,
    row.ctr.toFixed(2),
    row.conversions,
    row.revenue,
    row.status
  ]);
  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "campaign_performance.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function CampaignTable() {
  const [search, setSearch] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CampaignRow
    direction: "asc" | "desc"
  } | null>(null)

  const filteredAndSortedData = useMemo(() => {
    let filtered = campaignTableData.filter(row =>
      row.campaign.toLowerCase().includes(search.toLowerCase())
    )

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }
        
        const aString = String(aValue).toLowerCase()
        const bString = String(bValue).toLowerCase()
        
        if (sortConfig.direction === "asc") {
          return aString < bString ? -1 : aString > bString ? 1 : 0
        } else {
          return aString > bString ? -1 : aString < bString ? 1 : 0
        }
      })
    }

    return filtered
  }, [search, sortConfig])

  const handleSort = (key: keyof CampaignRow) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc"
        }
      }
      return { key, direction: "asc" }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
      case "paused":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Paused</Badge>
      case "completed":
        return <Badge className="bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="col-span-7 hover-lift glass animate-scale-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Detailed analytics for all marketing campaigns
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="hover-lift" onClick={() => downloadCSV(filteredAndSortedData)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("campaign")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Campaign
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("clicks")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Clicks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("impressions")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Impressions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("ctr")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    CTR %
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("conversions")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Conversions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("revenue")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Revenue
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{row.campaign}</TableCell>
                  <TableCell>{row.clicks.toLocaleString()}</TableCell>
                  <TableCell>{row.impressions.toLocaleString()}</TableCell>
                  <TableCell>{row.ctr.toFixed(2)}%</TableCell>
                  <TableCell>{row.conversions}</TableCell>
                  <TableCell>${row.revenue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}