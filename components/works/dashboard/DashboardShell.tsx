"use client"
import { useState } from "react"
import {
  LayoutDashboard, BookOpen, BarChart2, Users,
  Calendar, Settings, Bell, Search, LogOut,
  ChevronDown, Key, WifiOff, X, RefreshCw, MessageSquarePlus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/lib/profile"
import { useCanvas } from "@/lib/canvas"
import { OverviewView }  from "./views/OverviewView"
import { CoursesView }   from "./views/CoursesView"
import { AnalyticsView } from "./views/AnalyticsView"
import { StudentsView }  from "./views/StudentsView"
import { CalendarView }  from "./views/CalendarView"
import { SettingsView }  from "./views/SettingsView"
import { FeedbackView }  from "./views/FeedbackView"

export type View = "overview" | "courses" | "analytics" | "students" | "calendar" | "settings" | "feedback"

const NAV: { heading: string | null; items: { id: View; label: string; Icon: React.ElementType; badge?: string }[] }[] = [
  { heading: null, items: [
    { id: "overview",  label: "Dashboard",  Icon: LayoutDashboard },
  ]},
  { heading: "Canvas", items: [
    { id: "courses",   label: "Courses",    Icon: BookOpen   },
    { id: "analytics", label: "Analytics",  Icon: BarChart2  },
    { id: "students",  label: "Students",   Icon: Users      },
    { id: "calendar",  label: "Calendar",   Icon: Calendar   },
  ]},
  { heading: null, items: [
    { id: "feedback",  label: "Feedback",   Icon: MessageSquarePlus, badge: "beta" },
    { id: "settings",  label: "Settings",   Icon: Settings   },
  ]},
]

export function DashboardShell() {
  const [view, setView]     = useState<View>("overview")
  const [search, setSearch] = useState("")
  const { profile, setProfile } = useProfile()
  const { loading, courses, isDemo, refresh } = useCanvas()

  const initials = profile.name.trim().split(" ").filter(Boolean)
    .map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "??"

  function handleSearch(val: string) {
    setSearch(val)
    if (val.trim() && view !== "students") setView("students")
    if (!val.trim() && view === "students") setView("overview")
  }

  const views: Record<View, React.ReactNode> = {
    overview:  <OverviewView  onNavigate={setView} />,
    courses:   <CoursesView   />,
    analytics: <AnalyticsView />,
    students:  <StudentsView  search={search} />,
    calendar:  <CalendarView  />,
    settings:  <SettingsView  />,
    feedback:  <FeedbackView  />,
  }

  const statusLabel = loading
    ? "Syncing with Canvas..."
    : courses.length > 0
      ? `${courses.length} course${courses.length !== 1 ? "s" : ""} · live`
      : "No courses loaded"

  return (
    <div className="flex flex-col h-full">

      {/* Beta banner */}
      <div className="flex items-center justify-center gap-2 py-1.5 border-b border-amber-500/20 shrink-0 bg-amber-500/8">
        <WifiOff className="w-3 h-3 text-amber-400 shrink-0" />
        <span className="text-[10px] font-medium text-amber-400">
          Works Beta · API key stored locally · all Canvas data fetched directly · nothing passes through Works servers
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-[200px] shrink-0 flex flex-col border-r border-border bg-sidebar">

          <div className="h-[50px] flex items-center px-5 border-b border-border shrink-0">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">Works</span>
            <span className="ml-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
              beta
            </span>
          </div>

          {/* Status pill */}
          <div className="px-3 pt-3 pb-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background/30">
              {loading
                ? <RefreshCw className="w-3 h-3 text-muted-foreground animate-spin shrink-0" />
                : <div className={cn("w-2 h-2 rounded-full shrink-0", courses.length > 0 ? "bg-emerald-400" : "bg-muted-foreground/40")} />
              }
              <p className="text-[10px] text-muted-foreground truncate">{statusLabel}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-4">
            {NAV.map((section, si) => (
              <div key={si}>
                {section.heading && (
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-2 mb-1">
                    {section.heading}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map(({ id, label, Icon, badge }) => (
                    <button key={id}
                      onClick={() => { setView(id); if (id !== "students") setSearch("") }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all text-left",
                        view === id
                          ? "bg-foreground text-background font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}>
                      <Icon className="w-[13px] h-[13px] shrink-0" />
                      <span className="flex-1">{label}</span>
                      {badge && view !== id && (
                        <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 pb-4 border-t border-border pt-3">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
              <Key className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[9px] text-emerald-400/70 truncate">
                {courses.length > 0 ? "Canvas · connected" : "Canvas · key saved"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                {profile.avatar
                  ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                  : <span className="text-[9px] font-bold text-foreground">{initials}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground truncate">{profile.name}</p>
                <p className="text-[9px] text-muted-foreground">Instructor</p>
              </div>
              <button onClick={() => setProfile({ ...profile, onboarded: false })}
                className="p-1 rounded hover:bg-muted transition-colors shrink-0" title="Sign out">
                <LogOut className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Topbar */}
          <header className="h-[50px] shrink-0 border-b border-border flex items-center px-5 gap-3 bg-card">
            <div className="flex items-center gap-2 max-w-xs w-full px-3 py-1.5 rounded-lg border border-border bg-background focus-within:border-foreground/20 transition-colors">
              <Search className="w-3 h-3 text-muted-foreground shrink-0" />
              <input
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search students..."
                className="bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
              {search && (
                <button onClick={() => handleSearch("")}>
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              )}
            </div>

            <div className="flex-1" />

            <button onClick={refresh}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Sync Canvas">
              <RefreshCw className={cn("w-[13px] h-[13px]", loading && "animate-spin")} />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
              <Bell className="w-[13px] h-[13px] text-muted-foreground" />
            </button>
          </header>

          {/* View — key forces remount on nav change for clean entry animation */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div key={view} className="animate-in fade-in duration-200 h-full">
              {views[view]}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
