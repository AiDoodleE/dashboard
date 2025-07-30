import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bell, Settings, User } from "lucide-react"

import { useState } from "react";

export function DashboardHeader({ onOpenSettings }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">ADmyBRAND</h1>
              <p className="text-xs text-muted-foreground">Insights</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hover-lift" onClick={() => alert('This is a mock data for real notification. We can use a public API key and get notified.') }>
            <Bell className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover-lift"
            onClick={onOpenSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          {/* Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="hover-lift"
              onClick={() => setShowProfileMenu((v: boolean) => !v)}
              aria-label="Open profile menu"
              type="button"
            >
              <User className="h-4 w-4" />
            </Button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 animate-fade-in p-4 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">A</div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Ashlay</div>
                    <div className="text-xs text-slate-500 dark:text-slate-300">Use name</div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  Role: <span className="font-semibold">admin</span>
                </div>
                <button
                  className="w-full px-4 py-2 mt-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition"
                  onClick={() => { setShowProfileMenu(false); alert('Logged out (demo)') }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}