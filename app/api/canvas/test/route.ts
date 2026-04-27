import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { apiKey, canvasUrl } = await req.json()

    if (!apiKey?.trim() || !canvasUrl?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing apiKey or canvasUrl." }, { status: 400 })
    }

    const base = canvasUrl.trim().replace(/\/$/, "")
    const res = await fetch(`${base}/api/v1/users/self`, {
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Accept": "application/json",
      },
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json({ ok: true, name: data.name ?? null, email: data.primary_email ?? null })
    }

    if (res.status === 401) {
      return NextResponse.json({ ok: false, error: "Invalid API key. In Canvas: Account > Settings > Approved Integrations > New Access Token." })
    }
    if (res.status === 403) {
      return NextResponse.json({ ok: false, error: "Access denied. Your token may have insufficient permissions." })
    }

    return NextResponse.json({ ok: false, error: `Canvas returned ${res.status}. Double-check your Canvas URL.` })

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Could not reach Canvas: ${err?.message ?? "Unknown error"}. Check your Canvas URL.` }, { status: 500 })
  }
}
