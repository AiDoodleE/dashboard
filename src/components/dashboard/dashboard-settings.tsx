import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, GripVertical, LayoutDashboard, Eye, EyeOff } from "lucide-react"

const defaultSections = {
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
}

export function DashboardSettings({ open, onOpenChange, onSave }) {
  const [sections, setSections] = useState(defaultSections)
  const [layoutMode, setLayoutMode] = useState("grid")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(5)

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Object.values(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order values
    const updatedSections = {}
    items.forEach((item, index) => {
      updatedSections[item.id] = {
        ...item,
        order: index,
      }
    })

    setSections(updatedSections)
  }

  const toggleSection = (sectionId) => {
    setSections({
      ...sections,
      [sectionId]: {
        ...sections[sectionId],
        enabled: !sections[sectionId].enabled,
      },
    })
  }

  const handleSave = () => {
    onSave({
      sections,
      layoutMode,
      autoRefresh,
      refreshInterval,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Settings
          </DialogTitle>
          <DialogDescription>
            Customize your dashboard layout and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Layout Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Layout Settings</CardTitle>
              <CardDescription>Configure the dashboard layout and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Refresh</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data
                  </div>
                </div>
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section Visibility and Order */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dashboard Sections</CardTitle>
              <CardDescription>Configure visibility and order of dashboard sections</CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {Object.values(sections)
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 group"
                              >
                                <div {...provided.dragHandleProps} className="text-muted-foreground">
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{section.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {section.description}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleSection(section.id)}
                                >
                                  {section.enabled ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
