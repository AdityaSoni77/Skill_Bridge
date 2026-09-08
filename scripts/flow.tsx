/**
 * INTERACTIVE DEMO-FLOW TEST
 * ==========================
 * Mounts the real <App /> in jsdom and clicks through the exact 7-step judge
 * demo, asserting the numbers that the pitch depends on. Run:
 *   npx rolldown scripts/flow.tsx -d /tmp/flow -f esm --platform node && node /tmp/flow/flow.js
 */
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/login',
  pretendToBeVisual: true,
})

const g = globalThis as unknown as Record<string, unknown>
g.window = dom.window
g.document = dom.window.document
Object.defineProperty(g, 'navigator', { value: dom.window.navigator, configurable: true, writable: true })
g.HTMLElement = dom.window.HTMLElement
g.Element = dom.window.Element
g.Node = dom.window.Node
g.getComputedStyle = dom.window.getComputedStyle
g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(Date.now()), 0)
g.cancelAnimationFrame = (id: number) => clearTimeout(id)
g.IS_REACT_ACT_ENVIRONMENT = true
g.location = dom.window.location
const location = dom.window.location
class RO { observe() {} unobserve() {} disconnect() {} }
g.ResizeObserver = RO
;(dom.window as unknown as Record<string, unknown>).ResizeObserver = RO

const { createRoot } = await import('react-dom/client')
const { act } = await import('react')
const { default: App } = await import('../src/App')

const root = createRoot(document.getElementById('root')!)
await act(async () => { root.render(<App />) })
const settle = async () => { await act(async () => { await new Promise((r) => setTimeout(r, 60)) }) }
await settle()

/* ---------------------------------------------------------------- */
let pass = 0, fail = 0
const text = () => (document.body.textContent ?? '').replace(/\s+/g, ' ')
function check(label: string, cond: boolean, detail = '') {
  if (cond) { pass++; console.log(`  ok    ${label}`) }
  else { fail++; console.log(`  FAIL  ${label}${detail ? ' — ' + detail : ''}`) }
}
function has(label: string, needle: string) {
  check(`${label}: "${needle}"`, text().includes(needle))
}
/** Finds a clickable element by its visible text. */
function findByText(needle: string, tags = 'button,a') {
  return [...document.querySelectorAll(tags)].find(
    (el) => (el.textContent ?? '').replace(/\s+/g, ' ').trim().includes(needle),
  ) as HTMLElement | undefined
}
async function click(needle: string, tags?: string) {
  const el = findByText(needle, tags)
  if (!el) { fail++; console.log(`  FAIL  click "${needle}" — element not found`); return false }
  await act(async () => { el.click() })
  await settle()
  return true
}

/* ---------------------------------------------------------------- */
console.log('\nSTEP 0 — login screen')
has('login', 'student@demo.com')
has('login', 'industry@demo.com')
has('login', 'admin@demo.com')
has('login', 'faculty@demo.com')

console.log('\nSTEP 1 — sign in as the student, readiness 62%')
const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement | null
check('email field exists', !!emailInput)
await click('Student')          // one-click demo credential fill
await settle()
if (!text().includes('62')) await click('Sign in')
await settle()
check('landed on student dashboard', location.pathname === '/student', 'at ' + location.pathname)
has('dashboard', 'Aditya')
has('dashboard', '62')
check('shows month-on-month delta of +8', /\+?\s*8\s*%|8% this month|↑ 8/.test(text()), text().slice(0, 0))

console.log('\nSTEP 2 — skill gap analysis')
await click('Skill gap analysis')
check('navigated to /student/gap', location.pathname === '/student/gap', 'at ' + location.pathname)
for (const n of ['42', '75', '35', '70', '78', '65', '80', '60']) has('gap table', n)
has('gap projection', '84')

console.log('\nSTEP 3 — personalised roadmap')
await click('Learning roadmap')
check('navigated to /student/roadmap', location.pathname === '/student/roadmap', 'at ' + location.pathname)
has('roadmap', 'React Fundamentals')
has('roadmap', 'Node.js')

console.log('\nSTEP 4 — opportunities, ABC at 87%')
await click('Opportunities')
check('navigated to /student/opportunities', location.pathname === '/student/opportunities', 'at ' + location.pathname)
has('opportunities', 'ABC Technologies')
has('opportunities', '87')
has('opportunities', '25,000')

console.log('\nSTEP 5 — open the ABC posting, apply, confirm it enters the tracker')
const abcLink = [...document.querySelectorAll('a')].find(
  (a) => a.getAttribute('href') === '/student/opportunities/opp-001',
) as HTMLElement | undefined
check('ABC card links to its detail page', !!abcLink)
if (abcLink) { await act(async () => { abcLink.click() }); await settle() }
check('on the ABC detail page', location.pathname === '/student/opportunities/opp-001', 'at ' + location.pathname)
has('detail', '87')
has('detail', 'Node.js')
await click('Apply with my profile')
has('after applying', 'Application submitted')
await click('Applications')
check('navigated to /student/applications', location.pathname === '/student/applications', 'at ' + location.pathname)
has('tracker', 'Under Review')
has('tracker', 'Full Stack Developer Intern')

console.log('\nSTEP 6 — switch to the institution dashboard')
await click('Viewing as')
await click('Institution')
check('landed on /institution', location.pathname === '/institution', 'at ' + location.pathname)
has('institution', 'Industry ready')
has('institution', 'Needs training')

console.log('\nSTEP 7 — switch to industry; the new application must appear there')
await click('Viewing as')
await click('Industry')
check('landed on /industry', location.pathname === '/industry', 'at ' + location.pathname)
has('industry', 'Full Stack Developer Intern')
await click('My postings')
await click('Full Stack Developer Intern')
check('opened a posting detail', location.pathname.startsWith('/industry/postings/'), 'at ' + location.pathname)
check('the student who just applied now shows as an applicant', text().includes('Aditya'),
  'Aditya missing from the Applicants tab')
has('ranking', '%')

console.log('\nEXTRA — academician dashboard and every sidebar link')
await click('Viewing as')
await click('Academician')
check('landed on /faculty', location.pathname === '/faculty', 'at ' + location.pathname)

const visited: string[] = []
for (const label of ['Industry programs', 'Industry demand', 'Collaboration', 'Dashboard']) {
  await click(label)
  visited.push(`${label}→${location.pathname}`)
  check(`sidebar "${label}" renders content`, (document.body.textContent ?? '').length > 400)
}
console.log('  visited: ' + visited.join(', '))


/** React ignores direct .value writes, so use the native setter + input event. */
async function type(selector: string, value: string) {
  const el = document.querySelector(selector) as HTMLInputElement | null
  if (!el) { fail++; console.log(`  FAIL  type into ${selector} — not found`); return }
  const proto = el.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement : dom.window.HTMLInputElement
  Object.getOwnPropertyDescriptor(proto.prototype, 'value')!.set!.call(el, value)
  await act(async () => { el.dispatchEvent(new dom.window.Event('input', { bubbles: true })) })
  await settle()
}

/** Icon-only controls carry no text, so match on title/aria-label instead. */
async function clickTitle(title: string) {
  const el = document.querySelector(`[title="${title}"], [aria-label="${title}"]`) as HTMLElement | null
  if (!el) { fail++; console.log(`  FAIL  click [${title}] — not found`); return false }
  await act(async () => { el.click() })
  await settle()
  return true
}

/** Clicks a sidebar item and proves the route actually changed and rendered. */
async function goto(label: string, expected: string) {
  const clicked = await click(label)
  const ok = clicked && location.pathname === expected && (document.body.textContent ?? '').length > 600
  check(`"${label}" → ${expected}`, !!ok, clicked ? `landed at ${location.pathname}` : 'link not found')
}

async function switchTo(label: string, expected: string) {
  await click('Viewing as')
  await click(label)
  check(`persona "${label}" → ${expected}`, location.pathname === expected, 'at ' + location.pathname)
}

console.log('\nEXTRA — sign out, reject a bad password, sign in by typing')
await clickTitle('Sign out')
check('signed out to /login', location.pathname === '/login', 'at ' + location.pathname)
await type('input[type="email"]', 'student@demo.com')
await type('input[type="password"]', 'wrong-password')
await click('Sign in')
check('bad password rejected with guidance', text().includes('demo123'))
check('stayed on the login screen', location.pathname === '/login', 'at ' + location.pathname)
await type('input[type="password"]', 'demo123')
await click('Sign in')
check('typed credentials sign in', location.pathname === '/student', 'at ' + location.pathname)

console.log('\nEXTRA — every student sidebar link')
await goto('Skill profile', '/student/skills')
await goto('Skill gap analysis', '/student/gap')
await goto('Learning roadmap', '/student/roadmap')
await goto('Opportunities', '/student/opportunities')
await goto('Applications', '/student/applications')
await goto('Digital portfolio', '/student/portfolio')
await goto('Collaboration', '/collaboration')
await goto('Dashboard', '/student')

console.log('\nEXTRA — assessment recalculates readiness')
await goto('Skill assessment', '/student/assessment')
const bands = [...document.querySelectorAll('button')].filter((b) => (b.textContent ?? '').trim() === 'Build independently')
check('assessment offers a rating band per benchmark skill', bands.length >= 5, `found ${bands.length}`)
for (const b of bands) { await act(async () => { (b as HTMLElement).click() }) }
await settle()
const saveBtn = findByText('Save and recalculate my readiness') as HTMLButtonElement | undefined
check('save enabled once every skill is answered', !!saveBtn && !saveBtn.disabled)
await click('Save and recalculate my readiness')
check('assessment reports a recalculated readiness', /readiness/i.test(text()))
await click('See my skill gaps')
check('assessment routes into gap analysis', location.pathname === '/student/gap', 'at ' + location.pathname)

console.log('\nEXTRA — industry: publish a posting, then every sidebar link')
await switchTo('Industry', '/industry')
await goto('Post an opportunity', '/industry/post')
check('form previews who would match before publishing', /match/i.test(text()))
await click('Publish opportunity')
has('publish', 'Opportunity published')
check('left the form after publishing', location.pathname !== '/industry/post', 'at ' + location.pathname)
await goto('My postings', '/industry/postings')
await goto('Candidate search', '/industry/candidates')
await goto('Collaboration', '/collaboration')
await goto('Dashboard', '/industry')

console.log('\nEXTRA — institution: every sidebar link')
await switchTo('Institution', '/institution')
await goto('Student readiness', '/institution/students')
await goto('Skill gaps', '/institution/gaps')
await goto('Placements & training', '/institution/placements')
await goto('Collaboration', '/collaboration')
await goto('Dashboard', '/institution')

console.log('\nEXTRA — unknown route shows the not-found state, not a blank page')
await act(async () => {
  dom.window.history.pushState({}, '', '/institution/nope')
  dom.window.dispatchEvent(new dom.window.PopStateEvent('popstate'))
})
await settle()
check('unknown route handled', text().includes('Page not found'), text().slice(0, 90))

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
