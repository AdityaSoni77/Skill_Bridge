import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Briefcase, ClipboardList, Route, Target } from 'lucide-react'
import { useApp } from '@/store'
import { useIntel } from '@/lib/useIntel'
import { greeting } from '@/lib/utils'
import { Badge, Card, CardBody, CardHeader, LinkButton, Progress, VerifiedTag } from '@/components/ui/primitives'
import { ReadinessGauge } from '@/components/ReadinessGauge'
import { MatchRing } from '@/components/MatchRing'
import { StatusIcon } from '@/components/SkillStatus'
import { companyIndex } from '@/lib/data'

export default function StudentDashboard() {
  const { student } = useApp()
  const intel = useIntel()
  const { readiness, role, delta, matches, myApplications, roadmapProgress, currentStep, priorityGaps } = intel
  const topMatches = matches.filter((m) => m.match.eligible).slice(0, 3)
  const activeApps = myApplications.filter((a) => a.stage !== 'Selected')

  return (
    <div className="space-y-6">
      {/* Hero: the number the whole product exists to move. */}
      <Card className="overflow-hidden">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-9 md:p-8">
          <div className="flex flex-col items-center justify-center">
            <ReadinessGauge score={readiness.score} delta={delta} caption="Industry readiness" />
          </div>

          <div className="min-w-0">
            <p className="text-[14px] text-ink-500">{greeting()}, {student.name.split(' ')[0]} 👋</p>
            <h1 className="mt-1 font-display text-[23px] font-bold leading-snug text-ink-900">
              You are {readiness.score}% ready for a {role.title} role
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-ink-500">
              Measured against what {role.openings.toLocaleString('en-IN')} live {role.title} postings
              are asking for. You clear {readiness.criticalSkillsCleared} of {readiness.criticalSkillsTotal} critical
              skills — closing the rest is what moves this number.
            </p>

            <div className="mt-5 space-y-2.5">
              {readiness.contributions.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="w-[188px] shrink-0 text-[12.5px] text-ink-700">{c.label}</span>
                  <Progress value={c.raw * 100} showTarget={false} className="h-1.5" />
                  <span className="w-[74px] shrink-0 text-right text-[12px] text-ink-500 tnum">
                    {c.points.toFixed(1)} / {(c.weight * 100).toFixed(0)} pts
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <LinkButton to="/student/gap" size="sm">Why am I not ready? <ArrowRight size={14} /></LinkButton>
              <LinkButton to="/student/roadmap" size="sm" variant="secondary">Start my learning roadmap</LinkButton>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard to="/student/gap" icon={<Target size={15} />} label="Skill gaps"
          value={`${priorityGaps.length}`} sub={priorityGaps.length ? `${priorityGaps.filter((g) => g.status === 'missing').length} high, ${priorityGaps.filter((g) => g.status === 'close').length} small` : 'All requirements met'} />
        <MetricCard to="/student/opportunities" icon={<Briefcase size={15} />} label="Recommended opportunities"
          value={`${matches.filter((m) => m.match.score >= 70 && m.match.eligible).length}`} sub="70% match or higher" />
        <MetricCard to="/student/applications" icon={<ClipboardList size={15} />} label="Active applications"
          value={`${activeApps.length}`} sub={`${myApplications.filter((a) => a.stage === 'Shortlisted' || a.stage === 'Interview').length} progressing`} />
        <MetricCard to="/student/roadmap" icon={<Route size={15} />} label="Learning progress"
          value={`${roadmapProgress}%`} sub={currentStep ? `Now: ${currentStep.resource.title}` : 'Roadmap complete'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Recommended opportunities */}
        <Card>
          <CardHeader title="Recommended for you"
            subtitle="Ranked by skill compatibility against your live profile"
            action={<Link to="/student/opportunities" className="text-[13px] font-medium text-navy-700 hover:underline">See all</Link>} />
          <div className="divide-y divide-hairline">
            {topMatches.map(({ opp, match }) => {
              const co = companyIndex[opp.companyId]
              return (
                <Link key={opp.id} to={`/student/opportunities/${opp.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-canvas">
                  <MatchRing score={match.score} size={46} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold text-ink-900">{opp.title}</p>
                    <p className="mt-0.5 truncate text-[12.5px] text-ink-500">{co.name} · {opp.location} · {opp.stipend}</p>
                    <div className="mt-2 flex items-center gap-1">
                      {[...match.met, ...match.close, ...match.missing].map((s) => (
                        <span key={s.skillId} title={`${s.name}: ${s.have}/${s.need}`}><StatusIcon status={s.status} size={10} /></span>
                      ))}
                      <span className="ml-1 text-[11.5px] text-ink-400">
                        {match.met.length}/{match.skills.length} requirements met
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="shrink-0 text-ink-400" />
                </Link>
              )
            })}
          </div>
        </Card>

        <div className="space-y-6">
          {/* Next step on the roadmap */}
          <Card>
            <CardHeader title="Your next step" subtitle={`Step ${currentStep?.order ?? '—'} of ${intel.roadmap.length}`} />
            <CardBody>
              {currentStep ? (
                <>
                  <p className="text-[15px] font-semibold text-ink-900">{currentStep.resource.title}</p>
                  <p className="mt-1 text-[12.5px] text-ink-500">
                    {currentStep.resource.provider} · {currentStep.resource.hours} hours · {currentStep.resource.type}
                  </p>
                  <div className="mt-3.5 flex items-center gap-2">
                    <Progress value={roadmapProgress} showTarget={false} />
                    <span className="shrink-0 text-[12px] text-ink-500 tnum">{roadmapProgress}%</span>
                  </div>
                  <p className="mt-3 rounded-lg bg-canvas px-3 py-2 text-[12.5px] leading-snug text-ink-700">
                    Closes {currentStep.closesGap} proficiency points on {currentStep.targetSkills.join(', ')}.
                  </p>
                  <LinkButton to="/student/roadmap" size="sm" variant="secondary" className="mt-3.5 w-full">
                    Open roadmap
                  </LinkButton>
                </>
              ) : (
                <p className="text-[13.5px] text-ink-500">You have completed every module on this pathway.</p>
              )}
            </CardBody>
          </Card>

          {/* Application snapshot */}
          <Card>
            <CardHeader title="Applications" subtitle="Live status from each employer"
              action={<Link to="/student/applications" className="text-[13px] font-medium text-navy-700 hover:underline">Track</Link>} />
            <div className="divide-y divide-hairline">
              {myApplications.slice(0, 4).map((a) => {
                const opp = intel.matches.find((m) => m.opp.id === a.opportunityId)?.opp
                const tone = a.stage === 'Interview' || a.stage === 'Shortlisted' ? 'ready' : a.stage === 'Under Review' ? 'mid' : 'neutral'
                return (
                  <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-ink-900">{opp?.title}</p>
                      <p className="truncate text-[12px] text-ink-500">{companyIndex[opp?.companyId ?? '']?.name}</p>
                    </div>
                    <Badge tone={tone as 'ready' | 'mid' | 'neutral'}>{a.stage}</Badge>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Credential trust */}
          <Card>
            <CardBody className="flex items-start gap-3">
              <VerifiedTag label={`${student.verifiedSkillIds.length} verified skills`} />
              <p className="text-[12.5px] leading-relaxed text-ink-500">
                Verified skills carry more weight with recruiters than self-reported ones.
                Your {student.evidence.verifiedProjects} verified projects and {student.evidence.certifications} certificates
                feed the proof-of-work part of your score.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  to, icon, label, value, sub,
}: { to: string; icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Link to={to} className="group">
      <Card className="h-full p-5 transition-shadow group-hover:shadow-pop">
        <div className="flex items-center gap-2 text-ink-500">
          <span className="text-ink-400">{icon}</span>
          <p className="text-[12.5px] font-medium">{label}</p>
        </div>
        <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{value}</p>
        <p className="mt-1.5 text-[12px] text-ink-500">{sub}</p>
      </Card>
    </Link>
  )
}
