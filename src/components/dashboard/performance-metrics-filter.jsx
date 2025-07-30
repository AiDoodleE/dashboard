import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function PerformanceMetricsFilter({ open, onOpenChange, filters, setFilters }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Performance Metrics</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select
              value={filters.timePeriod}
              onValueChange={(value) => setFilters({ ...filters, timePeriod: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Revenue Range</label>
            <Select
              value={filters.revenueRange}
              onValueChange={(value) => setFilters({ ...filters, revenueRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select revenue range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                <SelectItem value="10000+">$10,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Traffic Source</label>
            <Select
              value={filters.trafficSource}
              onValueChange={(value) => setFilters({ ...filters, trafficSource: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select traffic source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="organic">Organic Search</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Show Only</label>
            <div className="flex items-center justify-between">
              <span className="text-sm">High-Value Customers</span>
              <Switch
                checked={filters.highValue}
                onCheckedChange={(checked) => 
                  setFilters({ ...filters, highValue: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Repeat Customers</span>
              <Switch
                checked={filters.repeatCustomers}
                onCheckedChange={(checked) => 
                  setFilters({ ...filters, repeatCustomers: checked })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
