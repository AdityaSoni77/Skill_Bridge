import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '../src/store'
import Login from '../src/pages/Login'
import Collaboration from '../src/pages/Collaboration'
import StudentDashboard from '../src/pages/student/Dashboard'
import SkillProfile from '../src/pages/student/SkillProfile'
import SkillGap from '../src/pages/student/SkillGap'
import Roadmap from '../src/pages/student/Roadmap'
import Opportunities from '../src/pages/student/Opportunities'
import OpportunityDetail from '../src/pages/student/OpportunityDetail'
import Applications from '../src/pages/student/Applications'
import Portfolio from '../src/pages/student/Portfolio'
import Assessment from '../src/pages/student/Assessment'
import IndustryDashboard from '../src/pages/industry/Dashboard'
import Postings from '../src/pages/industry/Postings'
import PostingDetail from '../src/pages/industry/PostingDetail'
import PostOpportunity from '../src/pages/industry/PostOpportunity'
import Candidates from '../src/pages/industry/Candidates'
import FacultyDashboard from '../src/pages/faculty/Dashboard'
import Programs from '../src/pages/faculty/Programs'
import Demand from '../src/pages/faculty/Demand'
import InstitutionDashboard from '../src/pages/institution/Dashboard'
import InstitutionStudents from '../src/pages/institution/Students'
import InstitutionGaps from '../src/pages/institution/Gaps'
import Placements from '../src/pages/institution/Placements'

const routes: [string, React.ComponentType, string?][] = [
  ['/login', Login],
  ['/student', StudentDashboard],
  ['/student/skills', SkillProfile],
  ['/student/gap', SkillGap],
  ['/student/roadmap', Roadmap],
  ['/student/opportunities', Opportunities],
  ['/student/opportunities/opp-001', OpportunityDetail, '/student/opportunities/:id'],
  ['/student/opportunities/does-not-exist', OpportunityDetail, '/student/opportunities/:id'],
  ['/student/applications', Applications],
  ['/student/portfolio', Portfolio],
  ['/student/assessment', Assessment],
  ['/industry', IndustryDashboard],
  ['/industry/postings', Postings],
  ['/industry/postings/opp-001', PostingDetail, '/industry/postings/:id'],
  ['/industry/postings/opp-001?candidate=stu-002', PostingDetail, '/industry/postings/:id'],
  ['/industry/postings/nope', PostingDetail, '/industry/postings/:id'],
  ['/industry/post', PostOpportunity],
  ['/industry/candidates', Candidates],
  ['/faculty', FacultyDashboard],
  ['/faculty/programs', Programs],
  ['/faculty/demand', Demand],
  ['/institution', InstitutionDashboard],
  ['/institution/students', InstitutionStudents],
  ['/institution/gaps', InstitutionGaps],
  ['/institution/placements', Placements],
  ['/collaboration', Collaboration],
]

// Recharts complains about zero-size containers when there is no layout engine;
// that is expected off-browser and not a defect worth failing the run on.
const IGNORE = /width\(0\) and height\(0\)|The width\(0\)|container/i
const realWarn = console.warn, realError = console.error
const noise: string[] = []
console.warn = (...a: unknown[]) => { const m = String(a[0]); if (!IGNORE.test(m)) noise.push('warn: ' + m) }
console.error = (...a: unknown[]) => { const m = String(a[0]); if (!IGNORE.test(m)) noise.push('error: ' + m) }

let failures = 0
for (const [url, Page, pattern] of routes) {
  try {
    const html = renderToString(
      <AppProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes><Route path={pattern ?? url.split('?')[0]} element={<Page />} /></Routes>
        </MemoryRouter>
      </AppProvider>,
    )
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (text.length < 60) { console.log(`EMPTY  ${url} (only ${text.length} chars of text)`); failures++ }
    else console.log(`ok     ${url.padEnd(46)} ${String(html.length).padStart(6)} bytes`)
  } catch (e) {
    failures++
    console.log(`FAIL   ${url}\n       ${(e as Error).message.split('\n')[0]}`)
  }
}
console.warn = realWarn; console.error = realError
if (noise.length) { console.log('\nConsole output during render:'); for (const n of [...new Set(noise)].slice(0, 12)) console.log('  ' + n) }
console.log(`\n${routes.length - failures}/${routes.length} screens rendered. ${failures ? failures + ' FAILURES' : 'No failures.'}`)
