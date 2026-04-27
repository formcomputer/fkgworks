"use client"
import { useState } from "react"
import { Search, Send, Plus, Lock, Users, User, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = { id: string; from: string; fromRole: "teacher" | "student"; content: string; time: string; read: boolean }
type Thread = { id: string; name: string; role: "teacher" | "student"; course?: string; preview: string; time: string; unread: number; messages: Message[] }

const THREADS: Thread[] = [
  {
    id: "t1", name: "Dr. Sarah Chen", role: "teacher", preview: "Does Thursday at 3pm work for you?", time: "10m ago", unread: 1,
    messages: [
      { id: "m1", from: "Dr. Sarah Chen", fromRole: "teacher", content: "Hi Fischer — wanted to check in about the pharmacology curriculum overlap with PA 603.", time: "9:40 AM", read: true },
      { id: "m2", from: "You", fromRole: "teacher", content: "Good point. I noticed the same thing in last week's SOAP notes. Maybe we schedule a quick sync?", time: "9:52 AM", read: true },
      { id: "m3", from: "Dr. Sarah Chen", fromRole: "teacher", content: "Does Thursday at 3pm work for you?", time: "10:01 AM", read: false },
    ]
  },
  {
    id: "t2", name: "Amara Okonkwo", role: "student", course: "PA 601", preview: "Thank you for the feedback!", time: "1h ago", unread: 0,
    messages: [
      { id: "m1", from: "Amara Okonkwo", fromRole: "student", content: "Professor, I wanted to ask about SOAP Note #4. I'm having trouble with the assessment section for hypertension cases.", time: "Yesterday", read: true },
      { id: "m2", from: "You", fromRole: "teacher", content: "Great question. Focus on identifying primary vs. secondary hypertension markers. Review the Kaplan slides from week 6.", time: "Yesterday", read: true },
      { id: "m3", from: "Amara Okonkwo", fromRole: "student", content: "Thank you for the feedback!", time: "1h ago", read: true },
    ]
  },
  {
    id: "t3", name: "Connor Walsh", role: "student", course: "CS 101", preview: "I missed class yesterday, can I...", time: "3h ago", unread: 2,
    messages: [
      { id: "m1", from: "Connor Walsh", fromRole: "student", content: "I missed class yesterday, can I get the notes?", time: "3h ago", read: false },
      { id: "m2", from: "Connor Walsh", fromRole: "student", content: "Also, will the Python lab be on the final?", time: "2h ago", read: false },
    ]
  },
  {
    id: "t4", name: "Dr. Marcus Lee", role: "teacher", preview: "Sounds good, see you there.", time: "Yesterday", unread: 0,
    messages: [
      { id: "m1", from: "You", fromRole: "teacher", content: "Marcus, are you attending the curriculum review on Dec 5?", time: "Yesterday", read: true },
      { id: "m2", from: "Dr. Marcus Lee", fromRole: "teacher", content: "Sounds good, see you there.", time: "Yesterday", read: true },
    ]
  },
  {
    id: "t5", name: "Priya Sharma", role: "student", course: "PA 601", preview: "Would it be possible to discuss my...", time: "2 days ago", unread: 0,
    messages: [
      { id: "m1", from: "Priya Sharma", fromRole: "student", content: "Would it be possible to discuss my research paper topic before submission?", time: "2 days ago", read: true },
    ]
  },
]

export function MessagesView() {
  const [threads, setThreads] = useState(THREADS)
  const [active, setActive] = useState<Thread>(THREADS[0])
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")

  function openThread(t: Thread) {
    setActive(t)
    setThreads(prev => prev.map(th => th.id === t.id ? { ...th, unread: 0 } : th))
  }

  function send() {
    if (!input.trim()) return
    const msg: Message = { id: `m${Date.now()}`, from: "You", fromRole: "teacher", content: input, time: "Just now", read: true }
    setActive(prev => ({ ...prev, messages: [...prev.messages, msg] }))
    setThreads(prev => prev.map(t => t.id === active.id ? { ...t, preview: input, time: "Just now" } : t))
    setInput("")
  }

  const filtered = threads.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
  const totalUnread = threads.reduce((a, t) => a + t.unread, 0)

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 border-r border-border flex flex-col bg-card">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-foreground">Messages</p>
              {totalUnread > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-foreground text-background">{totalUnread}</span>
              )}
            </div>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-background">
            <Search className="w-3 h-3 text-muted-foreground shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => openThread(t)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border transition-colors",
                active.id === t.id ? "bg-muted/40" : "hover:bg-muted/20"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[11px] font-semibold text-foreground">
                  {t.name.charAt(0)}
                </div>
                {t.role === "teacher" && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-card flex items-center justify-center"><Users className="w-1.5 h-1.5 text-white" /></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={cn("text-[12px] leading-tight truncate", t.unread > 0 ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>{t.name}</p>
                  <span className="text-[9px] text-muted-foreground shrink-0 ml-1">{t.time}</span>
                </div>
                {t.course && <p className="text-[9px] text-muted-foreground/60 mb-0.5">{t.course}</p>}
                <p className="text-[11px] text-muted-foreground truncate">{t.preview}</p>
              </div>
              {t.unread > 0 && (
                <span className="w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-semibold flex items-center justify-center shrink-0 mt-1">{t.unread}</span>
              )}
            </button>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
            <Lock className="w-3 h-3" />
            AES-256 encrypted · local storage
          </div>
        </div>
      </aside>

      {/* Conversation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-[52px] flex items-center px-5 border-b border-border bg-card gap-3 shrink-0">
          <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0">{active.name.charAt(0)}</div>
          <div>
            <p className="text-[13px] font-semibold text-foreground leading-tight">{active.name}</p>
            <p className="text-[10px] text-muted-foreground">{active.role === "teacher" ? "Instructor" : `Student · ${active.course}`}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400/70">
            <Lock className="w-2.5 h-2.5" />encrypted
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {active.messages.map(m => {
            const isMe = m.from === "You"
            return (
              <div key={m.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] space-y-1", isMe && "items-end flex flex-col")}>
                  <div className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed",
                    isMe
                      ? "bg-foreground text-background rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  )}>
                    {m.content}
                  </div>
                  <span className="text-[9px] text-muted-foreground px-1">{m.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input */}
        <div className="px-5 pb-5 pt-3 border-t border-border bg-card">
          <div className="flex items-end gap-2">
            <div className="flex-1 min-h-[40px] max-h-28 px-4 py-2.5 rounded-xl border border-border bg-background text-[13px] text-foreground focus-within:border-foreground/30 transition-colors">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder={`Message ${active.name}...`}
                className="w-full bg-transparent outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
                rows={1}
              />
            </div>
            <button
              onClick={send}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-colors disabled:opacity-30 shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-background" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 mt-2">Enter to send · Shift+Enter for new line · end-to-end encrypted</p>
        </div>
      </div>
    </div>
  )
}
