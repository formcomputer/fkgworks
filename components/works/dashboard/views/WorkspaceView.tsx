"use client"
import { useState } from "react"
import { Plus, ChevronRight, ChevronDown, Star, MoreHorizontal, Hash, Lock, FileText, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const PAGES = [
  { id: "1", icon: "", title: "PA Program",        expanded: true,  children: [
    { id: "1-1", icon: "", title: "Curriculum 2026",          locked: false },
    { id: "1-2", icon: "", title: "Clinical Rotations Guide", locked: false },
    { id: "1-3", icon: "", title: "Faculty Handbook",         locked: true  },
    { id: "1-4", icon: "", title: "Competency Checklist",     locked: false },
  ]},
  { id: "2", icon: "", title: "IT & Infrastructure", expanded: false, children: [
    { id: "2-1", icon: "", title: "Node Setup Guide",    locked: false },
    { id: "2-2", icon: "", title: "Backup Schedule",     locked: false },
    { id: "2-3", icon: "", title: "Security Runbook",    locked: true  },
  ]},
  { id: "3", icon: "", title: "Meeting Notes",      expanded: false, children: [
    { id: "3-1", icon: "", title: "Board of Trustees Q4",   locked: false },
    { id: "3-2", icon: "", title: "Works Kickoff — IT Dept", locked: false },
    { id: "3-3", icon: "", title: "PA Program Advisory",    locked: false },
  ]},
]

const CONTENT = {
  title: "Curriculum 2026",
  lastEdited: "Dr. James Grant · 2 hours ago",
  blocks: [
    { type: "h1",      content: "PA Program Curriculum — Academic Year 2026" },
    { type: "callout", content: "  FERPA Notice: All student records linked to this workspace are governed by R-MC data retention policy. Access is logged." },
    { type: "h2",      content: "Year One — Didactic Phase" },
    { type: "p",       content: "Students complete 16 months of classroom instruction spanning core biomedical sciences, clinical medicine, pharmacology, pathophysiology, and patient care fundamentals." },
    { type: "h2",      content: "Year Two — Clinical Phase" },
    { type: "p",       content: "Students rotate through 6 core disciplines across affiliated hospital partners in the Richmond–Charlottesville corridor. Rotations include Internal Medicine, Surgery, Pediatrics, OB/GYN, Emergency Medicine, and Psychiatry." },
    { type: "h2",      content: "Assessment & Competency" },
    { type: "p",       content: "All summative assessments are administered via the Works LMS, with grades stored on-campus and exportable in OMSAS/CASPA-compatible formats. No third-party proctoring tools transmit student data externally." },
  ],
}

export function WorkspaceView() {
  const [expanded, setExpanded] = useState<string[]>(["1"])
  function toggle(id: string) {
    setExpanded(e => e.includes(id) ? e.filter(x => x !== id) : [...e, id])
  }

  return (
    <div className="flex h-full overflow-hidden">

      {/* Tree sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-3 py-3 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workspace</span>
          <button className="p-1 rounded hover:bg-muted transition-colors"><Plus className="w-3.5 h-3.5 text-muted-foreground" /></button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-muted/30">
            <Search className="w-3 h-3 text-muted-foreground" />
            <input placeholder="Search pages..." className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full" />
          </div>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {PAGES.map(page => {
            const isExp = expanded.includes(page.id)
            return (
              <div key={page.id}>
                <button onClick={() => toggle(page.id)} className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  {isExp ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                  <span className="text-sm">{page.icon}</span>
                  <span className="truncate font-medium">{page.title}</span>
                </button>
                {isExp && (
                  <div className="ml-4 pl-2 border-l border-border space-y-0.5 mt-0.5 mb-1">
                    {page.children.map(child => (
                      <button key={child.id} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <span>{child.icon}</span>
                        <span className="flex-1 truncate text-left">{child.title}</span>
                        {child.locked && <Lock className="w-2.5 h-2.5 text-muted-foreground/40 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-10 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-6">
            <span>PA Program</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{CONTENT.title}</span>
          </div>

          {/* Page header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">{CONTENT.title}</h1>
              <p className="text-xs text-muted-foreground mt-1.5">Last edited by {CONTENT.lastEdited}</p>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <button className="p-1.5 rounded hover:bg-muted transition-colors"><Star className="w-4 h-4 text-muted-foreground" /></button>
              <button className="p-1.5 rounded hover:bg-muted transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>

          {/* Blocks */}
          <div className="space-y-4 prose prose-invert max-w-none">
            {CONTENT.blocks.map((block, i) => {
              if (block.type === "h1") return (
                <h1 key={i} className="text-xl font-bold text-foreground leading-snug mt-0">{block.content}</h1>
              )
              if (block.type === "h2") return (
                <h2 key={i} className="flex items-center gap-2 text-sm font-semibold text-foreground mt-6">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  {block.content}
                </h2>
              )
              if (block.type === "callout") return (
                <div key={i} className="flex gap-3 px-4 py-3 rounded-xl border border-border bg-muted/30 text-xs text-muted-foreground leading-relaxed">
                  {block.content}
                </div>
              )
              return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>
            })}
          </div>

          {/* Add block hint */}
          <div className="mt-10 pt-6 border-t border-border">
            <button className="flex items-center gap-2 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add a block
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
