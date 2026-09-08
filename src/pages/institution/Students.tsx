import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { homeCohort } from '@/lib/data'
import { careerRoles, roleIndex, skillIndex } from '@/lib/data/skills'
import { computeReadiness, readinessBand } from '@/lib/engine'
import { Avatar, Badge, Card, CardBody, EmptyState, PageHeading, Progress, Tabs } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

type Band = 'all' | 'Industry ready' | 'Developing' | 'Needs training'

export default function InstitutionStudents() {
  const [q, setQ] = useState('')
  const [band, setBand] = useState<Band>('all')

  const rows = useMemo(() =>
    homeCohort.map((student) => {
      const role = roleIndex[student.careerGoalId] ?? careerRoles[0]
      const r = computeReadiness(student, role, skillIndex)
      return {
        student, role, readiness: r.score,
        band: readinessBand(r.score, r.criticalClearance),
        cleared: r.criticalSkillsCleared, total: r.criticalSkillsTotal,
        topGap: r.gaps.find((g) => g.deficit > 0),
      }
    }).sort((a, b) => b.readiness - a.readiness), [])

  const visible = rows.filter((r) => {
    if (band !== 'all' && r.band !== band) return false
    if (q && !`${r.student.name} ${r.student.branch} ${r.role.title}`.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <PageHeading title="Student readiness"
        lede="Individual readiness scores for every student on the platform, with the single biggest gap holding each one back." />

      <Card className="mb-5 p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student, branch or goal"
            className="h-9 w-full rounded-lg border border-hairline pl-9 pr-3 text-[13.5px] placeholder:text-ink-400 focus:border-navy-500" />
        </div>
      </Card>

      <div className="mb-5">
        <Tabs active={band} onChange={setBand}
          tabs={[
            { id: 'all' as const, label: 'All students', count: rows.length },
            { id: 'Industry ready' as const, label: 'Industry ready', count: rows.filter((r) => r.band === 'Industry ready').length },
            { id: 'Developing' as const, label: 'Developing', count: rows.filter((r) => r.band === 'Developing').length },
            { id: 'Needs training' as const, label: 'Needs training', count: rows.filter((r) => r.band === 'Needs training').length },
          ]} />
      </div>

      {visible.length === 0 ? (
        <Card><EmptyState title="No students in this view" body="Clear the search or pick another readiness band." /></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-hairline text-[12px] font-medium text-ink-500">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-3 py-3">Career goal</th>
                  <th className="px-3 py-3">Critical skills</th>
                  <th className="px-3 py-3">Biggest gap</th>
                  <th className="px-5 py-3 text-right">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {visible.map((r) => {
                  const tone = r.band === 'Industry ready' ? 'ready' : r.band === 'Developing' ? 'mid' : 'high'
                  return (
                    <tr key={r.student.id} className="hover:bg-canvas">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar initials={r.student.avatarInitials} size={32} tone="light" />
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-medium text-ink-900">{r.student.name}</p>
                            <p className="truncate text-[11.5px] text-ink-500">{r.student.branch} · {r.student.year} year</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-ink-700">{r.role.title}</td>
                      <td className="px-3 py-3">
                        <span className={cn('text-[13px] font-medium tnum',
                          r.cleared === r.total ? 'text-gap-ready' : r.cleared === 0 ? 'text-gap-high' : 'text-gap-mid')}>
                          {r.cleared} / {r.total}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[12.5px] text-ink-700">
                        {r.topGap ? `${r.topGap.name} (+${r.topGap.deficit})` : <span className="text-gap-ready">None</span>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2.5">
                          <span className="w-[70px]"><Progress value={r.readiness} showTarget={false} tone={tone} className="h-1.5" /></span>
                          <span className="w-8 text-right text-[13px] font-semibold text-ink-900 tnum">{r.readiness}%</span>
                          <Badge tone={tone}>{r.band}</Badge>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <CardBody className="border-t border-hairline">
            <p className="text-[12.5px] text-ink-500">
              Showing {visible.length} of {rows.length} students. Scores recompute whenever a student
              completes an assessment or an industry benchmark changes.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
