"use client"
import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight, BookOpen, BarChart2, Users, Calendar,
  MessageSquarePlus, Key, Shield, Zap, ChevronDown,
  GraduationCap, FileText, TrendingUp, Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 h-14 border-b border-white/6 bg-black/80 backdrop-blur-xl">
      <span className="text-[15px] font-semibold text-white tracking-tight">Works</span>
      <div className="flex items-center gap-6">
        <a href="#features"  className="text-[13px] text-white/50 hover:text-white transition-colors">Features</a>
        <a href="#how"       className="text-[13px] text-white/50 hover:text-white transition-colors">How it works</a>
        <a href="#docs"      className="text-[13px] text-white/50 hover:text-white transition-colors">Docs</a>
        <Link href="/dashboard"
          className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-all active:scale-[0.98]">
          Try Demo <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-40 pb-28 px-8 text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/60 mb-8 animate-in fade-in duration-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Now in beta · fkgworks.tech
      </div>
      <h1 className="text-[56px] font-semibold tracking-tight text-white leading-[1.08] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        Canvas, but it<br />doesn&apos;t suck.
      </h1>
      <p className="text-[18px] text-white/50 max-w-xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        Works is a teacher-first interface for Canvas LMS. One API key unlocks your real courses, grades, and analytics — in a platform built the way it should have been.
      </p>
      <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <Link href="/dashboard"
          className="flex items-center gap-2 h-11 px-6 rounded-full bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-all active:scale-[0.98] shadow-lg shadow-white/10">
          Try Demo <ArrowRight className="w-4 h-4" />
        </Link>
        <a href="#docs"
          className="flex items-center gap-2 h-11 px-6 rounded-full border border-white/10 text-white/70 text-[14px] hover:text-white hover:border-white/25 transition-all">
          Documentation
        </a>
      </div>
      <p className="text-[11px] text-white/25 mt-5">No account needed · API key optional · works with any Canvas instance</p>
    </section>
  )
}

// ─── App Preview ──────────────────────────────────────────────────────────────
function AppPreview() {
  return (
    <section className="px-8 pb-28 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden shadow-2xl shadow-black/50 animate-in fade-in duration-700 delay-300">
        {/* Fake toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/2">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          <div className="flex-1 mx-4 h-6 rounded-lg bg-white/5 flex items-center px-3">
            <span className="text-[11px] text-white/25">fkgworks.tech/dashboard</span>
          </div>
        </div>
        {/* Fake app shell */}
        <div className="flex h-72 bg-[oklch(0.10_0_0)]">
          {/* Sidebar */}
          <div className="w-44 border-r border-white/6 p-3 space-y-1 shrink-0">
            <div className="h-7 rounded-lg bg-white/8 mb-3" />
            {["Dashboard","Courses","Analytics","Students","Calendar"].map((item, i) => (
              <div key={item} className={cn("h-7 rounded-lg flex items-center px-3 gap-2", i === 1 ? "bg-white text-black" : "bg-white/3")}>
                <div className={cn("w-2 h-2 rounded-full shrink-0", i === 1 ? "bg-black" : "bg-white/20")} />
                <div className={cn("h-2 rounded flex-1", i === 1 ? "bg-black/40" : "bg-white/10")} />
              </div>
            ))}
          </div>
          {/* Main content */}
          <div className="flex-1 p-5 space-y-4">
            <div className="grid grid-cols-4 gap-3">
              {["Courses","Students","Submission Rate","Needs Grading"].map(label => (
                <div key={label} className="rounded-xl border border-white/6 bg-white/3 p-3">
                  <div className="h-2 w-12 rounded bg-white/10 mb-2" />
                  <div className="h-5 w-10 rounded bg-white/20" />
                  <div className="h-1.5 w-16 rounded bg-white/8 mt-1.5" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1fr_200px] gap-3">
              <div className="rounded-xl border border-white/6 bg-white/3 p-4">
                <div className="h-2 w-28 rounded bg-white/10 mb-3" />
                <div className="space-y-2">
                  {[85,60,95,40,70].map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-1.5 rounded-full bg-white/6 flex-1">
                        <div className="h-full rounded-full bg-white/30" style={{ width: `${w}%` }} />
                      </div>
                      <div className="h-1.5 w-6 rounded bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/3 p-4 space-y-2">
                <div className="h-2 w-20 rounded bg-white/10 mb-3" />
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0" />
                    <div className="h-1.5 rounded bg-white/10 flex-1" />
                    <div className="h-1.5 w-8 rounded bg-white/8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { Icon: BookOpen,    title: "Real Canvas Data",    desc: "One API key pulls your actual courses, assignments, and submission data. Nothing is simulated when you're connected." },
  { Icon: BarChart2,   title: "Visual Analytics",    desc: "Submission rates, grading progress, low-submission alerts, and custom chart builder. See what Canvas buries in spreadsheets." },
  { Icon: Users,       title: "Student Roster",      desc: "Unified student view across all your courses. Search by name, ID, or email. See which courses each student is enrolled in." },
  { Icon: Calendar,    title: "Assignment Calendar", desc: "All your due dates in one place. Click any day to see what's due and how many students have submitted." },
  { Icon: Key,         title: "Your Key, Your Data", desc: "Your API key goes directly from your browser to Canvas. Works never touches it. No accounts, no data stored on our servers." },
  { Icon: Shield,      title: "Beta-First",          desc: "Works is in active beta. Every bug report and feature request goes directly to the team. You shape what we build next." },
]

function Features() {
  return (
    <section id="features" className="px-8 pb-28 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[36px] font-semibold text-white tracking-tight mb-4">Everything Canvas should be</h2>
        <p className="text-[16px] text-white/40 max-w-lg mx-auto">Built by educators, for educators. No training required.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="p-6 rounded-2xl border border-white/6 bg-white/2 hover:bg-white/4 hover:border-white/12 transition-all duration-300 group">
            <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-4 group-hover:bg-white/12 transition-colors">
              <Icon className="w-4 h-4 text-white/70" />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-2">{title}</h3>
            <p className="text-[12px] text-white/40 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how" className="px-8 pb-28 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[36px] font-semibold text-white tracking-tight mb-4">Up in under a minute</h2>
        <p className="text-[16px] text-white/40">No install. No account. Open the app and go.</p>
      </div>
      <div className="space-y-4">
        {[
          { n: "1", title: "Open Works",        desc: "Hit 'Try Demo' above — no sign-up, no download required. Or enter your Canvas API key to connect your real courses." },
          { n: "2", title: "Your data loads",   desc: "Works fetches your courses, assignments, and submission data directly from Canvas. Takes about 10 seconds." },
          { n: "3", title: "Actually use it",   desc: "Browse your courses, view analytics, check the calendar, build custom charts. It's Canvas, but the version you always wanted." },
        ].map(step => (
          <div key={step.n} className="flex items-start gap-5 p-5 rounded-2xl border border-white/6 bg-white/2">
            <span className="text-[20px] font-semibold text-white/20 w-8 shrink-0 mt-0.5">{step.n}</span>
            <div>
              <p className="text-[14px] font-semibold text-white mb-1">{step.title}</p>
              <p className="text-[12px] text-white/40 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Docs ─────────────────────────────────────────────────────────────────────
const DOCS = [
  { title: "Getting Started",
    sections: [
      { q: "Do I need a Canvas API key?",
        a: "No. Hit 'Try Demo' and you'll get 12 fully populated courses with 108 students and real-feeling assignment data. To connect your actual Canvas account, go to Canvas → Account → Settings → Approved Integrations → New Access Token." },
      { q: "Is my API key secure?",
        a: "Yes. Your key is stored in your browser's localStorage and sent directly from your browser to your Canvas instance. It never touches any Works server. We have no database, no accounts, and no way to see your key." },
      { q: "Which Canvas instances does Works support?",
        a: "Any Canvas instance — Instructure-hosted, self-hosted, or institutional. Enter your Canvas URL during setup (e.g. canvas.yourschool.edu)." },
    ]},
  { title: "Features",
    sections: [
      { q: "What data does Works pull from Canvas?",
        a: "Courses (where you're enrolled as teacher), assignments, and submission counts (submitted, graded, missing). Works uses the Canvas REST API with your token — the same access you have in Canvas, nothing more." },
      { q: "Can I edit or push grades?",
        a: "Grade editing is on the roadmap for v1. In the current beta, Works is read-only for grades. The gradebook view lets you see and annotate, and the 'Push to Canvas' button will be enabled in the next release." },
      { q: "How does the chart builder work?",
        a: "In Analytics, click 'Create chart' and choose a chart type (bar, line, pie, radar), a metric (submission rate, grading rate, etc.), and a course. The chart renders immediately with your live data." },
    ]},
  { title: "Beta & Feedback",
    sections: [
      { q: "How do I report a bug or request a feature?",
        a: "Open Works → Feedback in the sidebar. Rate your experience, pick a category, and write your note. It goes directly to the team. Every submission is read." },
      { q: "What's coming in v1?",
        a: "Grade write-back to Canvas, Canvas messaging integration, multi-teacher collaboration, and a proper Mac app with code-signed distribution. API key is the only thing that changes — your profile and preferences carry forward." },
    ]},
]

function Docs() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section id="docs" className="px-8 pb-28 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[36px] font-semibold text-white tracking-tight mb-4">Documentation</h2>
        <p className="text-[16px] text-white/40">Everything you need to know about Works.</p>
      </div>
      <div className="space-y-8">
        {DOCS.map(group => (
          <div key={group.title}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">{group.title}</p>
            <div className="space-y-1">
              {group.sections.map(item => {
                const id = item.q
                const isOpen = open === id
                return (
                  <div key={id} className="rounded-xl border border-white/6 bg-white/2 overflow-hidden">
                    <button onClick={() => setOpen(isOpen ? null : id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors">
                      <span className="text-[13px] font-medium text-white/80">{item.q}</span>
                      <ChevronDown className={cn("w-4 h-4 text-white/30 transition-transform duration-200 shrink-0 ml-4", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-[13px] text-white/45 leading-relaxed">{item.a}</p>
                      </div>
                    )}
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

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="px-8 pb-32 max-w-2xl mx-auto text-center">
      <div className="p-12 rounded-3xl border border-white/8 bg-white/3">
        <h2 className="text-[32px] font-semibold text-white tracking-tight mb-4">Ready to try it?</h2>
        <p className="text-[14px] text-white/40 mb-8 leading-relaxed">
          No sign-up. No download. Just open Works and see your courses the way they should look.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard"
            className="flex items-center gap-2 h-11 px-8 rounded-full bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-all active:scale-[0.98]">
            Try Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#docs"
            className="flex items-center gap-2 h-11 px-6 rounded-full border border-white/10 text-white/60 text-[14px] hover:text-white hover:border-white/25 transition-all">
            Read the Docs
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/6 px-8 py-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-[13px] font-semibold text-white/60">Works</span>
        <p className="text-[11px] text-white/25">
          fkgworks.tech · Beta · No data stored on Works servers
        </p>
        <div className="flex items-center gap-4">
          <a href="#docs"     className="text-[11px] text-white/30 hover:text-white/60 transition-colors">Docs</a>
          <Link href="/dashboard" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">App</Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Nav />
      <main>
        <Hero />
        <AppPreview />
        <Features />
        <HowItWorks />
        <Docs />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
