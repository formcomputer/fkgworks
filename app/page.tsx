"use client"
import Link from "next/link"
import { ArrowRight, BarChart2, BookOpen, Calendar, Key, Shield, Users } from "lucide-react"
import { SiteNav, SiteFooter, SpringButton } from "@/components/works/SiteShell"

const FEATURES = [
  { n:"01", Icon: BookOpen,  title: "Real Canvas data",    desc: "Your courses, assignments, and submissions pulled live via your API key. Nothing is simulated, nothing is cached. What you see is what Canvas has." },
  { n:"02", Icon: BarChart2, title: "Visual analytics",    desc: "Submission rates, grading progress, low-submission alerts, and a custom chart builder. Pick bar, line, pie, or radar. Works renders it instantly." },
  { n:"03", Icon: Users,     title: "Student roster",      desc: "All students across all your courses in one place. Search by name, ID, or email. Click any student to see every course they're enrolled in." },
  { n:"04", Icon: Calendar,  title: "Assignment calendar", desc: "Every due date plotted. Click a day to see what's due and how many students have submitted. No more toggling between course pages." },
  { n:"05", Icon: Key,       title: "Your key, your data", desc: "Your API key goes directly from your browser to Canvas. Works never intercepts it, stores it, or transmits it to any Works server." },
  { n:"06", Icon: Shield,    title: "Beta-first",          desc: "Works is in active private beta. Every bug report and feature request goes directly to the team. You shape what gets built next." },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <SiteNav />

      {/* ── Hero ── */}
      <section className="relative px-8 pt-6 pb-0">
        <div className="relative border border-white/8 max-w-full">
          <span className="absolute -top-2.5 -left-2.5 text-white/20 text-lg leading-none select-none font-light">+</span>
          <span className="absolute -top-2.5 -right-2.5 text-white/20 text-lg leading-none select-none font-light">+</span>

          <div className="flex flex-col items-center justify-center text-center px-8 py-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border border-white/10 text-[11px] text-white/35 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now in beta · fkgworks.tech
            </div>
            <h1 className="text-[clamp(36px,6vw,72px)] font-semibold tracking-[-0.025em] leading-[1.06] text-white mb-6 max-w-3xl">
              Native Business Intelligence<br/>for educators.
            </h1>
            <p className="text-[16px] text-white/40 max-w-xl leading-relaxed mb-10 font-light">
              Works provides the tools and data infrastructure to analyze, scale,
              and build charts, dashboards, and reports from your Canvas data — in seconds.
            </p>
            <div className="flex items-center gap-3">
              <SpringButton href="/dashboard" variant="primary" className="px-6 py-2.5 text-[14px]">
                Get Started <ArrowRight className="w-4 h-4" />
              </SpringButton>
              <SpringButton href="/dashboard" variant="ghost" className="px-6 py-2.5 text-[14px]">
                Try Demo
              </SpringButton>
            </div>
            <p className="text-[11px] text-white/18 mt-5">No account · No download · API key optional</p>
          </div>
        </div>

        {/* Scale strip */}
        <div className="border border-t-0 border-white/8 px-8 py-4 flex items-center justify-center gap-3 text-[14px] text-white/50 flex-wrap">
          <span>Scale your</span>
          <span className="inline-flex items-center gap-1.5 border border-white/12 rounded-xl px-3 py-1 text-[12px] text-white/70 bg-white/3">
            <BarChart2 className="w-3.5 h-3.5" />Data
          </span>
          <span>without compromising</span>
          <span className="inline-flex items-center gap-1.5 border border-white/12 rounded-xl px-3 py-1 text-[12px] text-white/70 bg-white/3">
            <Shield className="w-3.5 h-3.5" />Security
          </span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-8 py-20 border-b border-white/6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-px bg-white/6 rounded-2xl overflow-hidden">
          {[
            { n: "12",    label: "demo courses"        },
            { n: "108",   label: "synthetic students"  },
            { n: "120+",  label: "demo assignments"    },
            { n: "0",     label: "data on our servers" },
          ].map(s => (
            <div key={s.label} className="bg-black px-6 py-8 text-center">
              <p className="text-[36px] font-semibold tracking-tight text-white mb-1">{s.n}</p>
              <p className="text-[12px] text-white/35 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/25 text-center mb-4">Features</p>
          <h2 className="text-[clamp(24px,4vw,40px)] font-semibold tracking-tight text-white text-center mb-16">
            Everything Canvas should be.
          </h2>
          <div className="grid grid-cols-3 gap-px bg-white/6 rounded-2xl overflow-hidden">
            {FEATURES.map(({ n, Icon, title, desc }) => (
              <div key={title} className="bg-black p-8 hover:bg-white/[0.02] transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono text-white/20">{n}</span>
                  <Icon className="w-4 h-4 text-white/40" />
                </div>
                <p className="text-[14px] font-semibold text-white mb-2">{title}</p>
                <p className="text-[13px] text-white/35 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-8 py-24 border-t border-white/6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/25 text-center mb-4">How it works</p>
          <h2 className="text-[clamp(24px,4vw,40px)] font-semibold tracking-tight text-white text-center mb-16">Up in under a minute.</h2>
          <div className="space-y-px">
            {[
              { n:"01", title:"Open Works",       desc:"Hit Try Demo above. No sign-up, no download. Or enter your Canvas API key to connect your real courses." },
              { n:"02", title:"Your data loads",  desc:"Works fetches your courses, assignments, and submission data directly from Canvas. Takes about 10 seconds." },
              { n:"03", title:"Actually use it",  desc:"Browse courses, view analytics, build custom charts, check the calendar. Canvas as it should have been." },
            ].map((s, i) => (
              <div key={s.n} className={`flex gap-8 p-8 border border-white/6 bg-black ${i === 0 ? "rounded-t-2xl" : i === 2 ? "rounded-b-2xl border-t-0" : "border-t-0"}`}>
                <span className="text-[11px] font-mono text-white/20 mt-1 shrink-0">{s.n}</span>
                <div>
                  <p className="text-[14px] font-semibold text-white mb-1.5">{s.title}</p>
                  <p className="text-[13px] text-white/35 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-8 py-32 border-t border-white/6 text-center">
        <p className="text-[clamp(32px,5vw,56px)] font-semibold tracking-tight text-white mb-4">Ready?</p>
        <p className="text-[15px] text-white/35 mb-10">No sign-up. No download. Just open Works.</p>
        <div className="flex items-center justify-center gap-3">
          <SpringButton href="/dashboard" variant="primary" className="px-8 py-3 text-[14px]">
            Open Works <ArrowRight className="w-4 h-4" />
          </SpringButton>
          <SpringButton href="/docs" variant="ghost" className="px-8 py-3 text-[14px]">
            Read the Docs
          </SpringButton>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
