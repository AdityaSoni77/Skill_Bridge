import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { useApp } from '@/store'
import { skillCategories, skillIndex, skills as allSkills } from '@/lib/data/skills'
import { useIntel } from '@/lib/useIntel'
import { Card, CardBody, CardHeader, PageHeading, Progress, VerifiedTag, Badge } from '@/components/ui/primitives'
import { LinkButton } from '@/components/ui/primitives'

const proficiencyLabel = (v: number) =>
  v >= 80 ? 'Advanced' : v >= 60 ? 'Proficient' : v >= 40 ? 'Developing' : 'Beginner'

export default function SkillProfile() {
  const { student } = useApp()
  const { readiness } = useIntel()

  const byCategory = useMemo(() => {
    const held = Object.entries(student.skills).filter(([, v]) => v > 0)
    return skillCategories.map((cat) => {
      const items = held
        .filter(([id]) => skillIndex[id]?.category === cat)
        .map(([id, value]) => ({
          id, value, name: skillIndex[id].name,
          verified: student.verifiedSkillIds.includes(id),
          requirement: readiness.gaps.find((g) => g.skillId === id)?.need,
        }))
        .sort((a, b) => b.value - a.value)
      const avg = items.length ? Math.round(items.reduce((s, i) => s + i.value, 0) / items.length) : 0
      return { cat, items, avg }
    })
  }, [student, readiness])

  const chartData = byCategory.map((c) => ({ name: c.cat.replace(' Skills', ''), value: c.avg }))
  const untracked = allSkills.filter((s) => !student.skills[s.id]).length

  return (
    <div>
      <PageHeading
        title="Skill profile"
        lede="Everything you have declared or been assessed on. Verified entries were confirmed by an assessment, a certificate issuer or a company."
        action={<LinkButton to="/student/assessment" size="sm" variant="secondary">Retake assessment</LinkButton>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {byCategory.map((c) => (
          <Card key={c.cat} className="p-5">
            <p className="text-[12.5px] font-medium text-ink-500">{c.cat}</p>
            <p className="mt-2 font-display text-[26px] font-bold leading-none text-ink-900 tnum">{c.avg}</p>
            <p className="mt-1 text-[12px] text-ink-500">{c.items.length} skills · avg proficiency</p>
            <Progress value={c.avg} showTarget={false} className="mt-3" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {byCategory.map((c) => (
            <Card key={c.cat}>
              <CardHeader title={c.cat} subtitle={`${c.items.filter((i) => i.verified).length} of ${c.items.length} verified`} />
              <div className="divide-y divide-hairline">
                {c.items.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-[1.1]">
                      <p className="flex items-center gap-2 truncate text-[13.5px] font-medium text-ink-900">
                        {s.name}
                        {s.verified && <VerifiedTag />}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-ink-500">
                        {proficiencyLabel(s.value)}
                        {s.requirement !== undefined && ` · industry bar ${s.requirement}`}
                      </p>
                    </div>
                    <div className="flex flex-[1] items-center gap-2.5">
                      <Progress value={s.value} target={s.requirement} tone={
                        s.requirement === undefined ? 'navy' : s.value >= s.requirement ? 'ready' : s.value / s.requirement >= 0.6 ? 'mid' : 'high'
                      } />
                      <span className="w-7 shrink-0 text-right text-[13px] font-semibold text-ink-900 tnum">{s.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Category balance" subtitle="Average proficiency by category" />
            <CardBody className="pt-2">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: -14, right: 14, top: 4, bottom: 4 }}>
                    <CartesianGrid horizontal={false} stroke="#E4E7EC" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#667085', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={96} tick={{ fill: '#344054', fontSize: 11.5 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E7EC' }} formatter={(v) => [`${v} avg`, 'Proficiency']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                      {chartData.map((d) => (
                        <Cell key={d.name} fill={d.value >= 70 ? '#1F8A5B' : d.value >= 50 ? '#2E6BC4' : '#B45309'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Verification" />
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink-700">Verified skills</span>
                <Badge tone="navy">{student.verifiedSkillIds.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink-700">Verified projects</span>
                <Badge tone="navy">{student.evidence.verifiedProjects}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-ink-700">Certifications</span>
                <Badge tone="navy">{student.evidence.certifications}</Badge>
              </div>
              <p className="border-t border-hairline pt-3 text-[12.5px] leading-relaxed text-ink-500">
                {untracked} skills in the catalogue are not on your profile yet. Adding them through an
                assessment can open matches you are not currently being shown.
              </p>
              <LinkButton to="/student/assessment" size="sm" variant="secondary" className="w-full">
                Assess a new skill
              </LinkButton>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
