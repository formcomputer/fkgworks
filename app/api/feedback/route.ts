import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// Local dev: write to data/feedback.json
// Production (Vercel): forward to Web3Forms (set WEB3FORMS_KEY env var)
// or just log — feedback is also visible in Vercel function logs

async function readLocal(): Promise<any[]> {
  try {
    const file = path.join(process.cwd(), "data", "feedback.json")
    const raw = await fs.readFile(file, "utf-8")
    return JSON.parse(raw)
  } catch { return [] }
}

async function writeLocal(entries: any[]) {
  try {
    const file = path.join(process.cwd(), "data", "feedback.json")
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify(entries, null, 2))
  } catch { /* read-only fs in prod — that's fine */ }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, role, rating, category, message } = body
    if (!message?.trim()) {
      return NextResponse.json({ ok: false, error: "Message required" }, { status: 400 })
    }

    const entry = {
      id: `fb-${Date.now()}`,
      name: name?.trim() || "Anonymous",
      role: role?.trim() || "Instructor",
      rating: typeof rating === "number" ? rating : null,
      category: category || "general",
      message: message.trim(),
      ts: new Date().toISOString(),
    }

    // Always log (visible in Vercel function logs)
    console.log("[Works Feedback]", JSON.stringify(entry))

    // Try to write locally (works in dev, silently fails in prod)
    const all = await readLocal()
    all.unshift(entry)
    await writeLocal(all)

    // In production, forward to Web3Forms if key is set
    const w3fKey = process.env.WEB3FORMS_KEY
    if (w3fKey) {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: w3fKey,
          subject: `Works Feedback — ${category} (${rating ? `${rating}/5` : "no rating"})`,
          from_name: name || "Anonymous",
          message: `Name: ${name}\nRole: ${role}\nCategory: ${category}\nRating: ${rating}/5\n\n${message}`,
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, id: entry.id })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function GET() {
  const all = await readLocal()
  return NextResponse.json({ ok: true, entries: all })
}
