import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { apiKey, canvasUrl, courseId } = await req.json()
    const base = canvasUrl.trim().replace(/\/$/, "")
    const headers = { "Authorization": `Bearer ${apiKey.trim()}`, "Accept": "application/json" }

    // Fetch all submissions for this course
    const res = await fetch(
      `${base}/api/v1/courses/${courseId}/students/submissions?per_page=100&include[]=assignment&student_ids[]=all`,
      { headers }
    )
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Canvas error ${res.status}` })
    }
    const submissions = await res.json()

    return NextResponse.json({ ok: true, submissions })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 })
  }
}
