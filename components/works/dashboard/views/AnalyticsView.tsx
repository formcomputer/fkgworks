"use client"
import { useState, useMemo } from "react"
import {
  TrendingUp, Users, Award, AlertTriangle,
  RefreshCw, Plus, X, ChevronDown, BarChart2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { useCanvas, type CanvasCourse } from "@/lib/canvas"

const PALETTE = ["#6366f1","#34d399","#fbbf24","#f87171","#60a5fa","#a78bfa","#fb923c"]
const TT = {
  background: "oklch(0.155 0 0)",
  border: "1px solid oklch(1 0 0 / 8%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "oklch(0.97 0 0)",
}

// ── Types ─────────────────────────────────────────────────────────────────────
type ChartType = "bar" | "line" | "pie" | "radar"
type Metric    = "submission_rate" | "grading_rate" | "needs_grading" | "points_possible"

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "bar",   label: "Bar Chart"   },
  { value: "line",  label: "Line Chart"  },
  { value: "pie",   label: "Pie Chart"   },
  { value: "radar", label: "Radar Chart" },
]

const METRICS: { value: Metric; label: string }[] = [
  { value: "submission_rate", label: "Submission Rate"  },
  { value: "grading_rate",    label: "Grading Rate"     },
  { value: "needs_grading",   label: "Needs Grading"    },
  { value: "points_possible", label: "Points Possible"  },
]

type SavedChart = {
  id: string
  chartType: ChartType
  metric: Metric
  courseId: string
  courseName: string
  label: string
}

// ── Data builder ──────────────────────────────────────────────────────────────
function buildData(course: CanvasCourse, metric: Metric) {
  const assignments = course.assignments.filter(a => a.published)
  const total = Math.max(course.studentCount, 1)
  return assignments.map(a => {
    const name = a.title.length > 20 ? a.title.slice(0, 20) + "…" : a.title
    let value = 0
    if (metric === "submission_rate")  value = Math.round((a.submittedCount / total) * 100)
    if (metric === "grading_rate")     value = Math.round((a.gradedCount    / total) * 100)
    if (metric === "needs_grading")    value = a.needsGradingCount ?? Math.max(0, a.submittedCount - a.gradedCount)
    if (metric === "points_possible")  value = a.pointsPossible
    return { name, value }
  })
}

function metricLabel(m: Metric): string {
  return METRICS.find(x => x.value === m)?.label ?? m
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Select<T extends string>({
  value, onChange, options, placeholder, searchable,
}: {
  value: T | ""; onChange: (v: T) => void
  options: { value: T; label: string }[]
  placeholder: string; searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const filtered = searchable && q
    ? options.filter(o => o.label.toLowerCase().includes(q.toLowerCase()))
    : options
  const selected = options.find(o => o.value === value)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-card text-[12px] text-foreground hover:bg-muted transition-colors min-w-[160px] justify-between"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={cn("w-3 h-3 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQ("") }} />
          <div className="absolute top-full mt-1 left-0 z-50 min-w-full w-max max-w-[240px] rounded-xl border border-border bg-card shadow-xl overflow-hidden">
            {searchable && (
              <div className="px-3 py-2 border-b border-border">
                <input
                  autoFocus
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            )}
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.map(o => (
                <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); setQ("") }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-[12px] hover:bg-muted transition-colors",
                    value === o.value ? "text-foreground font-medium bg-muted/40" : "text-muted-foreground"
                  )}>
                  {o.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-2 text-[11px] text-muted-foreground">No results</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Chart renderer ────────────────────────────────────────────────────────────
function ChartCard({ chart, course, onRemove }: {
  chart: SavedChart; course: CanvasCourse; onRemove: () => void
}) {
  const data = useMemo(() => buildData(course, chart.metric), [course, chart.metric])
  const color = PALETTE[0]
  const unit  = (chart.metric === "submission_rate" || chart.metric === "grading_rate") ? "%" : ""

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-semibold text-foreground">{metricLabel(chart.metric)}</p>
          <p className="text-[11px] text-muted-foreground">{chart.courseName}</p>
        </div>
        <button onClick={onRemove} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-[12px] text-muted-foreground py-6 text-center">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          {chart.chartType === "bar" ? (
            <BarChart data={data} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} unit={unit} />
              <Tooltip contentStyle={TT} formatter={(v: any) => [`${v}${unit}`, metricLabel(chart.metric)]} />
              <Bar dataKey="value" fill={color} radius={[3,3,0,0]} />
            </BarChart>
          ) : chart.chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} unit={unit} />
              <Tooltip contentStyle={TT} formatter={(v: any) => [`${v}${unit}`, metricLabel(chart.metric)]} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }} />
            </LineChart>
          ) : chart.chartType === "pie" ? (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={TT} formatter={(v: any) => [`${v}${unit}`]} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px", color: "oklch(0.60 0 0)" }} />
            </PieChart>
          ) : (
            <RadarChart data={data} cx="50%" cy="50%" outerRadius={70}>
              <PolarGrid stroke="oklch(1 0 0 / 10%)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: "oklch(0.60 0 0)" }} />
              <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.25} />
              <Tooltip contentStyle={TT} formatter={(v: any) => [`${v}${unit}`]} />
            </RadarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function AnalyticsView() {
  const { courses, loading, error, refresh } = useCanvas()

  const [activeCourseId, setActiveCourseId] = useState<string>("")
  const [charts, setCharts] = useState<SavedChart[]>([])

  // Builder state
  const [building, setBuilding] = useState(false)
  const [bChartType, setBChartType] = useState<ChartType | "">("")
  const [bMetric,    setBMetric]    = useState<Metric    | "">("")
  const [bCourseId,  setBCourseId]  = useState<string>("")

  const activeCourse = courses.find(c => c.id === (activeCourseId || courses[0]?.id)) ?? courses[0] ?? null

  const courseOptions = courses.map(c => ({ value: c.id, label: c.name }))

  function addChart() {
    if (!bChartType || !bMetric || !bCourseId) return
    const course = courses.find(c => c.id === bCourseId)
    if (!course) return
    setCharts(prev => [...prev, {
      id: `${Date.now()}`,
      chartType: bChartType as ChartType,
      metric: bMetric as Metric,
      courseId: bCourseId,
      courseName: course.name,
      label: `${metricLabel(bMetric as Metric)} — ${course.code}`,
    }])
    setBuilding(false)
    setBChartType(""); setBMetric(""); setBCourseId("")
  }

  function removeChart(id: string) {
    setCharts(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
      <RefreshCw className="w-5 h-5 animate-spin" />
      <p className="text-sm">Loading Canvas data...</p>
    </div>
  )

  if (!activeCourse) return (
    <div className="p-6 max-w-md">
      <div className="flex items-start gap-2.5 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-medium text-amber-400">No courses loaded</p>
          <p className="text-[11px] text-amber-400/70 mt-1">{error ?? "Check your Canvas API key in Settings."}</p>
          <button onClick={refresh} className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400">
            <RefreshCw className="w-3 h-3" />Retry
          </button>
        </div>
      </div>
    </div>
  )

  const assignments = activeCourse.assignments.filter(a => a.published)
  const total = Math.max(activeCourse.studentCount, 1)
  const totalSub  = assignments.reduce((s, a) => s + a.submittedCount, 0)
  const totalGrad = assignments.reduce((s, a) => s + a.gradedCount, 0)
  const subPct    = assignments.length ? Math.round((totalSub  / (assignments.length * total)) * 100) : 0
  const gradPct   = assignments.length ? Math.round((totalGrad / (assignments.length * total)) * 100) : 0
  const low       = assignments.filter(a => total > 0 && (a.submittedCount / total) < 0.5)

  // Default charts for the active course
  const defaultData = assignments.map(a => ({
    name: a.title.length > 16 ? a.title.slice(0, 16) + "…" : a.title,
    submitted: Math.round((a.submittedCount / total) * 100),
    graded:    Math.round((a.gradedCount    / total) * 100),
    missing:   Math.max(0, total - a.submittedCount),
  }))

  return (
    <div className="p-6 max-w-6xl space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            {activeCourse.name} · {activeCourse.studentCount} students · {assignments.length} assignments
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {courses.map(c => (
            <button key={c.id} onClick={() => setActiveCourseId(c.id)}
              className={cn(
                "h-7 px-3 rounded-full text-xs font-medium transition-colors border whitespace-nowrap",
                (activeCourseId || courses[0]?.id) === c.id
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              )}>
              {c.name}
            </button>
          ))}
          <button onClick={refresh} className="h-7 w-7 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Students",       value: activeCourse.studentCount.toString(), Icon: Users,          up: true  },
          { label: "Assignments",    value: assignments.length.toString(),         Icon: Award,          up: true  },
          { label: "Submission Rate",value: `${subPct}%`,                          Icon: TrendingUp,     up: subPct > 50  },
          { label: "Grading Rate",   value: `${gradPct}%`,                         Icon: BarChart2,      up: gradPct > 50 },
        ].map(k => {
          const Ic = k.Icon
          return (
            <div key={k.label} className="rounded-xl border border-border bg-card px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <Ic className="w-4 h-4 text-muted-foreground" />
                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                  k.up ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                       : "text-amber-400 border-amber-500/20 bg-amber-500/5"
                )}>
                  {k.up ? "on track" : "needs attention"}
                </span>
              </div>
              <p className="text-2xl font-semibold text-foreground tracking-tight">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{k.label}</p>
            </div>
          )
        })}
      </div>

      {/* Default charts */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-[1fr_280px] gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[13px] font-semibold text-foreground mb-1">Submission vs. Grading Rate</p>
            <p className="text-[11px] text-muted-foreground mb-4">Per assignment · % of enrolled students</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={defaultData} barSize={10} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.60 0 0)" }} axisLine={false} tickLine={false} unit="%" domain={[0,100]} />
                <Tooltip contentStyle={TT} formatter={(v: any) => [`${v}%`]} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="submitted" name="Submitted" fill="#6366f1" radius={[3,3,0,0]} />
                <Bar dataKey="graded"    name="Graded"    fill="#34d399" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[13px] font-semibold text-foreground mb-1">Submission Breakdown</p>
            <p className="text-[11px] text-muted-foreground mb-3">All assignments combined</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Graded",    value: totalGrad },
                    { name: "Submitted", value: Math.max(0, totalSub - totalGrad) },
                    { name: "Missing",   value: Math.max(0, assignments.length * total - totalSub) },
                  ].filter(d => d.value > 0)}
                  cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={3} dataKey="value"
                >
                  {["#34d399","#6366f1","#f87171"].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={TT} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {[["#34d399","Graded",totalGrad],["#6366f1","Submitted",Math.max(0,totalSub-totalGrad)],["#f87171","Missing",Math.max(0,assignments.length*total-totalSub)]].map(([c,n,v]) => (
                <div key={String(n)} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: String(c) }} />
                  {String(n)} · {String(v)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Chart builder ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[13px] font-semibold text-foreground">Custom Charts</p>
          <button
            onClick={() => setBuilding(b => !b)}
            className="flex items-center gap-1.5 h-7 px-3 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Plus className="w-3 h-3" />
            Create chart
          </button>
        </div>

        {building && (
          <div className="px-5 py-4 border-b border-border bg-muted/10">
            <p className="text-[11px] text-muted-foreground mb-3">Create a</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Select<ChartType>
                value={bChartType}
                onChange={setBChartType}
                options={CHART_TYPES}
                placeholder="chart type"
              />
              <span className="text-[11px] text-muted-foreground">about</span>
              <Select<Metric>
                value={bMetric}
                onChange={setBMetric}
                options={METRICS}
                placeholder="metric"
              />
              <span className="text-[11px] text-muted-foreground">from</span>
              <Select<string>
                value={bCourseId}
                onChange={setBCourseId}
                options={courseOptions}
                placeholder="course"
                searchable
              />
              <button
                onClick={addChart}
                disabled={!bChartType || !bMetric || !bCourseId}
                className="h-8 px-4 text-xs font-medium text-background bg-foreground rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-30"
              >
                Add
              </button>
              <button onClick={() => setBuilding(false)} className="h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {charts.length === 0 ? (
          !building && (
            <div className="px-5 py-8 text-center text-[12px] text-muted-foreground">
              No custom charts yet. Click &ldquo;Create chart&rdquo; to build one.
            </div>
          )
        ) : (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {charts.map(chart => {
              const course = courses.find(c => c.id === chart.courseId)
              if (!course) return null
              return (
                <ChartCard
                  key={chart.id}
                  chart={chart}
                  course={course}
                  onRemove={() => removeChart(chart.id)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Low submission alert */}
      {low.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <p className="text-[13px] font-semibold text-amber-400">Low Submission Assignments</p>
          </div>
          <div className="space-y-2">
            {low.map(a => {
              const pct = Math.round((a.submittedCount / total) * 100)
              return (
                <div key={a.id} className="flex items-center gap-4">
                  <p className="text-[12px] text-foreground flex-1 truncate">{a.title}</p>
                  <div className="w-32 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] font-mono text-amber-400 w-8 text-right">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
