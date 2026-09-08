import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts'
import { departments, placementOutcomes, institutionProfile, collaborations, homeCohort } from '@/lib/data'
import { careerRoles, skillIndex } from '@/lib/data/skills'
import { aggregateReadiness } from '@/lib/engine'
import { Badge, Card, CardBody, CardHeader, PageHeading, Progress } from '@/components/ui/primitives'

export default function Placements() {
  const agg = aggregateReadiness(homeCohort, careerRoles, skillIndex)
  const latest = placementOutcomes[placementOutcomes.length - 1]

  return (
    <div>
      <PageHeading title="Placements & training"
        lede="Placement outcomes alongside the readiness signal that predicts them, plus every active industry collaboration." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Placement rate {latest.year}</p>
          <p className="mt-2 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{latest.placed}%</p>
          <p className="mt-1.5 text-[12px] text-gap-ready tnum">↑ {latest.placed - placementOutcomes[placementOutcomes.length - 2].placed} points year on year</p>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Average package</p>
          <p className="mt-2 font-display text-[28px] font-bold leading-none text-ink-900 tnum">₹{latest.avgPackage}L</p>
          <p className="mt-1.5 text-[12px] text-ink-500">Highest ₹{latest.highest}L</p>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Internships this year</p>
          <p className="mt-2 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{institutionProfile.internshipsThisYear}</p>
          <p className="mt-1.5 text-[12px] text-ink-500">Across {institutionProfile.partnerCompanies} partners</p>
        </Card>
        <Card className="p-5">
          <p className="text-[12.5px] text-ink-500">Cohort readiness</p>
          <p className="mt-2 font-display text-[28px] font-bold leading-none text-ink-900 tnum">{agg.average}%</p>
          <Progress value={agg.average} showTarget={false} className="mt-3" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Placement outcomes" subtitle="Four-year trend" />
          <CardBody className="pt-2">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={placementOutcomes} margin={{ left: -20, right: 10, top: 6, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E4E7EC" />
                  <XAxis dataKey="year" tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }} />
                  <Legend wrapperStyle={{ fontSize: 11.5, paddingTop: 8 }} iconType="plainline" iconSize={16} />
                  <Line type="monotone" dataKey="placed" name="Placed (%)" stroke="#0E2A4D" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="avgPackage" name="Avg package (₹L)" stroke="#E08A18" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Department-wise placement" subtitle="Placement rate against offers received" />
          <CardBody className="pt-2">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departments} margin={{ left: -22, right: 10, top: 6, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E4E7EC" />
                  <XAxis dataKey="name" tick={{ fill: '#667085', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }}
                    formatter={(v) => [`${v}%`, 'Placed']} />
                  <Bar dataKey="placed" radius={[4, 4, 0, 0]} barSize={34}>
                    {departments.map((d) => (
                      <Cell key={d.name} fill={d.placed >= 75 ? '#1F8A5B' : d.placed >= 60 ? '#2E6BC4' : '#B45309'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Industry collaborations" subtitle="Live engagements between your departments and partner companies" />
        <div className="divide-y divide-hairline">
          {collaborations.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ink-900">{c.title}</p>
                <p className="mt-0.5 truncate text-[12px] text-ink-500">{c.company} · {c.audience}</p>
              </div>
              <Badge tone="neutral">{c.kind}</Badge>
              <Badge tone={c.status === 'Open' ? 'ready' : c.status === 'Filling fast' ? 'mid' : 'neutral'}>{c.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
