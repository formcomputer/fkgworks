"use client"
import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ArrowRight } from "lucide-react"
import { SiteNav, SiteFooter, SpringButton } from "@/components/works/SiteShell"
import { cn } from "@/lib/utils"

const DOCS = [
  {
    slug: "getting-started",
    title: "Getting Started",
    articles: [
      {
        title: "What is Works?",
        content: `Works is a teacher-first interface for Canvas LMS. It connects to your Canvas account via an API key and presents your courses, students, grades, and assignments in a clean, fast, visual interface that Canvas itself never managed to build.

You can use Works in two modes:

**Demo mode** — No API key required. Works loads 12 pre-populated demo courses with 108 synthetic students and hundreds of assignments. All analytics, charts, and views work exactly as they would with real data. This is the fastest way to understand what Works does.

**Live mode** — Enter your Canvas API key and Works fetches your real courses, assignments, and submission data directly. Your key is stored in your browser's localStorage and never sent to any Works server.`
      },
      {
        title: "Do I need a Canvas API key?",
        content: `No. Hit Try Demo on the landing page and you're in immediately with fully populated demo data.

If you want to connect your real Canvas courses:

1. Log into Canvas
2. Go to **Account → Settings**
3. Scroll to **Approved Integrations**
4. Click **New Access Token**
5. Give it a name (e.g. "Works") and optionally set an expiry
6. Copy the token — you'll only see it once

Paste it into Works during onboarding or later in **Settings → Canvas API**.`
      },
      {
        title: "Is my API key secure?",
        content: `Yes. Here's exactly what happens with your key:

- It's stored in your browser's \`localStorage\` — the same place a site stores your preferences
- When Works fetches Canvas data, the request goes from your browser to your Canvas instance directly, via a server-side proxy route that never logs your key
- No Works server ever stores your API key
- You can revoke it at any time in Canvas under Account → Settings → Approved Integrations

We have no database, no user accounts, and no way to see your key.`
      },
      {
        title: "Which Canvas instances are supported?",
        content: `Any Canvas instance — Instructure-hosted, self-hosted, or institutional.

During onboarding, Works asks for your Canvas URL. Enter your institution's Canvas domain, for example:

- \`canvas.yourschool.edu\`
- \`yourschool.instructure.com\`
- \`canvas.instructure.com\` (default)

If you're unsure of your Canvas URL, look at the address bar when you're logged into Canvas.`
      },
    ]
  },
  {
    slug: "features",
    title: "Features",
    articles: [
      {
        title: "Courses & Assignments",
        content: `Works loads all courses where you're enrolled as a teacher. From the Courses view:

- See all courses with their assignment counts, student counts, and grading progress
- Click a course to see all its assignments
- Click an assignment to open the gradebook for that assignment

Works fetches published assignments only and shows real submission counts from Canvas — submitted, graded, and missing — per assignment.`
      },
      {
        title: "Analytics & Charts",
        content: `The Analytics view shows live data pulled from Canvas:

**Default charts**
- Submission vs. Grading Rate: bar chart comparing % submitted and % graded per assignment
- Submission Breakdown: pie chart of graded / submitted / missing across all assignments
- Submissions per Assignment: bar chart showing submitted vs. missing counts

**Custom Chart Builder**
Click "Create chart" and fill in three fields:
1. Chart type: bar, line, pie, or radar
2. Metric: submission rate, grading rate, needs grading, or points possible
3. Course: any course loaded from Canvas (searchable)

Charts render immediately and persist until you remove them.`
      },
      {
        title: "Student Roster",
        content: `The Students view shows a deduplicated list of all students across all your courses.

- Search by name, ID, or email
- Click any student to see their profile panel: every course they're enrolled in, their Canvas ID, and email
- Works deduplicates by Canvas user ID, so students enrolled in multiple courses appear once

The topbar search bar also filters students globally — type anywhere and Works jumps to the Students view.`
      },
      {
        title: "Assignment Calendar",
        content: `The Calendar view plots all published assignment due dates on a monthly calendar.

- Navigate between months with the arrow buttons
- Click any day to see what's due — each event shows the assignment title, course, points, and submission progress bar
- The right panel shows a "Next 14 days" upcoming list — click any item to jump the calendar to that date
- Clicking "Today" resets to the current month and selects today`
      },
      {
        title: "Feedback",
        content: `Works is in private beta. The Feedback view (sidebar → Feedback) lets you send notes directly to the team.

- Rate your experience 1–5 stars
- Categorize your feedback: General, Bug, Gradebook, Analytics, Canvas sync, Performance, UI, or Feature request
- Write your note and submit

Every submission is read. Your feedback directly shapes what gets built in v1.`
      },
    ]
  },
  {
    slug: "api",
    title: "Canvas API",
    articles: [
      {
        title: "How Works uses the Canvas API",
        content: `Works uses the Canvas REST API with your personal access token. Specifically, it calls:

- \`GET /api/v1/users/self\` — to verify your token during setup
- \`GET /api/v1/courses\` — to fetch courses where you're a teacher
- \`GET /api/v1/courses/:id/assignments\` — to fetch published assignments
- \`GET /api/v1/courses/:id/students/submissions\` — to get real submission counts

All requests are made server-side via Next.js API routes. Your token is passed from your browser to the API route as a request body, the route makes the Canvas call, and returns the data. The token is never written to any log or database.`
      },
      {
        title: "Rate limits",
        content: `Canvas has a rate limit of approximately 3,000 requests per hour per token. Works makes a burst of parallel requests on load — typically 3–5 requests per course. For a teacher with 10 courses, that's around 30–50 requests on the initial sync.

If you hit rate limits, Works will show an error and let you retry. You can also use the Sync button in the Courses view to manually trigger a re-fetch.`
      },
      {
        title: "Data Works does not access",
        content: `Works only reads what it needs. It does not access:

- Student grades or scores (the gradebook is currently read-only display)
- Student personal information beyond name and login ID
- Course files, pages, or discussion threads
- Other users' tokens or account settings
- Anything outside courses where you're enrolled as a teacher`
      },
    ]
  },
  {
    slug: "beta",
    title: "Beta & Roadmap",
    articles: [
      {
        title: "What's in v0.1 (current beta)",
        content: `The current beta includes:

- Canvas API connection with real course, assignment, and submission data
- Demo mode with 12 courses, 108 students, and 120+ assignments
- Analytics: default charts + custom chart builder (bar, line, pie, radar)
- Student roster with cross-course deduplication and search
- Assignment calendar with due date plotting
- Feedback form (sidebar → Feedback)
- Settings: API key management, profile, notifications`
      },
      {
        title: "What's coming in v1",
        content: `The v1 roadmap:

**Grade write-back** — Edit grades in the Works gradebook and push them back to Canvas. The "Push to Canvas" button is currently disabled; it activates in v1.

**Canvas messaging** — Send messages to students and other teachers directly from Works, using the Canvas messaging API.

**Multi-teacher collaboration** — Share a Works workspace with co-instructors. Real-time grade collaboration via WebSocket, AES-256 encrypted.

**Signed Mac app** — A properly code-signed .dmg that doesn't require right-click → Open. Automatic updates via Squirrel.

Your API key, profile, and preferences carry forward — nothing resets between versions.`
      },
    ]
  },
]

function DocArticle({ article }: { article: { title: string; content: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/6 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-4 text-left group">
        <span className={cn("text-[14px] transition-colors", open ? "text-white" : "text-white/55 group-hover:text-white/90")}>{article.title}</span>
        <ChevronDown className={cn("w-4 h-4 text-white/20 shrink-0 ml-6 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn("overflow-hidden transition-all duration-300 ease-out", open ? "max-h-[600px] opacity-100 pb-5" : "max-h-0 opacity-0")}>
        <div className="space-y-3">
          {article.content.split("\n\n").map((para, i) => (
            <p key={i} className="text-[13px] text-white/40 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: para
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/70 font-medium">$1</strong>')
                .replace(/`(.+?)`/g, '<code class="font-mono text-[12px] bg-white/6 px-1.5 py-0.5 rounded text-white/60">$1</code>')
              }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState(DOCS[0].slug)
  const section = DOCS.find(d => d.slug === activeSection) ?? DOCS[0]

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <SiteNav />
      <div className="max-w-5xl mx-auto px-8 py-16 flex gap-12">

        {/* Sidebar */}
        <aside className="w-48 shrink-0 sticky top-24 self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-4">Documentation</p>
          <nav className="space-y-0.5">
            {DOCS.map(d => (
              <button key={d.slug} onClick={() => setActiveSection(d.slug)}
                className={cn("w-full text-left px-3 py-2 rounded-xl text-[13px] transition-colors",
                  activeSection === d.slug ? "bg-white/8 text-white" : "text-white/40 hover:text-white hover:bg-white/4"
                )}>{d.title}</button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-white/6">
            <SpringButton href="/dashboard" variant="primary" className="w-full justify-center py-2.5 text-[13px]">
              Try Demo <ArrowRight className="w-3.5 h-3.5" />
            </SpringButton>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <h1 className="text-[28px] font-semibold tracking-tight text-white mb-2">{section.title}</h1>
          <p className="text-[13px] text-white/30 mb-10">{section.articles.length} articles</p>
          <div className="rounded-2xl border border-white/8 overflow-hidden divide-y-0">
            <div className="px-6 py-2">
              {section.articles.map(a => <DocArticle key={a.title} article={a} />)}
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
