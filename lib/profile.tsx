"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Profile = {
  name: string
  avatar: string | null   // base64 data URL or null
  apiKey: string
  canvasUrl: string
  onboarded: boolean
}

const DEFAULT: Profile = { name: "", avatar: null, apiKey: "", canvasUrl: "https://canvas.instructure.com", onboarded: false }

const Ctx = createContext<{ profile: Profile; setProfile: (p: Profile) => void }>({
  profile: DEFAULT,
  setProfile: () => {},
})

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(DEFAULT)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("works_profile")
      if (stored) setProfileState(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  function setProfile(p: Profile) {
    setProfileState(p)
    try { localStorage.setItem("works_profile", JSON.stringify(p)) } catch {}
  }

  if (!loaded) return null
  return <Ctx.Provider value={{ profile, setProfile }}>{children}</Ctx.Provider>
}

export function useProfile() { return useContext(Ctx) }
