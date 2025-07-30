import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, MessageSquare, Check, Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChartAnnotations({
  width,
  height,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  annotations = [],
  className,
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [newAnnotation, setNewAnnotation] = useState({ 
    title: '', 
    note: '',
    type: 'info'
  })
  const containerRef = useRef(null)

  const handleClick = (e) => {
    if (!isAdding) return
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setPosition({ x, y })
    
    // Reset form
    setNewAnnotation({ 
      title: `Annotation ${annotations.length + 1}`,
      note: '',
      type: 'info' 
    })
  }

  const handleAddAnnotation = () => {
    if (!newAnnotation.title.trim()) return
    
    onAddAnnotation?.({
      x: position.x,
      y: position.y,
      ...newAnnotation
    })
    
    setIsAdding(false)
  }

  const handleUpdateAnnotation = () => {
    if (!editingId || !newAnnotation.title.trim()) return
    
    onUpdateAnnotation?.(editingId, {
      ...newAnnotation
    })
    
    setEditingId(null)
  }

  const startEditing = (annotation) => {
    setEditingId(annotation.id)
    setNewAnnotation({
      title: annotation.title,
      note: annotation.note,
      type: annotation.type
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-500'
      case 'warning': return 'bg-yellow-500'
      case 'success': return 'bg-green-500'
      default: return 'bg-purple-500'
    }
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full", className)}
      onClick={handleClick}
    >
      {/* Annotations */}
      {annotations.map((annotation) => (
        <div 
          key={annotation.id}
          className={cn(
            "absolute w-4 h-4 rounded-full cursor-pointer flex items-center justify-center",
            "hover:scale-150 transition-transform duration-200 z-10",
            getTypeColor(annotation.type)
          )}
          style={{
            left: `${(annotation.x / width) * 100}%`,
            top: `${(annotation.y / height) * 100}%`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: annotation.color
          }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full h-full flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-white" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 z-50">
              {editingId === annotation.id ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Edit Annotation</h4>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpdateAnnotation()
                        }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(null)
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Input
                    value={newAnnotation.title}
                    onChange={(e) => setNewAnnotation(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Title"
                    className="h-8 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Textarea
                    value={newAnnotation.note}
                    onChange={(e) => setNewAnnotation(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="Add your note here..."
                    className="min-h-[80px] text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center gap-2 pt-1">
                    {['info', 'warning', 'success', 'custom'].map((type) => (
                      <button
                        key={type}
                        className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center text-xs text-white",
                          getTypeColor(type),
                          newAnnotation.type === type && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          setNewAnnotation(prev => ({ ...prev, type: type }))
                        }}
                      >
                        {type[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{annotation.title}</h4>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(annotation)
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteAnnotation?.(annotation.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {annotation.note && (
                    <p className="text-sm text-muted-foreground">{annotation.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(annotation.date).toLocaleString()}
                  </p>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      ))}

      {/* Add Annotation Button */}
      <div className="absolute bottom-4 right-4 z-10">
        {isAdding ? (
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
            <Input
              value={newAnnotation.title}
              onChange={(e) => setNewAnnotation(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Annotation title"
              className="h-8 w-32 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
            <Button 
              size="sm" 
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation()
                handleAddAnnotation()
              }}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Add</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setIsAdding(false)
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            className="gap-1.5"
            onClick={(e) => {
              e.stopPropagation()
              setIsAdding(true)
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Annotation</span>
          </Button>
        )}
      </div>
    </div>
  )
}
