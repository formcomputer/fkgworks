"use client"
import { useState } from "react"
import { ArrowLeft, Users, FileText, TrendingUp, ChevronRight, Clock, RefreshCw, Check, Pencil, WifiOff, AlertTriangle, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCanvas, type CanvasCourse, type CanvasAssignment } from "@/lib/canvas"

function letterGrade(pct: number | null): string {
  if (pct === null) return "—"
  if (pct >= 93) return "A"
  if (pct >= 90) return "A-"
  if (pct >= 87) return "B+"
  if (pct >= 83) return "B"
  if (pct >= 80) return "B-"
  if (pct >= 77) return "C+"
  if (pct >= 73) return "C"
  return "D"
}

type Screen = "courses" | "assignments" | "gradebook"

const COLORS = ["#6366f1","#8b5cf6","#a78bfa","#34d399","#fbbf24","#f87171","#60a5fa","#fb923c"]
function courseColor(idx: number) { return COLORS[idx % COLORS.length] }

// ─── Gradebook ────────────────────────────────────────────────────────────────
function Gradebook({ course, assignment, courseIdx, onBack }: {
  course: CanvasCourse; assignment: CanvasAssignment; courseIdx: number; onBack: () => void
}) {
  const color = courseColor(courseIdx)
  const [pushing, setPushing] = useState(false)
  const [pushed, setPushed] = useState(false)
  const students = course.students

  function push() {
    setPushing(true)
    setTimeout(() => { setPushing(false); setPushed(true) }, 1600)
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to assignments
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ color, borderColor: color+"30", background: color+"15" }}>{course.code}</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">{assignment.title}</h2>
          <p className="text-sm text-muted-foreground">
            {assignment.dueAt ? `Due ${new Date(assignment.dueAt).toLocaleDateString()}` : "No due date"} · {assignment.pointsPossible} pts · {assignment.gradedCount}/{students.length} graded
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            <Download className="w-3 h-3" />Export
          </button>
          <button disabled title="Canvas grade push coming in v2" className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border text-muted-foreground opacity-40 cursor-not-allowed">
            Push to Canvas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Students",       value: `${students.length}`                             },
          { label: "Graded",         value: `${assignment.gradedCount}/${students.length}`   },
          { label: "Points Possible",value: `${assignment.pointsPossible}`                   },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3 text-center">
            <p className="text-xl font-semibold font-mono text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 border-b border-border bg-muted/30">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Student</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center w-24">Score</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center w-12">Grade</span>
        </div>
        {students.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">No student roster available for this course.</div>
        ) : students.map((student, i) => (
          <div key={student.id} className={cn("grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 items-center hover:bg-muted/10 transition-colors", i < students.length - 1 && "border-b border-border")}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0">
                {student.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground">{student.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{student.id}</p>
              </div>
            </div>
            <div className="w-24 text-center">
              <span className="inline-flex items-center justify-center w-20 h-7 rounded-md font-mono text-sm text-muted-foreground/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <Pencil className="w-2.5 h-2.5 opacity-40" />
              </span>
            </div>
            <div className="w-12 text-center">
              <span className="text-xs font-semibold font-mono px-1.5 py-0.5 rounded border text-muted-foreground border-border">—</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground/40 text-center">Grade entry coming in the next build · syncs directly to Canvas</p>
    </div>
  )
}

// ─── Assignments ──────────────────────────────────────────────────────────────
function AssignmentsView({ course, courseIdx, onBack, onSelectAssignment }: {
  course: CanvasCourse; courseIdx: number; onBack: () => void; onSelectAssignment: (a: CanvasAssignment) => void
}) {
  const color = courseColor(courseIdx)
  const total = Math.max(course.studentCount, 1)

  const statusOf = (a: CanvasAssignment) => {
    if (!a.published) return "unpublished"
    if (a.gradedCount === 0) return "open"
    if (a.gradedCount < total) return "grading"
    return "graded"
  }

  const statusStyle: Record<string, { label: string; cls: string }> = {
    open:        { label: "Open",        cls: "text-blue-400 border-blue-500/20 bg-blue-500/5"         },
    grading:     { label: "Grading",     cls: "text-amber-400 border-amber-500/20 bg-amber-500/5"     },
    graded:      { label: "Graded",      cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"},
    unpublished: { label: "Unpublished", cls: "text-muted-foreground border-border bg-muted/20"       },
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to courses
      </button>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ color, borderColor: color+"30", background: color+"15" }}>{course.code}</span>
          <span className="text-[10px] text-muted-foreground">{course.term}</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground">{course.name}</h2>
        <p className="text-sm text-muted-foreground">{course.studentCount} students · {course.assignments.filter(a => a.published).length} published assignments</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Assignments",  value: course.assignments.length.toString() },
          { label: "Students",     value: course.studentCount.toString()       },
          { label: "Graded",       value: `${course.assignments.filter(a => a.gradedCount === total && a.published).length} of ${course.assignments.filter(a=>a.published).length}` },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3 text-center">
            <p className="text-xl font-semibold font-mono text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-border bg-muted/30">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Assignment</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Submitted</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Due</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
        </div>
        {course.assignments.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">No assignments found for this course.</div>
        ) : course.assignments.map((a, i) => {
          const status = statusOf(a)
          const { label, cls } = statusStyle[status]
          const submitted = a.submittedCount
          const pct = Math.round((submitted / total) * 100)
          const due = a.dueAt ? new Date(a.dueAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"
          return (
            <button key={a.id} onClick={() => onSelectAssignment(a)}
              className={cn("w-full grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 items-center text-left hover:bg-muted/15 transition-colors group", i < course.assignments.length - 1 && "border-b border-border")}>
              <div>
                <p className="text-[13px] font-medium text-foreground">{a.title}</p>
                <p className="text-[10px] text-muted-foreground">{a.pointsPossible} pts</p>
              </div>
              <div className="flex flex-col items-end gap-1 w-28">
                <span className="text-xs font-mono text-foreground">{submitted}/{total}</span>
                <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-foreground/50" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground w-20">
                <Clock className="w-3 h-3 shrink-0" />{due}
              </div>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", cls)}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Courses Grid ─────────────────────────────────────────────────────────────
function CoursesGrid({ onSelectCourse }: { onSelectCourse: (c: CanvasCourse, idx: number) => void }) {
  const { courses, loading, error, refresh } = useCanvas()
  const totalStudents = courses.reduce((s, c) => s + c.studentCount, 0)
  const totalAssignments = courses.reduce((s, c) => s + c.assignments.length, 0)
  const pendingGrading = courses.reduce((s, c) => s + c.assignments.filter(a => a.published && a.notSubmittedCount > 0).length, 0)

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Courses</h2>
          <p className="text-sm text-muted-foreground">Select a course to view assignments and grades</p>
        </div>
        <button onClick={refresh} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
          <RefreshCw className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-medium text-emerald-400">Live Canvas · Sync</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Courses",       value: loading ? "..." : courses.length.toString() },
          { label: "Students",      value: loading ? "..." : totalStudents.toString()  },
          { label: "Assignments",   value: loading ? "..." : totalAssignments.toString()},
          { label: "Needs Grading", value: loading ? "..." : pendingGrading.toString() },
        ].map(w => (
          <div key={w.label} className="rounded-xl border border-border bg-card px-4 py-3.5">
            <p className="text-2xl font-semibold text-foreground tracking-tight">{w.value}</p>
            <p className="text-[12px] font-medium text-foreground/80 mt-0.5">{w.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-[12px] text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading your Canvas courses...</div>
      ) : (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-3">Your Courses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {courses.map((course, ci) => {
              const color = courseColor(ci)
              const pending = course.assignments.filter(a => a.published && a.notSubmittedCount > 0).length
              const gradedPct = course.assignments.length && course.studentCount
                ? Math.round(course.assignments.reduce((s, a) => s + a.gradedCount, 0) / (course.assignments.length * course.studentCount) * 100)
                : null
              return (
                <button key={course.id} onClick={() => onSelectCourse(course, ci)}
                  className="group text-left p-4 rounded-xl border border-border bg-card hover:border-foreground/20 hover:bg-muted/10 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border" style={{ color, borderColor: color+"30", background: color+"15" }}>{course.code}</span>
                    {pending > 0 && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/5 text-amber-400">{pending} pending</span>}
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-0.5 leading-snug">{course.name}</p>
                  <p className="text-[11px] text-muted-foreground mb-3">{course.term}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.studentCount}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{course.assignments.length} assignments</span>
                  </div>
                  {gradedPct !== null && (
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${gradedPct}%`, background: color+"cc" }} />
                    </div>
                  )}
                  <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">Open <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function CoursesView() {
  const [screen, setScreen] = useState<Screen>("courses")
  const [selectedCourse, setSelectedCourse] = useState<CanvasCourse | null>(null)
  const [selectedCourseIdx, setSelectedCourseIdx] = useState(0)
  const [selectedAssignment, setSelectedAssignment] = useState<CanvasAssignment | null>(null)

  if (screen === "gradebook" && selectedCourse && selectedAssignment) {
    return <Gradebook course={selectedCourse} assignment={selectedAssignment} courseIdx={selectedCourseIdx} onBack={() => setScreen("assignments")} />
  }
  if (screen === "assignments" && selectedCourse) {
    return <AssignmentsView course={selectedCourse} courseIdx={selectedCourseIdx} onBack={() => setScreen("courses")} onSelectAssignment={a => { setSelectedAssignment(a); setScreen("gradebook") }} />
  }
  return <CoursesGrid onSelectCourse={(c, idx) => { setSelectedCourse(c); setSelectedCourseIdx(idx); setScreen("assignments") }} />
}
