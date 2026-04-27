"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sparkles } from "lucide-react"

const navLinks = [
  { label: "products", children: true },
  { label: "resources", children: true },
  { label: "solutions", children: true },
  { label: "pricing" },
]

interface NavProps {
  onAskAi: () => void
}

export function Nav({ onAskAi }: NavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-12"
      style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}>

      {/* Logo */}
      <a href="/" className="text-sm font-medium text-white tracking-tight hover:opacity-80 transition-opacity">
        works
      </a>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <button key={link.label}
            className="flex items-center gap-0.5 px-3 py-1.5 text-sm text-[var(--foreground-muted)] hover:text-white transition-colors rounded-md hover:bg-[var(--surface-hover)]">
            {link.label}
            {link.children && <ChevronDown className="w-3 h-3 opacity-50" />}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button onClick={onAskAi}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--foreground-muted)] hover:text-white transition-colors rounded-md hover:bg-[var(--surface-hover)]">
          <Sparkles className="w-3.5 h-3.5" />
          ask ai
        </button>
        <button className="px-3 py-1.5 text-sm text-[var(--foreground-muted)] hover:text-white transition-colors rounded-md hover:bg-[var(--surface-hover)]">
          log in
        </button>
        <Button variant="ghost" size="sm">sign up</Button>
      </div>
    </nav>
  )
}
