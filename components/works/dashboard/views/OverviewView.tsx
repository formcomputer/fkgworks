"use client"
import { useMemo } from "react"
import {
  BookOpen, Users, TrendingUp, Clock,
  ArrowUpRight, RefreshCw, AlertTriangle, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCanvas } from "@/lib/canvas"
import { useProfile } from "@/lib/profile"
import type { View } from "../DashboardShell"

function greeting(name: string): string {
  const h = new Date().getHours()
  const first = name.split(" ")[0] || "there"
  if (h < 5)  return `Working late, ${first}.`
  if (h < 12) return `Good morning, ${first}.`
  if (h < 17) return `Good afternoon, ${first}.`
  if (h < 21) return `Good evening, ${first}.`
  return `Good night, ${first}.`
}

export function OverviewView({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { courses, loading, error, refresh } = useCanvas()
  const { profile } = useProfile()

  const totalStudents    = courses.reduce((s, c) => s + c.studentCount, 0)
  const totalAssignments = courses.reduce((s, c) => s + c.assignments.length, 0)
  const published        = courses.reduce((s, c) => s + c.assignments.filter(a => a.published).length, 0)
  const totalSubmitted   = courses.reduce((s, c) => s + c.assignments.reduce((x, a) => x + a.submittedCount, 0), 0)
  const totalGraded      = courses.reduce((s, c) => s + c.assignments.reduce((x, a) => x + a.gradedCount, 0), 0)
  const needsGrading     = courses.reduce((s, c) =>
    s + c.assignments.filter(a => a.published && a.gradedCount < c.studentCount).length, 0)

  const submissionRate = published && totalStudents
    ? Math.round((totalSubmitted / (published * totalStudents)) * 100)
    : null

  const now = Date.now()
  const week = 7 * 86400000

  const upcoming = useMemo(() =>
    courses
      .flatMap(c => c.assignments
        .filter(a => a.published && a.dueAt)
        .map(a => ({ ...a, courseCode: c.code, courseName: c.name }))
      )
      .filter(a => {
        const t = new Date(a.dueAt!).getTime()
        return t >= now && t <= now + week
      })
      .sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime())
      .slice(0, 6),
    [courses]
  )

  const needsAttention = useMemo(() =>
    courses
      .flatMap(c => c.assignments
        .filter(a => a.published && a.gradedCount < c.studentCount)
        .map(a => ({ ...a, courseCode: c.code, total: c.studentCount }))
      )
      .sort((a, b) => (a.gradedCount / a.total) - (b.gradedCount / b.total))
      .slice(0, 5),
    [courses]
  )

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">

      {/* Greeting */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground tracking-tight">
            {greeting(profile.name)}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {loading
              ? "Syncing with Canvas..."
              : error
                ? "Could not reach Canvas."
                : courses.length === 0
                  ? "No courses loaded yet."
                  : `${courses.length} course${courses.length !== 1 ? "s" : ""} · ${totalAssignments} assignments`}
          </p>
        </div>
        {(loading || error) && (
          <button onClick={refresh}
            className="flex items-center gap-1.5 h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            {loading ? "Syncing" : "Retry"}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-400">{error}</p>
        </div>
      )}

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Courses",        value: courses.length.toString(),                Icon: BookOpen,    },
          { label: "Students",       value: totalStudents > 0 ? totalStudents.toString() : "—", Icon: Users, },
          { label: "Submission Rate",value: submissionRate != null ? `${submissionRate}%` : "—", Icon: TrendingUp },
          { label: "Needs Grading",  value: needsGrading.toString(),                 Icon: Clock,       },
        ].map(s => {
          const Ic = s.Icon
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Ic className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-[26px] font-semibold text-foreground tracking-tight leading-none">{s.value}</p>
              <p className="text-[12px] text-muted-foreground mt-1.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Two column */}
      <div className="grid grid-cols-[1fr_300px] gap-5">

        {/* Needs attention */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-[13px] font-semibold text-foreground">Needs Grading</h3>
            <button onClick={() => onNavigate("courses")}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
              Open Courses <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
            </div>
          ) : needsAttention.length === 0 ? (
            <div className="px-5 py-8 text-center text-[12px] text-muted-foreground">
              {courses.length === 0 ? "No courses loaded." : "All caught up."}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-[1fr_80px_120px] gap-4 px-5 py-2 border-b border-border bg-muted/20">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Assignment</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Course</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Progress</span>
              </div>
              {needsAttention.map((a, i) => {
                const pct = a.total > 0 ? Math.round((a.gradedCount / a.total) * 100) : 0
                return (
                  <div key={a.id}
                    className={cn("grid grid-cols-[1fr_80px_120px] gap-4 px-5 py-3 items-center", i < needsAttention.length - 1 && "border-b border-border")}>
                    <p className="text-[12px] font-medium text-foreground truncate">{a.title}</p>
                    <span className="text-[11px] text-muted-foreground">{a.courseCode}</span>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{a.gradedCount}/{a.total}</span><span>{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-foreground/60" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Due this week */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-[13px] font-semibold text-foreground">Due This Week</h3>
            <button onClick={() => onNavigate("calendar")}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Calendar <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="px-5 py-8 text-center text-[12px] text-muted-foreground">
              {loading ? "Loading..." : "Nothing due in the next 7 days."}
            </div>
          ) : upcoming.map((a, i) => {
            const due = new Date(a.dueAt!)
            const dateStr = due.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            return (
              <div key={a.id}
                className={cn("flex items-start gap-3 px-5 py-3", i < upcoming.length - 1 && "border-b border-border")}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground truncate">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{a.courseCode}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{dateStr}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Course list */}
      {courses.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-[13px] font-semibold text-foreground">Your Courses</h3>
          </div>
          {courses.map((c, i) => {
            const graded = c.assignments.reduce((s, a) => s + a.gradedCount, 0)
            const total  = c.assignments.length * c.studentCount
            const pct    = total > 0 ? Math.round((graded / total) * 100) : 0
            return (
              <button key={c.id} onClick={() => onNavigate("courses")}
                className={cn("w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-muted/15 transition-colors", i < courses.length - 1 && "border-b border-border")}>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {c.studentCount} students · {c.assignments.length} assignments · {c.term}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Graded</span><span>{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-foreground/60" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
