import { Link } from 'react-router-dom'
import { Building2, GraduationCap, Handshake, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell,
  LineChart, Line, Legend, PieChart, Pie,
} from 'recharts'
import { homeCohort, departments, institutionProfile, demandTrend, skillDemand } from '@/lib/data'
import { careerRoles, skillIndex } from '@/lib/data/skills'
import { aggregateReadiness, topSkillGaps } from '@/lib/engine'
import { Badge, Card, CardBody, CardHeader, PageHeading, Progress } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const BAND_COLORS = { 'Industry ready': '#1F8A5B', Developing: '#2E6BC4', 'Needs training': '#C0392B' }

export default function InstitutionDashboard() {
  const agg = aggregateReadiness(homeCohort, careerRoles, skillIndex)
  const gaps = topSkillGaps(homeCohort, careerRoles, skillIndex, 6)

  const bandData = (Object.keys(BAND_COLORS) as (keyof typeof BAND_COLORS)[]).map((k) => ({
    name: k, value: agg.bands[k], pct: agg.bandPct[k],
  }))

  return (
    <div>
      <PageHeading
        title={`${institutionProfile.name} — skill intelligence`}
        lede={`Aggregate readiness across ${homeCohort.length} students on the platform, measured against live industry benchmarks. Every number here is computed from individual student profiles, not entered by hand.`}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><GraduationCap size={14} className="text-ink-400" />Profiles assessed</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{homeCohort.length.toLocaleString('en-IN')}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">of {institutionProfile.totalStudents.toLocaleString('en-IN')} enrolled · every figure below is computed from these</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><TrendingUp size={14} className="text-ink-400" />Average readiness</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{agg.average}%</p>
          <p className="mt-1.5 text-[12px] text-ink-500">Across all declared career goals</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><Building2 size={14} className="text-ink-400" />Partner companies</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{institutionProfile.partnerCompanies}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">{institutionProfile.internshipsThisYear} internships this year</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><Handshake size={14} className="text-ink-400" />Faculty engagements</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{institutionProfile.facultyEngagements}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">FDPs, consultancy and research</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        {/* Readiness distribution */}
        <Card>
          <CardHeader title="Student readiness" subtitle="A student counts as industry ready only when every critical skill for their target role is cleared" />
          <CardBody>
            <div className="flex items-center gap-5">
              <div className="h-[168px] w-[168px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={bandData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} strokeWidth={0}>
                      {bandData.map((d) => <Cell key={d.name} fill={BAND_COLORS[d.name]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }}
                      formatter={(v, n) => [`${v} students`, n as string]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                {bandData.map((d) => (
                  <div key={d.name}>
                    <div className="flex items-baseline justify-between">
                      <span className="flex items-center gap-2 text-[13px] text-ink-700">
                        <span className="h-2 w-2 rounded-full" style={{ background: BAND_COLORS[d.name] }} />
                        {d.name}
                      </span>
                      <span className="text-[13px] font-semibold text-ink-900 tnum">{d.pct}%</span>
                    </div>
                    <p className="mt-0.5 pl-4 text-[11.5px] text-ink-500 tnum">{d.value} students</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-canvas px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink-700">
              {agg.bandPct.Developing + agg.bandPct['Needs training']}% of students are one or more critical
              skills away from being hireable in their target role. The gaps below say which ones.
            </p>
          </CardBody>
        </Card>

        {/* Top skill gaps — the institution's action list */}
        <Card>
          <CardHeader title="Top skill gaps across students"
            subtitle="Ranked by how many students are short and how far short they are" />
          <div className="divide-y divide-hairline">
            {gaps.map((g, i) => (
              <div key={g.skillId} className="flex items-center gap-3.5 px-5 py-3">
                <span className="w-4 shrink-0 text-[13px] font-semibold text-ink-400 tnum">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-ink-900">{g.name}</p>
                  <p className="text-[11.5px] text-ink-500">{g.category}</p>
                </div>
                <div className="w-[110px] shrink-0">
                  <Progress value={g.affectedPct} showTarget={false} tone={g.affectedPct >= 20 ? 'high' : 'mid'} className="h-1.5" />
                </div>
                <div className="w-[92px] shrink-0 text-right">
                  <p className="text-[13px] font-semibold text-ink-900 tnum">{g.affected} students</p>
                  <p className="text-[11px] text-ink-500 tnum">avg {g.avgDeficit} pts short</p>
                </div>
              </div>
            ))}
          </div>
          <CardBody className="border-t border-hairline">
            <Link to="/institution/gaps" className="text-[13px] font-medium text-navy-700 hover:underline">
              Open full gap analysis and training plan
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {/* Demand trend */}
        <Card>
          <CardHeader title="Industry demand trend"
            subtitle="Relative hiring demand index across partner postings, last nine months" />
          <CardBody className="pt-2">
            <div className="h-[268px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandTrend} margin={{ left: -20, right: 10, top: 6, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E4E7EC" />
                  <XAxis dataKey="month" tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }} />
                  <Legend wrapperStyle={{ fontSize: 11.5, paddingTop: 8 }} iconType="plainline" iconSize={16} />
                  <Line type="monotone" dataKey="AI/ML" stroke="#0E2A4D" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="React" stroke="#2E6BC4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Cloud" stroke="#E08A18" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Cybersecurity" stroke="#1F8A5B" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Data Analytics" stroke="#98A2B3" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Most demanded skills" subtitle="Year-on-year change in partner hiring" />
          <div className="divide-y divide-hairline">
            {skillDemand.map((s) => (
              <div key={s.name} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-ink-900">{s.name}</p>
                  <p className="text-[11.5px] text-ink-500 tnum">{s.openings.toLocaleString('en-IN')} open roles</p>
                </div>
                <Badge tone="ready">↑ {s.trend}%</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department readiness */}
      <Card className="mt-6">
        <CardHeader title="Placement readiness by department"
          subtitle="Share of students in each readiness band, and placement rate to date" />
        <CardBody className="pt-2">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ left: -20, right: 10, top: 6, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E4E7EC" />
                <XAxis dataKey="name" tick={{ fill: '#667085', fontSize: 10.5 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }} />
                <Legend wrapperStyle={{ fontSize: 11.5, paddingTop: 8 }} />
                <Bar dataKey="ready" name="Industry ready" stackId="a" fill="#1F8A5B" />
                <Bar dataKey="developing" name="Developing" stackId="a" fill="#2E6BC4" />
                <Bar dataKey="needsTraining" name="Needs training" stackId="a" fill="#C0392B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {departments.map((d) => (
              <div key={d.name} className="rounded-lg border border-hairline px-3 py-2.5">
                <p className="truncate text-[12.5px] font-medium text-ink-900">{d.name}</p>
                <p className="mt-1 text-[11.5px] text-ink-500 tnum">{d.students} students · {d.offers} offers</p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={d.placed} showTarget={false} tone={d.placed >= 75 ? 'ready' : d.placed >= 60 ? 'mid' : 'high'} className="h-1.5" />
                  <span className={cn('shrink-0 text-[12px] font-semibold tnum',
                    d.placed >= 75 ? 'text-gap-ready' : d.placed >= 60 ? 'text-gap-mid' : 'text-gap-high')}>{d.placed}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
