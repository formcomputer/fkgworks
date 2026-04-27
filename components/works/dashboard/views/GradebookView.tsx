"use client"
import { useState } from "react"
import { Upload, Download, RefreshCw, Check, Pencil, Users, FileText, TrendingUp, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const COURSES = [
  { id: "pa-601", code: "PA 601", name: "Clinical Medicine I",   color: "#6366f1" },
  { id: "pa-602", code: "PA 602", name: "Pharmacology",          color: "#8b5cf6" },
  { id: "pa-603", code: "PA 603", name: "Patient Assessment",    color: "#a78bfa" },
  { id: "cs-101", code: "CS 101", name: "Intro to Computing",    color: "#34d399" },
  { id: "en-201", code: "EN 201", name: "Academic Writing",      color: "#fbbf24" },
]

const ASSIGNMENTS = ["SOAP Note #1", "SOAP Note #2", "Midterm", "SOAP Note #3", "Lab Report", "SOAP Note #4", "Final"]

const STUDENTS = [
  { name: "Amara Okonkwo",  id: "S001", grades: [92, 88, 91, 95, 87, null, null] },
  { name: "Diego Reyes",    id: "S002", grades: [78, 82, 76, 80, 79, null, null] },
  { name: "Priya Sharma",   id: "S003", grades: [96, 98, 97, 99, 95, null, null] },
  { name: "Connor Walsh",   id: "S004", grades: [70, 68, 72, 74, 69, null, null] },
  { name: "Yuki Tanaka",    id: "S005", grades: [85, 87, 89, 86, 88, null, null] },
  { name: "Jordan Ellis",   id: "S006", grades: [91, 90, 88, 92, 90, null, null] },
  { name: "Mia Patel",      id: "S007", grades: [83, 85, 81, 84, 86, null, null] },
  { name: "Luca Romano",    id: "S008", grades: [77, 75, 79, 78, 76, null, null] },
]

function avg(grades: (number | null)[]) {
  const filled = grades.filter((g): g is number => g !== null)
  if (!filled.length) return null
  return Math.round(filled.reduce((a, b) => a + b, 0) / filled.length)
}

function gradeColor(g: number | null) {
  if (g === null) return "text-muted-foreground/30"
  if (g >= 90) return "text-emerald-400"
  if (g >= 80) return "text-blue-400"
  if (g >= 70) return "text-amber-400"
  return "text-red-400"
}

function letterGrade(g: number | null) {
  if (g === null) return "—"
  if (g >= 93) return "A"
  if (g >= 90) return "A-"
  if (g >= 87) return "B+"
  if (g >= 83) return "B"
  if (g >= 80) return "B-"
  if (g >= 77) return "C+"
  if (g >= 73) return "C"
  return "D"
}

export function GradebookView() {
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0])
  const [grades, setGrades] = useState(STUDENTS.map(s => ({ ...s, grades: [...s.grades] })))
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null)
  const [editVal, setEditVal] = useState("")
  const [pushing, setPushing] = useState(false)
  const [pushed, setPushed] = useState(false)

  function startEdit(row: number, col: number) {
    setEditing({ row, col })
    setEditVal(grades[row].grades[col]?.toString() ?? "")
  }

  function commitEdit() {
    if (!editing) return
    const val = parseFloat(editVal)
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setGrades(prev => {
        const next = prev.map(s => ({ ...s, grades: [...s.grades] }))
        next[editing.row].grades[editing.col] = val
        return next
      })
    }
    setEditing(null)
    setPushed(false)
  }

  function pushToCanvas() {
    setPushing(true)
    setTimeout(() => { setPushing(false); setPushed(true) }, 1800)
  }

  const classAvg = avg(grades.flatMap(s => s.grades))
  const atRisk = grades.filter(s => { const a = avg(s.grades); return a !== null && a < 75 }).length

  return (
    <div className="p-6 max-w-full space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Gradebook</h2>
          <p className="text-sm text-muted-foreground">Edit grades here — push to Canvas when ready</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            <Download className="w-3 h-3" />Export
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            <Upload className="w-3 h-3" />Import Excel
          </button>
          <button
            disabled
            title="Canvas grade push coming in v2 — read-only demo"
            className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border text-muted-foreground opacity-40 cursor-not-allowed"
          >
            Push to Canvas
          </button>
        </div>
      </div>

      {/* Course tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {COURSES.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c)}
            className={cn(
              "flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium transition-colors border",
              selectedCourse.id === c.id
                ? "border-foreground/30 bg-foreground/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
            {c.code}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><Users className="w-4 h-4 text-muted-foreground" /></div>
          <div><p className="text-lg font-semibold text-foreground leading-none">{grades.length}</p><p className="text-[11px] text-muted-foreground mt-0.5">Students</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><TrendingUp className="w-4 h-4 text-muted-foreground" /></div>
          <div><p className="text-lg font-semibold text-foreground leading-none">{classAvg ? `${classAvg}%` : "—"}</p><p className="text-[11px] text-muted-foreground mt-0.5">Class Average</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-muted-foreground" /></div>
          <div><p className="text-lg font-semibold text-foreground leading-none">{ASSIGNMENTS.length}</p><p className="text-[11px] text-muted-foreground mt-0.5">Assignments</p></div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><AlertTriangle className="w-4 h-4 text-muted-foreground" /></div>
          <div><p className={cn("text-lg font-semibold leading-none", atRisk > 0 ? "text-amber-400" : "text-foreground")}>{atRisk}</p><p className="text-[11px] text-muted-foreground mt-0.5">At Risk</p></div>
        </div>
      </div>

            {/* Grid */}
      <div className="rounded-xl border border-border overflow-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] w-[180px] sticky left-0 bg-muted/30 z-10 border-r border-border">Student</th>
              {ASSIGNMENTS.map((a, i) => (
                <th key={i} className="px-3 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] text-center min-w-[90px] whitespace-nowrap">{a}</th>
              ))}
              <th className="px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] text-center min-w-[80px]">Avg</th>
              <th className="px-4 py-2.5 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] text-center min-w-[60px]">Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((student, ri) => {
              const a = avg(student.grades)
              return (
                <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors group">
                  <td className="px-4 py-2 sticky left-0 bg-background group-hover:bg-muted/10 z-10 border-r border-border transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground leading-tight">{student.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  {student.grades.map((g, ci) => {
                    const isEditing = editing?.row === ri && editing?.col === ci
                    return (
                      <td key={ci} className="px-2 py-1.5 text-center" onClick={() => !isEditing && startEdit(ri, ci)}>
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null) }}
                            className="w-16 text-center bg-foreground/10 border border-foreground/30 rounded px-1.5 py-0.5 text-foreground text-xs outline-none font-mono"
                          />
                        ) : (
                          <span className={cn(
                            "inline-flex items-center justify-center w-14 h-7 rounded-md font-mono cursor-pointer transition-colors",
                            g !== null ? "hover:bg-muted/50" : "hover:bg-muted/30",
                            gradeColor(g)
                          )}>
                            {g !== null ? g : <Pencil className="w-2.5 h-2.5 opacity-30" />}
                          </span>
                        )}
                      </td>
                    )
                  })}
                  <td className="px-4 py-2 text-center">
                    <span className={cn("font-mono font-semibold text-sm", gradeColor(a))}>{a ?? "—"}</span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={cn("text-xs font-semibold font-mono px-2 py-0.5 rounded border",
                      a === null ? "text-muted-foreground border-border" :
                      a >= 90 ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                      a >= 80 ? "text-blue-400 border-blue-500/20 bg-blue-500/5" :
                      a >= 70 ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                      "text-red-400 border-red-500/20 bg-red-500/5"
                    )}>
                      {letterGrade(a)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-muted-foreground/50 text-center">Click any cell to edit · Tab to advance · Enter to confirm · read-only demo — Canvas write coming in v2</p>
    </div>
  )
}
