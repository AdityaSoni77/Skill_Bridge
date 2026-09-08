import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Application, Opportunity, Role, Student } from '@/lib/types'
import { adityaSoni, allStudents, facultyUser, institutionProfile, opportunities as seedOpportunities, seedApplications } from '@/lib/data'
import { careerRoles, skillIndex } from '@/lib/data/skills'
import { computeMatch } from '@/lib/engine'

export interface DemoAccount {
  role: Role
  email: string
  password: string
  label: string
  name: string
  detail: string
  home: string
}

export const demoAccounts: DemoAccount[] = [
  { role: 'student', email: 'student@demo.com', password: 'demo123', label: 'Student', name: 'Aditya Soni', detail: '3rd year CSE · SGSITS, Indore', home: '/student' },
  { role: 'industry', email: 'industry@demo.com', password: 'demo123', label: 'Industry', name: 'Kunal Mehra', detail: 'Talent Lead · ABC Technologies', home: '/industry' },
  { role: 'institution', email: 'admin@demo.com', password: 'demo123', label: 'Institution', name: institutionProfile.adminName, detail: `${institutionProfile.designation} · SGSITS`, home: '/institution' },
  { role: 'faculty', email: 'faculty@demo.com', password: 'demo123', label: 'Academician', name: facultyUser.name, detail: `${facultyUser.designation} · CSE, SGSITS`, home: '/faculty' },
]

interface Toast { id: number; title: string; body?: string }

interface AppState {
  account: DemoAccount | null
  student: Student
  applications: Application[]
  opportunities: Opportunity[]
  savedIds: string[]
  shortlistedIds: string[]
  toasts: Toast[]
  signIn: (email: string, password: string) => { ok: boolean; error?: string; account?: DemoAccount }
  signInAs: (role: Role) => DemoAccount
  signOut: () => void
  applyTo: (opportunityId: string) => void
  hasApplied: (opportunityId: string) => boolean
  toggleSave: (opportunityId: string) => void
  toggleShortlist: (studentId: string) => void
  addOpportunity: (o: Opportunity) => void
  updateSkills: (next: Record<string, number>) => void
  notify: (title: string, body?: string) => void
  dismissToast: (id: number) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<DemoAccount | null>(null)
  const [student, setStudent] = useState<Student>(adityaSoni)
  const [applications, setApplications] = useState<Application[]>(seedApplications)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(seedOpportunities)
  const [savedIds, setSavedIds] = useState<string[]>(['opp-003'])
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['stu-002', 'stu-015'])
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((title: string, body?: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, title, body }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const signIn: AppState['signIn'] = useCallback((email, password) => {
    const found = demoAccounts.find((a) => a.email === email.trim().toLowerCase())
    if (!found) return { ok: false, error: 'No account found for that email. Use one of the demo accounts below.' }
    if (password !== found.password) return { ok: false, error: 'Incorrect password. The demo password is demo123.' }
    setAccount(found)
    return { ok: true, account: found }
  }, [])

  const signInAs: AppState['signInAs'] = useCallback((role) => {
    const found = demoAccounts.find((a) => a.role === role)!
    setAccount(found)
    return found
  }, [])

  const signOut = useCallback(() => setAccount(null), [])

  const hasApplied = useCallback(
    (id: string) => applications.some((a) => a.studentId === student.id && a.opportunityId === id),
    [applications, student.id],
  )

  const applyTo = useCallback(
    (opportunityId: string) => {
      const opp = opportunities.find((o) => o.id === opportunityId)
      if (!opp) return
      const match = computeMatch(student, opp, careerRoles, skillIndex)
      const today = new Date().toISOString().slice(0, 10)
      setApplications((prev) => [
        {
          id: 'app-' + Math.random().toString(36).slice(2, 8),
          studentId: student.id,
          opportunityId,
          appliedOn: today,
          stage: 'Under Review',
          matchAtApply: match.score,
          timeline: [
            { stage: 'Applied', date: today, note: `Profile shared with ${opp.title} hiring team` },
            { stage: 'Under Review', date: today, note: `Ranked at ${match.score}% skill compatibility` },
          ],
        },
        ...prev,
      ])
      notify('Application submitted', `${opp.title} — now tracking at Under Review.`)
    },
    [opportunities, student, notify],
  )

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const toggleShortlist = useCallback(
    (id: string) => {
      setShortlistedIds((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        const name = allStudents.find((s) => s.id === id)?.name ?? 'Candidate'
        notify(prev.includes(id) ? 'Removed from shortlist' : 'Added to shortlist', name)
        return next
      })
    },
    [notify],
  )

  const addOpportunity = useCallback(
    (o: Opportunity) => {
      setOpportunities((prev) => [o, ...prev])
      notify('Opportunity published', `${o.title} is now live and being matched to students.`)
    },
    [notify],
  )

  const updateSkills = useCallback(
    (next: Record<string, number>) => setStudent((s) => ({ ...s, skills: { ...s.skills, ...next } })),
    [],
  )

  const value = useMemo(
    () => ({
      account, student, applications, opportunities, savedIds, shortlistedIds, toasts,
      signIn, signInAs, signOut, applyTo, hasApplied, toggleSave, toggleShortlist,
      addOpportunity, updateSkills, notify, dismissToast: (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    }),
    [account, student, applications, opportunities, savedIds, shortlistedIds, toasts,
      signIn, signInAs, signOut, applyTo, hasApplied, toggleSave, toggleShortlist, addOpportunity, updateSkills, notify],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
