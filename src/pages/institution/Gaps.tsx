import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { homeCohort, trainingRequests } from '@/lib/data'
import { careerRoles, skillIndex, skillDemand } from '@/lib/data/skills'
import { topSkillGaps } from '@/lib/engine'
import { Badge, Card, CardBody, CardHeader, PageHeading, Progress } from '@/components/ui/primitives'

export default function InstitutionGaps() {
  const gaps = topSkillGaps(homeCohort, careerRoles, skillIndex, 10)
  const chart = gaps.slice(0, 8).map((g) => ({ name: g.name.length > 12 ? g.name.slice(0, 11) + '…' : g.name, pct: g.affectedPct, deficit: g.avgDeficit }))
  const demandByName = Object.fromEntries(skillDemand.map((s) => [s.name, s.trend]))

  return (
    <div>
      <PageHeading title="Skill gap analysis"
        lede="Where your students collectively fall short of industry requirements. Gaps that also carry rising industry demand are the ones worth funding training for first." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Share of students short on each skill" />
          <CardBody className="pt-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} layout="vertical" margin={{ left: 4, right: 18, top: 4, bottom: 4 }}>
                  <CartesianGrid horizontal={false} stroke="#E4E7EC" />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={104} tick={{ fill: '#344054', fontSize: 11.5 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }}
                    formatter={(v, n) => n === 'pct' ? [`${v}% of students`, 'Short on this skill'] : [v, n as string]} />
                  <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={17}>
                    {chart.map((d) => <Cell key={d.name} fill={d.pct >= 20 ? '#C0392B' : d.pct >= 10 ? '#B45309' : '#2E6BC4'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Gap versus industry demand" subtitle="High gap plus rising demand is where training pays back fastest" />
          <div className="divide-y divide-hairline">
            {gaps.map((g) => {
              const demand = demandByName[g.name]
              return (
                <div key={g.skillId} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-ink-900">{g.name}</p>
                    <p className="text-[11.5px] text-ink-500 tnum">{g.affected} students · avg {g.avgDeficit} points short</p>
                  </div>
                  <div className="w-[70px] shrink-0">
                    <Progress value={g.affectedPct} showTarget={false} tone={g.affectedPct >= 20 ? 'high' : 'mid'} className="h-1.5" />
                  </div>
                  {demand !== undefined
                    ? <Badge tone="ready">↑ {demand}% demand</Badge>
                    : <Badge tone="neutral">—</Badge>}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Training requirements"
          subtitle="Programmes raised against these gaps, with an industry partner attached" />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-hairline text-[12px] font-medium text-ink-500">
                <th className="px-5 py-3">Skill</th>
                <th className="px-3 py-3">Students affected</th>
                <th className="px-3 py-3">Departments</th>
                <th className="px-3 py-3">Industry partner</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {trainingRequests.map((t) => (
                <tr key={t.id} className="hover:bg-canvas">
                  <td className="px-5 py-3 text-[13.5px] font-medium text-ink-900">{t.skill}</td>
                  <td className="px-3 py-3 text-[13px] text-ink-700 tnum">{t.students}</td>
                  <td className="px-3 py-3 text-[12.5px] text-ink-500">{t.department}</td>
                  <td className="px-3 py-3 text-[13px] text-ink-700">{t.partner}</td>
                  <td className="px-5 py-3">
                    <Badge tone={t.status === 'Running' ? 'ready' : t.status === 'Scheduled' ? 'navy' : 'mid'}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
