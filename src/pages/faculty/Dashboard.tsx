import { Link } from 'react-router-dom'
import { BookOpen, FlaskConical, IndianRupee, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { facultyUser, facultyPrograms, homeCohort } from '@/lib/data'
import { careerRoles, skillIndex, skillDemand } from '@/lib/data/skills'
import { topSkillGaps, aggregateReadiness } from '@/lib/engine'
import { Badge, Card, CardBody, CardHeader, LinkButton, PageHeading, Progress } from '@/components/ui/primitives'
import { formatDate } from '@/lib/utils'

export default function FacultyDashboard() {
  const gaps = topSkillGaps(homeCohort, careerRoles, skillIndex, 5)
  const agg = aggregateReadiness(homeCohort, careerRoles, skillIndex)
  const upcoming = [...facultyPrograms].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 5)

  return (
    <div>
      <PageHeading
        title={`${facultyUser.name} — industry engagement`}
        lede={`${facultyUser.designation}, ${facultyUser.department}. Industry programmes open to you, and the demand signals your curriculum should respond to.`}
        action={<LinkButton to="/faculty/programs" size="sm">Browse all programmes</LinkButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><BookOpen size={14} className="text-ink-400" />Programmes completed</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{facultyUser.programsCompleted}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">FDPs, training and internships</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><FlaskConical size={14} className="text-ink-400" />Publications</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{facultyUser.publications}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">{facultyUser.expertise.slice(0, 2).join(', ')}</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><IndianRupee size={14} className="text-ink-400" />Consultancy value</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{facultyUser.consultancyValue}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">Through the institute cell</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-500"><Users size={14} className="text-ink-400" />Your students' readiness</p>
          <p className="mt-2.5 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{agg.average}%</p>
          <Progress value={agg.average} showTarget={false} className="mt-3" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Industry programmes closing soon"
            subtitle="Matched to your department and declared expertise"
            action={<Link to="/faculty/programs" className="text-[13px] font-medium text-navy-700 hover:underline">See all</Link>} />
          <div className="divide-y divide-hairline">
            {upcoming.map((p) => (
              <div key={p.id} className="px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink-900">{p.title}</p>
                  <Badge tone="navy">{p.type}</Badge>
                </div>
                <p className="mt-1 text-[12.5px] text-ink-500">
                  {p.company} · {p.mode} · {p.duration} · {p.stipend}
                </p>
                <p className="mt-1.5 text-[12px] text-ink-400 tnum">
                  {p.seats} {p.seats === 1 ? 'seat' : 'seats'} · applications close {formatDate(p.deadline)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Industry demand" subtitle="Year-on-year change in partner hiring" />
            <CardBody className="pt-2">
              <div className="h-[196px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillDemand} layout="vertical" margin={{ left: 6, right: 20, top: 4, bottom: 4 }}>
                    <CartesianGrid horizontal={false} stroke="#E4E7EC" />
                    <XAxis type="number" unit="%" tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={94} tick={{ fill: '#344054', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }}
                      formatter={(v) => [`↑ ${v}%`, 'Demand growth']} />
                    <Bar dataKey="trend" radius={[0, 4, 4, 0]} barSize={15}>
                      {skillDemand.map((s) => <Cell key={s.name} fill={s.trend >= 25 ? '#1F8A5B' : '#2E6BC4'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <Link to="/faculty/demand" className="mt-2 inline-block text-[13px] font-medium text-navy-700 hover:underline">
                See full demand trend
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Where your students need you"
              subtitle="Biggest gaps across the department cohort" />
            <div className="divide-y divide-hairline">
              {gaps.map((g) => (
                <div key={g.skillId} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink-900">{g.name}</span>
                  <span className="w-[60px]"><Progress value={g.affectedPct} showTarget={false} tone="high" className="h-1.5" /></span>
                  <span className="w-[76px] shrink-0 text-right text-[12px] text-ink-500 tnum">{g.affected} students</span>
                </div>
              ))}
            </div>
            <CardBody className="border-t border-hairline">
              <p className="text-[12.5px] leading-relaxed text-ink-500">
                These gaps are computed from your students' live assessments. An FDP or workshop on
                the top two would move the largest number of them.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
