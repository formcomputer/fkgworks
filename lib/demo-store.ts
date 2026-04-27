// ─── Works Demo Store ─────────────────────────────────────────────────────────
// 12 courses · 108 students · realistic graded assignments
// Used when no Canvas API key is present

import type { CanvasCourse, CanvasAssignment, CanvasStudent } from "@/lib/canvas"

const FIRST = ["Amara","Diego","Priya","Connor","Yuki","Jordan","Mia","Luca","Aisha","Marcus","Sofia","Ethan","Zara","Rohan","Naomi","Felix","Imani","Wyatt","Camila","Theo","Layla","Asher","Noor","Jasper","Anika","Silas","Caleb","Nadia","Mateo","Eliza","Gideon","Yara","Hugo","Saanvi","Reuben","Talia","Arlo","Maeve","Quinn","Linnea","Idris","Cleo","Beckett","Esme","Rafael","Anya","Tobias","Selma","Kian","Maren","Devon","Octavia","Shiloh","Briar","Indira","Roman","Petra","Soren","Nia","Zephyr","Lior","Caspian","Thalia","Magnus","Cyrus","Marlowe","Jude","Sana","Otis","Greta","Kofi","Romy","Bodhi","Nova","Sasha","Wren","Tarek","Juno","Levi","Halle","Emil","Sage","Niko","Lyra","Pax","Adele","Ezra","Opal","Hassan","Iona","Dax","Atlas","Maya","Riven","Celeste","Ori","Calix","Wes","Sable","Mireille","Kaius","Vesper","Cosmo","Phaedra","Romi","Onyx","Elio"]
const LAST  = ["Okonkwo","Reyes","Sharma","Walsh","Tanaka","Ellis","Patel","Romano","Khoury","Hernandez","Iversen","Bishara","Volkov","Tran","Lindgren","Adeyemi","Rinaldi","Park","Castellanos","Bauer","Singh","Moreau","Petrov","Asante","Halvorsen","Nguyen","Saito","Vasquez","Jovanovic","Nakamura","Whitfield","Costa","Diallo","Sokolov","Eriksen","Mwangi","Falk","Aoki","Becker","Riviera","Kapoor","Mensah","Bonham","El-Sayed","Rasmussen","Beaumont","Faraj","Salinas","Marchetti","Banerjee","Bishop","Saavedra","Holmgren","Andersen","Khouri","Tully","Vargas","Dubois","Nasser","Petersen","Marek","Dlamini","Karimi","Yamamoto","Henriksen","Nazir","Bonet","Gallego","Voss","Larsen","Hosseini","Marini","Andrade","Solberg","Ibarra","Castelli","Brennan","Mackenzie","Sokol","Chiba","Halonen","Fournier","Suzuki","Ostrowski","Romanov","Pereira","Kerr","Mahmoud","Wexler","Olin","Engelbrecht","Tedeschi","Nakahara","Selim","Borsa","Faure","Ekwensi","Holst","Vasic","Adisa","Mercer","Crane","Vo","Ibeji","Strand"]

function makeStudents(n: number): CanvasStudent[] {
  const seen = new Set<string>()
  const out: CanvasStudent[] = []
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
      id: `DEMO-${String(idx).padStart(3,"0")}`,
      name,
      email: `${f.toLowerCase()}.${l.toLowerCase().replace(/[^a-z]/g,"")}@demo.edu`,
      sortable_name: `${l}, ${f}`,
    })
  }
  return out
}

export const DEMO_STUDENTS = makeStudents(108)

function randBetween(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

// Seeded random so data is stable across renders
function seededRand(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function makeAssignment(id: string, courseId: string, title: string, category: string, points: number, dueOffset: number, studentCount: number, seed: number): CanvasAssignment {
  const r = seededRand(seed)
  const submittedCount = Math.floor(studentCount * (0.7 + r() * 0.28))
  const gradedCount    = Math.floor(submittedCount * (0.6 + r() * 0.38))
  const now = new Date()
  const due = new Date(now.getTime() + dueOffset * 86400000)
  return {
    id, title,
    pointsPossible: points,
    dueAt: due.toISOString(),
    published: true,
    submittedCount,
    gradedCount,
    notSubmittedCount: studentCount - submittedCount,
    needsGradingCount: submittedCount - gradedCount,
  }
}

const COURSE_DEFS = [
  { code: "PA 601", name: "Clinical Medicine I",           term: "Fall 2026", students: 24, color: "#6366f1",
    assignments: [
      ["SOAP Note #1 — Chest Pain",        "SOAP Notes",  100, -45],
      ["SOAP Note #2 — Hypertension",       "SOAP Notes",  100, -30],
      ["Quiz 1 — Cardiovascular",           "Quizzes",      50, -35],
      ["Midterm Exam",                       "Exams",       100, -20],
      ["SOAP Note #3 — Diabetes Mgmt",      "SOAP Notes",  100, -10],
      ["Lab Report — Urinalysis",           "Labs",         75, -5 ],
      ["SOAP Note #4 — Renal Failure",      "SOAP Notes",  100,  5 ],
      ["Quiz 2 — Endocrine",               "Quizzes",      50,  10],
      ["Case Study — Acute MI",            "Case Studies", 100,  20],
      ["Final Exam",                        "Exams",       150,  35],
    ]},
  { code: "PA 602", name: "Pharmacology",                  term: "Fall 2026", students: 24, color: "#8b5cf6",
    assignments: [
      ["Drug Interaction Lab 1",            "Labs",        100, -40],
      ["Pharmacokinetics Quiz",             "Quizzes",      50, -32],
      ["Drug Interaction Lab 2",            "Labs",        100, -22],
      ["Midterm — Drug Classes",            "Exams",       100, -15],
      ["Adverse Effects Case Study",        "Case Studies",100, -8 ],
      ["Prescription Writing Workshop",    "Workshops",    75, -2 ],
      ["Drug Interaction Lab 3",            "Labs",        100,  8 ],
      ["Quiz 2 — Pharmacodynamics",        "Quizzes",      50,  14],
      ["Controlled Substances Module",     "Modules",      50,  22],
      ["Final Exam",                        "Exams",       150,  36],
    ]},
  { code: "PA 603", name: "Patient Assessment",            term: "Fall 2026", students: 22, color: "#a78bfa",
    assignments: [
      ["Physical Exam Practicum 1",        "Practicum",   100, -38],
      ["Patient History Workshop",         "Workshops",    75, -28],
      ["Exam Reflection #1",               "Reflections",  50, -20],
      ["Physical Exam Practicum 2",        "Practicum",   100, -12],
      ["Pediatric Assessment Lab",         "Labs",         75, -6 ],
      ["Exam Reflection #2",               "Reflections",  50,  4 ],
      ["Patient Interview Practicum",      "Practicum",   100,  12],
      ["Geriatric Assessment Module",      "Modules",      75,  20],
      ["OSCE Preparation Workshop",        "Workshops",    50,  28],
      ["Final OSCE",                        "Exams",       150,  42],
    ]},
  { code: "WH 401", name: "Women's Health",               term: "Fall 2026", students: 30, color: "#ec4899",
    assignments: [
      ["Prenatal Care Case Study",         "Case Studies", 100, -42],
      ["OB/GYN History Taking Lab",        "Labs",          75, -34],
      ["Quiz 1 — Reproductive Anatomy",   "Quizzes",        50, -26],
      ["Labor & Delivery Simulation",      "Simulations",  100, -18],
      ["Postpartum Assessment",            "Assessments",   75, -10],
      ["Contraception Counseling Role Play","Workshops",    50, -4 ],
      ["Quiz 2 — Common GYN Conditions",  "Quizzes",        50,  6 ],
      ["Prenatal Ultrasound Interpretation","Labs",         100,  14],
      ["Maternal Mental Health Module",    "Modules",        75,  22],
      ["Midterm Exam",                     "Exams",         100,  30],
      ["High-Risk Pregnancy Case Study",   "Case Studies",  100,  38],
      ["Final Exam",                        "Exams",        150,  50],
    ]},
  { code: "CS 101", name: "Intro to Computing",            term: "Fall 2026", students: 42, color: "#34d399",
    assignments: [
      ["Python Functions Lab",             "Labs",         100, -44],
      ["Assignment 1 — Algorithms",        "Assignments",  100, -36],
      ["Quiz 1 — Data Types",              "Quizzes",       50, -28],
      ["Web Scraping Project",             "Projects",     150, -18],
      ["Midterm Exam",                     "Exams",        100, -10],
      ["Assignment 2 — OOP",               "Assignments",  100, -2 ],
      ["Database Design Lab",              "Labs",         100,  8 ],
      ["Quiz 2 — Algorithms",             "Quizzes",        50,  16],
      ["Final Project — Full Stack App",   "Projects",     200,  30],
      ["Final Exam",                        "Exams",        100,  40],
    ]},
  { code: "EN 201", name: "Academic Writing",              term: "Fall 2026", students: 30, color: "#fbbf24",
    assignments: [
      ["Essay #1 — Narrative Voice",       "Essays",       100, -40],
      ["Research Paper Outline",           "Outlines",      50, -32],
      ["Peer Review Workshop",             "Workshops",     50, -24],
      ["Essay #2 — Argumentative",         "Essays",       100, -16],
      ["Research Paper Draft",             "Drafts",       100, -8 ],
      ["Grammar & Style Quiz",             "Quizzes",       50, -2 ],
      ["Research Paper Final",             "Papers",       150,  10],
      ["Essay #3 — Comparative Analysis",  "Essays",       100,  20],
      ["Portfolio Compilation",            "Portfolios",   100,  30],
      ["Final Essay",                       "Essays",       150,  42],
    ]},
  { code: "BIO 310", name: "Pathophysiology",              term: "Fall 2026", students: 28, color: "#f87171",
    assignments: [
      ["Cell Injury Lab Report",           "Lab Reports",  100, -46],
      ["Inflammation Case Study",          "Case Studies", 100, -36],
      ["Quiz 1 — Cellular Pathology",     "Quizzes",        50, -28],
      ["Cardiovascular Disease Module",    "Modules",      100, -20],
      ["Midterm Exam",                     "Exams",        100, -12],
      ["Neoplasia Lab Report",             "Lab Reports",  100, -4 ],
      ["Quiz 2 — Hemodynamics",           "Quizzes",        50,  6 ],
      ["Immunopathology Case Study",       "Case Studies", 100,  16],
      ["Neurological Disorders Module",    "Modules",      100,  26],
      ["Final Exam",                        "Exams",        150,  40],
    ]},
  { code: "ANAT 201", name: "Human Anatomy",               term: "Fall 2026", students: 35, color: "#60a5fa",
    assignments: [
      ["Skeletal System Lab",              "Labs",         100, -50],
      ["Muscular System Quiz",             "Quizzes",       50, -40],
      ["Cadaver Lab Report 1",             "Lab Reports",  100, -30],
      ["Cardiovascular Anatomy Lab",       "Labs",         100, -22],
      ["Midterm Practical",                "Practicals",   100, -14],
      ["Neuroanatomy Module",              "Modules",      100, -6 ],
      ["Cadaver Lab Report 2",             "Lab Reports",  100,  4 ],
      ["Abdominal Anatomy Lab",            "Labs",         100,  14],
      ["Quiz 2 — Thoracic Cavity",        "Quizzes",        50,  22],
      ["Final Practical",                   "Practicals",  150,  36],
    ]},
  { code: "PHYS 302", name: "Clinical Physiology",         term: "Fall 2026", students: 26, color: "#fb923c",
    assignments: [
      ["Cardiovascular Function Lab",      "Labs",         100, -48],
      ["Respiratory Mechanics Quiz",       "Quizzes",       50, -38],
      ["Renal Physiology Case Study",      "Case Studies", 100, -28],
      ["Midterm Exam",                     "Exams",        100, -18],
      ["Endocrine System Lab",             "Labs",         100, -8 ],
      ["Quiz 2 — Acid-Base Balance",      "Quizzes",        50,  2 ],
      ["Neural Control Module",            "Modules",      100,  12],
      ["Exercise Physiology Lab",          "Labs",         100,  22],
      ["Integrative Systems Case Study",   "Case Studies", 100,  32],
      ["Final Exam",                        "Exams",        150,  44],
    ]},
  { code: "PSYC 201", name: "Medical Psychology",          term: "Fall 2026", students: 32, color: "#a3e635",
    assignments: [
      ["Patient Communication Role Play",  "Role Plays",    75, -44],
      ["Mental Health Screening Lab",      "Labs",         100, -34],
      ["Quiz 1 — DSM-5 Overview",         "Quizzes",        50, -26],
      ["Motivational Interviewing Module", "Modules",      100, -16],
      ["Midterm Exam",                     "Exams",        100, -8 ],
      ["Grief & Loss Case Study",          "Case Studies", 100, -1 ],
      ["Quiz 2 — Psychopharmacology",     "Quizzes",        50,  8 ],
      ["Substance Abuse Assessment Lab",   "Labs",         100,  18],
      ["Behavioral Health Module",         "Modules",      100,  28],
      ["Final Exam",                        "Exams",        150,  42],
    ]},
  { code: "SCI 112", name: "Clinical Sciences II",         term: "Fall 2026", students: 24, color: "#38bdf8",
    assignments: [
      ["EKG Interpretation Lab 1",         "Labs",         100, -46],
      ["Radiology Reading Workshop",       "Workshops",     75, -36],
      ["Quiz 1 — Diagnostic Tests",       "Quizzes",        50, -28],
      ["EKG Interpretation Lab 2",         "Labs",         100, -18],
      ["Midterm Exam",                     "Exams",        100, -10],
      ["Point-of-Care Ultrasound Lab",     "Labs",         100, -2 ],
      ["Quiz 2 — Lab Values",             "Quizzes",        50,  8 ],
      ["Advanced EKG Interpretation",      "Labs",         100,  18],
      ["Clinical Decision Making Module",  "Modules",      100,  28],
      ["Final Exam",                        "Exams",        150,  40],
    ]},
  { code: "MED 499", name: "Clinical Capstone",            term: "Fall 2026", students: 18, color: "#e879f9",
    assignments: [
      ["Capstone Proposal",                "Proposals",    100, -52],
      ["Literature Review",                "Reports",      150, -40],
      ["Methodology Workshop",             "Workshops",     75, -30],
      ["Progress Report 1",               "Reports",       100, -20],
      ["Peer Review Presentation",         "Presentations",100, -10],
      ["Progress Report 2",               "Reports",       100, -2 ],
      ["Data Analysis Lab",               "Labs",          100,  8 ],
      ["Draft Capstone Paper",            "Drafts",        150,  18],
      ["Capstone Presentation",           "Presentations", 150,  30],
      ["Final Capstone Paper",            "Papers",        200,  45],
    ]},
]

export function buildDemoCourses(): CanvasCourse[] {
  return COURSE_DEFS.map((def, ci) => {
    const students = DEMO_STUDENTS.slice(0, def.students)
    const assignments: CanvasAssignment[] = def.assignments.map(([title, category, points, dueOffset], ai) =>
      makeAssignment(
        `demo-${ci}-${ai}`,
        `demo-${ci}`,
        title as string,
        category as string,
        points as number,
        dueOffset as number,
        def.students,
        ci * 100 + ai * 7 + 42
      )
    )
    return {
      id: `demo-${ci}`,
      code: def.code,
      name: def.name,
      term: def.term,
      studentCount: def.students,
      students,
      assignments,
    }
  })
}
