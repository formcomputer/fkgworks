"use client"
import { useState, useRef } from "react"
import { Camera, Key, ArrowRight, Check, AlertTriangle, RefreshCw, X, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/lib/profile"

type Mode = "choose" | "demo" | "api"

export function Onboarding() {
  const { setProfile } = useProfile()
  const [mode,      setMode]      = useState<Mode>("choose")
  const [step,      setStep]      = useState(0)
  const [name,      setName]      = useState("")
  const [avatar,    setAvatar]    = useState<string | null>(null)
  const [apiKey,    setApiKey]    = useState("")
  const [canvasUrl, setCanvasUrl] = useState("https://canvas.instructure.com")
  const [testing,   setTesting]   = useState(false)
  const [testResult,setTestResult]= useState<"ok"|"fail"|null>(null)
  const [testError, setTestError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function testKey() {
    if (!apiKey.trim()) return
    setTesting(true); setTestResult(null); setTestError("")
    try {
      const res = await fetch("/api/canvas/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim(), canvasUrl: canvasUrl.trim() }),
      })
      const data = await res.json()
      if (data.ok) {
        setTestResult("ok")
        if (!name.trim() && data.name) setName(data.name)
      } else {
        setTestResult("fail"); setTestError(data.error ?? "Connection failed.")
      }
    } catch {
      setTestResult("fail"); setTestError("Could not reach test endpoint.")
    } finally { setTesting(false) }
  }

  function launch(withKey = false) {
    setProfile({
      name: name.trim() || "Instructor",
      avatar,
      apiKey: withKey ? apiKey.trim() : "",
      canvasUrl: canvasUrl.trim(),
      onboarded: true,
    })
  }

  const initials = name.trim().split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0,2) || "?"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 animate-in fade-in duration-500">

      {/* Beta bar */}
      <div className="fixed top-0 inset-x-0 flex items-center justify-center gap-2 py-1.5 bg-amber-500/8 border-b border-amber-500/20 z-50">
        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Beta</span>
        <span className="text-[10px] text-amber-400/70">fkgworks.tech · your feedback shapes v1</span>
      </div>

      <div className="w-full max-w-sm mt-8">

        {/* Logo */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-[28px] font-semibold tracking-tight text-foreground">Works</p>
          <p className="text-[13px] text-muted-foreground mt-1">Canvas, but it doesn&apos;t suck.</p>
        </div>

        {/* ── Mode chooser ── */}
        {mode === "choose" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <button onClick={() => setMode("api")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-foreground/20 hover:bg-muted/20 transition-all active:scale-[0.99] group">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-semibold text-foreground">Use Canvas API Key</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Connect your real courses, students, and grades</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <button onClick={() => setMode("demo")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-foreground/20 hover:bg-muted/20 transition-all active:scale-[0.99] group">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-semibold text-foreground">Try the Demo</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">12 courses, 108 students, fully populated — no key needed</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <p className="text-center text-[10px] text-muted-foreground/40 pt-2">
              fkgworks.tech · Works Beta
            </p>
          </div>
        )}

        {/* ── Demo mode ── */}
        {mode === "demo" && (
          <div className="animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div>
                <button onClick={() => setMode("choose")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors mb-3 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 rotate-180" />Back
                </button>
                <p className="text-[15px] font-semibold text-foreground">Set up your profile</p>
                <p className="text-[12px] text-muted-foreground mt-1">You&apos;ll explore with 12 demo courses and 108 synthetic students.</p>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => fileRef.current?.click()} className="relative group">
                  <div className="w-18 h-18 w-[72px] h-[72px] rounded-full border-2 border-dashed border-border hover:border-foreground/30 transition-all overflow-hidden bg-muted flex items-center justify-center">
                    {avatar
                      ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xl font-semibold text-muted-foreground">{initials}</span>}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-foreground flex items-center justify-center shadow-lg">
                    <Camera className="w-3 h-3 text-background" />
                  </div>
                </button>
                <p className="text-[10px] text-muted-foreground">Optional photo</p>
                <input ref={fileRef} type="file" accept="image/*" onChange={pickAvatar} className="hidden" />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Chen"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[13px] text-foreground outline-none focus:border-foreground/25 transition-colors placeholder:text-muted-foreground" />
              </div>

              <button onClick={() => launch(false)} disabled={!name.trim()}
                className="w-full flex items-center justify-center gap-2 h-10 text-[13px] font-medium text-background bg-foreground rounded-xl hover:bg-foreground/90 active:scale-[0.99] transition-all disabled:opacity-40">
                Enter Demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── API key mode ── */}
        {mode === "api" && step === 0 && (
          <div className="animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div>
                <button onClick={() => setMode("choose")} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors mb-3 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 rotate-180" />Back
                </button>
                <p className="text-[15px] font-semibold text-foreground">Set up your profile</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button onClick={() => fileRef.current?.click()} className="relative">
                  <div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-border hover:border-foreground/30 transition-all overflow-hidden bg-muted flex items-center justify-center">
                    {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-semibold text-muted-foreground">{initials}</span>}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                    <Camera className="w-3 h-3 text-background" />
                  </div>
                </button>
                <p className="text-[10px] text-muted-foreground">Optional photo</p>
                <input ref={fileRef} type="file" accept="image/*" onChange={pickAvatar} className="hidden" />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dr. Sarah Chen"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[13px] text-foreground outline-none focus:border-foreground/25 transition-colors placeholder:text-muted-foreground" />
              </div>

              <button onClick={() => setStep(1)} disabled={!name.trim()}
                className="w-full flex items-center justify-center gap-2 h-10 text-[13px] font-medium text-background bg-foreground rounded-xl hover:bg-foreground/90 active:scale-[0.99] transition-all disabled:opacity-40">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {mode === "api" && step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div>
                <button onClick={() => setStep(0)} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors mb-3 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 rotate-180" />Back
                </button>
                <p className="text-[15px] font-semibold text-foreground">Canvas API Key</p>
                <p className="text-[12px] text-muted-foreground mt-1">Stored locally. Never sent to any Works server.</p>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-400/90 leading-relaxed">
                  Your key goes directly from your browser to Canvas. Works never sees it.
                </p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Canvas URL</label>
                <input value={canvasUrl} onChange={e => { setCanvasUrl(e.target.value); setTestResult(null) }}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-mono text-foreground outline-none focus:border-foreground/25 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">API Key</label>
                <input value={apiKey} onChange={e => { setApiKey(e.target.value); setTestResult(null) }}
                  placeholder="4188~..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-[12px] font-mono text-foreground outline-none focus:border-foreground/25 transition-colors placeholder:text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground mt-1.5">Canvas → Account → Settings → Approved Integrations</p>
              </div>

              {testResult === "ok" && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 animate-in fade-in duration-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <p className="text-[12px] font-medium text-emerald-400">Connected successfully</p>
                </div>
              )}
              {testResult === "fail" && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 animate-in fade-in duration-200">
                  <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="text-[12px] text-red-400">{testError}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={testKey} disabled={!apiKey.trim() || testing}
                  className="flex items-center gap-1.5 h-10 px-4 text-[12px] font-medium border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40">
                  {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : testResult === "ok" ? <Check className="w-3 h-3 text-emerald-400" /> : <Key className="w-3 h-3" />}
                  {testing ? "Testing..." : "Test key"}
                </button>
                <button onClick={() => launch(true)} disabled={!apiKey.trim()}
                  className="flex-1 flex items-center justify-center gap-2 h-10 text-[13px] font-medium text-background bg-foreground rounded-xl hover:bg-foreground/90 active:scale-[0.99] transition-all disabled:opacity-40">
                  Launch Works <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
