import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookmarkCheck, BookmarkPlus, Filter, X } from 'lucide-react'
import { useApp } from '@/store'
import { allStudents, companyIndex } from '@/lib/data'
import { careerRoles, skillIndex } from '@/lib/data/skills'
import { rankCandidates } from '@/lib/engine'
import { Avatar, Badge, Button, Card, CardBody, CardHeader, EmptyState, LinkButton, PageHeading, Progress, Tabs, VerifiedTag } from '@/components/ui/primitives'
import { MatchRing } from '@/components/MatchRing'
import { StatusChip } from '@/components/SkillStatus'
import { cn } from '@/lib/utils'

export default function PostingDetail() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const { opportunities, applications, shortlistedIds, toggleShortlist } = useApp()
  const opp = opportunities.find((o) => o.id === id)
  const [tab, setTab] = useState<'applicants' | 'sourced' | 'shortlist'>('applicants')
  const [minMatch, setMinMatch] = useState(0)

  if (!opp) {
    return (
      <Card>
        <EmptyState title="Posting not found" body="This posting may have been closed."
          action={<LinkButton to="/industry/postings" size="sm">Back to postings</LinkButton>} />
      </Card>
    )
  }

  const applicantIds = new Set(applications.filter((a) => a.opportunityId === opp.id).map((a) => a.studentId))
  const ranked = rankCandidates(allStudents, opp, careerRoles, skillIndex)

  const pool = ranked.filter(({ student, match }) => {
    if (match.score < minMatch) return false
    if (tab === 'applicants') return applicantIds.has(student.id)
    if (tab === 'shortlist') return shortlistedIds.includes(student.id)
    return !applicantIds.has(student.id) // sourced: strong fits who have not applied
  })

  const selectedId = params.get('candidate')
  const selected = ranked.find((r) => r.student.id === selectedId)

  return (
    <div>
      <Link to="/industry/postings" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={14} /> My postings
      </Link>

      <PageHeading title={opp.title}
        lede={`${companyIndex[opp.companyId].name} · ${opp.location} · ${opp.stipend} · ${opp.applicants} applications received`} />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Applications</p>
          <p className="mt-1.5 font-display text-[26px] font-bold leading-none text-ink-900 tnum">{opp.applicants}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Meeting every requirement</p>
          <p className="mt-1.5 font-display text-[26px] font-bold leading-none text-gap-ready tnum">
            {ranked.filter((r) => r.match.missing.length === 0 && r.match.close.length === 0).length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">One skill away</p>
          <p className="mt-1.5 font-display text-[26px] font-bold leading-none text-gap-mid tnum">
            {ranked.filter((r) => r.match.missing.length + r.match.close.length === 1).length}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Tabs active={tab} onChange={setTab}
              tabs={[
                { id: 'applicants' as const, label: 'Applicants', count: ranked.filter((r) => applicantIds.has(r.student.id)).length },
                { id: 'sourced' as const, label: 'Matched but not applied', count: ranked.filter((r) => !applicantIds.has(r.student.id)).length },
                { id: 'shortlist' as const, label: 'Shortlist', count: shortlistedIds.length },
              ]} />
            <label className="flex items-center gap-2 text-[13px] text-ink-700">
              <Filter size={14} className="text-ink-400" /> Min match
              <input type="range" min={0} max={95} step={5} value={minMatch}
                onChange={(e) => setMinMatch(+e.target.value)} className="w-20 accent-navy-900" />
              <span className="w-8 font-semibold tnum">{minMatch}%</span>
            </label>
          </div>

          {pool.length === 0 ? (
            <Card>
              <EmptyState title="No candidates in this view"
                body="Lower the minimum match filter, or check the other tabs — strong candidates who have not applied yet appear under 'Matched but not applied'."
                action={<Button size="sm" variant="secondary" onClick={() => setMinMatch(0)}>Reset filter</Button>} />
            </Card>
          ) : (
            <div className="space-y-3">
              {pool.map(({ student, match, depth }) => {
                const shortlisted = shortlistedIds.includes(student.id)
                return (
                  <Card key={student.id} className={cn('transition-shadow hover:shadow-pop', selectedId === student.id && 'ring-2 ring-navy-500')}>
                    <CardBody className="py-4">
                      <div className="flex flex-wrap items-start gap-3">
                        <Avatar initials={student.avatarInitials} size={40} tone="light" />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink-900">
                            {student.name}
                            {student.verifiedSkillIds.length >= 4 && <VerifiedTag />}
                          </p>
                          <p className="mt-0.5 text-[12.5px] text-ink-500">
                            {student.branch} · {student.year} year · CGPA {student.cgpa} · {student.institution}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {[...match.met, ...match.close, ...match.missing].map((s) => (
                              <StatusChip key={s.skillId} status={s.status} name={s.name} />
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-ink-500">
                            <span className="tnum">{student.evidence.verifiedProjects} verified projects</span>
                            <span className="tnum">{student.evidence.internships} internships</span>
                            <span className="tnum">{student.evidence.certifications} certificates</span>
                            <span className="flex items-center gap-1.5">
                              skill depth
                              <span className="inline-block w-16"><Progress value={depth * 100} showTarget={false} className="h-1.5" /></span>
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-center gap-2">
                          <MatchRing score={match.score} size={50} />
                          <button onClick={() => toggleShortlist(student.id)}
                            className={cn('inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors',
                              shortlisted ? 'border-navy-900 bg-navy-900 text-white' : 'border-hairline text-ink-700 hover:bg-canvas')}>
                            {shortlisted ? <BookmarkCheck size={13} /> : <BookmarkPlus size={13} />}
                            {shortlisted ? 'Shortlisted' : 'Shortlist'}
                          </button>
                          <button onClick={() => setParams({ candidate: student.id })}
                            className="text-[12.5px] font-medium text-navy-700 hover:underline">
                            View portfolio
                          </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Candidate portfolio panel */}
        <div className="lg:sticky lg:top-[88px] lg:self-start">
          {selected ? (
            <Card>
              <CardHeader title="Candidate portfolio"
                action={<button onClick={() => setParams({})} className="text-ink-400 hover:text-ink-700" aria-label="Close"><X size={16} /></button>} />
              <CardBody>
                <div className="flex items-center gap-3">
                  <Avatar initials={selected.student.avatarInitials} size={44} />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-ink-900">{selected.student.name}</p>
                    <p className="truncate text-[12px] text-ink-500">{selected.student.email}</p>
                  </div>
                </div>
                <p className="mt-3.5 text-[13px] leading-relaxed text-ink-700">{selected.student.about}</p>

                <h4 className="mt-4 text-[12.5px] font-semibold text-ink-900">Match breakdown</h4>
                <div className="mt-2 space-y-2">
                  {selected.match.breakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-[12px]">
                        <span className="text-ink-700">{b.label}</span>
                        <span className="text-ink-500 tnum">{b.points.toFixed(1)}/{(b.weight * 100).toFixed(0)}</span>
                      </div>
                      <Progress value={b.raw * 100} showTarget={false} className="mt-1 h-1.5" />
                    </div>
                  ))}
                </div>

                <h4 className="mt-4 text-[12.5px] font-semibold text-ink-900">Projects</h4>
                <ul className="mt-1.5 space-y-2">
                  {selected.student.projects.map((p) => (
                    <li key={p.title} className="rounded-lg bg-canvas px-3 py-2">
                      <p className="flex items-center gap-2 text-[13px] font-medium text-ink-900">
                        {p.title}{p.verified && <VerifiedTag />}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-snug text-ink-500">{p.description}</p>
                    </li>
                  ))}
                </ul>

                <h4 className="mt-4 text-[12.5px] font-semibold text-ink-900">Education</h4>
                {selected.student.education.map((e) => (
                  <p key={e.degree} className="mt-1 text-[12.5px] text-ink-700">
                    {e.degree} · {e.institution} · {e.score}
                  </p>
                ))}

                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => toggleShortlist(selected.student.id)}>
                    {shortlistedIds.includes(selected.student.id) ? 'Remove from shortlist' : 'Shortlist candidate'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <h3 className="text-[13.5px] font-semibold text-ink-900">Requirements on this posting</h3>
                <div className="mt-3 space-y-2.5">
                  {opp.requirements.map((r) => (
                    <div key={r.skillId} className="flex items-center justify-between text-[13px]">
                      <span className="text-ink-700">
                        {skillIndex[r.skillId]?.name ?? r.skillId}
                        {r.critical && <span className="ml-1.5 text-[11px] text-gap-high">must have</span>}
                      </span>
                      <Badge tone="neutral">level {r.level}</Badge>
                    </div>
                  ))}
                </div>
                <p className="mt-4 border-t border-hairline pt-3 text-[12.5px] leading-relaxed text-ink-500">
                  Select a candidate to see their verified portfolio and the full breakdown behind
                  their match score.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
