"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function SpringButton({
  children, className, href, onClick, variant = "primary", external,
}: {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  variant?: "primary" | "ghost" | "subtle"
  external?: boolean
}) {
  const [pressed, setPressed] = useState(false)
  const base = cn(
    "inline-flex items-center justify-center gap-2 font-medium select-none cursor-pointer",
    "transition-transform duration-[80ms] ease-out rounded-xl text-[13px]",
    pressed ? "scale-[0.96]" : "scale-100",
    variant === "primary" && "bg-white text-black px-5 py-2 hover:bg-white/90",
    variant === "ghost"   && "border border-white/20 text-white/80 px-5 py-2 hover:border-white/40 hover:text-white",
    variant === "subtle"  && "text-white/50 px-3 py-1.5 hover:text-white",
    className
  )
  const h = {
    onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false), onTouchStart: () => setPressed(true), onTouchEnd: () => setPressed(false),
  }
  if (href && external) return <a href={href} target="_blank" rel="noopener noreferrer" className={base} {...h}>{children}</a>
  if (href) return <Link href={href} className={base} {...h}>{children}</Link>
  return <button onClick={onClick} className={base} {...h}>{children}</button>
}

export function SiteNav() {
  const path = usePathname()
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-14 border-b border-white/6 bg-black/90 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="white" fillOpacity="0.8"/>
        </svg>
        <Link href="/" className="text-[14px] font-semibold tracking-tight text-white">Works</Link>
      </div>
      <div className="flex items-center gap-6">
        {[["Features","/#features"],["Docs","/docs"],["Pricing","/pricing"]].map(([l,h]) => (
          <Link key={l} href={h} className={cn(
            "text-[13px] transition-colors",
            path === h ? "text-white" : "text-white/45 hover:text-white"
          )}>{l}</Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <SpringButton href="/dashboard" variant="ghost" className="text-[13px]">Log In</SpringButton>
        <SpringButton href="/dashboard" variant="primary" className="text-[13px]">Try Demo</SpringButton>
      </div>
    </nav>
  )
}

export function SiteFooter() {
  const cols = [
    { heading: "GET STARTED", links: [["Docs","/docs"],["Website","/"],["Desktop","/desktop"]] },
    { heading: "SCALE",       links: [["Workspaces","/workspaces"],["Gradebook","/gradebook"],["Graphs","/graphs"]] },
    { heading: "AGENCY",      links: [["Bookings","/bookings"],["Portfolio","/portfolio"],["Team","/team"]] },
    { heading: "COMMUNITY",   links: [["Initiatives","/initiatives"],["Events","/events"],["Instagram","https://instagram.com"]] },
    { heading: "COMPANY",     links: [["About","/about"],["Press","/press"],["Help","/help"],["Legal","/legal"],["Academy","/academy"],["Jobs","/jobs"]] },
  ]
  return (
    <footer className="border-t border-white/6 px-8 pt-14 pb-10" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <div className="grid grid-cols-5 gap-8 max-w-5xl mb-14">
        {cols.map(col => (
          <div key={col.heading}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-4">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith("http")
                    ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/45 hover:text-white transition-colors">{label}</a>
                    : <Link href={href} className="text-[13px] text-white/45 hover:text-white transition-colors">{label}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-white/25 uppercase tracking-widest">
        <span className="w-2 h-2 bg-white/30 inline-block" />
        ALL SYSTEMS NORMAL
      </div>
    </footer>
  )
}
