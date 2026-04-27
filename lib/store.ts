// ─── Works. Semi-Airgapped Demo Store ────────────────────────────────────────
// All data is fake/simulated. No real Canvas API calls are made in demo mode.

export type Student = {
  id: string
  name: string
  email: string
  avatar: string
  program: string
  year: number
}

export type GradeEntry = {
  studentId: string
  score: number | null
  submitted: boolean
  late: boolean
}

export type Assignment = {
  id: string
  courseId: string
  title: string
  category: string
  points: number
  due: string
  published: boolean
  entries: GradeEntry[]
}

export type GradeCategory = {
  id: string
  name: string
  weight: number
}

export type Course = {
  id: string
  code: string
  name: string
  term: string
  color: string
  studentCount: number
  categories: GradeCategory[]
}

export const STUDENTS: Student[] = [
  { id: "S001", name: "Amara Okonkwo",  email: "aokonkwo@demo.edu",  avatar: "AO", program: "PA Program", year: 1 },
  { id: "S002", name: "Diego Reyes",    email: "dreyes@demo.edu",    avatar: "DR", program: "PA Program", year: 1 },
  { id: "S003", name: "Priya Sharma",   email: "psharma@demo.edu",   avatar: "PS", program: "PA Program", year: 1 },
  { id: "S004", name: "Connor Walsh",   email: "cwalsh@demo.edu",    avatar: "CW", program: "CS",         year: 2 },
  { id: "S005", name: "Yuki Tanaka",    email: "ytanaka@demo.edu",   avatar: "YT", program: "PA Program", year: 1 },
  { id: "S006", name: "Jordan Ellis",   email: "jellis@demo.edu",    avatar: "JE", program: "EN",         year: 2 },
  { id: "S007", name: "Mia Patel",      email: "mpatel@demo.edu",    avatar: "MP", program: "PA Program", year: 1 },
  { id: "S008", name: "Luca Romano",    email: "lromano@demo.edu",   avatar: "LR", program: "PA Program", year: 1 },
]

export const COURSES: Course[] = [
  { id: "pa-601", code: "PA 601", name: "Clinical Medicine I",  term: "Fall 2026", color: "#6366f1", studentCount: 24,
    categories: [{ id: "c1", name: "SOAP Notes", weight: 40 }, { id: "c2", name: "Quizzes", weight: 20 }, { id: "c3", name: "Midterm", weight: 20 }, { id: "c4", name: "Final", weight: 20 }] },
  { id: "pa-602", code: "PA 602", name: "Pharmacology",         term: "Fall 2026", color: "#8b5cf6", studentCount: 24,
    categories: [{ id: "c1", name: "Labs", weight: 30 }, { id: "c2", name: "Quizzes", weight: 30 }, { id: "c3", name: "Final", weight: 40 }] },
  { id: "pa-603", code: "PA 603", name: "Patient Assessment",   term: "Fall 2026", color: "#a78bfa", studentCount: 22,
    categories: [{ id: "c1", name: "Practicum", weight: 50 }, { id: "c2", name: "Reflections", weight: 25 }, { id: "c3", name: "Final", weight: 25 }] },
  { id: "cs-101", code: "CS 101", name: "Intro to Computing",   term: "Fall 2026", color: "#34d399", studentCount: 42,
    categories: [{ id: "c1", name: "Labs", weight: 40 }, { id: "c2", name: "Assignments", weight: 30 }, { id: "c3", name: "Final", weight: 30 }] },
  { id: "en-201", code: "EN 201", name: "Academic Writing",     term: "Fall 2026", color: "#fbbf24", studentCount: 30,
    categories: [{ id: "c1", name: "Essays", weight: 60 }, { id: "c2", name: "Drafts", weight: 20 }, { id: "c3", name: "Final", weight: 20 }] },
]

const makeEntries = (scores: (number | null)[]): GradeEntry[] =>
  STUDENTS.slice(0, scores.length).map((s, i) => ({
    studentId: s.id,
    score: scores[i],
    submitted: scores[i] !== null,
    late: false,
  }))

export const ASSIGNMENTS: Assignment[] = [
  // PA 601
  { id: "a1",  courseId: "pa-601", title: "SOAP Note #1 — Chest Pain",        category: "SOAP Notes",    points: 100, due: "Sep 15", published: true,  entries: makeEntries([92,78,98,null,88,93,84,76]) },
  { id: "a2",  courseId: "pa-601", title: "SOAP Note #2 — Hypertension",       category: "SOAP Notes",    points: 100, due: "Oct 1",  published: true,  entries: makeEntries([88,82,99,null,87,90,85,75]) },
  { id: "a3",  courseId: "pa-601", title: "Quiz 1 — Cardiovascular",           category: "Quizzes",       points: 50,  due: "Sep 20", published: true,  entries: makeEntries([45,38,50,null,44,48,42,36]) },
  { id: "a4",  courseId: "pa-601", title: "Midterm Exam",                      category: "Midterm",       points: 100, due: "Oct 15", published: true,  entries: makeEntries([91,76,97,null,89,88,81,79]) },
  { id: "a5",  courseId: "pa-601", title: "SOAP Note #3 — Diabetes",           category: "SOAP Notes",    points: 100, due: "Nov 1",  published: true,  entries: makeEntries([95,80,99,null,86,92,84,78]) },
  { id: "a6",  courseId: "pa-601", title: "SOAP Note #4 — Renal Failure",      category: "SOAP Notes",    points: 100, due: "Nov 29", published: true,  entries: makeEntries([null,null,null,null,null,null,null,null]) },
  { id: "a7",  courseId: "pa-601", title: "Final Exam",                        category: "Final",         points: 100, due: "Dec 15", published: false, entries: makeEntries([]) },
  // PA 602
  { id: "a8",  courseId: "pa-602", title: "Drug Interaction Lab 1",            category: "Labs",          points: 100, due: "Sep 18", published: true,  entries: makeEntries([90,85,96,null,88,null,82,null]) },
  { id: "a9",  courseId: "pa-602", title: "Pharmacokinetics Quiz",             category: "Quizzes",       points: 50,  due: "Oct 5",  published: true,  entries: makeEntries([44,40,50,null,46,null,42,null]) },
  { id: "a10", courseId: "pa-602", title: "Drug Interaction Lab 2",            category: "Labs",          points: 100, due: "Nov 2",  published: true,  entries: makeEntries([88,82,97,null,85,null,80,null]) },
  { id: "a11", courseId: "pa-602", title: "Final Exam",                        category: "Final",         points: 100, due: "Dec 15", published: false, entries: makeEntries([]) },
  // PA 603
  { id: "a12", courseId: "pa-603", title: "Physical Exam Practicum",           category: "Practicum",     points: 100, due: "Oct 10", published: true,  entries: makeEntries([89,77,98,null,87,null,83,null]) },
  { id: "a13", courseId: "pa-603", title: "Exam Reflection #1",                category: "Reflections",   points: 50,  due: "Oct 20", published: true,  entries: makeEntries([46,38,50,null,45,null,43,null]) },
  { id: "a14", courseId: "pa-603", title: "Patient Interview Practicum",       category: "Practicum",     points: 100, due: "Nov 10", published: true,  entries: makeEntries([91,79,99,null,88,null,85,null]) },
  // CS 101
  { id: "a15", courseId: "cs-101", title: "Python Functions Lab",              category: "Labs",          points: 100, due: "Sep 25", published: true,  entries: makeEntries([88,72,null,95,null,92,null,null]) },
  { id: "a16", courseId: "cs-101", title: "Assignment 1 — Algorithms",        category: "Assignments",   points: 100, due: "Oct 15", published: true,  entries: makeEntries([84,68,null,92,null,88,null,null]) },
  { id: "a17", courseId: "cs-101", title: "Final Project",                     category: "Final",         points: 100, due: "Dec 10", published: false, entries: makeEntries([]) },
  // EN 201
  { id: "a18", courseId: "en-201", title: "Essay #1 — Narrative Voice",        category: "Essays",        points: 100, due: "Sep 28", published: true,  entries: makeEntries([null,null,null,null,null,88,null,null]) },
  { id: "a19", courseId: "en-201", title: "Research Paper Draft",              category: "Drafts",        points: 50,  due: "Oct 20", published: true,  entries: makeEntries([null,null,null,null,null,44,null,null]) },
  { id: "a20", courseId: "en-201", title: "Final Essay",                       category: "Final",         points: 100, due: "Dec 12", published: false, entries: makeEntries([]) },
]

// ── Computed helpers ──────────────────────────────────────────────────────────

export function getStudentAvg(studentId: string, courseId: string): number | null {
  const assignments = ASSIGNMENTS.filter(a => a.courseId === courseId && a.published)
  const entries = assignments.flatMap(a => a.entries.filter(e => e.studentId === studentId && e.score !== null))
  if (!entries.length) return null
  const total = entries.reduce((sum, e) => sum + (e.score! / (ASSIGNMENTS.find(a => a.entries.includes(e))?.points ?? 100)) * 100, 0)
  return Math.round(total / entries.length)
}

export function getCourseAvg(courseId: string): number | null {
  const scores = STUDENTS.map(s => getStudentAvg(s.id, courseId)).filter((v): v is number => v !== null)
  if (!scores.length) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

export function getCourseTrend(courseId: string): { week: string; avg: number }[] {
  const base = getCourseAvg(courseId) ?? 82
  return ["Wk1","Wk2","Wk3","Wk4","Wk5","Wk6","Wk7","Wk8"].map((w, i) => ({
    week: w,
    avg: Math.min(100, Math.round(base - 4 + i * 0.8 + (Math.sin(i) * 2)))
  }))
}

export function getGradeDist(courseId: string) {
  const avgs = STUDENTS.map(s => getStudentAvg(s.id, courseId)).filter((v): v is number => v !== null)
  return [
    { range: "A (90–100)", count: avgs.filter(v => v >= 90).length },
    { range: "B (80–89)",  count: avgs.filter(v => v >= 80 && v < 90).length },
    { range: "C (70–79)",  count: avgs.filter(v => v >= 70 && v < 80).length },
    { range: "D (60–69)",  count: avgs.filter(v => v >= 60 && v < 70).length },
    { range: "F (<60)",    count: avgs.filter(v => v < 60).length },
  ]
}

export function letterGrade(avg: number | null): string {
  if (avg === null) return "—"
  if (avg >= 93) return "A"
  if (avg >= 90) return "A-"
  if (avg >= 87) return "B+"
  if (avg >= 83) return "B"
  if (avg >= 80) return "B-"
  if (avg >= 77) return "C+"
  if (avg >= 73) return "C"
  if (avg >= 70) return "C-"
  return "D"
}
