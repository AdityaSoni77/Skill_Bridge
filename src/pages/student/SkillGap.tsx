import { ArrowRight, Info } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, PolarRadiusAxis } from 'recharts'
import { useIntel } from '@/lib/useIntel'
import { Badge, Card, CardBody, CardHeader, LinkButton, PageHeading, Progress, VerifiedTag } from '@/components/ui/primitives'
import { StatusIcon, statusMeta } from '@/components/SkillStatus'
import { useApp } from '@/store'
import { cn } from '@/lib/utils'

export default function SkillGap() {
  const { student } = useApp()
  const { readiness, role, projection, priorityGaps } = useIntel()

  const radarData = readiness.gaps.map((g) => ({
    skill: g.name.length > 14 ? g.name.split(' ')[0] : g.name,
    You: g.have,
    Industry: g.need,
  }))

  return (
    <div>
      <PageHeading
        title="Skill gap analysis"
        lede={`Your current proficiency against what industry expects for a ${role.title}. The dark marker on each bar is the industry requirement.`}
        action={<LinkButton to="/student/roadmap" size="sm">Start my learning roadmap <ArrowRight size={14} /></LinkButton>}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Your skill vs industry requirement"
            subtitle={`${role.title} · benchmark refreshed from ${role.openings.toLocaleString('en-IN')} live postings`} />
          <div className="divide-y divide-hairline">
            {readiness.gaps.map((g) => {
              const m = statusMeta[g.status]
              return (
                <div key={g.skillId} className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <StatusIcon status={g.status} size={12} />
                    <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink-900">
                      {g.name}
                      {g.critical && <span className="ml-2 text-[11px] font-normal text-ink-400">critical</span>}
                      {g.verified && <span className="ml-2 align-middle"><VerifiedTag /></span>}
                    </p>
                    <p className="shrink-0 text-[13px] text-ink-700 tnum">
                      <span className="font-semibold text-ink-900">{g.have}</span>
                      <span className="text-ink-400"> / {g.need}</span>
                    </p>
                    <span className={cn('w-[68px] shrink-0 text-right text-[12px] font-medium', m.text)}>
                      {g.deficit > 0 ? `+${g.deficit} needed` : m.label}
                    </span>
                  </div>
                  <div className="mt-2 pl-[26px]">
                    <Progress value={g.have} target={g.need} tone={m.tone} />
                  </div>
                </div>
              )
            })}
          </div>
          <CardBody className="border-t border-hairline bg-canvas/60">
            <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-500">
              <Info size={14} className="mt-0.5 shrink-0" />
              Exceeding a requirement earns no extra credit — the engine caps each skill at 100% of the
              bar so a strong SQL score cannot hide a missing Node.js.
            </p>
          </CardBody>
        </Card>

        <div className="space-y-6">
          {/* The "why am I not ready / how do I get ready" answer */}
          <Card>
            <CardHeader title="Why am I not ready?" subtitle="And exactly what changes it" />
            <CardBody>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[32px] font-bold leading-none text-ink-900 tnum">{readiness.score}%</span>
                <span className="text-[13px] text-ink-500">current readiness</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-700">
                You clear {readiness.criticalSkillsCleared} of {readiness.criticalSkillsTotal} critical
                skills for this role. These are the increases that matter:
              </p>
              <ul className="mt-3 space-y-2">
                {priorityGaps.map((g) => (
                  <li key={g.skillId} className="flex items-center gap-3 rounded-lg bg-canvas px-3 py-2">
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink-900">{g.name}</span>
                    <span className="shrink-0 text-[13px] font-semibold text-navy-700 tnum">+{g.deficit}</span>
                    <Badge tone={statusMeta[g.status].tone}>{statusMeta[g.status].label}</Badge>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg border border-saffron-300/60 bg-saffron-50 px-3.5 py-3">
                <p className="text-[12.5px] text-saffron-600">Estimated readiness after your roadmap</p>
                <p className="mt-0.5 font-display text-[26px] font-bold leading-none text-ink-900 tnum">
                  {projection.score}%
                </p>
                <p className="mt-1.5 text-[11.5px] leading-snug text-ink-500">
                  Assumes each gap is closed to the industry bar, discounted by a 90% completion
                  factor. Nothing here is guesswork — recompute it any time.
                </p>
              </div>
              <LinkButton to="/student/roadmap" className="mt-4 w-full" size="sm">
                Start my learning roadmap
              </LinkButton>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Profile shape" subtitle="Where you sit inside the requirement envelope" />
            <CardBody className="pt-1">
              <div className="h-[268px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="#E4E7EC" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#667085', fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Industry requirement" dataKey="Industry" stroke="#98A2B3" fill="#98A2B3" fillOpacity={0.14} strokeDasharray="4 3" />
                    <Radar name={student.name.split(' ')[0]} dataKey="You" stroke="#2E6BC4" fill="#2E6BC4" fillOpacity={0.28} />
                    <Legend wrapperStyle={{ fontSize: 11.5, paddingTop: 6 }} iconType="plainline" iconSize={14} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
