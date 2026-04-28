import { SiteNav, SiteFooter, SpringButton } from "@/components/works/SiteShell"
import { Check } from "lucide-react"

const PLANS = [
  {
    name: "Beta",
    price: "Free",
    desc: "Everything, right now, no strings.",
    features: ["All features unlocked","12 demo courses","Real Canvas connection","Analytics & chart builder","Feedback direct to team"],
    cta: "Start for free", href: "/dashboard", primary: true,
  },
  {
    name: "Pro",
    price: "$12/mo",
    desc: "Coming in v1. Grade write-back, messaging, signed desktop app.",
    features: ["Everything in Beta","Grade write-back to Canvas","Canvas messaging","Signed Mac & Windows app","Priority support"],
    cta: "Join waitlist", href: "/dashboard", primary: false,
  },
  {
    name: "Institution",
    price: "Custom",
    desc: "Multi-teacher workspaces and institutional deployment.",
    features: ["Everything in Pro","Multi-teacher workspaces","SSO & admin controls","Self-hosted option","Dedicated support"],
    cta: "Contact us", href: "/help", primary: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <SiteNav />
      <div className="max-w-5xl mx-auto px-8 py-24 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-4">Pricing</p>
        <h1 className="text-[clamp(28px,5vw,52px)] font-semibold tracking-tight text-white mb-4">Simple, honest pricing.</h1>
        <p className="text-[15px] text-white/35 mb-20 max-w-md mx-auto">Free during beta. Pro and institutional plans launching with v1.</p>
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map(p => (
            <div key={p.name} className={`rounded-2xl border p-8 text-left flex flex-col ${p.primary ? "border-white/20 bg-white/4" : "border-white/8 bg-black"}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-3">{p.name}</p>
              <p className="text-[36px] font-semibold tracking-tight text-white mb-2">{p.price}</p>
              <p className="text-[13px] text-white/35 leading-relaxed mb-8">{p.desc}</p>
              <ul className="space-y-3 flex-1 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-white/55">
                    <Check className="w-3.5 h-3.5 text-white/30 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <SpringButton href={p.href} variant={p.primary ? "primary" : "ghost"} className="w-full justify-center py-2.5">{p.cta}</SpringButton>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
