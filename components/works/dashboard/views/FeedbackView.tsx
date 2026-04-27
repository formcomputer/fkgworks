"use client"
import { useState } from "react"
import { Send, Check, Star, AlertTriangle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/lib/profile"

const CATEGORIES = [
  { value: "general",     label: "General feedback"      },
  { value: "bug",         label: "Bug report"            },
  { value: "gradebook",   label: "Gradebook"             },
  { value: "analytics",   label: "Analytics"             },
  { value: "canvas_sync", label: "Canvas sync"           },
  { value: "performance", label: "Performance"           },
  { value: "ui",          label: "Design / UI"           },
  { value: "feature",     label: "Feature request"       },
]

type State = "idle" | "sending" | "sent" | "error"

export function FeedbackView() {
  const { profile } = useProfile()
  const [rating,   setRating]   = useState<number | null>(null)
  const [hovered,  setHovered]  = useState<number | null>(null)
  const [category, setCategory] = useState("general")
  const [message,  setMessage]  = useState("")
  const [catOpen,  setCatOpen]  = useState(false)
  const [state,    setState]    = useState<State>("idle")
  const [errMsg,   setErrMsg]   = useState("")

  async function submit() {
    if (!message.trim()) return
    setState("sending")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          role: "Instructor",
          rating,
          category,
          message,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setState("sent")
      } else {
        setErrMsg(data.error ?? "Submission failed.")
        setState("error")
      }
    } catch {
      setErrMsg("Network error. Please try again.")
      setState("error")
    }
  }

  function reset() {
    setState("idle"); setRating(null); setMessage(""); setCategory("general"); setErrMsg("")
  }

  const selectedCat = CATEGORIES.find(c => c.value === category)

  return (
    <div className="flex items-start justify-center pt-12 px-6 pb-12 min-h-full">
      <div className="w-full max-w-lg space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 uppercase tracking-wider">
              Beta
            </span>
            <span className="text-[10px] text-muted-foreground">Works v0.1 · your feedback shapes v1</span>
          </div>
          <h2 className="text-[22px] font-semibold text-foreground tracking-tight">Share your feedback</h2>
          <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
            Works is in private beta. Every note — bugs, friction, missing features — goes directly to the team and shapes what we build next.
          </p>
        </div>

        {/* Sent state */}
        {state === "sent" ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center space-y-3 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-[15px] font-semibold text-foreground">Got it — thank you.</p>
            <p className="text-[12px] text-muted-foreground">Your feedback has been sent to the Works team.</p>
            <button onClick={reset}
              className="mt-2 text-[12px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">
              Submit another
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">

            {/* Star rating */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                Overall experience
              </p>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(n => (
                  <button
                    key={n}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setRating(n)}
                    className="transition-transform active:scale-90"
                  >
                    <Star className={cn(
                      "w-6 h-6 transition-colors",
                      (hovered ?? rating ?? 0) >= n
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )} />
                  </button>
                ))}
                {rating && (
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    {["","Rough","Needs work","Getting there","Pretty good","Excellent"][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                Area
              </p>
              <div className="relative">
                <button
                  onClick={() => setCatOpen(o => !o)}
                  className="flex items-center justify-between w-full h-9 px-3 rounded-lg border border-border bg-background text-[13px] text-foreground hover:bg-muted/30 transition-colors"
                >
                  {selectedCat?.label}
                  <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", catOpen && "rotate-180")} />
                </button>
                {catOpen && (
                  <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                    {CATEGORIES.map(c => (
                      <button key={c.value}
                        onClick={() => { setCategory(c.value); setCatOpen(false) }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 text-[13px] hover:bg-muted/50 transition-colors",
                          category === c.value ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                Your feedback <span className="text-red-400">*</span>
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What's working, what isn't, what you wish existed..."
                rows={5}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/25 transition-colors resize-none leading-relaxed"
              />
              <p className="text-[10px] text-muted-foreground mt-1.5">
                Submitting as <span className="text-foreground">{profile.name}</span>
              </p>
            </div>

            {/* Error */}
            {state === "error" && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-red-500/20 bg-red-500/5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <p className="text-[12px] text-red-400">{errMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!message.trim() || state === "sending"}
              className="w-full flex items-center justify-center gap-2 h-10 text-[13px] font-medium text-background bg-foreground rounded-xl hover:bg-foreground/90 active:scale-[0.99] transition-all disabled:opacity-40"
            >
              {state === "sending" ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-background/40 border-t-background animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send feedback
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/40">
          Works Beta · Feedback is stored locally on your institution&apos;s server · never shared externally
        </p>
      </div>
    </div>
  )
}
