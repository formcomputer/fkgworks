import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { apiKey, canvasUrl, courseId } = await req.json()
    const base = canvasUrl.trim().replace(/\/$/, "")
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "Accept": "application/json",
    }

    // Test 1: single assignment with submission_summary
    const r1 = await fetch(
      `${base}/api/v1/courses/${courseId}/assignments?per_page=3&include[]=submission_summary`,
      { headers }
    )
    const d1 = await r1.json()

    // Test 2: submissions endpoint directly
    const r2 = await fetch(
      `${base}/api/v1/courses/${courseId}/submissions?per_page=5&include[]=assignment`,
      { headers }
    )
    const d2 = await r2.json()

    // Test 3: gradebook-style submissions
    const r3 = await fetch(
      `${base}/api/v1/courses/${courseId}/students/submissions?per_page=5&student_ids[]=all`,
      { headers }
    )
    const d3 = await r3.json()

    return NextResponse.json({
      assignments_with_summary: d1.slice?.(0,3).map((a: any) => ({
        id: a.id,
        name: a.name,
        submission_summary: a.submission_summary,
        needs_grading_count: a.needs_grading_count,
      })),
      direct_submissions_sample: Array.isArray(d2) ? d2.slice(0,3).map((s: any) => ({
        id: s.id,
        workflow_state: s.workflow_state,
        submitted_at: s.submitted_at,
        score: s.score,
        assignment_id: s.assignment_id,
      })) : d2,
      student_submissions_sample: Array.isArray(d3) ? d3.slice(0,3).map((s: any) => ({
        id: s.id,
        workflow_state: s.workflow_state,
        submitted_at: s.submitted_at,
        score: s.score,
        assignment_id: s.assignment_id,
      })) : d3,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
