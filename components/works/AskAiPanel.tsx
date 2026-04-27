"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles, ArrowRight } from "lucide-react"

const MAX_QUESTIONS = 10

const SYSTEM_PROMPT = `You are the AI assistant for "works" — a full-stack AI workspace platform for ambitious founders. works helps people build, ship, and deploy products fast. It has five pillars: build (AI-assisted scaffolding), ship (one-click deploy), community (GitHub-like social layer), workspace (Notion-like org tools), and the works/ language (a slash-based DSL for calling platform primitives like /deploy, /agent, /component). The aesthetic is pure black, monochrome, Vercel-inspired. The promise is simple: it Works Be concise, confident, lowercase where natural. You are not a general assistant — only answer questions about Works`

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AskAiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [questionsUsed, setQuestionsUsed] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const remaining = MAX_QUESTIONS - questionsUsed
  const exhausted = remaining <= 0

  async function send() {
    if (!input.trim() || loading || exhausted) return
    const userMsg: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    setQuestionsUsed(q => q + 1)

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text ?? "something went wrong."
      setMessages(m => [...m, { role: "assistant", content: reply }])
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "couldn't reach the works ai. try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "#0a0a0a",
          borderLeft: "1px solid var(--border-strong)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">ask ai</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--foreground-muted)]">
              {remaining} question{remaining !== 1 ? "s" : ""} left
            </span>
            <button onClick={onClose} className="p-1 rounded hover:bg-[var(--surface-hover)] transition-colors">
              <X className="w-4 h-4 text-[var(--foreground-muted)]" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-[var(--foreground-muted)]">ask anything about Works</p>
              {["what can works do?", "tell me about the works/ language", "how does shipping work?"].map(q => (
                <button key={q} onClick={() => { setInput(q) }}
                  className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-md text-xs text-[var(--foreground-muted)] hover:text-white transition-colors group"
                  style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
                  {q}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-white text-black"
                  : "text-[var(--foreground-muted)]"
              }`}
                style={m.role === "assistant" ? { border: "1px solid var(--border)" } : {}}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg text-xs" style={{ border: "1px solid var(--border)" }}>
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[var(--foreground-subtle)] animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {exhausted && (
            <p className="text-xs text-center text-[var(--foreground-subtle)] pt-2">
              you've used all 10 questions. <a href="/signup" className="text-white underline underline-offset-2">sign up</a> for unlimited access.
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ border: "1px solid var(--border-strong)", background: "var(--surface)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              disabled={exhausted || loading}
              placeholder={exhausted ? "sign up for more questions" : "ask about Works.."}
              className="flex-1 bg-transparent text-xs text-white placeholder:text-[var(--foreground-subtle)] outline-none disabled:opacity-40"
            />
            <button onClick={send} disabled={!input.trim() || loading || exhausted}
              className="p-1 rounded transition-opacity disabled:opacity-30 hover:opacity-70">
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
