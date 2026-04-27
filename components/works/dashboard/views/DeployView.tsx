"use client"
import { useState } from "react"
import { Plus, GitBranch, CheckCircle2, Clock, XCircle, RefreshCw, ExternalLink, MoreHorizontal, Terminal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const PROJECTS = [
  { name: "works-lms",        url: "lms.rmc.internal",       branch: "main", status: "live"     as const, ago: "2m ago",  runtime: "Node 18", sha: "a3f92c1", msg: "fix gradebook sort order" },
  { name: "works-workspace",  url: "workspace.rmc.internal", branch: "main", status: "live"     as const, ago: "1h ago",  runtime: "Node 18", sha: "d1e4509", msg: "add nested page linking"   },
  { name: "works-meet",       url: "meet.rmc.internal",      branch: "main", status: "building" as const, ago: "now",     runtime: "Node 18", sha: "f9ab201", msg: "WebRTC STUN peer fix"      },
  { name: "pa-portal",        url: "pa.rmc.internal",        branch: "dev",  status: "failed"   as const, ago: "4h ago",  runtime: "Node 18", sha: "7c3d884", msg: "add schedule grid view"    },
  { name: "works-admin",      url: "admin.rmc.internal",     branch: "main", status: "live"     as const, ago: "2d ago",  runtime: "Node 18", sha: "2ab3f10", msg: "dashboard node metrics"    },
]

const statusMeta = {
  live:     { dot: "bg-emerald-400",  label: "Live",     textColor: "text-emerald-400", Icon: CheckCircle2 },
  building: { dot: "bg-amber-400 animate-pulse", label: "Building", textColor: "text-amber-400",  Icon: RefreshCw   },
  failed:   { dot: "bg-red-400",      label: "Failed",   textColor: "text-red-400",    Icon: XCircle     },
}

const LOG_LINES = [
  { text: "→ Received push: works-lms @ a3f92c1",         dim: false },
  { text: "→ Cloning repository...",                       dim: true  },
  { text: "→ docker build -t works-lms:a3f92c1 .",        dim: false },
  { text: "  Step 1/8 · FROM node:18-alpine",             dim: true  },
  { text: "  Step 4/8 · COPY package*.json ./",           dim: true  },
  { text: "  Step 5/8 · RUN npm ci --production",         dim: true  },
  { text: "  Step 8/8 · EXPOSE 3000",                     dim: true  },
  { text: " Image built in 14.2s",                       dim: false },
  { text: " Container started — port 3000",              dim: false },
  { text: " TLS cert issued — lms.rmc.internal",         dim: false },
  { text: " Health check passed",                        dim: false },
  { text: "  Ready · 2 minutes ago",                      dim: true  },
]

export function DeployView() {
  const [deploying, setDeploying] = useState<string | null>(null)
  function redeploy(name: string) {
    setDeploying(name)
    setTimeout(() => setDeploying(null), 2800)
  }

  return (
    <div className="p-6 max-w-6xl space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Deploy</h2>
          <p className="text-sm text-muted-foreground">Git push → Docker build → live on campus. Zero cloud.</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-background bg-foreground rounded-lg hover:bg-foreground/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />New Project
        </button>
      </div>

      {/* Git hint */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card font-mono">
        <Terminal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-foreground">git push works main</span>
        <span className="text-xs text-muted-foreground ml-1">→ auto-builds and deploys to Node 01</span>
        <a href="#" className="ml-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors">docs ↗</a>
      </div>

      {/* Project list */}
      <Card className="gap-0 py-0 border-border overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-2.5 border-b border-border bg-muted/30">
          <span />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Project</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Branch</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Deployed</span>
          <span />
        </div>
        {PROJECTS.map((p, i) => {
          const isDeploying = deploying === p.name
          const meta = statusMeta[isDeploying ? "building" : p.status]
          const StatusIcon = meta.Icon
          return (
            <div key={p.name} className={cn("grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-muted/20 transition-colors group", i < PROJECTS.length - 1 && "border-b border-border")}>
              <div className={cn("w-2 h-2 rounded-full shrink-0", meta.dot)} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">{p.sha}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{p.msg}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <GitBranch className="w-3 h-3" />{p.branch}
              </div>
              <div className={cn("flex items-center gap-1.5 text-xs font-medium", meta.textColor)}>
                <StatusIcon className={cn("w-3.5 h-3.5", (isDeploying || p.status === "building") && "animate-spin")} />
                {isDeploying ? "Building..." : meta.label}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground w-16">
                <Clock className="w-3 h-3 shrink-0" />
                {isDeploying ? "just now" : p.ago}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={`https://${p.url}`} className="p-1.5 rounded hover:bg-muted transition-colors"><ExternalLink className="w-3.5 h-3.5 text-muted-foreground" /></a>
                <button onClick={() => redeploy(p.name)} disabled={isDeploying || p.status === "building"} className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-30"><RefreshCw className={cn("w-3.5 h-3.5 text-muted-foreground", isDeploying && "animate-spin")} /></button>
                <button className="p-1.5 rounded hover:bg-muted transition-colors"><MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" /></button>
              </div>
            </div>
          )
        })}
      </Card>

      {/* Build log */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Last Build · works-lms</h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 text-[11px] text-muted-foreground font-mono">build log</span>
            <span className="ml-auto text-[11px] text-emerald-400 font-mono"> Success · 14.2s</span>
          </div>
          <div className="p-4 font-mono text-[11px] leading-6 space-y-0">
            {LOG_LINES.map((l, i) => (
              <p key={i} className={l.dim ? "text-muted-foreground" : l.text.startsWith("") ? "text-emerald-400" : "text-foreground"}>{l.text}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
