"use client"
import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, RefreshCw, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCanvas } from "@/lib/canvas"

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const COLORS = ["#6366f1","#8b5cf6","#34d399","#fbbf24","#f87171","#60a5fa","#fb923c"]

type CalEvent = {
  id: string
  title: string
  courseCode: string
  courseName: string
  color: string
  date: Date
  pointsPossible: number
  submittedCount: number
  total: number
}

export function CalendarView() {
  const { courses, loading, error, refresh } = useCanvas()
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<Date | null>(today)

  // Build event list from all course assignments with due dates
  const events = useMemo<CalEvent[]>(() => {
    return courses.flatMap((course, ci) =>
      course.assignments
        .filter(a => a.dueAt && a.published)
        .map(a => ({
          id: a.id,
          title: a.title,
          courseCode: course.code,
          courseName: course.name,
          color: COLORS[ci % COLORS.length],
          date: new Date(a.dueAt!),
          pointsPossible: a.pointsPossible,
          submittedCount: a.submittedCount,
          total: course.studentCount,
        }))
    ).sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [courses])

  const year  = current.getFullYear()
  const month = current.getMonth()

  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  function eventsOn(day: number | null): CalEvent[] {
    if (!day) return []
    return events.filter(e =>
      e.date.getFullYear() === year &&
      e.date.getMonth() === month &&
      e.date.getDate() === day
    )
  }

  const selectedDay = selected?.getDate() ?? null
  const selectedMonth = selected?.getMonth() ?? null
  const selectedYear = selected?.getFullYear() ?? null
  const selectedEvents = events.filter(e =>
    selected &&
    e.date.getFullYear() === selectedYear &&
    e.date.getMonth() === selectedMonth &&
    e.date.getDate() === selectedDay
  )

  // Upcoming (next 14 days from today)
  const upcoming = events.filter(e => {
    const diff = e.date.getTime() - today.getTime()
    return diff >= 0 && diff <= 14 * 86400000
  }).slice(0, 8)

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const isSelected = (day: number) =>
    selected &&
    day === selected.getDate() &&
    month === selected.getMonth() &&
    year === selected.getFullYear()

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
      <RefreshCw className="w-5 h-5 animate-spin" />
      <p className="text-sm">Loading calendar...</p>
    </div>
  )

  return (
    <div className="flex h-full overflow-hidden">

      {/* Calendar grid */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={() => { setCurrent(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today) }}
              className="h-6 px-2 text-[10px] font-medium rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrent(new Date(year, month - 1, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrent(new Date(year, month + 1, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider text-center py-1.5">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {cells.map((day, i) => {
            const evs = eventsOn(day)
            const today_ = day !== null && isToday(day)
            const selected_ = day !== null && isSelected(day)
            return (
              <div
                key={i}
                onClick={() => day && setSelected(new Date(year, month, day))}
                className={cn(
                  "bg-background p-1.5 min-h-[80px] flex flex-col gap-0.5 transition-colors",
                  day ? "cursor-pointer hover:bg-muted/30" : "opacity-0 pointer-events-none",
                  selected_ && "bg-muted/20"
                )}
              >
                {day && (
                  <>
                    <span className={cn(
                      "text-[11px] font-medium w-5 h-5 flex items-center justify-center rounded-full leading-none shrink-0",
                      today_ ? "bg-foreground text-background" : selected_ ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {day}
                    </span>
                    {evs.slice(0, 3).map(e => (
                      <div
                        key={e.id}
                        className="text-[9px] px-1 py-0.5 rounded truncate font-medium leading-tight"
                        style={{ background: e.color + "22", color: e.color }}
                      >
                        {e.title.length > 18 ? e.title.slice(0, 18) + "…" : e.title}
                      </div>
                    ))}
                    {evs.length > 3 && (
                      <span className="text-[9px] text-muted-foreground px-1">+{evs.length - 3}</span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[280px] shrink-0 border-l border-border flex flex-col overflow-hidden">

        {/* Selected day detail */}
        <div className="p-5 border-b border-border">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {selected
              ? selected.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
              : "Select a day"}
          </p>
          {selectedEvents.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Nothing due.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map(e => {
                const pct = e.total > 0 ? Math.round((e.submittedCount / e.total) * 100) : 0
                return (
                  <div key={e.id} className="p-3 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: e.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-foreground leading-snug">{e.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{e.courseCode} · {e.pointsPossible} pts</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{e.submittedCount} of {e.total} submitted</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: e.color }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Next 14 Days
          </p>
          {upcoming.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Nothing upcoming.</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map(e => {
                const dateStr = e.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      setCurrent(new Date(e.date.getFullYear(), e.date.getMonth(), 1))
                      setSelected(e.date)
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-lg border border-border hover:bg-muted/20 transition-colors text-left"
                  >
                    <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: e.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-foreground truncate">{e.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{e.courseCode}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{dateStr}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
