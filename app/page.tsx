"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Spring button — Apple-style press feel ───────────────────────────────────
function SpringButton({
  children, className, href, onClick, variant = "primary",
}: {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  variant?: "primary" | "ghost"
}) {
  const [pressed, setPressed] = useState(false)

  const base = cn(
    "relative inline-flex items-center justify-center gap-2 font-medium select-none cursor-pointer",
    "transition-transform duration-100 ease-out",
    pressed ? "scale-[0.96]" : "scale-100",
    variant === "primary"
      ? "bg-white text-black rounded-full px-6 h-11 text-[14px] hover:bg-white/90"
      : "border border-white/15 text-white/70 rounded-full px-6 h-11 text-[14px] hover:border-white/30 hover:text-white",
    className
  )

  const handlers = {
    onMouseDown:  () => setPressed(true),
    onMouseUp:    () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd:   () => setPressed(false),
  }

  if (href) return (
    <Link href={href} className={base} {...handlers}>{children}</Link>
  )
  return (
    <button onClick={onClick} className={base} {...handlers}>{children}</button>
  )
}

// ─── Docs accordion ───────────────────────────────────────────────────────────
const DOCS = [
  {
    section: "Getting started",
    items: [
      { q: "Do I need a Canvas API key?",
        a: "No. Hit Try Demo and you get 12 fully populated courses, 108 students, and real-feeling assignment data instantly. To connect your real Canvas account: Canvas → Account → Settings → Approved Integrations → New Access Token." },
      { q: "Is my API key secure?",
        a: "Yes. Your key is stored in your browser's localStorage and sent directly to your Canvas instance. It never passes through any Works server. We have no database, no accounts, no way to see your key." },
      { q: "Which Canvas instances work?",
        a: "Any Canvas instance — Instructure-hosted, self-hosted, or institutional. Enter your Canvas URL during setup, e.g. canvas.yourschool.edu." },
    ],
  },
  {
    section: "Features",
    items: [
      { q: "What data does Works pull from Canvas?",
        a: "Courses where you're a teacher, assignments, and submission counts. Works uses the Canvas REST API with your token — the same access you have in Canvas, nothing more." },
      { q: "Can I edit or push grades?",
        a: "Grade write-back is coming in v1. The current beta is read-only for grades. The gradebook lets you view and annotate; push to Canvas will be live in the next release." },
      { q: "How does the chart builder work?",
        a: "In Analytics, click Create chart. Choose a chart type (bar, line, pie, radar), a metric (submission rate, grading rate, etc.), and a course. Renders immediately with your live data." },
    ],
  },
  {
    section: "Beta",
    items: [
      { q: "How do I report a bug?",
        a: "Open Works → Feedback in the sidebar. Rate your experience, pick a category, write your note. It goes directly to the team. Every submission is read." },
      { q: "What's coming in v1?",
        a: "Grade write-back to Canvas, messaging, multi-teacher collaboration, and a signed Mac app. Your profile and API key carry forward — nothing resets." },
    ],
  },
]

function DocsSection() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section id="docs" className="px-6 pb-32 max-w-2xl mx-auto">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-10 text-center">Documentation</p>
      <div className="space-y-10">
        {DOCS.map(group => (
          <div key={group.section}>
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/25 mb-3 font-medium">{group.section}</p>
            <div className="space-y-px">
              {group.items.map(item => {
                const isOpen = open === item.q
                return (
                  <div key={item.q} className="border-b border-white/6 last:border-0">
                    <button
                      onClick={() => setOpen(isOpen ? null : item.q)}
                      className="w-full flex items-center justify-between py-4 text-left group"
                    >
                      <span className={cn(
                        "text-[14px] transition-colors duration-150",
                        isOpen ? "text-white" : "text-white/60 group-hover:text-white/90"
                      )}>
                        {item.q}
                      </span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-white/25 shrink-0 ml-6 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )} />
                    </button>
                    <div className={cn(
                      "overflow-hidden transition-all duration-300 ease-out",
                      isOpen ? "max-h-48 opacity-100 pb-4" : "max-h-0 opacity-0"
                    )}>
                      <p className="text-[13px] text-white/40 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 h-14">
        <span className="text-[15px] font-semibold tracking-tight">Works</span>
        <div className="flex items-center gap-5">
          <a href="#docs"
            className="text-[13px] text-white/40 hover:text-white transition-colors duration-150">
            Docs
          </a>
          <SpringButton href="/dashboard" variant="primary">
            Try Demo
          </SpringButton>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div
          className="space-y-6"
          style={{
            animation: "heroIn 0.9s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 text-[11px] text-white/35 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Beta · fkgworks.tech
          </div>

          <h1
            className="text-[clamp(48px,9vw,96px)] font-semibold tracking-[-0.03em] leading-[1.04] text-white"
          >
            Canvas,<br />but it doesn&apos;t suck.
          </h1>

          <p className="text-[clamp(15px,2vw,19px)] text-white/40 max-w-md mx-auto leading-relaxed font-light">
            A teacher-first interface for Canvas LMS.<br />
            One API key. Everything you actually need.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <SpringButton href="/dashboard" variant="primary">
              Try Demo <ArrowRight className="w-4 h-4" />
            </SpringButton>
            <SpringButton href="#docs" variant="ghost">
              Documentation
            </SpringButton>
          </div>

          <p className="text-[11px] text-white/18 pt-1">
            No account · No download · API key optional
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-px h-16 bg-white/8 mx-auto" />

      {/* Features — dead simple, Apple-style */}
      <section id="features" className="px-6 py-28 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-px bg-white/6 rounded-2xl overflow-hidden border border-white/6">
          {[
            { label: "Real Canvas data",     desc: "Your courses, assignments, and submissions pulled live via API. Nothing simulated." },
            { label: "Visual analytics",      desc: "Grade trends, submission rates, and a custom chart builder. See what Canvas buries." },
            { label: "Student roster",        desc: "Unified view across all courses. Search by name, ID, or email." },
            { label: "Assignment calendar",   desc: "Every due date in one place. Click any day to see submissions." },
            { label: "Your key, your data",   desc: "API key goes from your browser straight to Canvas. Works never sees it." },
          ].map((f, i) => (
            <div key={f.label}
              className="flex items-start gap-5 px-7 py-6 bg-black hover:bg-white/[0.02] transition-colors duration-200">
              <span className="text-[11px] font-mono text-white/15 mt-1 shrink-0 w-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[14px] font-medium text-white/90 mb-1">{f.label}</p>
                <p className="text-[13px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-px h-16 bg-white/8 mx-auto" />

      {/* Docs */}
      <div className="pt-24">
        <DocsSection />
      </div>

      {/* CTA */}
      <section className="px-6 pb-36 text-center">
        <p className="text-[clamp(28px,5vw,48px)] font-semibold tracking-tight text-white mb-6">
          Ready?
        </p>
        <SpringButton href="/dashboard" variant="primary" className="text-[15px] h-12 px-8">
          Open Works <ArrowRight className="w-4 h-4" />
        </SpringButton>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 px-8 py-6 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-[12px] text-white/25 font-medium">Works</span>
        <span className="text-[11px] text-white/15">fkgworks.tech · Beta · No data stored on Works servers</span>
        <a href="#docs" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">Docs</a>
      </footer>

      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
