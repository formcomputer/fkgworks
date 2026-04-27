"use client"

import { useState, useEffect } from "react"
import { FileText, Shield, Zap, Users } from "lucide-react"

const pills = [
  { label: "idea", icon: FileText },
  { label: "product", icon: Zap },
  { label: "team", icon: Users },
  { label: "security", icon: Shield },
]

const endings = ["speed", "security", "quality", "scale"]

export function MarqueePill() {
  const [pillIndex, setPillIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setPillIndex(i => (i + 1) % pills.length)
        setEndIndex(i => (i + 1) % endings.length)
        setVisible(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const { label, icon: Icon } = pills[pillIndex]

  return (
    <section className="flex items-center justify-center py-10 gap-3 flex-wrap"
      style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="text-base md:text-lg text-white font-medium">essentially, scale your</span>

      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-white rounded-full transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
        style={{ border: "1px solid var(--border-strong)", background: "var(--surface)" }}>
        <Icon className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
        {label}
      </span>

      <span className="text-base md:text-lg text-white font-medium">without compromising</span>

      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-white rounded-full transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
        style={{ border: "1px solid var(--border-strong)", background: "var(--surface)" }}>
        <Shield className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
        {endings[endIndex]}
      </span>
    </section>
  )
}
