"use client"

import { ArrowRight, Bot, Wrench, Globe, ShoppingBag, Building2, Users } from "lucide-react"

const features = [
  {
    title: "your product, delivered.",
    description: "security, speed, and ai included, so you can focus on your user.",
    accent: true,
    icon: null,
    span: "col-span-1 row-span-2",
  },
  {
    title: "agents",
    description: "deliver more value to users by executing complex workflows.",
    icon: Bot,
    preview: "agent",
  },
  {
    title: "toolkit",
    description: "enrich any product or feature with the latest models and tools.",
    icon: Wrench,
    tags: ["ai", "cash", "engine", "workflow", "sandbox", "files"],
  },
  {
    title: "web apps",
    description: "ship beautiful interfaces that don't compromise speed or functionality.",
    icon: Globe,
    preview: "webapp",
  },
  {
    title: "composable commerce",
    description: "increase conversion with fast, branded storefronts.",
    icon: ShoppingBag,
    preview: "commerce",
  },
  {
    title: "multi-tenant platform",
    description: "serve thousands securely across isolated environments.",
    icon: Building2,
    preview: "multitenant",
  },
]

export function FeatureGrid() {
  return (
    <section className="grid grid-cols-3 border-b" style={{ borderColor: "var(--border)" }}>
      {/* Accent card */}
      <div className="col-span-1 row-span-2 p-8 flex flex-col justify-between"
        style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <p className="text-2xl font-medium text-white leading-snug mb-3">
            your product,<br />delivered.
          </p>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            security, speed, and ai included, so you can focus on your user.
          </p>
        </div>
      </div>

      {/* Agents */}
      <FeatureCard title="agents" description="deliver more value to users by executing complex workflows." icon={Bot} borderRight>
        <div className="mt-4 rounded-md p-3 text-xs font-mono text-[var(--foreground-muted)]"
          style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
          <div className="flex items-center gap-2 mb-2 text-[var(--foreground-subtle)]">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            thinking...
          </div>
          <div className="h-6 rounded" style={{ background: "var(--border)", width: "75%" }} />
        </div>
      </FeatureCard>

      {/* Toolkit */}
      <FeatureCard title="toolkit" description="enrich any product or feature with the latest models and tools." icon={Wrench}>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["ai", "cash", "engine", "workflow", "sandbox", "files"].map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs text-[var(--foreground-muted)] rounded"
              style={{ border: "1px solid var(--border)" }}>
              {tag}
            </span>
          ))}
        </div>
      </FeatureCard>

      {/* Web apps */}
      <FeatureCard title="web apps" description="ship beautiful interfaces that don't compromise speed or functionality." icon={Globe} borderRight borderTop>
        <div className="mt-4 rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div className="flex gap-1 px-2 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-amber-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          <div className="p-3 text-xs font-mono text-[var(--foreground-subtle)]">
            what will you create?
          </div>
        </div>
      </FeatureCard>

      {/* Composable commerce */}
      <FeatureCard title="composable commerce" description="increase conversion with fast, branded storefronts." icon={ShoppingBag} borderTop borderRight>
        <div className="mt-4 rounded-md p-3" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
          <div className="h-16 rounded flex items-center justify-center"
            style={{ border: "1px dashed var(--border-strong)" }}>
            <span className="text-xs text-[var(--foreground-subtle)]">storefront preview</span>
          </div>
        </div>
      </FeatureCard>

      {/* Multi-tenant */}
      <FeatureCard title="multi-tenant platform" description="serve thousands securely across isolated environments." icon={Building2} borderTop>
        <div className="mt-4 space-y-1.5">
          {["project.domain.com", "customer.domain.com"].map(d => (
            <div key={d} className="flex items-center gap-2 px-2 py-1 rounded text-xs text-[var(--foreground-muted)]"
              style={{ border: "1px solid var(--border)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {d}
            </div>
          ))}
        </div>
      </FeatureCard>
    </section>
  )
}

function FeatureCard({
  title, description, icon: Icon, children,
  borderRight, borderTop,
}: {
  title: string
  description: string
  icon: React.ElementType
  children?: React.ReactNode
  borderRight?: boolean
  borderTop?: boolean
}) {
  return (
    <div className="p-6 flex flex-col group cursor-pointer transition-colors duration-150"
      style={{
        borderRight: borderRight ? "1px solid var(--border)" : undefined,
        borderTop: borderTop ? "1px solid var(--border)" : undefined,
        borderBottom: "1px solid var(--border)",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-white">{title}</p>
        <ArrowRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{description}</p>
      {children}
    </div>
  )
}
