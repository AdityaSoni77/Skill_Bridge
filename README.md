# SkillBridge

**From classroom skills to industry careers.**

An industry readiness intelligence platform connecting **students, industries, academicians and institutions** through one shared signal: the gap between what industry requires and what a student can actually do.

Not a job portal. The product answers four questions a job board cannot:

1. What does industry require for this role, right now?
2. What can this student actually do?
3. What exactly is missing, and what should they learn next?
4. Which opportunities are they realistically ready for?

---

## Running it

```bash
npm install
npm run dev
```

Opens on <http://localhost:5173>. No backend, no API keys, no network calls — all data is local and all scoring is computed in the browser.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run lint` | oxlint |
| `npm run verify` | Prints the Skill Intelligence Engine's outputs against their expected demo values |
| `npm run smoke` | Server-renders all 26 screens and fails on any blank page or console error |
| `npm run flow` | Drives the real app through the full judge demo in jsdom — 80 assertions |

## Demo accounts

Password is `demo123` for all four. The login screen has one-click buttons, so nothing needs typing.

| Role | Email |
| --- | --- |
| Student | `student@demo.com` |
| Industry | `industry@demo.com` |
| Institution | `admin@demo.com` |
| Academician | `faculty@demo.com` |

Once signed in, **"Viewing as"** in the top-right switches persona instantly — no signing out mid-demo. State is in-memory, so a browser refresh restores pristine demo data.

---

## The 3-minute judge demo

Sign in with the **Student** button.

**1 — Industry readiness: 62%** (Dashboard)
> "Aditya isn't a number on a résumé. He's 62% ready for the role he actually wants, measured against what companies are hiring for this month — up 8 points since last month."

**2 — Skill gap analysis** (sidebar → Skill gap analysis)
> React 42/75 · Node.js 35/70 · SQL 78/65 · Git 80/60

> "The platform doesn't just say he lacks skills. It says exactly which ones, by how much, and which are non-negotiable for the role. He's *ahead* on SQL and Git — nobody told him that either."

Point at the projection: **62% → 84% after the roadmap.**

**3 — Learning roadmap** (sidebar → Learning roadmap)
> "HTML, CSS, JavaScript, Git are already complete — detected from his actual proficiency, not ticked off by hand. React Fundamentals is current. Then Node.js, APIs, a full stack project, and an industry assessment."

**4 — Opportunities** (sidebar → Opportunities)
> ABC Technologies, Full Stack Developer Intern, ₹25,000/month — **87% match**

> "And here's why it's 87, not a black box: JavaScript, SQL and Git clear the bar, React is close, Node.js is the blocker. Improve two skills and this becomes a strong match."

**5 — Apply** → *View opportunity* → *Apply with my profile*
> Lands in the tracker at **Under Review**, with the match score recorded at the time of applying.

**6 — Institution** ("Viewing as" → Institution)
> "The same signal, aggregated. The college can now see that a large share of its students share Aditya's exact gaps — Communication, SQL, Python, React — ranked by how many students are short and how far short. That becomes a training plan with an industry partner attached."

**7 — Industry** ("Viewing as" → Industry → My postings → the Full Stack posting)
> "Aditya's application is already here. Companies see candidates ranked by skill compatibility with a per-skill breakdown, instead of scanning hundreds of résumés. Everyone who clears every requirement scores 100%, so they're ordered by skill depth."

Optional closer — **Post an opportunity**: change a required skill level and the matching-candidate preview updates live, before the posting is even published.

---

## The Skill Intelligence Engine

All scoring lives in `src/lib/engine.ts` as pure functions over plain data. It is fully deterministic — no randomness, no model calls — so the same figure appears identically every time it's shown. Each scorer can be swapped for a trained model without touching the UI.

**Industry readiness**

```
readiness = 0.60 × skill coverage vs the industry bar
          + 0.25 × critical skills cleared
          + 0.15 × verified proof of work
```

Coverage is capped per skill, so exceeding a bar earns no bonus. Critical skills are scored **binary** on purpose: being "almost there" on a core skill still fails a recruiter's filter, so it cannot be averaged away.

**Opportunity match**

```
match = 0.60 × skill compatibility
      + 0.20 × career interest fit
      + 0.10 × eligibility
      + 0.10 × experience & proof of work
```

**Roadmap.** A module counts as complete only when the student's proficiency reaches its mastery level, so the roadmap doubles as a progress record rather than a static syllabus. Projections are discounted by a 0.9 confidence factor to stay honest.

**Recruiter ranking.** Match score answers "does this candidate clear our bar?" and is deliberately capped, so every candidate above the bar scores 100. `skillDepth` then orders them by how far above the bar they sit — the UI shows both.

**Institution aggregates.** `aggregateReadiness` and `topSkillGaps` recompute every student's readiness from their individual profile; nothing is hand-entered.

---

## Project structure

```
src/
  lib/
    engine.ts            Skill Intelligence Engine — all scoring, pure functions
    types.ts             Domain model
    useIntel.ts          Hook binding the signed-in student to the engine
    utils.ts             cn(), ₹ formatting, dates
    data/
      skills.ts          34 skills, 5 career roles with industry benchmarks,
                         learning catalogue, role pathways, demand trends
      students.ts        16 hand-written students (demo narrative)
      cohortGen.ts       104 deterministically seeded students, so institution
                         percentages rest on a real population
      opportunities.ts   7 companies, 9 opportunities, seeded applications
      institution.ts     Faculty, faculty programs, collaborations, departments
  components/
    AppShell.tsx         Sidebar, persona switcher, mobile drawer, toasts
    ReadinessGauge.tsx   Radial readiness dial
    SkillStatus.tsx      Ready / close / missing semantics
    MatchRing.tsx        Match percentage ring
    OpportunityCard.tsx  Opportunity card with per-skill ticks
    ui/primitives.tsx    Card, Button, Badge, Progress, Tabs, EmptyState…
  pages/
    Login.tsx            Demo accounts + the problem/solution story
    Collaboration.tsx    Mentorship, guest lectures, live projects, challenges
    student/             Dashboard, SkillProfile, SkillGap, Roadmap,
                         Opportunities, OpportunityDetail, Applications,
                         Portfolio, Assessment
    industry/            Dashboard, Postings, PostingDetail, PostOpportunity,
                         Candidates
    faculty/             Dashboard, Programs, Demand
    institution/         Dashboard, Students, Gaps, Placements
scripts/
  verify.ts              Engine outputs vs expected demo values
  smoke.tsx              SSR every route, fail on blank pages
  flow.tsx               Interactive end-to-end demo flow in jsdom
```

**Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts, React Router. UI primitives are hand-written in the shadcn/ui style (same `cn` + variant API, no CLI dependency).

---

## Verification

```
npm run verify   engine outputs match their expected demo values
npm run smoke    26/26 screens rendered, no failures
npm run flow     80 passed, 0 failed
npm run lint     3 warnings (fast-refresh only), 0 errors
npm run build    typecheck clean, production build succeeds
```

`npm run flow` clicks through the real application: signs in, rejects a wrong password, walks all four personas' sidebars, takes the assessment and confirms readiness recalculates, applies to the ABC posting and confirms it enters the tracker **and then appears on the recruiter's side**, publishes a new posting, and checks that an unknown URL renders a not-found state rather than a blank page.

---

## Known limitations

- **State is in-memory.** Applications, shortlists and assessment results reset on refresh. This is deliberate for demo safety — every reload returns to a pristine 62%. Persistence would be a storage layer behind the same store API.
- **Authentication is simulated.** `signIn` matches against four hard-coded accounts; there is no real session, token or password hashing.
- **Proficiency is self-reported.** The assessment captures banded self-ratings rather than testing skill. A production version needs proctored assessments or verified evidence, which is why `verifiedSkillIds` and the "Verified" indicator exist as a separate, more trustworthy signal.
- **Industry benchmarks are seeded, not live.** `careerRoles[].benchmark` is fixed data described as being recomputed from live postings. Wiring it to real job-posting ingestion is the main production gap.
- **Institution figures cover the 96 assessed SGSITS profiles**, against 1,292 enrolled. The dashboard states this rather than implying full coverage.
- **Several candidates legitimately score 100% on an entry-level posting** because they clear every requirement. They're ordered by skill depth, shown next to each candidate.
- Recharts renders no useful dimensions during server-side rendering, so `npm run smoke` filters those container warnings.
