"use client"

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center pt-40 pb-24 px-6"
      style={{ borderBottom: "1px solid var(--border)" }}>

      {/* Crosshair corners */}
      <Crosshair className="absolute top-6 left-6" />
      <Crosshair className="absolute top-6 right-6" />
      <Crosshair className="absolute bottom-6 left-6" />
      <Crosshair className="absolute bottom-6 right-6" />

      {/* Vertical column lines */}
      <div className="absolute inset-y-0 left-[15%] w-px" style={{ background: "var(--border)" }} />
      <div className="absolute inset-y-0 right-[15%] w-px" style={{ background: "var(--border)" }} />

      <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white max-w-3xl leading-[1.1] mb-5">
        infrastructure for the rest of the web.
      </h1>
      <p className="text-base md:text-lg text-[var(--foreground-muted)] max-w-lg leading-relaxed mb-10">
        works provides the developer tools and cloud infrastructure<br />
        to build, scale, and secure faster, more personalized software for all.
      </p>

      <div className="flex items-center gap-3">
        <button className="h-10 px-6 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-100 transition-colors active:scale-[0.98]">
          start building
        </button>
        <button className="h-10 px-6 text-sm font-medium text-white rounded-full transition-colors active:scale-[0.98]"
          style={{ border: "1px solid var(--border-strong)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          docs
        </button>
      </div>
    </section>
  )
}

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <div className={`w-4 h-4 relative ${className}`}>
      <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: "var(--border-strong)" }} />
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "var(--border-strong)" }} />
    </div>
  )
}
