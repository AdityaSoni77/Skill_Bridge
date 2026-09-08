import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { demandTrend, skillDemand } from '@/lib/data/skills'
import { careerRoles } from '@/lib/data/skills'
import { Badge, Card, CardBody, CardHeader, PageHeading, Progress } from '@/components/ui/primitives'
import { inr } from '@/lib/utils'

export default function Demand() {
  return (
    <div>
      <PageHeading title="Industry demand"
        lede="What partner companies are hiring for, and how the requirement for each role has moved. Use this to decide what to add to the syllabus next term." />

      <Card className="mb-6">
        <CardHeader title="Demand index by skill area" subtitle="Relative hiring volume across partner postings, last nine months" />
        <CardBody className="pt-2">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandTrend} margin={{ left: -18, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#E4E7EC" />
                <XAxis dataKey="month" tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }} />
                <Legend wrapperStyle={{ fontSize: 11.5, paddingTop: 10 }} iconType="plainline" iconSize={16} />
                <Line type="monotone" dataKey="AI/ML" stroke="#0E2A4D" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="React" stroke="#2E6BC4" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Cloud" stroke="#E08A18" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Cybersecurity" stroke="#1F8A5B" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Data Analytics" stroke="#98A2B3" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Skill demand growth" />
          <div className="divide-y divide-hairline">
            {skillDemand.map((s) => (
              <div key={s.name} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-ink-900">{s.name}</p>
                  <p className="text-[11.5px] text-ink-500 tnum">{s.openings.toLocaleString('en-IN')} open roles · {s.category}</p>
                </div>
                <span className="w-[70px]"><Progress value={s.trend * 3} showTarget={false} tone="ready" className="h-1.5" /></span>
                <Badge tone="ready">↑ {s.trend}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Role benchmarks" subtitle="What industry currently expects, by role" />
          <div className="divide-y divide-hairline">
            {careerRoles.map((r) => (
              <div key={r.id} className="px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink-900">{r.title}</p>
                  <Badge tone="ready">↑ {r.demandTrendPct}%</Badge>
                </div>
                <p className="mt-1 text-[12px] text-ink-500 tnum">
                  {r.openings.toLocaleString('en-IN')} openings · median stipend {inr(r.medianStipend)}/month · {r.family}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.benchmark.filter((b) => b.critical).map((b) => (
                    <Badge key={b.skillId} tone="high">critical · level {b.level}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
