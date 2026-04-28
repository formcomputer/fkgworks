"use client"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function SpringButton({
  children, className, href, variant = "primary",
}: {
  children: React.ReactNode
  className?: string
  href?: string
  variant?: "primary" | "ghost"
}) {
  const [pressed, setPressed] = useState(false)
  const base = cn(
    "inline-flex items-center justify-center gap-2 font-medium select-none cursor-pointer transition-transform duration-100 ease-out rounded-full px-5 py-2 text-[13px]",
    pressed ? "scale-[0.96]" : "scale-100",
    variant === "primary"
      ? "bg-white text-black hover:bg-white/90"
      : "border border-white/30 text-white hover:border-white/60",
    className
  )
  const h = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
  }
  if (href) return <Link href={href} className={base} {...h}>{children}</Link>
  return <button className={base} {...h}>{children}</button>
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 h-14 border-b border-white/6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/80">
            <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="currentColor"/>
          </svg>
          <span className="text-[14px] font-semibold tracking-tight">Works</span>
        </div>

        {/* Center links */}
        <div className="flex items-center gap-6">
          {["Products","Resources","Solutions","Pricing"].map(l => (
            <button key={l} className="flex items-center gap-0.5 text-[13px] text-white/70 hover:text-white transition-colors">
              {l}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-50 mt-px">
                <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <SpringButton href="/dashboard" variant="ghost" className="text-[13px]">Ask AI</SpringButton>
          <SpringButton href="/dashboard" variant="ghost" className="text-[13px]">Log In</SpringButton>
          <SpringButton href="/dashboard" variant="primary" className="text-[13px]">Sign Up</SpringButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-8 pt-12 pb-0">
        {/* Bordered hero box */}
        <div className="relative border border-white/10 max-w-full mx-auto" style={{ minHeight: 360 }}>
          {/* Corner + */}
          <span className="absolute -top-2.5 -left-2.5 text-white/30 text-[18px] leading-none select-none">+</span>

          <div className="flex flex-col items-center justify-center text-center px-8 py-20">
            <h1 className="text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.02em] text-white leading-tight mb-5">
              Native Business Intelligence.
            </h1>
            <p className="text-[15px] text-white/45 max-w-lg leading-relaxed mb-8">
              Works provides the tools and data infrastructure<br/>
              to analyze, scale, and build charts, dashboards, and reports in seconds.
            </p>
            <div className="flex items-center gap-3">
              <SpringButton href="/dashboard" variant="primary" className="px-6 py-2.5 text-[14px] rounded-xl">
                Get Started
              </SpringButton>
              <SpringButton href="/dashboard" variant="ghost" className="px-6 py-2.5 text-[14px] rounded-xl border-white/20">
                Get A Demo
              </SpringButton>
            </div>
          </div>
        </div>

        {/* Scale strip */}
        <div className="border border-t-0 border-white/10 px-8 py-5 flex items-center justify-center gap-3 text-[15px] text-white/70">
          <span>Scale your</span>
          <span className="inline-flex items-center gap-1.5 border border-white/15 rounded-md px-2.5 py-1 text-[13px] text-white/80">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4 7h6M7 5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Data
          </span>
          <span>without compromising</span>
          <span className="inline-flex items-center gap-1.5 border border-white/15 rounded-md px-2.5 py-1 text-[13px] text-white/80">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L2.5 3.5V7c0 2.5 2 4.5 4.5 5 2.5-.5 4.5-2.5 4.5-5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            Security
          </span>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-8 pt-16 pb-10">
        <div className="grid grid-cols-5 gap-8 mb-12">
          {[
            { heading: "GET STARTED", links: ["Docs","Website","Desktop"] },
            { heading: "SCALE",       links: ["Workspaces","Gradebook","Graphs"] },
            { heading: "AGENCY",      links: ["Bookings","Portfolio","Team"] },
            { heading: "COMMUNITY",   links: ["Initiatives","Events","Instagram","GitHub"] },
            { heading: "COMPANY",     links: ["About","Press","Help","Legal","Academy","Jobs"] },
          ].map(col => (
            <div key={col.heading}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-white/50 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <span className="w-2 h-2 bg-white/40 rounded-none inline-block"/>
          ALL SYSTEMS NORMAL
        </div>
      </footer>

    </div>
  )
}
