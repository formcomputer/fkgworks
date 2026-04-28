import { SimplePage } from "@/components/works/SimplePage"

export default function Page() {
  return (
    <SimplePage title="Desktop App" subtitle="Works runs entirely in your browser, but a native Mac app is coming in v1.">
      <div className="rounded-2xl border border-white/8 px-8 py-10 text-center">
        <p className="text-[13px] text-white/25">Coming soon — Works is in beta.</p>
      </div>
    </SimplePage>
  )
}
