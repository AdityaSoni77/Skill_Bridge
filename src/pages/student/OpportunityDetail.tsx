import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, MapPin, IndianRupee, Clock, Users, CalendarDays, TriangleAlert, Sparkles } from 'lucide-react'
import { useApp } from '@/store'
import { useIntel } from '@/lib/useIntel'
import { companyIndex } from '@/lib/data'
import { careerRoles, skillIndex } from '@/lib/data/skills'
import { computeMatch, matchAdvice } from '@/lib/engine'
import { Avatar, Badge, Button, Card, CardBody, CardHeader, EmptyState, LinkButton, Progress, VerifiedTag } from '@/components/ui/primitives'
import { ReadinessGauge } from '@/components/ReadinessGauge'
import { StatusIcon, statusMeta } from '@/components/SkillStatus'
import { formatDate, relativeDate, cn } from '@/lib/utils'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { student, opportunities, applyTo, hasApplied } = useApp()
  const { roadmap } = useIntel()
  const opp = opportunities.find((o) => o.id === id)

  if (!opp) {
    return (
      <Card>
        <EmptyState title="Opportunity not found"
          body="This posting may have closed or the link is out of date."
          action={<LinkButton to="/student/opportunities" size="sm">Back to opportunities</LinkButton>} />
      </Card>
    )
  }

  const co = companyIndex[opp.companyId]
  const match = computeMatch(student, opp, careerRoles, skillIndex)
  const applied = hasApplied(opp.id)
  const ordered = [...match.met, ...match.close, ...match.missing]
  // Which roadmap modules would close the gaps this specific posting cares about.
  const gapSkillIds = new Set([...match.close, ...match.missing].map((s) => s.skillId))
  const helpfulSteps = roadmap.filter((s) => s.status !== 'completed' && s.resource.skillIds.some((sid) => gapSkillIds.has(sid)))

  return (
    <div>
      <Link to="/student/opportunities" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-900">
        <ArrowLeft size={14} /> All opportunities
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_336px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-start gap-4 p-6">
              <Avatar initials={co.logoInitials} size={48} tone="light" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13.5px] font-medium text-ink-700">{co.name}</p>
                  {co.verified && <VerifiedTag label="Verified employer" />}
                </div>
                <h1 className="mt-1 font-display text-[24px] font-bold leading-tight text-ink-900">{opp.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink-500">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={13} />{opp.location} · {opp.workMode}</span>
                  <span className="inline-flex items-center gap-1.5 tnum"><IndianRupee size={13} />{opp.stipend.replace('₹', '')}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock size={13} />{opp.duration}</span>
                  <span className="inline-flex items-center gap-1.5 tnum"><Users size={13} />{opp.applicants} applicants</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />Posted {relativeDate(opp.postedOn)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="navy">{opp.type}</Badge>
                  {opp.offersTraining && <Badge tone="ready">Training & mentorship offered</Badge>}
                </div>
              </div>
            </div>
            <CardBody className="border-t border-hairline">
              <p className="text-[14px] leading-relaxed text-ink-700">{opp.description}</p>
              <h3 className="mt-5 text-[13px] font-semibold text-ink-900">What you get</h3>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {opp.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13px] text-ink-700">
                    <Check size={14} className="mt-0.5 shrink-0 text-gap-ready" />{p}
                  </li>
                ))}
              </ul>
              <h3 className="mt-5 text-[13px] font-semibold text-ink-900">About {co.name}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{co.about}</p>
              <p className="mt-1.5 text-[12.5px] text-ink-400">{co.industry} · {co.size} · {co.location}</p>
            </CardBody>
          </Card>

          {/* Requirement-by-requirement comparison */}
          <Card>
            <CardHeader title="How you compare on each requirement"
              subtitle="Your proficiency against the level this employer asked for" />
            <div className="divide-y divide-hairline">
              {ordered.map((s) => {
                const m = statusMeta[s.status]
                return (
                  <div key={s.skillId} className="flex items-center gap-3 px-5 py-3.5">
                    <StatusIcon status={s.status} size={12} />
                    <p className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink-900">
                      {s.name}{s.critical && <span className="ml-2 text-[11px] font-normal text-ink-400">must have</span>}
                    </p>
                    <div className="hidden w-[160px] items-center gap-2 sm:flex">
                      <Progress value={s.have} target={s.need} tone={m.tone} />
                    </div>
                    <p className="w-[62px] shrink-0 text-right text-[13px] tnum">
                      <span className="font-semibold text-ink-900">{s.have}</span>
                      <span className="text-ink-400"> / {s.need}</span>
                    </p>
                    <span className={cn('w-[74px] shrink-0 text-right text-[12px] font-medium', m.text)}>
                      {s.deficit > 0 ? `+${s.deficit} needed` : m.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          {helpfulSteps.length > 0 && (
            <Card>
              <CardHeader title="How to become ready for this role"
                subtitle="Modules from your roadmap that close exactly these gaps" />
              <div className="divide-y divide-hairline">
                {helpfulSteps.map((s) => (
                  <div key={s.resource.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-[12px] font-semibold text-navy-700 tnum">
                      {s.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-ink-900">{s.resource.title}</p>
                      <p className="text-[12px] text-ink-500">{s.resource.provider} · {s.resource.hours} hours</p>
                    </div>
                    {s.closesGap > 0 && <Badge tone="navy">+{s.closesGap} pts</Badge>}
                  </div>
                ))}
              </div>
              <CardBody className="border-t border-hairline">
                <LinkButton to="/student/roadmap" size="sm" variant="secondary" className="w-full">
                  Open my roadmap
                </LinkButton>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Match panel */}
        <div className="space-y-5 lg:sticky lg:top-[88px] lg:self-start">
          <Card>
            <CardBody className="flex flex-col items-center pb-5 pt-6 text-center">
              <ReadinessGauge score={match.score} size={132} caption="match score" />
              <p className="mt-3 text-[13px] leading-relaxed text-ink-700">{matchAdvice(match)}</p>
            </CardBody>
            <div className="border-t border-hairline px-5 py-4">
              <p className="mb-2.5 text-[12.5px] font-semibold text-ink-900">Why this score</p>
              <div className="space-y-2">
                {match.breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex items-baseline justify-between text-[12.5px]">
                      <span className="text-ink-700">{b.label}</span>
                      <span className="text-ink-500 tnum">
                        {b.points.toFixed(1)} <span className="text-ink-400">/ {(b.weight * 100).toFixed(0)}</span>
                      </span>
                    </div>
                    <Progress value={b.raw * 100} showTarget={false} className="mt-1 h-1.5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-hairline px-5 py-4">
              {match.eligible ? (
                <p className="flex items-start gap-2 text-[12.5px] text-gap-ready">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  You meet every eligibility criterion: CGPA {opp.eligibility.minCgpa}+, {opp.eligibility.years.join('/')} year.
                </p>
              ) : (
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gap-mid">
                    <TriangleAlert size={13} /> Eligibility not met yet
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[12px] text-gap-mid">
                    {match.eligibilityNotes.map((n) => <li key={n}>· {n}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <CardBody className="border-t border-hairline">
              {applied ? (
                <div className="text-center">
                  <Badge tone="ready" className="mb-2">Application submitted</Badge>
                  <LinkButton to="/student/applications" size="sm" variant="secondary" className="w-full">
                    Track application
                  </LinkButton>
                </div>
              ) : (
                <>
                  <Button className="w-full" onClick={() => applyTo(opp.id)}>Apply with my profile</Button>
                  <p className="mt-2 text-center text-[11.5px] leading-snug text-ink-400">
                    Shares your verified skills, projects and readiness score with {co.name}.
                  </p>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-900">
                <Sparkles size={13} className="text-saffron-500" /> Closing date
              </p>
              <p className="mt-1 text-[13px] text-ink-700">
                Applications reviewed on a rolling basis. Posted {formatDate(opp.postedOn)}.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
