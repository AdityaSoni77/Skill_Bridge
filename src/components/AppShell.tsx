import { Suspense, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Radar, GitCompareArrows, Route, Briefcase, ClipboardList, IdCard,
  ClipboardCheck, Handshake, Users, FilePlus2, Building2, GraduationCap, TrendingUp,
  Menu, X, LogOut, ChevronDown, Check, PanelsTopLeft,
} from 'lucide-react'
import type { Role } from '@/lib/types'
import { useApp, demoAccounts } from '@/store'
import { cn } from '@/lib/utils'
import { Avatar } from './ui/primitives'

const navByRole: Record<Role, { to: string; label: string; icon: typeof Radar; end?: boolean }[]> = {
  student: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/skills', label: 'Skill profile', icon: Radar },
    { to: '/student/gap', label: 'Skill gap analysis', icon: GitCompareArrows },
    { to: '/student/roadmap', label: 'Learning roadmap', icon: Route },
    { to: '/student/opportunities', label: 'Opportunities', icon: Briefcase },
    { to: '/student/applications', label: 'Applications', icon: ClipboardList },
    { to: '/student/portfolio', label: 'Digital portfolio', icon: IdCard },
    { to: '/student/assessment', label: 'Skill assessment', icon: ClipboardCheck },
    { to: '/collaboration', label: 'Collaboration', icon: Handshake },
  ],
  industry: [
    { to: '/industry', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/industry/postings', label: 'My postings', icon: Briefcase },
    { to: '/industry/post', label: 'Post an opportunity', icon: FilePlus2 },
    { to: '/industry/candidates', label: 'Candidate search', icon: Users },
    { to: '/collaboration', label: 'Collaboration', icon: Handshake },
  ],
  faculty: [
    { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/faculty/programs', label: 'Industry programs', icon: GraduationCap },
    { to: '/faculty/demand', label: 'Industry demand', icon: TrendingUp },
    { to: '/collaboration', label: 'Collaboration', icon: Handshake },
  ],
  institution: [
    { to: '/institution', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/institution/students', label: 'Student readiness', icon: Users },
    { to: '/institution/gaps', label: 'Skill gaps', icon: GitCompareArrows },
    { to: '/institution/placements', label: 'Placements & training', icon: Building2 },
    { to: '/collaboration', label: 'Collaboration', icon: Handshake },
  ],
}

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <rect width="32" height="32" rx="7" fill="#0E2A4D" />
        <path d="M7 20c4-7 14-7 18 0" stroke="#E08A18" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M11 20v-4M21 20v-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-white">SkillBridge</span>
      )}
    </span>
  )
}

/** Lets a judge move between the four personas without re-typing credentials. */
function RoleSwitcher() {
  const { account, signInAs } = useApp()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  if (!account) return null

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[13px] font-medium text-ink-700 hover:bg-canvas">
        <PanelsTopLeft size={14} className="text-ink-400" />
        <span className="hidden sm:inline">Viewing as</span>
        <span className="text-ink-900">{account.label}</span>
        <ChevronDown size={14} className={cn('text-ink-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-40 mt-2 w-[290px] overflow-hidden rounded-xl border border-hairline bg-white shadow-pop animate-fade-up">
            <p className="border-b border-hairline px-3 py-2 text-[12px] text-ink-500">
              Switch persona — all four accounts share the same seeded data
            </p>
            {demoAccounts.map((a) => (
              <button key={a.role}
                onClick={() => { const acc = signInAs(a.role); setOpen(false); nav(acc.home) }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-canvas">
                <Avatar initials={a.name.split(' ').map((p) => p[0]).slice(0, 2).join('')} size={30} tone="light" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink-900">{a.label} — {a.name}</span>
                  <span className="block truncate text-[12px] text-ink-500">{a.detail}</span>
                </span>
                {account.role === a.role && <Check size={15} className="shrink-0 text-navy-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function AppShell() {
  const { account, signOut } = useApp()
  const nav = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  if (!account) return null
  const items = navByRole[account.role]

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to={account.home} onClick={() => setMobileOpen(false)}><Wordmark /></Link>
        <button className="text-white/70 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>
      <p className="px-5 pb-4 text-[12px] leading-snug text-white/45">
        From classroom skills to industry careers.
      </p>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 scrollbar-thin">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} end={it.end} onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn('flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors',
                isActive ? 'bg-white/[0.12] text-white' : 'text-white/65 hover:bg-white/[0.06] hover:text-white')}>
            <it.icon size={16} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{it.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <Avatar initials={account.name.split(' ').map((p) => p[0]).slice(0, 2).join('')} size={32} tone="light" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{account.name}</p>
            <p className="truncate text-[11.5px] text-white/50">{account.detail}</p>
          </div>
          <button onClick={() => { signOut(); nav('/login') }} title="Sign out"
            className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-[248px] shrink-0 lg:block"><div className="fixed h-screen w-[248px]">{sidebar}</div></aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="fixed inset-y-0 left-0 z-50 w-[260px] lg:hidden">{sidebar}</aside>
        </>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-hairline bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <button className="rounded-lg p-2 text-ink-700 hover:bg-canvas lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <p className="hidden min-w-0 truncate text-[13px] text-ink-500 sm:block">
            {account.role === 'student' && 'Your readiness updates as industry requirements change.'}
            {account.role === 'industry' && 'Candidates ranked by skill compatibility, not keyword search.'}
            {account.role === 'institution' && 'Aggregate skill intelligence across your students.'}
            {account.role === 'faculty' && 'Industry engagement and demand signals for your department.'}
          </p>
          <div className="ml-auto"><RoleSwitcher /></div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <Suspense fallback={<RouteSkeleton />}><Outlet /></Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

/** Placeholder while a lazily-loaded screen is fetched. */
function RouteSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-hairline/70" />
      <div className="h-44 animate-pulse rounded-xl bg-hairline/50" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-hairline/50" />)}
      </div>
    </div>
  )
}

export function ToastStack() {
  const { toasts, dismissToast } = useApp()
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-[min(340px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} role="status"
          className="flex items-start gap-3 rounded-xl border border-hairline bg-white p-3.5 shadow-pop animate-fade-up">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-gap-ready">
            <Check size={12} strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-ink-900">{t.title}</p>
            {t.body && <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500">{t.body}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} className="text-ink-400 hover:text-ink-700" aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
