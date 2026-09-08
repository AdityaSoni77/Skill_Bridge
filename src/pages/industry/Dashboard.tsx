import { Link } from 'react-router-dom'
import { ArrowUpRight, Briefcase, Users, UserCheck, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { useApp } from '@/store'
import { allStudents, companyIndex } from '@/lib/data'
import { careerRoles, skillIndex } from '@/lib/data/skills'
import { rankCandidates } from '@/lib/engine'
import { Avatar, Badge, Card, CardBody, CardHeader, LinkButton, PageHeading, Progress, VerifiedTag } from '@/components/ui/primitives'
import { MatchRing } from '@/components/MatchRing'

const MY_COMPANY = 'co-001'

export default function IndustryDashboard() {
  const { opportunities, applications, shortlistedIds } = useApp()
  const mine = opportunities.filter((o) => o.companyId === MY_COMPANY)
  const co = companyIndex[MY_COMPANY]

  const totalApplicants = mine.reduce((n, o) => n + o.applicants, 0)
  const flagship = mine[0]
  const ranked = flagship ? rankCandidates(allStudents, flagship, careerRoles, skillIndex) : []
  const readyNow = ranked.filter((r) => r.match.score >= 85).length

  // How the applicant pool stacks up against each requirement of the flagship posting.
  const requirementHealth = flagship
    ? flagship.requirements.map((r) => {
      const meeting = allStudents.filter((s) => (s.skills[r.skillId] ?? 0) >= r.level).length
      return {
        name: skillIndex[r.skillId]?.name.split(' ')[0] ?? r.skillId,
        pct: Math.round((meeting / allStudents.length) * 100),
      }
    })
    : []

  return (
    <div>
      <PageHeading
        title={`${co.name} — talent dashboard`}
        lede="Candidates are ranked by measured skill compatibility with each posting, so you are reading evidence rather than searching resumes."
        action={<LinkButton to="/industry/post" size="sm">Post an opportunity</LinkButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><Briefcase size={14} className="text-ink-400" />Live postings</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{mine.length}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">Across internships, jobs and live projects</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><Users size={14} className="text-ink-400" />Total applicants</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{totalApplicants}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">{applications.filter((a) => mine.some((o) => o.id === a.opportunityId)).length} tracked in this demo dataset</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><UserCheck size={14} className="text-ink-400" />Ready now</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{readyNow}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">85%+ compatibility on your flagship role</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><TrendingUp size={14} className="text-ink-400" />Shortlisted</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{shortlistedIds.length}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">Awaiting interview scheduling</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title={flagship?.title ?? 'No postings yet'}
            subtitle={flagship ? `${flagship.applicants} applications · ranked by skill compatibility` : undefined}
            action={flagship && <Link to={`/industry/postings/${flagship.id}`} className="text-[13px] font-medium text-navy-700 hover:underline">Open posting</Link>}
          />
          <div className="divide-y divide-hairline">
            {ranked.slice(0, 6).map(({ student, match, depth }) => (
              <Link key={student.id} to={`/industry/postings/${flagship!.id}?candidate=${student.id}`}
                className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-canvas">
                <Avatar initials={student.avatarInitials} size={36} tone="light" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-[14px] font-semibold text-ink-900">
                    {student.name}
                    {student.verifiedSkillIds.length >= 4 && <VerifiedTag label="Verified" />}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-ink-500">
                    {student.branch} · {student.year} year · {student.institution} · CGPA {student.cgpa}
                  </p>
                </div>
                <div className="hidden w-24 shrink-0 sm:block">
                  <p className="mb-1 text-[11px] text-ink-400">skill depth</p>
                  <Progress value={depth * 100} showTarget={false} className="h-1.5" />
                </div>
                <MatchRing score={match.score} size={44} />
                <ArrowUpRight size={15} className="shrink-0 text-ink-400" />
              </Link>
            ))}
          </div>
          <CardBody className="border-t border-hairline bg-canvas/60">
            <p className="text-[12.5px] leading-relaxed text-ink-500">
              Candidates clearing every stated requirement all score 100%. Skill depth — how far
              above each bar they sit — breaks those ties instead of an arbitrary ordering.
            </p>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Where the talent pool falls short"
              subtitle={flagship ? `Share of students meeting each ${flagship.title} requirement` : undefined} />
            <CardBody className="pt-2">
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requirementHealth} margin={{ left: -22, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#E4E7EC" />
                    <XAxis dataKey="name" tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }}
                      formatter={(v) => [`${v}% of students`, 'Meet the bar']} />
                    <Bar dataKey="pct" radius={[4, 4, 0, 0]} barSize={30}>
                      {requirementHealth.map((d) => (
                        <Cell key={d.name} fill={d.pct >= 60 ? '#1F8A5B' : d.pct >= 35 ? '#B45309' : '#C0392B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
                Use this to decide whether to relax a requirement or fund training for the
                skills the pool is genuinely short on.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Your postings" action={<Link to="/industry/postings" className="text-[13px] font-medium text-navy-700 hover:underline">Manage</Link>} />
            <div className="divide-y divide-hairline">
              {mine.map((o) => (
                <Link key={o.id} to={`/industry/postings/${o.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-canvas">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-ink-900">{o.title}</p>
                    <p className="text-[12px] text-ink-500">{o.type} · {o.location}</p>
                  </div>
                  <Badge tone="neutral">{o.applicants} applied</Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
