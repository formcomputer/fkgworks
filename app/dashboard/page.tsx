"use client"
import { ProfileProvider, useProfile } from "@/lib/profile"
import { CanvasProvider } from "@/lib/canvas"
import { DashboardShell } from "@/components/works/dashboard/DashboardShell"
import { Onboarding } from "@/components/works/Onboarding"

function AppGate() {
  const { profile } = useProfile()
  if (!profile.onboarded) return <Onboarding />
  return (
    <CanvasProvider>
      <DashboardShell />
    </CanvasProvider>
  )
}

export default function DashboardPage() {
  return (
    <ProfileProvider>
      <AppGate />
    </ProfileProvider>
  )
}
