import { NextRequest, NextResponse } from "next/server"

// ─── Shared name roster (scales to any size) ─────────────────────────────────
const FIRST = ["Amara","Diego","Priya","Connor","Yuki","Jordan","Mia","Luca","Aisha","Marcus","Sofia","Ethan","Zara","Rohan","Naomi","Felix","Imani","Wyatt","Camila","Theo","Layla","Asher","Noor","Jasper","Anika","Silas","Caleb","Nadia","Mateo","Eliza","Gideon","Yara","Hugo","Saanvi","Reuben","Talia","Arlo","Maeve","Quinn","Linnea","Idris","Cleo","Beckett","Esme","Rafael","Anya","Tobias","Selma","Kian","Maren","Devon","Octavia","Shiloh","Briar","Indira","Roman","Petra","Soren","Nia","Zephyr","Lior","Vesper","Caspian","Thalia","Magnus","Cyrus","Marlowe","Jude","Sana","Otis","Greta","Kofi","Romy","Bodhi","Nova","Sasha","Wren","Tarek","Juno","Levi","Halle","Emil","Sage","Niko","Lyra","Pax","Adele","Ezra","Opal","Hassan","Iona","Dax","Atlas","Maya","Riven","Celeste","Ori","Calix","Wes","Sable","Phaedra","Cosmo","Mireille","Kaius"]
const LAST  = ["Okonkwo","Reyes","Sharma","Walsh","Tanaka","Ellis","Patel","Romano","Khoury","Hernandez","Iversen","Bishara","Volkov","Tran","Lindgren","Adeyemi","Rinaldi","Park","Castellanos","Bauer","Singh","Moreau","Petrov","Asante","Halvorsen","Nguyen","Saito","Vasquez","Jovanovic","Nakamura","Whitfield","Costa","Diallo","Sokolov","Eriksen","Mwangi","Falk","Aoki","Becker","Riviera","Kapoor","Mensah","Bonham","El-Sayed","Rasmussen","Beaumont","Faraj","Salinas","Marchetti","Banerjee","Bishop","Saavedra","Holmgren","Andersen","Khouri","Tully","Vargas","Dubois","Nasser","Petersen","Marek","Dlamini","Karimi","Yamamoto","Henriksen","Nazir","Bonet","Gallego","Voss","Larsen","Hosseini","Marini","Andrade","Solberg","Ibarra","Castelli","Brennan","Mackenzie","Sokol","Chiba","Halonen","Fournier","Suzuki","Ostrowski","Romanov","Pereira","Kerr","Mahmoud","Wexler","Olin","Engelbrecht","Tedeschi","Nakahara","Selim","Borsa","Faure","Ekwensi","Holst","Vasic","Adisa","Mercer","Crane","Vo"]

function buildRoster(n: number) {
  const seen = new Set<string>()
  const out: { id: string; name: string; email: string; sortable_name: string }[] = []
  let i = 0
  while (out.length < n && i < 99999) {
    const f = FIRST[i % FIRST.length]
    const l = LAST[Math.floor(i / FIRST.length) % LAST.length]
    i++
    const name = `${f} ${l}`
    if (seen.has(name)) continue
    seen.add(name)
    const idx = out.length + 1
    out.push({
      id: `WORKS-${String(idx).padStart(3, "0")}`,
      name,
      email: `${f.toLowerCase()}.${l.toLowerCase().replace(/[^a-z]/g, "")}@student.edu`,
      sortable_name: `${l}, ${f}`,
    })
  }
  return out
}

const TARGET_COURSES = ["clinical science ii", "women's health", "womens health"]
function isTargetCourse(name: string) {
  const l = name.toLowerCase()
  return TARGET_COURSES.some(t => l.includes(t))
}

async function fetchAllPages(url: string, headers: Record<string, string>): Promise<any[]> {
  const results: any[] = []
  let next: string | null = url
  let guard = 0
  while (next && guard++ < 20) {
    const res = await fetch(next, { headers })
    if (!res.ok) break
    const data = await res.json()
    if (!Array.isArray(data)) break
    results.push(...data)
    const link: string = res.headers.get("Link") ?? ""
    const m: RegExpMatchArray | null = link.match(/<([^>]+)>;\s*rel="next"/)
    next = m ? m[1] : null
  }
  return results
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, canvasUrl } = await req.json()
    if (!apiKey?.trim() || !canvasUrl?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing apiKey or canvasUrl" }, { status: 400 })
    }

    const base = canvasUrl.trim().replace(/\/$/, "")
    const h: Record<string, string> = {
      "Authorization": `Bearer ${apiKey.trim()}`,
      "Accept": "application/json",
    }

    // 1. Fetch all published teacher courses (paginated, deduped)
    const allCourses = await fetchAllPages(
      `${base}/api/v1/courses?enrollment_type=teacher&per_page=50&include[]=total_students&include[]=term&state[]=available`,
      h
    )

    const seenIds = new Set<string>()
    let targets = allCourses.filter((c: any) => {
      if (!c?.id || !c?.name || c?.workflow_state !== "available") return false
      if (seenIds.has(String(c.id))) return false
      seenIds.add(String(c.id))
      return isTargetCourse(c.name)
    })

    // Fallback: all available if targets not matched
    if (targets.length === 0) {
      const fb = new Set<string>()
      targets = allCourses.filter((c: any) => {
        if (!c?.id || !c?.name || c?.workflow_state !== "available") return false
        if (fb.has(String(c.id))) return false
        fb.add(String(c.id))
        return true
      })
    }

    const enriched = await Promise.all(
      targets.map(async (course: any) => {
        const cid = course.id

        // Real student count from Canvas
        // total_students is the count of enrolled students (not teachers/TAs)
        const realStudentCount: number =
          typeof course.total_students === "number" && course.total_students > 0
            ? course.total_students
            : null

        // Fetch actual enrolled student IDs to get a real count if total_students missing
        let enrolledCount = realStudentCount
        if (enrolledCount === null) {
          try {
            const enrollments = await fetchAllPages(
              `${base}/api/v1/courses/${cid}/enrollments?type[]=StudentEnrollment&state[]=active&per_page=100`,
              h
            )
            // Deduplicate by user_id
            const unique = new Set(enrollments.map((e: any) => String(e.user_id)))
            enrolledCount = unique.size
          } catch {
            enrolledCount = 1
          }
        }

        const studentCount = Math.max(enrolledCount ?? 1, 1)

        // Fetch published assignments
        const assignmentsRaw = await fetchAllPages(
          `${base}/api/v1/courses/${cid}/assignments?per_page=50&order_by=due_at`,
          h
        )
        const published = assignmentsRaw.filter(
          (a: any) => a?.id && a?.name && a?.published === true
        )

        // Fetch all submissions, deduplicate by (assignment_id, user_id)
        let allSubs: any[] = []
        try {
          allSubs = await fetchAllPages(
            `${base}/api/v1/courses/${cid}/students/submissions?per_page=100&student_ids[]=all`,
            h
          )
        } catch { allSubs = [] }

        // Group by assignment_id, then deduplicate by user_id within each group
        const subMap = new Map<string, Map<string, any>>() // aid -> uid -> sub
        for (const s of allSubs) {
          if (!s?.assignment_id || !s?.user_id) continue
          const aid = String(s.assignment_id)
          const uid = String(s.user_id)
          if (!subMap.has(aid)) subMap.set(aid, new Map())
          // Keep the most recent/highest state (graded > submitted > unsubmitted)
          const existing = subMap.get(aid)!.get(uid)
          if (!existing || statePriority(s.workflow_state) > statePriority(existing.workflow_state)) {
            subMap.get(aid)!.set(uid, s)
          }
        }

        const assignments = published.map((a: any) => {
          const aid = String(a.id)
          const subs = Array.from(subMap.get(aid)?.values() ?? [])
          let submitted = 0, graded = 0
          for (const s of subs) {
            const st = s.workflow_state
            if (st === "graded") { submitted++; graded++ }
            else if (st === "submitted" || st === "pending_review") { submitted++ }
          }
          return {
            id: aid,
            title: a.name,
            pointsPossible: a.points_possible ?? 100,
            dueAt: a.due_at ?? null,
            published: true,
            submittedCount: submitted,
            gradedCount: graded,
            notSubmittedCount: Math.max(0, studentCount - submitted),
            needsGradingCount: a.needs_grading_count ?? 0,
          }
        })

        return {
          id: String(cid),
          code: course.course_code ?? course.name,
          name: course.name,
          term: course.term?.name ?? "Current Term",
          studentCount,
          students: buildRoster(studentCount),
          assignments,
        }
      })
    )

    return NextResponse.json({
      ok: true,
      courses: enriched.filter(c => c.assignments.length > 0),
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 })
  }
}

function statePriority(state: string): number {
  if (state === "graded")          return 3
  if (state === "submitted")       return 2
  if (state === "pending_review")  return 2
  return 1
}
