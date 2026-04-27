"use client"
import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, Network, HardDrive, Shield, RefreshCw, Cpu, MemoryStick, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function useLive(base: number, variance: number, interval = 2500) {
  const [v, setV] = useState(base)
  useEffect(() => {
    const id = setInterval(() => setV(base + (Math.random() - 0.5) * variance), interval)
    return () => clearInterval(id)
  }, [base, variance, interval])
  return Math.max(0, Math.min(100, v))
}

function MetricBar({ label, value, unit = "%", warn = 75, danger = 90 }: { label: string; value: number; unit?: string; warn?: number; danger?: number }) {
  const color = value >= danger ? "bg-red-400" : value >= warn ? "bg-amber-400" : "bg-foreground/70"
  const textColor = value >= danger ? "text-red-400" : value >= warn ? "text-amber-400" : "text-foreground"
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("text-xs font-mono font-medium", textColor)}>{value.toFixed(1)}{unit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  )
}

const EVENTS = [
  { ok: true,  text: "Node 01 → Node 02 backup sync complete",    time: "1h ago"  },
  { ok: false, text: "Node 02 CPU spike 87% — auto-recovered",    time: "3h ago"  },
  { ok: true,  text: "TLS certificate auto-renewed",              time: "6h ago"  },
  { ok: true,  text: "Postgres WAL checkpoint OK",                time: "12h ago" },
  { ok: true,  text: "Node 01 health check passed",               time: "15m ago" },
  { ok: true,  text: "FERPA audit log flush complete",            time: "2h ago"  },
]

export function NodeHealthView() {
  const n1cpu  = useLive(34, 14)
  const n1ram  = useLive(61, 6)
  const n1disk = useLive(9.4, 0.4)
  const n2cpu  = useLive(18, 10)
  const n2ram  = useLive(43, 5)
  const n2disk = useLive(14.2, 0.3)

  const nodes = [
    {
      name: "Node 01", role: "Primary",
      desc: "Deployment engine · LMS · Auth · Postgres · TLS Proxy",
      ip: "10.0.1.10", uptime: "31d 4h", sla: "99.97%", model: "Mac Mini M4 Pro · 32 GB",
      cpu: n1cpu, ram: n1ram, disk: n1disk,
      services: [
        { name: "Deploy Engine", ok: true },
        { name: "LMS",          ok: true },
        { name: "Auth / SAML",  ok: true },
        { name: "Postgres",     ok: true },
        { name: "TLS Proxy",    ok: true },
      ],
    },
    {
      name: "Node 02", role: "Secondary",
      desc: "Local AI · Meet · Backup engine · Failover watch",
      ip: "10.0.1.11", uptime: "31d 4h", sla: "99.91%", model: "Mac Mini M4 Pro · 32 GB",
      cpu: n2cpu, ram: n2ram, disk: n2disk,
      services: [
        { name: "Local AI (Ollama)", ok: true  },
        { name: "Meet / WebRTC",    ok: true  },
        { name: "Backup Engine",    ok: true  },
        { name: "Failover Watch",   ok: true  },
      ],
    },
  ]

  return (
    <div className="p-6 max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Node Health</h2>
          <p className="text-sm text-muted-foreground">Randolph-Macon College · 2 nodes online · auto-failover armed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">All systems operational</span>
          </div>
          <button className="flex items-center gap-1.5 h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            <RefreshCw className="w-3 h-3" />Refresh
          </button>
        </div>
      </div>

      {/* Node cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {nodes.map(node => (
          <Card key={node.name} className="gap-0 border-border">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-base">{node.name}</CardTitle>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">{node.role}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{node.model}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">{node.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />Healthy
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Metrics */}
              <div className="space-y-3">
                <MetricBar label="CPU" value={node.cpu} />
                <MetricBar label="RAM" value={node.ram} />
                <MetricBar label="Disk" value={node.disk} warn={60} danger={80} />
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-3 gap-2">
                {[{ l: "IP Address", v: node.ip }, { l: "Uptime", v: node.uptime }, { l: "30d SLA", v: node.sla }].map(s => (
                  <div key={s.l} className="text-center py-2 rounded-lg border border-border bg-muted/30">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{s.l}</p>
                    <p className="text-xs font-mono font-medium text-foreground">{s.v}</p>
                  </div>
                ))}
              </div>

              {/* Services */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {node.services.map(svc => (
                    <span key={svc.name} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                      <div className={cn("w-1.5 h-1.5 rounded-full", svc.ok ? "bg-emerald-400" : "bg-red-400")} />
                      {svc.name}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card size="sm" className="border-border">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Network className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">Network</span>
            </div>
            {[["Node 01 → Node 02 ping", "0.4 ms"], ["External egress", "disabled"], ["TLS version", "1.3"]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1 border-b border-border last:border-0">
                <span className="text-[11px] text-muted-foreground">{l}</span>
                <span className="text-[11px] font-mono text-foreground">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card size="sm" className="border-border">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">Storage</span>
            </div>
            {[["Node 01 SSD", "48 / 512 GB"], ["Node 02 SSD", "73 / 512 GB"], ["Last backup", "1h ago"]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1 border-b border-border last:border-0">
                <span className="text-[11px] text-muted-foreground">{l}</span>
                <span className={cn("text-[11px] font-mono", l === "Last backup" ? "text-emerald-400" : "text-foreground")}>{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card size="sm" className="border-border">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">Compliance</span>
            </div>
            {[["FERPA", "passing"], ["Audit log", "append-only"], ["Encryption", "AES-256"]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1 border-b border-border last:border-0">
                <span className="text-[11px] text-muted-foreground">{l}</span>
                <span className={cn("text-[11px] font-mono", l === "FERPA" ? "text-emerald-400" : "text-foreground")}>{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Event log */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">System Events</h3>
        <Card className="gap-0 py-0 border-border overflow-hidden">
          {EVENTS.map((ev, i) => (
            <div key={i} className={cn("flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors", i < EVENTS.length - 1 && "border-b border-border")}>
              {ev.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              <span className="flex-1 text-xs text-muted-foreground">{ev.text}</span>
              <span className="text-[11px] text-muted-foreground/60">{ev.time}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
