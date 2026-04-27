"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useProfile } from "@/lib/profile"
import { buildDemoCourses } from "@/lib/demo-store"

export type CanvasStudent = {
  id: string
  name: string
  email: string
  sortable_name?: string
}

export type CanvasAssignment = {
  id: string
  title: string
  pointsPossible: number
  dueAt: string | null
  published: boolean
  submittedCount: number
  gradedCount: number
  notSubmittedCount: number
  needsGradingCount: number
}

export type CanvasCourse = {
  id: string
  code: string
  name: string
  term: string
  studentCount: number
  students: CanvasStudent[]
  assignments: CanvasAssignment[]
}

type CanvasState = {
  courses: CanvasCourse[]
  loading: boolean
  error: string | null
  isDemo: boolean
  refresh: () => void
}

const Ctx = createContext<CanvasState>({
  courses: [], loading: false, error: null, isDemo: true, refresh: () => {}
})

export function CanvasProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile()
  const [courses, setCourses] = useState<CanvasCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [isDemo,  setIsDemo]  = useState(true)

  async function load() {
    // No API key → demo mode immediately
    if (!profile.apiKey?.trim()) {
      setCourses(buildDemoCourses())
      setIsDemo(true)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setIsDemo(false)

    try {
      const res = await fetch("/api/canvas/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey:    profile.apiKey,
          canvasUrl: profile.canvasUrl || "https://canvas.instructure.com",
        }),
      })
      const data = await res.json()

      if (data.ok && Array.isArray(data.courses) && data.courses.length > 0) {
        setCourses(data.courses)
        setIsDemo(false)
      } else {
        // API key present but Canvas returned nothing → fall back to demo
        setCourses(buildDemoCourses())
        setIsDemo(true)
        setError(data.error ?? "No courses found — showing demo data.")
      }
    } catch (err: any) {
      setCourses(buildDemoCourses())
      setIsDemo(true)
      setError(`Could not reach Canvas — showing demo data.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile.onboarded) load()
  }, [profile.onboarded, profile.apiKey, profile.canvasUrl])

  return (
    <Ctx.Provider value={{ courses, loading, error, isDemo, refresh: load }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCanvas() { return useContext(Ctx) }
