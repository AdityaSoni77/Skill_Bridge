import { useMemo, useState } from 'react'
import { Search, Users } from 'lucide-react'
import { useApp } from '@/store'
import { allStudents } from '@/lib/data'
import { careerRoles, roleIndex, skillIndex } from '@/lib/data/skills'
import { computeReadiness, readinessBand } from '@/lib/engine'
import { Avatar, Badge, Card, CardBody, EmptyState, PageHeading, Progress, Tabs, VerifiedTag } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

/** Search the whole talent pool by career goal and readiness, not keywords. */
export default function Candidates() {
  const { shortlistedIds, toggleShortlist } = useApp()
  const [q, setQ] = useState('')
  const [goal, setGoal] = useState<'all' | string>('all')
  const [minReadiness, setMinReadiness] = useState(0)

  const scored = useMemo(() =>
    allStudents.map((student) => {
      const role = roleIndex[student.careerGoalId] ?? careerRoles[0]
      const r = computeReadiness(student, role, skillIndex)
      return { student, role, readiness: r.score, band: readinessBand(r.score, r.criticalClearance), breakdown: r }
    }).sort((a, b) => b.readiness - a.readiness), [])

  const visible = scored.filter(({ student, role, readiness }) => {
    if (goal !== 'all' && student.careerGoalId !== goal) return false
    if (readiness < minReadiness) return false
    if (q) {
      const hay = `${student.name} ${student.branch} ${student.institution} ${role.title}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  return (
    <div>
      <PageHeading title="Candidate search"
        lede="Every student carries a measured readiness score for their target role. Filter on that instead of scanning resumes." />

      <Card className="mb-5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, branch, college"
              className="h-9 w-full rounded-lg border border-hairline pl-9 pr-3 text-[13.5px] placeholder:text-ink-400 focus:border-navy-500" />
          </div>
          <label className="flex items-center gap-2 text-[13px] text-ink-700">
            Minimum readiness
            <input type="range" min={0} max={95} step={5} value={minReadiness}
              onChange={(e) => setMinReadiness(+e.target.value)} className="w-24 accent-navy-900" />
            <span className="w-8 font-semibold tnum">{minReadiness}%</span>
          </label>
        </div>
      </Card>

      <div className="mb-5">
        <Tabs active={goal} onChange={setGoal}
          tabs={[{ id: 'all', label: 'All roles', count: allStudents.length },
          ...careerRoles.map((r) => ({ id: r.id, label: r.title, count: allStudents.filter((s) => s.careerGoalId === r.id).length }))]} />
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState icon={<Users size={28} />} title="No candidates match these filters"
            body="Try lowering the readiness threshold — students who are close to the bar are often worth interviewing, especially if you offer training." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map(({ student, role, readiness, band, breakdown }) => {
            const tone = band === 'Industry ready' ? 'ready' : band === 'Developing' ? 'mid' : 'high'
            const shortlisted = shortlistedIds.includes(student.id)
            return (
              <Card key={student.id}>
                <CardBody className="py-4">
                  <div className="flex items-start gap-3">
                    <Avatar initials={student.avatarInitials} size={40} tone="light" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 truncate text-[14.5px] font-semibold text-ink-900">
                        {student.name}
                        {student.verifiedSkillIds.length >= 4 && <VerifiedTag />}
                      </p>
                      <p className="mt-0.5 truncate text-[12.5px] text-ink-500">
                        {student.branch} · {student.year} year · CGPA {student.cgpa}
                      </p>
                      <p className="truncate text-[12px] text-ink-400">{student.institution}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn('font-display text-[20px] font-bold leading-none tnum',
                        tone === 'ready' ? 'text-gap-ready' : tone === 'mid' ? 'text-gap-mid' : 'text-gap-high')}>
                        {readiness}%
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-500">ready</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={readiness} showTarget={false} tone={tone} />
                    <Badge tone={tone}>{band}</Badge>
                  </div>

                  <p className="mt-2.5 text-[12.5px] text-ink-500">
                    Targeting {role.title} · clears {breakdown.criticalSkillsCleared}/{breakdown.criticalSkillsTotal} critical skills
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
                    <span className="text-[12px] text-ink-500 tnum">
                      {student.evidence.verifiedProjects} projects · {student.evidence.internships} internships
                    </span>
                    <button onClick={() => toggleShortlist(student.id)}
                      className={cn('rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors',
                        shortlisted ? 'border-navy-900 bg-navy-900 text-white' : 'border-hairline text-ink-700 hover:bg-canvas')}>
                      {shortlisted ? 'Shortlisted' : 'Shortlist'}
                    </button>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
