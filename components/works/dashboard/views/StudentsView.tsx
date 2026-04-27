"use client"
import { useState } from "react"
import { ChevronRight, X, Mail, AlertTriangle, Search, RefreshCw, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCanvas, type CanvasStudent } from "@/lib/canvas"

type EnrichedStudent = CanvasStudent & { courses: string[] }

export function StudentsView({ search: externalSearch }: { search?: string }) {
  const { courses, loading, error, refresh } = useCanvas()
  const [localSearch, setLocalSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const search = (externalSearch ?? localSearch).toLowerCase().trim()

  // Build a deduplicated student list across all courses, keyed by Canvas ID
  const studentMap = new Map<string, EnrichedStudent>()
  courses.forEach(course => {
    course.students.forEach(s => {
      if (studentMap.has(s.id)) {
        studentMap.get(s.id)!.courses.push(course.code)
      } else {
        studentMap.set(s.id, { ...s, courses: [course.code] })
      }
    })
  })

  const allStudents = Array.from(studentMap.values())
    .sort((a, b) => a.name.localeCompare(b.name))

  const filtered = search
    ? allStudents.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.id.includes(search) ||
        s.email.toLowerCase().includes(search)
      )
    : allStudents

  const selected = selectedId ? studentMap.get(selectedId) ?? null : null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <p className="text-sm">Loading students from Canvas...</p>
      </div>
    )
  }

  if (error && allStudents.length === 0) {
    return (
      <div className="p-6 max-w-md">
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-medium text-amber-400">Could not load students</p>
            <p className="text-[11px] text-amber-400/70 mt-1">{error}</p>
            <button onClick={refresh} className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300">
              <RefreshCw className="w-3 h-3" />Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Students</h2>
              <p className="text-sm text-muted-foreground">
                {allStudents.length} unique students across {courses.length} course{courses.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={refresh} className="flex items-center gap-1.5 h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
              <RefreshCw className="w-3 h-3" />Sync
            </button>
          </div>

          {!externalSearch && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search by name, ID, or email..."
                className="bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
              {localSearch && (
                <button onClick={() => setLocalSearch("")}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          )}

          {search && (
            <p className="text-[11px] text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2.5 border-b border-border bg-muted/30">
              <span />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Student</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Courses</span>
              <span />
            </div>
            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                {search ? `No students matching "${search}"` : "No students found."}
              </div>
            ) : filtered.map((s, i) => (
              <button key={s.id} onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
                className={cn(
                  "w-full grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 items-center text-left transition-colors",
                  i < filtered.length - 1 && "border-b border-border",
                  selectedId === s.id ? "bg-muted/30" : "hover:bg-muted/15"
                )}>
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0">
                  {s.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{s.email || s.id}</p>
                </div>
                <div className="flex items-center gap-1 flex-wrap justify-end max-w-[200px]">
                  {s.courses.slice(0, 3).map(c => (
                    <span key={c} className="text-[9px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">{c}</span>
                  ))}
                  {s.courses.length > 3 && (
                    <span className="text-[9px] text-muted-foreground">+{s.courses.length - 3}</span>
                  )}
                </div>
                <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0", selectedId === s.id && "rotate-90")} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <aside className="w-[260px] shrink-0 border-l border-border bg-card flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <p className="text-[13px] font-semibold text-foreground">Student</p>
            <button onClick={() => setSelectedId(null)} className="p-1 rounded hover:bg-muted transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center text-xl font-semibold text-foreground mx-auto mb-3">
                {selected.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <p className="text-[14px] font-semibold text-foreground">{selected.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{selected.email || "No email on file"}</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Canvas ID: {selected.id}</p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                Enrolled In ({selected.courses.length})
              </p>
              <div className="space-y-1.5">
                {selected.courses.map(c => (
                  <div key={c} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background">
                    <BookOpen className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-[12px] text-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <button disabled className="w-full flex items-center justify-center gap-2 h-8 text-xs font-medium text-muted-foreground bg-muted rounded-lg cursor-not-allowed border border-border opacity-50">
              <Mail className="w-3 h-3" />Message (coming in v2)
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}
