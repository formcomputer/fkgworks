export function Footer() {
  const cols = [
    { heading: "platform", links: ["deploy", "lms", "workspace", "meet", "local ai", "node health"] },
    { heading: "company", links: ["about", "blog", "careers", "contact"] },
    { heading: "legal", links: ["privacy", "terms", "ferpa", "security"] },
  ]
  return (
    <footer className="px-8 py-16" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <div className="flex-1">
            <p className="text-sm font-medium text-white mb-2">works</p>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed max-w-xs">
              campus infrastructure that lives on your hardware. no cloud, no vendor, no compromise.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.heading} className="flex-1">
              <p className="text-xs font-medium text-white mb-4 uppercase tracking-widest opacity-40">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="text-xs text-[var(--foreground-muted)] hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs text-[var(--foreground-subtle)]">© 2026 Works all rights reserved.</p>
          <p className="text-xs text-[var(--foreground-subtle)]">built for higher ed. runs on your hardware.</p>
        </div>
      </div>
    </footer>
  )
}
