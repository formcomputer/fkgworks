import { SiteNav, SiteFooter } from "@/components/works/SiteShell"

export function SimplePage({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <SiteNav />
      <div className="max-w-3xl mx-auto px-8 py-24">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-4">Works</p>
        <h1 className="text-[clamp(28px,5vw,48px)] font-semibold tracking-tight text-white mb-4">{title}</h1>
        {subtitle && <p className="text-[15px] text-white/40 leading-relaxed mb-16 max-w-xl">{subtitle}</p>}
        {children}
      </div>
      <SiteFooter />
    </div>
  )
}
