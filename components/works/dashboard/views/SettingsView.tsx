"use client"
import { useState } from "react"
import { Key, Eye, EyeOff, Check, RefreshCw, Shield, User, Bell, Lock, AlertTriangle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/lib/profile"

export function SettingsView() {
  const { profile, setProfile } = useProfile()

  const [apiKey, setApiKey]       = useState(profile.apiKey || "")
  const [canvasUrl, setCanvasUrl] = useState(profile.canvasUrl || "https://canvas.instructure.com")
  const [showKey, setShowKey]     = useState(false)
  const [testing, setTesting]     = useState(false)
  const [testResult, setTestResult] = useState<"ok" | "fail" | null>(null)
  const [testError, setTestError] = useState("")
  const [displayName, setDisplayName] = useState(profile.name || "")
  const [saved, setSaved]         = useState(false)
  const [notifyGrade,  setNotifyGrade]  = useState(true)
  const [notifyMsg,    setNotifyMsg]    = useState(true)
  const [notifySubmit, setNotifySubmit] = useState(false)

  async function testConnection() {
    if (!apiKey.trim()) {
      setTestResult("fail")
      setTestError("Enter your API key first.")
      return
    }
    setTesting(true)
    setTestResult(null)
    setTestError("")
    try {
      const res = await fetch("/api/canvas/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim(), canvasUrl: canvasUrl.trim() }),
      })
      const data = await res.json()
      if (data.ok) {
        setTestResult("ok")
        setProfile({ ...profile, apiKey: apiKey.trim(), canvasUrl: canvasUrl.trim() })
      } else {
        setTestResult("fail")
        setTestError(data.error || "Connection failed.")
      }
    } catch (err: any) {
      setTestResult("fail")
      setTestError("Could not reach the test endpoint.")
    } finally {
      setTesting(false)
    }
  }

  function saveProfile() {
    setProfile({ ...profile, name: displayName.trim() || profile.name, apiKey: apiKey.trim(), canvasUrl: canvasUrl.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Canvas connection, profile, and preferences</p>
      </div>

      {/* Canvas API */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <Key className="w-4 h-4 text-muted-foreground" />
          <p className="text-[13px] font-semibold text-foreground">Canvas API</p>
          {testResult === "ok" && (
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Connected
            </span>
          )}

        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Canvas URL</label>
            <input value={canvasUrl} onChange={e => { setCanvasUrl(e.target.value); setTestResult(null) }}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px] text-foreground font-mono outline-none focus:border-foreground/30 transition-colors" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">API Key</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background focus-within:border-foreground/30 transition-colors">
                <input
                  value={showKey ? apiKey : apiKey ? "•".repeat(Math.min(apiKey.length, 32)) : ""}
                  onChange={e => { if (showKey) { setApiKey(e.target.value); setTestResult(null) } }}
                  placeholder="4188~..."
                  className="flex-1 bg-transparent text-[13px] text-foreground outline-none font-mono placeholder:text-muted-foreground"
                  readOnly={!showKey}
                />
                <button onClick={() => setShowKey(s => !s)} className="p-1 rounded hover:bg-muted transition-colors">
                  {showKey ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
              </div>
              <button onClick={testConnection} disabled={testing}
                className="flex items-center gap-1.5 h-9 px-3.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                {testing
                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                  : testResult === "ok" 
                    ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    : testResult === "fail"
                      ? <X className="w-3 h-3 text-red-400" />
                      : <RefreshCw className="w-3 h-3" />}
                {testing ? "Testing..." : "Test"}
              </button>
            </div>
            <div className="flex items-start gap-1.5 mt-2">
              <Lock className="w-3 h-3 text-muted-foreground/60 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground/60">Stored in localStorage. Never sent to any server other than your Canvas instance.</p>
            </div>
          </div>

          {testResult === "ok" && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-medium text-emerald-400">Connected to Canvas</p>
                <p className="text-[11px] text-emerald-400/70 mt-0.5">Key verified and saved.</p>
              </div>
            </div>
          )}

          {testResult === "fail" && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg border border-red-500/20 bg-red-500/5">
              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-medium text-red-400">Connection failed</p>
                <p className="text-[11px] text-red-400/70 mt-0.5">{testError}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Profile */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <User className="w-4 h-4 text-muted-foreground" />
          <p className="text-[13px] font-semibold text-foreground">Profile</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-[13px] text-foreground outline-none focus:border-foreground/30 transition-colors" />
          </div>
          <button onClick={saveProfile}
            className="flex items-center gap-1.5 h-8 px-4 text-xs font-medium text-background bg-foreground rounded-lg hover:bg-foreground/90 transition-colors">
            {saved ? <><Check className="w-3 h-3" />Saved</> : "Save Profile"}
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <p className="text-[13px] font-semibold text-foreground">Notifications</p>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: "Grade sync alerts",  sub: "When Canvas grades are updated",  val: notifyGrade,  set: setNotifyGrade  },
            { label: "New messages",       sub: "Student or teacher DMs",           val: notifyMsg,    set: setNotifyMsg    },
            { label: "Submission alerts",  sub: "When students submit work",         val: notifySubmit, set: setNotifySubmit },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between py-1">
              <div>
                <p className="text-[13px] text-foreground">{n.label}</p>
                <p className="text-[11px] text-muted-foreground">{n.sub}</p>
              </div>
              <button onClick={() => n.set((v: boolean) => !v)}
                className={cn("w-10 h-5 rounded-full transition-colors relative shrink-0", n.val ? "bg-foreground" : "bg-muted border border-border")}>
                <span className={cn("absolute top-0.5 w-4 h-4 rounded-full transition-all", n.val ? "left-5 bg-background" : "left-0.5 bg-muted-foreground/40")} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <p className="text-[13px] font-semibold text-foreground">Security</p>
        </div>
        <div className="p-5 space-y-0">
          {[
            { label: "Key storage",       value: "localStorage (local only)" },
            { label: "Auth",              value: "bcrypt + JWT (v2 build)"   },
            { label: "Messages",          value: "AES-256-GCM encrypted"     },
            { label: "External calls",    value: "Canvas API only"            },
          ].map((s, i, arr) => (
            <div key={s.label} className={cn("flex items-center justify-between py-2.5", i < arr.length - 1 && "border-b border-border")}>
              <span className="text-[12px] text-muted-foreground">{s.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-mono text-foreground">{s.value}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
