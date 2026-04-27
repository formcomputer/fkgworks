"use client"
import { useState } from "react"
import { Video, Mic, MicOff, VideoOff, PhoneOff, Monitor, MessageSquare, Plus, Clock, Users, Lock, ScreenShare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const SESSIONS = [
  { title: "PA 601 — Office Hours",         host: "Dr. James Grant",      time: "Today · 3:00 PM",    attendees: 8,  id: "1" },
  { title: "Works IT Kickoff",              host: "Fischer Grant",         time: "Tomorrow · 10:00 AM",attendees: 4,  id: "2" },
  { title: "Board of Trustees Briefing",    host: "President's Office",    time: "Dec 12 · 2:00 PM",   attendees: 12, id: "3" },
  { title: "Pharmacology Review Session",   host: "Dr. Sarah Chen",        time: "Dec 8 · 4:00 PM",    attendees: 22, id: "4" },
]

const PARTICIPANTS = [
  { name: "Fischer Grant",   you: true  },
  { name: "Dr. James Grant", you: false },
  { name: "Dr. Sarah Chen",  you: false },
  { name: "Prof. Martinez",  you: false },
]

export function MeetView() {
  const [inCall, setInCall] = useState(false)
  const [muted, setMuted] = useState(false)
  const [vidOff, setVidOff] = useState(false)

  if (inCall) return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Call topbar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-foreground">PA 601 — Office Hours</span>
          <span className="text-xs text-muted-foreground">· 4 participants</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-1">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>On-campus · no external routing</span>
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-3">
        {PARTICIPANTS.map(p => (
          <div key={p.name} className="relative rounded-xl overflow-hidden bg-card border border-border flex flex-col items-center justify-center" style={{ aspectRatio: "16/9" }}>
            <div className="w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center mb-2 text-xl font-semibold text-foreground">
              {p.name.charAt(0)}
            </div>
            <p className="text-xs text-muted-foreground">{p.name}</p>
            {p.you && (
              <span className="absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-full bg-foreground/10 border border-border text-muted-foreground">you</span>
            )}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-[9px] text-emerald-400 font-medium">on-campus</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="h-20 flex items-center justify-center gap-3 border-t border-border/50 bg-card/30">
        <ControlBtn onClick={() => setMuted(m => !m)} active={muted} danger={muted}>
          {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </ControlBtn>
        <ControlBtn onClick={() => setVidOff(v => !v)} danger={vidOff}>
          {vidOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
        </ControlBtn>
        <ControlBtn><ScreenShare className="w-4 h-4" /></ControlBtn>
        <ControlBtn><MessageSquare className="w-4 h-4" /></ControlBtn>
        <button
          onClick={() => setInCall(false)}
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
        >
          <PhoneOff className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Meet</h2>
          <p className="text-sm text-muted-foreground">WebRTC · campus-routed · recordings stored locally · zero cloud</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-background bg-foreground rounded-lg hover:bg-foreground/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />Schedule
        </button>
      </div>

      {/* Start now */}
      <Card className="border-border">
        <CardContent className="py-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-border bg-muted flex items-center justify-center">
            <Video className="w-6 h-6 text-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground mb-1">Start an instant meeting</p>
            <p className="text-xs text-muted-foreground max-w-xs">All audio and video routes through Node 02 on your campus network. Nothing leaves the building.</p>
          </div>
          <button onClick={() => setInCall(true)} className="h-9 px-6 text-sm font-medium text-background bg-foreground rounded-full hover:bg-foreground/90 transition-colors active:scale-[0.98]">
            Start meeting
          </button>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>End-to-end encrypted · no external STUN/TURN servers · FERPA compliant</span>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Upcoming Sessions</h3>
        <Card className="gap-0 py-0 border-border overflow-hidden">
          {SESSIONS.map((s, i) => (
            <div key={s.id} className={cn("flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors group", i < SESSIONS.length - 1 && "border-b border-border")}>
              <div className="w-9 h-9 rounded-lg border border-border bg-muted flex items-center justify-center shrink-0">
                <Video className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.host}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />{s.time}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground w-16">
                <Users className="w-3 h-3" />{s.attendees} invited
              </div>
              <button onClick={() => setInCall(true)} className="h-7 px-3 text-[11px] font-medium text-background bg-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/90">
                Join
              </button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

function ControlBtn({ children, onClick, danger }: { children: React.ReactNode; onClick?: () => void; danger?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} className={cn(
      "w-12 h-12 rounded-full border flex items-center justify-center transition-colors",
      danger ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20" : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
    )}>
      {children}
    </button>
  )
}
